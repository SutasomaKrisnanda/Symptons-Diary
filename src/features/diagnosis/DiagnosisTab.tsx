import { useState, useEffect, useRef } from 'react';
import { Sparkle, Warning, Stethoscope, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { predictDiagnosis } from '../../utils/aiDiagnosis';

type ChatMessage = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  isRedFlagWarning?: boolean;
};

export default function DiagnosisTab() {
  const { symptomLogs } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<any[]>([]);
  const hasInitialized = useRef(false);

  // Mulai anamnesis ketika tab dibuka
  useEffect(() => {
    if (messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      if (symptomLogs.length === 0) {
        addMessage('ai', 'Halo! Saya belum melihat adanya catatan gejala di jurnal Anda hari ini. Silakan catat gejala Anda di Beranda terlebih dahulu agar saya bisa membantu.');
      } else {
        const latestSymptom = symptomLogs[0];
        addMessage('ai', `Halo! Saya perhatikan Anda mencatat keluhan **${latestSymptom.symptomName}**. Mari kita gali lebih dalam. Seperti apa kualitas keluhan tersebut dirasakan?`, [
          'Berdenyut / Tajam',
          'Terasa berat / Menekan',
          'Panas / Terbakar',
          'Lainnya'
        ]);
      }
    }
  }, [symptomLogs]);

  const addMessage = (sender: 'ai' | 'user', text: string, options?: string[], isRedFlagWarning = false) => {
    const msgId = Math.random().toString(36).substring(2, 9);
    if (sender === 'ai') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: msgId, sender, text, options, isRedFlagWarning }]);
      }, 800); // Simulasi delay AI
    } else {
      setMessages(prev => [...prev, { id: msgId, sender, text }]);
    }
  };

  const handleOptionClick = (option: string) => {
    // 1. Tampilkan jawaban user
    addMessage('user', option);
    
    // Hapus opsi dari pesan AI terakhir
    setMessages(prev => {
      const newArr = [...prev];
      const lastAiIndex = newArr.map(m => m.sender).lastIndexOf('ai');
      if (lastAiIndex !== -1) {
        newArr[lastAiIndex].options = undefined;
      }
      return newArr;
    });

    // 2. Lanjut ke pertanyaan Sacred Seven berikutnya berdasarkan Step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Decision Tree statis sederhana untuk demo UI (Fundamental Four & Sacred Seven)
    if (nextStep === 1) {
      addMessage('ai', 'Apakah keluhan ini menjalar atau menyebar ke bagian tubuh lain?', [
        'Ya, menjalar ke leher/rahang/lengan',
        'Ya, menjalar ke punggung',
        'Tidak, hanya di satu titik'
      ]);
    } else if (nextStep === 2) {
      // Cek red flag dari jawaban sebelumnya
      if (option.includes('rahang') || option.includes('leher')) {
        addMessage('ai', '⚠️ Keluhan menjalar ke leher/rahang bisa menjadi tanda bahaya (Red Flag) untuk masalah jantung.', undefined, true);
      }
      addMessage('ai', 'Faktor apa yang biasanya memperberat atau memperburuk keluhan Anda ini?', [
        'Aktivitas Fisik',
        'Stres / Kelelahan',
        'Setelah Makan',
        'Perubahan Cuaca / Dingin'
      ]);
    } else if (nextStep === 3) {
      addMessage('ai', 'Apakah ada gejala penyerta lain seperti keringat dingin masif, muntah, atau kelemahan tubuh?', [
        'Keringat dingin masif',
        'Muntah darah / warna pekat',
        'Lemas / Hampir pingsan',
        'Tidak ada penyerta parah'
      ]);
    } else if (nextStep === 4) {
      // Selesai Anamnesis, jalankan algoritma prediksi
      const symptomIds = symptomLogs.map(s => s.symptomId);
      // Asumsikan kita memberi skor multiplier acak berdasarkan flow untuk demo ini
      const dummyMultiplier = { "dis_002": 1.5 }; // Misal mengarah ke UAP
      const results = predictDiagnosis(symptomIds, dummyMultiplier);
      
      addMessage('ai', 'Terima kasih atas informasinya. Saya sedang memproses data Sacred Seven Anda...');
      
      setTimeout(() => {
        setDiagnosisResults(results);
      }, 2000);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentStep(0);
    setDiagnosisResults([]);
    hasInitialized.current = false;
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-bgapp">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-4 z-10 shrink-0">
        <div className="w-10 h-10 bg-gradient-to-tr from-brand to-teal-400 rounded-xl flex items-center justify-center text-white shadow-brand">
          <Sparkle weight="fill" className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">Asisten Anamnesis AI</h2>
          <p className="text-xs text-gray-500">Evaluasi Fundamental 4 & Sacred 7</p>
        </div>
        <button onClick={handleReset} className="ml-auto w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ArrowCounterClockwise weight="bold" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 flex flex-col relative pb-32">
        
        {messages.length === 0 && symptomLogs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Stethoscope className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 max-w-xs">Silakan catat gejala di beranda agar asisten dapat memulai wawancara medis.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            
            {/* Red Flag Alert Inline */}
            {msg.isRedFlagWarning ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-[85%] flex items-start gap-3 shadow-sm">
                <Warning weight="fill" className="text-red-500 text-xl shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{msg.text}</p>
              </div>
            ) : (
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-brand text-white' : 'bg-white border border-gray-100'} p-4 rounded-2xl shadow-sm`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkle weight="fill" className="text-brand text-xs" />
                    <span className="text-xs font-bold text-gray-400">AI Guesser</span>
                  </div>
                )}
                
                <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-700'}`}>{msg.text}</p>
                
                {/* Opsi Pilihan Ganda */}
                {msg.options && (
                  <div className="mt-4 flex flex-col gap-2">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleOptionClick(opt)}
                        className="text-left text-sm bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors px-4 py-3 rounded-xl font-medium border border-brand/20"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand/60 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}

        {/* Hasil Prediksi */}
        {diagnosisResults.length > 0 && (
          <div className="bg-white border-2 border-brand/20 rounded-[32px] p-6 shadow-xl animate-in zoom-in-95 mt-4">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Stethoscope className="text-brand" /> Top Kemungkinan (Triase)
            </h3>
            
            <div className="space-y-4">
              {diagnosisResults.map((res, index) => (
                <div key={res.disease.id} className={`p-4 rounded-2xl border ${index === 0 ? 'bg-brand text-white border-brand' : 'bg-gray-50 border-gray-100 text-gray-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{res.disease.name}</h4>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full mt-1 inline-block ${index === 0 ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>
                        ICD-10: {res.disease.icd10}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{res.matchPercentage}%</span>
                      <p className={`text-[10px] ${index === 0 ? 'text-white/80' : 'text-gray-400'}`}>Kecocokan</p>
                    </div>
                  </div>
                  
                  {index === 0 && res.disease.red_flags.length > 0 && (
                    <div className="mt-4 bg-white/10 p-3 rounded-xl border border-white/20">
                      <p className="text-xs font-bold mb-1 flex items-center gap-1"><Warning /> Waspadai Tanda Bahaya:</p>
                      <ul className="text-xs list-disc pl-4 space-y-1">
                        {res.disease.red_flags.map((rf: string, i: number) => <li key={i}>{rf}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-orange-50 p-4 rounded-xl text-xs text-orange-800 border border-orange-100 text-center">
              Aplikasi ini hanya alat bantu triase, <b>bukan diagnosis medis pasti</b>. Segera ke dokter jika kondisi memburuk.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
