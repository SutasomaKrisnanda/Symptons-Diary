import { useState, useMemo, useEffect } from 'react';
import { X, MagnifyingGlass } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import symptomsData from '../../data/symptoms.json';

export default function SymptomPickerModal() {
  const { isSymptomModalOpen, setSymptomModalOpen, addSymptomLog, updateSymptomLog, prefilledSymptomId, selectedActiveSymptom } = useAppStore();
  const [search, setSearch] = useState('');
  
  const [selectedSymptom, setSelectedSymptom] = useState<any>(null);
  const [severity, setSeverity] = useState(5);
  const [onset, setOnset] = useState(new Date().toISOString().slice(0, 16)); // YYYY-MM-DDTHH:mm
  const [isContinuous, setIsContinuous] = useState(false);
  const [endDate, setEndDate] = useState('');

  // Mode Edit atau Add
  const isEditing = !!selectedActiveSymptom;

  useEffect(() => {
    if (isSymptomModalOpen) {
      if (isEditing && selectedActiveSymptom) {
        const sym = symptomsData.find(s => s.id === selectedActiveSymptom.symptomId);
        if (sym) {
          setSelectedSymptom(sym);
          setSeverity(selectedActiveSymptom.severity || 5);
          setOnset(new Date(selectedActiveSymptom.onset).toISOString().slice(0, 16));
          setIsContinuous(!!selectedActiveSymptom.isContinuous);
          if (selectedActiveSymptom.endDate) {
            setEndDate(new Date(selectedActiveSymptom.endDate).toISOString().slice(0, 16));
          } else {
            setEndDate('');
          }
        }
      } else if (prefilledSymptomId) {
        const sym = symptomsData.find(s => s.id === prefilledSymptomId);
        if (sym) {
          setSelectedSymptom(sym);
        }
      }
    } else {
      setSelectedSymptom(null);
      setSearch('');
      setSeverity(5);
      setIsContinuous(false);
      setEndDate('');
      setOnset(new Date().toISOString().slice(0, 16));
    }
  }, [isSymptomModalOpen, prefilledSymptomId, isEditing, selectedActiveSymptom]);

  const filteredSymptoms = useMemo(() => {
    return symptomsData.filter(sym => 
      sym.name.toLowerCase().includes(search.toLowerCase()) || 
      sym.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  if (!isSymptomModalOpen) return null;

  const handleSave = () => {
    if (!selectedSymptom) return;
    
    if (isEditing && selectedActiveSymptom) {
      updateSymptomLog({
        ...selectedActiveSymptom,
        onset: new Date(onset).toISOString(),
        severity,
        isContinuous,
        endDate: isContinuous && endDate ? new Date(endDate).toISOString() : undefined
      });
    } else {
      addSymptomLog({
        id: `log_${Date.now()}`,
        symptomId: selectedSymptom.id,
        symptomName: selectedSymptom.name,
        onset: new Date(onset).toISOString(),
        severity,
        isContinuous,
        endDate: isContinuous && endDate ? new Date(endDate).toISOString() : undefined
      });
    }
    
    // Reset and close
    setSymptomModalOpen(false);
  };

  return (
    <div onClick={() => setSymptomModalOpen(false)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col h-[85vh] sm:h-[650px]">
        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Ubah Gejala' : (selectedSymptom ? 'Detail Gejala' : 'Pilih Gejala')}
          </h2>
          <button onClick={() => setSymptomModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <X weight="bold" />
          </button>
        </div>

        {!selectedSymptom ? (
          <>
            <div className="px-6 pt-4">
              <div className="relative">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari gejala..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm" 
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto no-scrollbar flex-1">
              <div className="space-y-2">
                {filteredSymptoms.length > 0 ? filteredSymptoms.map(sym => (
                  <button 
                    key={sym.id} 
                    onClick={() => setSelectedSymptom(sym)}
                    className="w-full text-left bg-white border border-gray-100 hover:border-brand/30 hover:shadow-sm p-4 rounded-2xl transition-all flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 group-hover:text-brand transition-colors">{sym.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{sym.category}</p>
                    </div>
                  </button>
                )) : (
                  <p className="text-center text-gray-400 text-sm py-10">Gejala tidak ditemukan.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 overflow-y-auto no-scrollbar flex-1 space-y-6">
            <div className="bg-brand-light/30 p-4 rounded-2xl border border-brand/10">
              <h3 className="font-bold text-xl text-brand">{selectedSymptom.name}</h3>
              <p className="text-xs text-gray-500">{selectedSymptom.description}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tingkat Keparahan (1-10)</label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-green-500 font-bold">Ringan</span>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={severity} 
                  onChange={e => setSeverity(parseInt(e.target.value))}
                  className="flex-1 accent-brand" 
                />
                <span className="text-xs text-red-500 font-bold">Parah</span>
              </div>
              <div className="text-center mt-2 text-xl font-bold text-brand">{severity}</div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input 
                type="checkbox" 
                id="isContinuous" 
                checked={isContinuous} 
                onChange={e => setIsContinuous(e.target.checked)}
                className="w-5 h-5 text-brand rounded border-gray-300 focus:ring-brand"
              />
              <label htmlFor="isContinuous" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Gejala dirasakan terus menerus
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isContinuous ? 'Waktu Mulai' : 'Waktu Kejadian (Onset)'}
              </label>
              <input 
                type="datetime-local" 
                value={onset}
                onChange={e => setOnset(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm" 
              />
              {!isContinuous && <p className="text-xs text-gray-400 mt-2">Kapan gejala ini dirasakan?</p>}
            </div>

            {isContinuous && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Waktu Selesai (Opsional)</label>
                <input 
                  type="datetime-local" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm" 
                />
                <p className="text-xs text-gray-400 mt-2">Biarkan kosong jika masih dirasakan sampai sekarang.</p>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              {!isEditing && (
                <button onClick={() => setSelectedSymptom(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors">
                  Kembali
                </button>
              )}
              <button onClick={handleSave} className="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl shadow-brand transition-colors">
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
