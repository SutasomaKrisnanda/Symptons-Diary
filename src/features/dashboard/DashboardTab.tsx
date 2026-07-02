import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  User, MagnifyingGlass, Bell, Thermometer, 
  SlidersHorizontal, Fire, Plus, ArrowUpRight, Pill, 
  Warning, Stethoscope, BookOpen, ClockCounterClockwise
} from '@phosphor-icons/react';
import VitalsModal from '../../components/modals/VitalsModal';
import MedicationModal from '../../components/modals/MedicationModal';
import SymptomPickerModal from '../../components/modals/SymptomPickerModal';
import DiseaseDetailModal from '../../components/modals/DiseaseDetailModal';
import ActiveSymptomDetailModal from '../../components/modals/ActiveSymptomDetailModal';
import symptomsData from '../../data/symptoms.json';
import diseasesData from '../../data/diseases.json';

export default function DashboardTab() {
  const { 
    vitals, symptomLogs, medicationLogs, notifications,
    setVitalsModalOpen, setMedicationModalOpen, setSymptomModalOpen,
    setActiveTab, markNotificationRead, setActiveSymptomModalOpen 
  } = useAppStore();
  
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  
  const [symptomFilter, setSymptomFilter] = useState('');
  const [symptomSort, setSymptomSort] = useState<'time' | 'alpha' | 'severity'>('time');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('id-ID', options));
  }, []);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return null;
    const lowerQ = searchQuery.toLowerCase();
    
    const quickActions = symptomsData.filter(s => s.name.toLowerCase().includes(lowerQ)).slice(0, 3);
    const encyclopedia = diseasesData.filter(d => d.name.toLowerCase().includes(lowerQ) || d.icd10.toLowerCase().includes(lowerQ)).slice(0, 3);
    const history = [
      ...symptomLogs.map(l => ({ ...l, type: 'symptom', time: new Date(l.onset).getTime() })),
      ...medicationLogs.map(l => ({ ...l, type: 'medication', time: new Date(`${l.date}T${l.time}`).getTime() }))
    ].filter(log => 
      (log.type === 'symptom' && (log as any).symptomName.toLowerCase().includes(lowerQ)) ||
      (log.type === 'medication' && (log as any).name.toLowerCase().includes(lowerQ))
    ).sort((a, b) => b.time - a.time).slice(0, 3);

    return { quickActions, encyclopedia, history };
  }, [searchQuery, symptomLogs, medicationLogs]);

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setIsNotifOpen(false);
    if (notif.action === 'anamnesis') setActiveTab(1);
    if (notif.action === 'vitals') setVitalsModalOpen(true);
  };

  const allLogs = [
    ...symptomLogs.map(log => ({ ...log, type: 'symptom', time: new Date(log.onset).getTime() })),
    ...medicationLogs.map(log => ({ ...log, type: 'medication', time: new Date(`${log.date}T${log.time}`).getTime() }))
  ].sort((a, b) => b.time - a.time).slice(0, 5);

  const processedSymptomLogs = useMemo(() => {
    let res = [...symptomLogs];
    if (symptomFilter) {
      res = res.filter(l => l.symptomName.toLowerCase().includes(symptomFilter.toLowerCase()));
    }
    res.sort((a, b) => {
      if (symptomSort === 'time') return new Date(b.onset).getTime() - new Date(a.onset).getTime();
      if (symptomSort === 'alpha') return a.symptomName.localeCompare(b.symptomName);
      if (symptomSort === 'severity') return (b.severity || 0) - (a.severity || 0);
      return 0;
    });
    return res;
  }, [symptomLogs, symptomFilter, symptomSort]);

  return (
    <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar pb-28 lg:pb-8 relative animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="px-6 lg:px-10 pt-8 lg:pt-10 pb-4 flex flex-col md:flex-row md:justify-between items-start md:items-center sticky top-0 bg-bgapp/90 backdrop-blur-md z-30 gap-4">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-12 h-12 bg-white rounded-full overflow-hidden border border-gray-100 shadow-soft flex items-center justify-center shrink-0">
              <User weight="fill" className="text-gray-400 text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Dashboard Pribadi</p>
              <p className="text-gray-800 font-bold text-lg">{currentDate}</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto relative">
            
            {/* Global Medical Omnibox */}
            <div className="relative flex-1 md:w-72">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MagnifyingGlass className="text-gray-400 text-lg" />
              </div>
              <input 
                type="text" 
                placeholder="Cari gejala, penyakit, riwayat..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 shadow-soft text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
              />
              
              {/* Omnibox Dropdown */}
              {isSearchOpen && searchQuery.length >= 2 && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[60vh] overflow-y-auto">
                  
                  {/* Aksi Cepat */}
                  {searchResults.quickActions.length > 0 && (
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1"><Fire /> Aksi Cepat</h4>
                      {searchResults.quickActions.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => { setSymptomModalOpen(true, s.id); setIsSearchOpen(false); setSearchQuery(''); }}
                          className="px-3 py-2 hover:bg-brand-light/30 rounded-xl cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center shrink-0">
                            <Plus weight="bold" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Catat {s.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">SNOMED: {s.snomed_ct}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ensiklopedia */}
                  {searchResults.encyclopedia.length > 0 && (
                    <div className="p-3 border-t border-gray-50">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1"><BookOpen /> Ensiklopedia</h4>
                      {searchResults.encyclopedia.map(d => (
                        <div 
                          key={d.id} 
                          onClick={() => { setSelectedDisease(d); setIsSearchOpen(false); setSearchQuery(''); }}
                          className="px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                            <Stethoscope />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">ICD-10: {d.icd10}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Riwayat */}
                  {searchResults.history.length > 0 && (
                    <div className="p-3 border-t border-gray-50">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1"><ClockCounterClockwise /> Riwayat Anda</h4>
                      {searchResults.history.map((log: any) => (
                        <div 
                          key={log.id}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.type === 'symptom' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                            {log.type === 'symptom' ? <Fire /> : <Pill />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{log.type === 'symptom' ? log.symptomName : log.name}</p>
                            <p className="text-[10px] text-gray-400">{new Date(log.time).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.quickActions.length === 0 && searchResults.encyclopedia.length === 0 && searchResults.history.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">
                      Tidak ada hasil ditemukan.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Click Outside Overlay for Omnibox */}
            {isSearchOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)}></div>
            )}

            {/* Notification Bell */}
            <div className="relative z-50">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-12 h-12 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-gray-600 relative hover:text-brand transition-colors shrink-0"
              >
                {unreadNotifCount > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
                <Bell className="text-xl" />
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[60vh] overflow-y-auto">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Notifikasi</h3>
                    <span className="text-xs bg-brand-light text-brand px-2 py-1 rounded-full font-bold">{unreadNotifCount} Baru</span>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                      <Bell weight="thin" className="text-4xl mb-2" />
                      <p className="text-sm">Belum ada notifikasi.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex gap-3 ${notif.read ? 'bg-white hover:bg-gray-50' : notif.type === 'alert' ? 'bg-red-50 hover:bg-red-100' : 'bg-[#fffce1] hover:bg-[#fff9c4]'}`}
                        >
                          <div className={`mt-1 shrink-0 ${notif.type === 'alert' ? 'text-red-500' : 'text-amber-500'}`}>
                            {notif.type === 'alert' ? <Warning weight="fill" /> : <Bell weight="fill" />}
                          </div>
                          <div>
                            <p className={`text-sm ${notif.type === 'alert' ? 'text-red-900 font-medium' : 'text-gray-800'}`}>{notif.message}</p>
                            <p className={`text-[10px] mt-1 ${notif.read ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(notif.createdAt).toLocaleString('id-ID')}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Click Outside Overlay for Notif */}
            {isNotifOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
            )}

          </div>
        </header>

        {/* Main Grid */}
        <main className="px-6 lg:px-10 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-20">
          
          {/* Kolom Kiri */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Hero Card */}
            <div className="bg-brand rounded-[32px] p-8 text-white shadow-brand relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Catat Data Hari Ini</h2>
                <p className="text-brand-light text-sm md:text-base opacity-90 max-w-xs">
                  Bantu AI memahami kondisimu secara akurat untuk prediksi yang lebih baik.
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between md:justify-start gap-6 border border-white/20 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white text-brand rounded-2xl flex items-center justify-center shadow-sm">
                      <Thermometer weight="fill" className="text-2xl" />
                    </div>
                    <div className="hidden md:block">
                      <p className="font-semibold text-sm">Tanda Vital</p>
                      <p className="text-xs opacity-80">{vitals.temperature ? `${vitals.temperature}°C` : 'Belum diisi'}</p>
                    </div>
                  </div>
                  <button onClick={() => setVitalsModalOpen(true)} className="flex-1 md:flex-none bg-white text-brand px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform whitespace-nowrap">
                    Catat
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between md:justify-start gap-6 border border-white/20 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white text-brand rounded-2xl flex items-center justify-center shadow-sm">
                      <Pill weight="fill" className="text-2xl" />
                    </div>
                    <div className="hidden md:block">
                      <p className="font-semibold text-sm">Riwayat Obat</p>
                      <p className="text-xs opacity-80">{medicationLogs.length} obat hari ini</p>
                    </div>
                  </div>
                  <button onClick={() => setMedicationModalOpen(true)} className="flex-1 md:flex-none bg-white text-brand px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform whitespace-nowrap">
                    Catat Obat
                  </button>
                </div>
              </div>
            </div>

            {/* Pemantauan Gejala */}
            <div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-800">Gejala Aktif</h3>
                <div className="flex gap-2 relative">
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-400 hover:text-brand transition-colors"
                  >
                    <SlidersHorizontal className="text-lg" />
                  </button>

                  {/* Filter Dropdown */}
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pencarian</label>
                          <input 
                            type="text"
                            placeholder="Filter gejala..."
                            value={symptomFilter}
                            onChange={(e) => setSymptomFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Urutkan Berdasarkan</label>
                          <select 
                            value={symptomSort} 
                            onChange={(e) => setSymptomSort(e.target.value as any)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                          >
                            <option value="time">Waktu Terkini</option>
                            <option value="alpha">Abjad (A-Z)</option>
                            <option value="severity">Keparahan Terbesar</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  {isFilterDropdownOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterDropdownOpen(false)}></div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {processedSymptomLogs.map((log) => (
                  <div key={log.id} onClick={() => setActiveSymptomModalOpen(true, log)} className="bg-white rounded-[28px] p-6 shadow-soft border border-gray-50 flex flex-col justify-between aspect-square relative group hover:border-brand/30 hover:shadow-lg transition-all cursor-pointer">
                    <h4 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{log.symptomName}</h4>
                    <p className="text-xs text-gray-400 mt-1">Skala: {log.severity}/10</p>
                    <div className="flex justify-between items-end mt-4">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                        <Fire weight="fill" className="text-2xl" />
                      </div>
                      <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                        <ArrowUpRight weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Tambah Gejala */}
                <div onClick={() => setSymptomModalOpen(true)} className="bg-transparent border-2 border-dashed border-gray-300 rounded-[28px] p-6 flex flex-col items-center justify-center aspect-square hover:border-brand hover:bg-brand-light/30 transition-colors cursor-pointer group text-gray-400 hover:text-brand">
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                    <Plus weight="bold" className="text-xl" />
                  </div>
                  <span className="font-semibold text-sm">Pilih Gejala</span>
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (Aktivitas) */}
          <div className="lg:col-span-4 mt-6 lg:mt-0">
            <div className="bg-white rounded-[32px] p-6 shadow-soft border border-gray-50 h-full">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Aktivitas Terakhir</h3>
              
              <div className="space-y-6">
                {allLogs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    Belum ada aktivitas hari ini.
                  </div>
                ) : (
                  allLogs.map((log: any, index) => (
                    <div key={log.id} className="relative flex gap-4 animate-in slide-in-from-right-4" style={{ animationDelay: `${index * 100}ms` }}>
                      {/* Timeline Line */}
                      {index !== allLogs.length - 1 && (
                        <div className="absolute top-10 left-6 bottom-[-24px] w-px bg-gray-100"></div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${log.type === 'symptom' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                        {log.type === 'symptom' ? <Fire weight="fill" className="text-xl" /> : <Pill weight="fill" className="text-xl" />}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {log.type === 'symptom' ? 'Gejala Dicatat' : 'Obat Dikonsumsi'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {log.type === 'symptom' ? log.symptomName : `${log.name} - ${log.dosage}`}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                          {new Date(log.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      <VitalsModal />
      <MedicationModal />
      <SymptomPickerModal />
      <ActiveSymptomDetailModal />
      <DiseaseDetailModal disease={selectedDisease} onClose={() => setSelectedDisease(null)} />
    </div>
  );
}
