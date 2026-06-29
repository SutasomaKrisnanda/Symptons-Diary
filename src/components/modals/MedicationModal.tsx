import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';

export default function MedicationModal() {
  const { isMedicationModalOpen, setMedicationModalOpen, addMedicationLog } = useAppStore();
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Format waktu saat ini: HH:MM
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const [time, setTime] = useState(timeString);
  const [notes, setNotes] = useState('');

  if (!isMedicationModalOpen) return null;

  const handleSave = () => {
    if (!name) return;
    addMedicationLog({
      id: `med_${Date.now()}`,
      name,
      dosage,
      date,
      time,
      notes
    });
    setMedicationModalOpen(false);
    // Reset form
    setName('');
    setDosage('');
    setNotes('');
  };

  return (
    <div onClick={() => setMedicationModalOpen(false)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Riwayat Obat</h2>
          <button onClick={() => setMedicationModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <X weight="bold" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Obat <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mis: Paracetamol" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dosis (Opsional)</label>
            <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Mis: 500mg, 1 Tablet" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Waktu</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan Tambahan</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Mis: Diminum setelah makan" rows={2} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none text-sm"></textarea>
          </div>
        </div>
        
        <div className="p-6 pt-0">
          <button onClick={handleSave} disabled={!name} className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-brand transition-colors">
            Simpan Obat
          </button>
        </div>
      </div>
    </div>
  );
}
