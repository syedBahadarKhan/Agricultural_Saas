import React from 'react';
import { Sprout, Calendar, ArrowRight } from 'lucide-react';

export default function CropCard({ crop }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-28 bg-agrigreen-50 flex items-center justify-center relative">
         <Sprout className="h-12 w-12 text-agrigreen-300 opacity-50" />
         <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-navy-900 shadow">
           {crop.cycle?.stage || 'PLANNING'}
         </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy-900">{crop.name} {crop.variety && <span className="text-sm font-normal text-slate-500">({crop.variety})</span>}</h3>
        <p className="text-sm text-slate-500 mb-4">{crop.farm?.name || 'Farm unassigned'}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-500">Type</span>
            <span className="font-medium text-slate-800">{crop.type}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-500">Area Planted</span>
            <span className="font-medium text-slate-800">{crop.areaPlanted} {crop.areaUnit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 flex items-center"><Calendar className="h-3 w-3 mr-1"/> Harvest</span>
            <span className="font-medium text-slate-800">
              {crop.cycle?.expectedHarvestDate ? new Date(crop.cycle.expectedHarvestDate).toLocaleDateString() : 'TBD'}
            </span>
          </div>
        </div>
        
        <div className="mt-5 pt-3">
          <button className="w-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-md text-sm font-medium transition">
             Manage Crop <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
