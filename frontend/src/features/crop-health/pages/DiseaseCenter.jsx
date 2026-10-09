import React from 'react';
import { Search, Filter, Stethoscope } from 'lucide-react';
import { useDiseases } from '../hooks/useDiseases';
import DiseaseCard from '../components/DiseaseCard';

export default function DiseaseCenter() {
  const { diseases, loading, error, search, setSearch, crop, setCrop } = useDiseases();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Crop Health Center</h2>
          <p className="text-slate-500 mt-1">Search for diseases, pests, and get verified treatment recommendations.</p>
        </div>
        <button className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition flex items-center">
          <Stethoscope className="h-5 w-5 mr-2" /> Request Diagnosis
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search by disease name or symptom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
          />
        </div>
        <div className="w-full md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <select 
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500 appearance-none bg-white"
          >
            <option value="">All Crops</option>
            <option value="Tomato">Tomato</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
            <option value="Cotton">Cotton</option>
            <option value="Sugarcane">Sugarcane</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
        </div>
      ) : diseases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-900">No results found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search terms or crop filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease) => (
            <DiseaseCard key={disease._id} disease={disease} />
          ))}
        </div>
      )}
    </div>
  );
}
