import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

localforage.config({
  name: 'Rahasya',
  storeName: 'app_data'
});

const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export interface Vitals {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  lastUpdated?: string;
}

export interface SymptomLog {
  id: string;
  symptomId: string;
  symptomName: string;
  onset: string;
  severity?: number;
  notes?: string;
  anamnesisCompleted?: boolean;
  isContinuous?: boolean;
  endDate?: string;
}

export interface MedicationLog {
  id: string;
  name: string;
  dosage: string;
  date: string;
  time: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'reminder' | 'alert';
  createdAt: string;
  read: boolean;
  action?: 'anamnesis' | 'vitals';
}

interface AppState {
  hasOnboarded: boolean;
  activeTabIndex: number;
  vitals: Vitals;
  symptomLogs: SymptomLog[];
  medicationLogs: MedicationLog[];
  notifications: AppNotification[];
  
  isVitalsModalOpen: boolean;
  isSymptomModalOpen: boolean;
  isMedicationModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isActiveSymptomModalOpen: boolean;
  
  prefilledSymptomId: string | null;
  selectedActiveSymptom: SymptomLog | null;

  setOnboarded: (value: boolean) => void;
  setActiveTab: (index: number) => void;
  updateVitals: (vitals: Partial<Vitals>) => void;
  
  addSymptomLog: (log: SymptomLog) => void;
  updateSymptomLog: (log: SymptomLog) => void;
  deleteSymptomLog: (id: string) => void;
  
  addMedicationLog: (log: MedicationLog) => void;
  markNotificationRead: (id: string) => void;
  
  setVitalsModalOpen: (isOpen: boolean) => void;
  setSymptomModalOpen: (isOpen: boolean, prefilledId?: string) => void;
  setMedicationModalOpen: (isOpen: boolean) => void;
  setDeleteModalOpen: (isOpen: boolean) => void;
  setActiveSymptomModalOpen: (isOpen: boolean, log?: SymptomLog | null) => void;
  
  resetData: () => void;
}

// Fungsi bantu cek overlap tanggal
const checkOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  const as = new Date(aStart).getTime();
  const ae = aEnd ? new Date(aEnd).getTime() : new Date(aStart).getTime() + 86400000; // default 1 hari
  const bs = new Date(bStart).getTime();
  const be = bEnd ? new Date(bEnd).getTime() : new Date(bStart).getTime() + 86400000;
  return Math.max(as, bs) < Math.min(ae, be); // Overlap jika max(starts) < min(ends)
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      activeTabIndex: 0,
      vitals: {},
      symptomLogs: [],
      medicationLogs: [],
      notifications: [],
      
      isVitalsModalOpen: false,
      isSymptomModalOpen: false,
      isMedicationModalOpen: false,
      isDeleteModalOpen: false,
      isActiveSymptomModalOpen: false,
      
      prefilledSymptomId: null,
      selectedActiveSymptom: null,

      setOnboarded: (value) => set({ hasOnboarded: value }),
      setActiveTab: (index) => set({ activeTabIndex: index }),
      
      updateVitals: (vitals) => set((state) => {
        const newVitals = { ...state.vitals, ...vitals, lastUpdated: new Date().toISOString() };
        const newNotifs = [...state.notifications];
        if (vitals.temperature && vitals.temperature > 38) {
          newNotifs.unshift({
            id: Math.random().toString(36).substring(2),
            message: `Suhu Anda tinggi (${vitals.temperature}°C). Jangan lupa cek kembali dalam beberapa jam.`,
            type: 'alert',
            createdAt: new Date().toISOString(),
            read: false,
            action: 'vitals'
          });
        }
        return { vitals: newVitals, notifications: newNotifs };
      }),
      
      addSymptomLog: (log) => set((state) => {
        let isMerged = false;
        
        // Cari apakah ada duplikat yang tumpang tindih
        const newLogs = state.symptomLogs.map(existingLog => {
          if (existingLog.symptomId === log.symptomId) {
            const isSameDay = new Date(existingLog.onset).toDateString() === new Date(log.onset).toDateString();
            const isOverlapping = checkOverlap(existingLog.onset, existingLog.endDate || existingLog.onset, log.onset, log.endDate || log.onset);
            
            if (isSameDay || isOverlapping) {
              isMerged = true;
              return { ...existingLog, ...log, id: existingLog.id }; // Gabungkan, pertahankan ID lama
            }
          }
          return existingLog;
        });

        if (!isMerged) {
          newLogs.unshift(log); // Tambahkan baru jika tidak ada overlap
        }

        const newNotifs = [...state.notifications];
        if (!isMerged) {
          newNotifs.unshift({
            id: Math.random().toString(36).substring(2),
            message: `Anda belum melengkapi detail anamnesis untuk ${log.symptomName}. Klik untuk melanjutkan wawancara.`,
            type: 'reminder',
            createdAt: new Date().toISOString(),
            read: false,
            action: 'anamnesis'
          });
        }
        
        return { symptomLogs: newLogs, notifications: newNotifs };
      }),
      
      updateSymptomLog: (log) => set((state) => ({
        symptomLogs: state.symptomLogs.map(l => l.id === log.id ? log : l)
      })),

      deleteSymptomLog: (id) => set((state) => ({
        symptomLogs: state.symptomLogs.filter(l => l.id !== id)
      })),

      addMedicationLog: (log) => set((state) => ({ medicationLogs: [log, ...state.medicationLogs] })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      setVitalsModalOpen: (isOpen) => set({ isVitalsModalOpen: isOpen }),
      setSymptomModalOpen: (isOpen, prefilledId = undefined) => set({ isSymptomModalOpen: isOpen, prefilledSymptomId: prefilledId || null }),
      setMedicationModalOpen: (isOpen) => set({ isMedicationModalOpen: isOpen }),
      setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
      setActiveSymptomModalOpen: (isOpen, log = null) => set({ isActiveSymptomModalOpen: isOpen, selectedActiveSymptom: log }),

      resetData: () => {
        set({ 
          hasOnboarded: false, 
          activeTabIndex: 0, 
          vitals: {}, 
          symptomLogs: [],
          medicationLogs: [],
          notifications: [],
          isVitalsModalOpen: false,
          isSymptomModalOpen: false,
          isMedicationModalOpen: false,
          isDeleteModalOpen: false,
          isActiveSymptomModalOpen: false,
          prefilledSymptomId: null,
          selectedActiveSymptom: null
        });
      }
    }),
    {
      name: 'rahasya_storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
