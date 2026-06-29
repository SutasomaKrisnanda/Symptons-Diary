import { useAppStore } from '../../store/useAppStore';
import { 
  ShieldCheck, House, Stethoscope, Notebook, Trash
} from '@phosphor-icons/react';
import DashboardTab from '../../features/dashboard/DashboardTab';
import DiagnosisTab from '../../features/diagnosis/DiagnosisTab';
import DiseaseLibraryTab from '../../features/disease-library/DiseaseLibraryTab';
import DeleteDataModal from '../modals/DeleteDataModal';

export default function AppLayout() {
  const { activeTabIndex, setActiveTab, setDeleteModalOpen } = useAppStore();

  const handleReset = () => {
    setDeleteModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTabIndex) {
      case 0: return <DashboardTab />;
      case 1: return <DiagnosisTab />;
      case 2: return <DiseaseLibraryTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center">
            <ShieldCheck weight="fill" className="text-3xl text-brand" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">Rahasya</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab(0)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTabIndex === 0 ? 'bg-brand text-white shadow-brand' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <House weight={activeTabIndex === 0 ? "fill" : "regular"} className="text-2xl" />
            <span className="font-medium">Beranda</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(1)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTabIndex === 1 ? 'bg-brand text-white shadow-brand' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Stethoscope weight={activeTabIndex === 1 ? "fill" : "regular"} className="text-2xl" />
            <span className="font-medium">Diagnosa AI</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(2)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTabIndex === 2 ? 'bg-brand text-white shadow-brand' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Notebook weight={activeTabIndex === 2 ? "fill" : "regular"} className="text-2xl" />
            <span className="font-medium">Jurnal Gejala</span>
          </button>
        </nav>

        <div className="p-6">
          <div className="bg-red-50 rounded-2xl p-4 flex flex-col items-start gap-3 border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
              <Trash weight="fill" className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Privasi Penuh</h4>
              <p className="text-xs text-gray-500 mb-3 mt-1">Data Anda hanya di perangkat ini.</p>
            </div>
            <button 
              onClick={handleReset}
              className="w-full bg-white text-red-500 text-sm font-bold py-2 rounded-xl shadow-sm hover:bg-red-50 transition-colors border border-red-100"
            >
              Hapus Data
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full h-app relative flex flex-col overflow-hidden bg-bgapp">
        {renderContent()}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden absolute bottom-0 left-0 w-full px-6 pb-6 pt-2 z-40 bg-gradient-to-t from-bgapp via-bgapp/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-white p-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex justify-between items-center pointer-events-auto">
          
          <button 
            onClick={() => setActiveTab(0)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${activeTabIndex === 0 ? 'bg-brand text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <House weight={activeTabIndex === 0 ? "fill" : "regular"} className="text-2xl" />
          </button>

          <button 
            onClick={() => setActiveTab(1)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${activeTabIndex === 1 ? 'bg-brand text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Stethoscope weight={activeTabIndex === 1 ? "fill" : "regular"} className="text-2xl" />
          </button>

          <button 
            onClick={() => setActiveTab(2)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${activeTabIndex === 2 ? 'bg-brand text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Notebook weight={activeTabIndex === 2 ? "fill" : "regular"} className="text-2xl" />
          </button>

          <button 
            onClick={handleReset}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-red-400 hover:bg-red-50 hover:text-red-500`}
            title="Hapus Data"
          >
            <Trash weight="fill" className="text-2xl" />
          </button>
        </div>
      </div>

      <DeleteDataModal />
    </>
  );
}
