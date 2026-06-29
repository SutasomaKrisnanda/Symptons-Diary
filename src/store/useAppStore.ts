import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

localforage.config({
  name: 'SymptomsDiary',
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
  
  prefilledSymptomId: string | null;

  setOnboarded: (value: boolean) => void;
  setActiveTab: (index: number) => void;
  updateVitals: (vitals: Partial<Vitals>) => void;
  addSymptomLog: (log: SymptomLog) => void;
  addMedicationLog: (log: MedicationLog) => void;
  markNotificationRead: (id: string) => void;
  
  setVitalsModalOpen: (isOpen: boolean) => void;
  setSymptomModalOpen: (isOpen: boolean, prefilledId?: string) => void;
  setMedicationModalOpen: (isOpen: boolean) => void;
  setDeleteModalOpen: (isOpen: boolean) => void;
  
  resetData: () => void;
}

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
      
      prefilledSymptomId: null,

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
        const newLogs = [log, ...state.symptomLogs];
        const newNotifs = [...state.notifications];
        newNotifs.unshift({
          id: Math.random().toString(36).substring(2),
          message: `Anda belum melengkapi detail anamnesis untuk ${log.symptomName}. Klik untuk melanjutkan wawancara.`,
          type: 'reminder',
          createdAt: new Date().toISOString(),
          read: false,
          action: 'anamnesis'
        });
        return { symptomLogs: newLogs, notifications: newNotifs };
      }),
      
      addMedicationLog: (log) => set((state) => ({ medicationLogs: [log, ...state.medicationLogs] })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      setVitalsModalOpen: (isOpen) => set({ isVitalsModalOpen: isOpen }),
      setSymptomModalOpen: (isOpen, prefilledId = undefined) => set({ isSymptomModalOpen: isOpen, prefilledSymptomId: prefilledId || null }),
      setMedicationModalOpen: (isOpen) => set({ isMedicationModalOpen: isOpen }),
      setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),

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
          prefilledSymptomId: null
        });
      }
    }),
    {
      name: 'symptonsdiary_storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
