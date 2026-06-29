import { X, Warning, Trash } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';

export default function DeleteDataModal() {
  const { isDeleteModalOpen, setDeleteModalOpen, resetData } = useAppStore();

  if (!isDeleteModalOpen) return null;

  const handleDelete = () => {
    resetData();
    setDeleteModalOpen(false);
  };

  return (
    <div onClick={() => setDeleteModalOpen(false)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 p-6 text-center">
        
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Warning weight="fill" className="text-3xl" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hapus Semua Data?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Peringatan: Seluruh jurnal gejala, tanda vital, dan riwayat obat Anda akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleDelete}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Trash weight="bold" /> Ya, Hapus Semua
          </button>
          <button 
            onClick={() => setDeleteModalOpen(false)}
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-bold transition-colors"
          >
            Batal
          </button>
        </div>
        
      </div>
    </div>
  );
}
