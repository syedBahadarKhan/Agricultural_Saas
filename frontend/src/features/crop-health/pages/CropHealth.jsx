import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export default function CropHealth() {
  const [search, setSearch] = useState('');

  const mockResults = [
    {
      id: 1,
      disease: 'Tomato Early Blight',
      crop: 'Tomato',
      severity: 'High',
      symptoms: 'Dark, concentric rings on older leaves.',
      verified: true
    },
    {
      id: 2,
      disease: 'Nutrient Deficiency (Nitrogen)',
      crop: 'Wheat',
      severity: 'Medium',
      symptoms: 'Pale green or yellowing leaves starting from the bottom.',
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Crop Health & Disease Intelligence</h2>
        <p className="text-slate-300 mb-6 max-w-2xl">Search our expert-verified database for crop diseases, pests, and symptoms to find recommended treatments and management practices.</p>
        
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Search e.g., 'Tomato leaf yellowing'..." 
            className="w-full pl-12 pr-4 py-4 rounded-lg text-navy-900 focus:outline-none focus:ring-4 focus:ring-agrigreen-500 shadow-inner text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
          <button className="absolute right-2 top-2 bg-agrigreen-600 hover:bg-agrigreen-500 text-white px-6 py-2 rounded-md font-bold transition">
            Search
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-amber-800">Important Notice</h4>
          <p className="text-sm text-amber-700 mt-1">Treatment recommendations should be verified against local agricultural guidance and the product label. Severe or uncertain cases should be reviewed by a qualified agricultural expert.</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-navy-900 mb-4">Search Results</h3>
        <div className="grid grid-cols-1 gap-4">
          {mockResults.map(result => (
            <div key={result.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-bold text-navy-900">{result.disease}</h4>
                  {result.verified && (
                     <span className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-semibold border border-blue-200">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Expert Verified
                     </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${result.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {result.severity} Severity
                  </span>
                </div>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-800">Crop:</span> {result.crop}</p>
                <p className="text-sm text-slate-600 mt-1"><span className="font-medium text-slate-800">Symptoms:</span> {result.symptoms}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-agrigreen-600 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
