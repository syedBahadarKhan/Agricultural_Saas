import React from 'react';
import { Stethoscope, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DiseaseCard({ disease }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'LOW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MODERATE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'SEVERE': return 'bg-red-200 text-red-900 border-red-300 font-bold';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition cursor-pointer group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
           <h3 className="text-lg font-bold text-navy-900 group-hover:text-agrigreen-600 transition">{disease.name}</h3>
           <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(disease.severity)}`}>
             {disease.severity} Risk
           </span>
        </div>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{disease.causes}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 line-clamp-1"><span className="font-medium">Symptoms:</span> {disease.symptoms?.join(', ')}</span>
          </div>
          <div className="flex items-start text-sm">
            <ShieldCheck className="h-4 w-4 mr-2 text-agrigreen-500 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 line-clamp-1"><span className="font-medium">Treatments:</span> {disease.treatments?.length || 0} available</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-4">
          {disease.affectedCrops?.slice(0, 3).map((c, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {c}
            </span>
          ))}
          {disease.affectedCrops?.length > 3 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              +{disease.affectedCrops.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center group-hover:bg-agrigreen-50 transition">
        <span className="text-sm font-medium text-slate-500 group-hover:text-agrigreen-700">View Details & Treatments</span>
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-agrigreen-700" />
      </div>
    </div>
  );
}
