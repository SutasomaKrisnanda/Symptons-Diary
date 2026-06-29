import { useState } from 'react';
import { MagnifyingGlass, BookOpen, Bug } from '@phosphor-icons/react';
import diseasesData from '../../data/diseases.json';
import DiseaseDetailModal from '../../components/modals/DiseaseDetailModal';

export default function DiseaseLibraryTab() {
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any>(null);

  const filteredDiseases = diseasesData.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.icd10.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar pb-28 lg:pb-8 relative p-6 lg:p-10 bg-bgapp">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sticky top-0 bg-bgapp/90 backdrop-blur-md z-30 py-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-brand shadow-soft">
              <BookOpen weight="fill" className="text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ensiklopedia Penyakit</h2>
              <p className="text-sm text-gray-500">Pelajari detail medis, ICD-10, dan tanda bahaya</p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input 
              type="text" 
              placeholder="Cari penyakit atau ICD-10..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 shadow-soft text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
            />
          </div>
        </div>

        {/* Grid Penyakit */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <div 
              key={disease.id} 
              onClick={() => setSelectedDisease(disease)}
              className="bg-white rounded-[28px] p-6 shadow-soft border border-gray-50 hover:border-brand/30 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold text-brand bg-brand-light px-2 py-1 rounded-full uppercase tracking-wider">
                    {disease.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {disease.icd10}
                  </span>
                </div>
                {disease.isInfectious && (
                  <span title="Penyakit Infeksi"><Bug weight="fill" className="text-red-400 text-lg" /></span>
                )}
              </div>
              
              <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-brand transition-colors leading-tight">{disease.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                {disease.description}
              </p>
              
              <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
                <p className="text-xs font-semibold text-brand">Baca Detail Klinis</p>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand group-hover:text-white transition-colors">
                  <BookOpen weight="bold" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDiseases.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <BookOpen className="text-6xl text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">Penyakit tidak ditemukan.</p>
          </div>
        )}

      </div>

      <DiseaseDetailModal disease={selectedDisease} onClose={() => setSelectedDisease(null)} />
    </div>
  );
}
