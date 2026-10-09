import React, { useState, useEffect } from 'react';
import { useCrops } from '../hooks/useCrops';
import { useFarms } from '../../farms/hooks/useFarms';

export default function CropForm({ onClose }) {
  const { addCrop } = useCrops();
  const { farms, fetchFarms } = useFarms();
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    type: 'CEREAL',
    farm: '',
    areaPlanted: '',
    areaUnit: 'Acre',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addCrop({
        ...formData,
        areaPlanted: Number(formData.areaPlanted)
      });
      onClose();
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
          <h3 className="text-lg font-bold text-navy-900">Add New Crop</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Crop Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" 
                placeholder="e.g. Tomato" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Variety (Optional)</label>
                <input type="text" name="variety" value={formData.variety} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500" placeholder="e.g. Roma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select name="type" required value={formData.type} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500">
                  <option value="CEREAL">Cereal</option>
                  <option value="VEGETABLE">Vegetable</option>
                  <option value="FRUIT">Fruit</option>
                  <option value="CASH_CROP">Cash Crop</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Select Farm</label>
              <select name="farm" required value={formData.farm} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500">
                <option value="">-- Choose Farm --</option>
                {farms.map(f => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Area Planted</label>
                <input type="number" name="areaPlanted" required value={formData.areaPlanted} onChange={handleChange}
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

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-agrigreen-600 text-white rounded-md hover:bg-agrigreen-700 font-medium disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Crop'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
