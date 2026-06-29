import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Sparkle, Database, UserMinus, ArrowRight } from '@phosphor-icons/react';

export default function Onboarding() {
  const setOnboarded = useAppStore((state) => state.setOnboarded);

  const startApp = () => {
    setOnboarded(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-app z-50 bg-white flex items-center justify-center overflow-y-auto no-scrollbar">
      <div className="w-full max-w-5xl p-8 lg:p-12 lg:grid lg:grid-cols-2 lg:gap-16 items-center flex flex-col lg:flex-row justify-center min-h-full">
        
        {/* Kolom Kiri: Visual */}
        <div className="text-center lg:text-left flex-1 w-full flex flex-col items-center lg:items-start justify-center">
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-brand-light rounded-full flex items-center justify-center mb-8 shadow-inner relative">
            <ShieldCheck weight="fill" className="text-5xl lg:text-6xl text-brand" />
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Sparkle weight="fill" className="text-teal-400 text-xl" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 lg:leading-tight">Symptons Diary</h1>
          <p className="text-gray-500 mb-8 leading-relaxed text-lg lg:max-w-md">
            Catat gejala harianmu dan dapatkan prediksi arah diagnosis medis dengan bantuan AI secara instan.
          </p>
        </div>

        {/* Kolom Kanan: Info Privasi & CTA */}
        <div className="w-full max-w-md bg-gray-50 p-6 lg:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Komitmen Privasi Kami</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-soft">
              <div className="w-10 h-10 bg-brand-light text-brand rounded-full flex items-center justify-center shrink-0">
                <Database weight="fill" className="text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">100% Data Lokal</h4>
                <p className="text-xs text-gray-500">Disimpan di memori perangkat ini saja.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-soft">
              <div className="w-10 h-10 bg-brand-light text-brand rounded-full flex items-center justify-center shrink-0">
                <UserMinus weight="fill" className="text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">Tanpa Akun</h4>
                <p className="text-xs text-gray-500">Langsung gunakan tanpa login/email.</p>
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={startApp}
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-2xl shadow-brand transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
            >
              Mulai Sekarang <ArrowRight weight="bold" />
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 px-4">
              Menggunakan penyimpanan lokal browser Anda.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
