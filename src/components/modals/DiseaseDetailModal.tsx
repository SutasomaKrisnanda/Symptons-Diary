import { X, Bug, Warning, Stethoscope } from '@phosphor-icons/react';

export default function DiseaseDetailModal({ disease, onClose }: { disease: any, onClose: () => void }) {
  if (!disease) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header Parallax / Info */}
        <div className="bg-brand text-white p-6 md:p-8 relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {disease.category}
                </span>
                <span className="text-xs font-mono bg-black/20 px-3 py-1 rounded-full">
                  ICD-10: {disease.icd10}
                </span>
                {disease.isInfectious && (
                  <Bug weight="fill" className="text-red-300 text-lg" title="Penyakit Infeksi" />
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{disease.name}</h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-md transition-colors">
              <X weight="bold" className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar flex-1 space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Stethoscope className="text-brand text-xl" /> Deskripsi Klinis
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
              {disease.description}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Penyebab Umum</h3>
            <p className="text-sm text-gray-600">{disease.causes}</p>
          </section>

          {disease.sacred_seven_clues && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Karakteristik Gejala Utama (Sacred Seven)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {disease.sacred_seven_clues.quality && (
                  <div className="bg-brand-light/30 border border-brand/10 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-2">Kualitas Nyeri/Gejala</h4>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                      {disease.sacred_seven_clues.quality.map((q: string, i: number) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}
                {disease.sacred_seven_clues.radiation && (
                  <div className="bg-brand-light/30 border border-brand/10 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-2">Penyebaran (Radiasi)</h4>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                      {disease.sacred_seven_clues.radiation.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {disease.sacred_seven_clues.aggravating_factors && (
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Faktor Memperberat</h4>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                      {disease.sacred_seven_clues.aggravating_factors.map((a: string, i: number) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
                {disease.sacred_seven_clues.relieving_factors && (
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Faktor Memperingan</h4>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                      {disease.sacred_seven_clues.relieving_factors.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {disease.red_flags && disease.red_flags.length > 0 && (
            <section className="bg-red-50 border-2 border-red-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                <Warning weight="fill" className="text-2xl" /> Indikasi Gawat Darurat (Red Flags)
              </h3>
              <p className="text-xs text-red-600 mb-4">Segera kunjungi IGD jika Anda mengalami salah satu dari gejala berikut:</p>
              <ul className="space-y-2">
                {disease.red_flags.map((rf: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-red-50">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                    <span className="text-sm font-semibold text-gray-800">{rf}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
        
      </div>
    </div>
  );
}
