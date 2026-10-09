import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFarms } from '../hooks/useFarms';
import FarmCard from '../components/FarmCard';
import FarmForm from '../components/FarmForm';

export default function FarmerFarms() {
  const { farms, loading, error } = useFarms();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy-900">My Farms</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Farm
        </button>
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
      ) : farms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">You haven't added any farms yet.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-agrigreen-600 font-medium hover:text-agrigreen-700"
          >
            + Add your first farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard key={farm._id} farm={farm} />
          ))}
        </div>
      )}
      
      {showAddModal && <FarmForm onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
