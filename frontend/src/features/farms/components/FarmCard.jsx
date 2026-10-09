import React from 'react';
import { MapPin, FileText } from 'lucide-react';

export default function FarmCard({ farm }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-32 bg-slate-200 w-full relative">
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-navy-900 shadow">
          {farm.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy-900">{farm.name}</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="h-4 w-4 mr-2 text-agrigreen-600" /> {farm.location?.district || farm.location?.region || 'Unknown Location'}
          </div>
          <div className="flex justify-between text-sm text-slate-700 mt-4 pt-4 border-t border-slate-100">
             <div><span className="font-semibold">{farm.totalArea}</span> {farm.areaUnit || 'Acres'}</div>
             <div><span className="font-semibold">{farm.plots?.length || 0}</span> Plots</div>
          </div>
        </div>
        <div className="mt-4 pt-4 flex space-x-2">
          <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-md text-sm font-medium transition">Manage</button>
          <button className="flex-1 bg-agrigreen-50 hover:bg-agrigreen-100 text-agrigreen-700 py-2 rounded-md text-sm font-medium transition flex items-center justify-center">
             <FileText className="h-4 w-4 mr-1" /> Report
          </button>
        </div>
      </div>
    </div>
  );
}
