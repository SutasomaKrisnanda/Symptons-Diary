import { X, PencilSimple, Trash, Fire, Clock } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';

export default function ActiveSymptomDetailModal() {
  const { 
    isActiveSymptomModalOpen, 
    setActiveSymptomModalOpen, 
    selectedActiveSymptom,
    setSymptomModalOpen,
    deleteSymptomLog
  } = useAppStore();

  if (!isActiveSymptomModalOpen || !selectedActiveSymptom) return null;

  const handleEdit = () => {
    // Tutup modal detail, buka modal picker di mode edit (karena selectedActiveSymptom masih ada di store)
    setActiveSymptomModalOpen(false, selectedActiveSymptom);
    setSymptomModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus catatan gejala ini?')) {
      deleteSymptomLog(selectedActiveSymptom.id);
      setActiveSymptomModalOpen(false, null);
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div onClick={() => setActiveSymptomModalOpen(false, null)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col">
        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Detail Gejala Aktif</h2>
          <button onClick={() => setActiveSymptomModalOpen(false, null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <X weight="bold" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Fire weight="fill" className="text-3xl" />
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-800">{selectedActiveSymptom.symptomName}</h3>
              <p className="text-sm font-semibold text-brand">Keparahan: {selectedActiveSymptom.severity}/10</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl space-y-4 border border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock weight="bold" />
                <span className="text-xs font-bold uppercase tracking-wider">Waktu Mulai</span>
              </div>
              <p className="text-sm font-medium text-gray-800">{formatDateTime(selectedActiveSymptom.onset)}</p>
            </div>

            {selectedActiveSymptom.isContinuous && (
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock weight="bold" />
                  <span className="text-xs font-bold uppercase tracking-wider">Waktu Selesai</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {selectedActiveSymptom.endDate ? formatDateTime(selectedActiveSymptom.endDate) : 'Masih Berlangsung'}
                </p>
              </div>
            )}
            
            {!selectedActiveSymptom.isContinuous && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tipe Kejadian</span>
                <p className="text-sm font-medium text-gray-800">Spesifik / Sekali</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleDelete} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Trash weight="bold" /> Hapus
            </button>
            <button onClick={handleEdit} className="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl shadow-brand transition-colors flex items-center justify-center gap-2">
              <PencilSimple weight="bold" /> Ubah Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
