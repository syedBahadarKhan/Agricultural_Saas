import React, { useState } from 'react';
import { useFarms } from '../hooks/useFarms';

export default function FarmForm({ onClose }) {
  const { addFarm } = useFarms();
  const [formData, setFormData] = useState({
    name: '',
    totalArea: '',
    areaUnit: 'Acre',
    location: {
      address: '',
      district: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addFarm({
        ...formData,
        totalArea: Number(formData.totalArea)
      });
      onClose(); // close modal on success
      // Note: useFarms adds it to state, but since it's a different component instance,
      // it's better to reload or pass the onSuccess callback. In a real app we'd use React Query.
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-navy-900">Add New Farm</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Farm Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" 
                placeholder="e.g. Swat Valley 1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Total Area</label>
                <input type="number" name="totalArea" required value={formData.totalArea} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Unit</label>
                <select name="areaUnit" value={formData.areaUnit} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500">
                  <option value="Acre">Acre</option>
                  <option value="Hectare">Hectare</option>
                  <option value="Kanal">Kanal</option>
                  <option value="Marla">Marla</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Address / Location Details</label>
              <input type="text" name="location.address" value={formData.location.address} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">District / Region</label>
              <input type="text" name="location.district" required value={formData.location.district} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-agrigreen-600 text-white rounded-md hover:bg-agrigreen-700 font-medium disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Farm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
