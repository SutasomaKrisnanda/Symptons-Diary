import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';

export default function VitalsModal() {
  const { isVitalsModalOpen, setVitalsModalOpen, updateVitals, vitals } = useAppStore();
  const [tab, setTab] = useState<'dasar' | 'lanjutan'>('dasar');

  const [temp, setTemp] = useState(vitals.temperature?.toString() || '');
  const [hr, setHr] = useState(vitals.heartRate?.toString() || '');
  const [rr, setRr] = useState(vitals.respiratoryRate?.toString() || '');
  
  const [bp, setBp] = useState(vitals.bloodPressure || '');
  const [spo2, setSpo2] = useState(vitals.oxygenSaturation?.toString() || '');
  const [weight, setWeight] = useState(vitals.weight?.toString() || '');
  const [height, setHeight] = useState(vitals.height?.toString() || '');

  if (!isVitalsModalOpen) return null;

  const handleSave = () => {
    updateVitals({
      temperature: temp ? parseFloat(temp) : undefined,
      heartRate: hr ? parseInt(hr) : undefined,
      respiratoryRate: rr ? parseInt(rr) : undefined,
      bloodPressure: bp || undefined,
      oxygenSaturation: spo2 ? parseInt(spo2) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    });
    setVitalsModalOpen(false);
  };

  return (
    <div onClick={() => setVitalsModalOpen(false)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Tanda Vital</h2>
          <button onClick={() => setVitalsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <X weight="bold" />
          </button>
        </div>

        <div className="px-6 mt-4 flex gap-2">
          <button onClick={() => setTab('dasar')} className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === 'dasar' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Dasar</button>
          <button onClick={() => setTab('lanjutan')} className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === 'lanjutan' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Lanjutan</button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
          {tab === 'dasar' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Suhu Tubuh (°C)</label>
                <input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} placeholder="36.5" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Denyut Nadi (bpm)</label>
                <input type="number" value={hr} onChange={e => setHr(e.target.value)} placeholder="80" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Laju Pernapasan (x/menit)</label>
                <input type="number" value={rr} onChange={e => setRr(e.target.value)} placeholder="16" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tekanan Darah (mmHg)</label>
                <input type="text" value={bp} onChange={e => setBp(e.target.value)} placeholder="120/80" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Saturasi Oksigen / SpO2 (%)</label>
                <input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} placeholder="98" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Berat Badan (kg)</label>
                  <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tinggi Badan (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 pt-0">
          <button onClick={handleSave} className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-2xl shadow-brand transition-colors">
            Simpan Tanda Vital
          </button>
        </div>
      </div>
    </div>
  );
}
