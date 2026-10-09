import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { adminService } from '../services/admin.api';

export default function VerificationCenter() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await adminService.getPendingApplications();
        if (response.success) {
          setApplications(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch pending applications:', error);
      }
    };
    fetchApps();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateApplicationStatus(id, { status });
      setApplications(applications.filter(app => app._id !== id));
      alert(`Application successfully ${status.toLowerCase()}`);
    } catch (error) {
      alert(`Failed to update application: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy-900">Verification Center</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Pending Applications</h3>
        </div>
        
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No pending applications to review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="px-6 py-3 font-medium">Applicant</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Submitted</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-900">{app.user.firstName} {app.user.lastName}</div>
                      <div className="text-sm text-slate-500">{app.user.email}</div>
                      <div className="text-sm text-slate-500">{app.submittedData?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${app.role === 'FARMER' ? 'bg-agrigreen-100 text-agrigreen-800' : 'bg-blue-100 text-blue-800'}`}>
                        {app.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {app.submittedData?.city || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(app._id, 'APPROVED')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-agrigreen-600 hover:bg-agrigreen-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, 'REJECTED')}
                        className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
