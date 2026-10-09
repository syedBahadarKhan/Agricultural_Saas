import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function ApplicationStatus() {
  const { user } = useAuth();
  let intentData = null;
  try {
    const intentStr = localStorage.getItem('purchaseIntent');
    if (intentStr) intentData = JSON.parse(intentStr);
  } catch (e) {}

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-navy-900">
          Application Status
        </h2>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 text-center">
          {user?.accountStatus === 'PENDING_REVIEW' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Pending Admin Approval</h3>
              <p className="text-sm text-slate-500 mb-6">
                Your application has been submitted and is currently waiting for administrator review. You will be able to access the platform features once your account is approved.
              </p>
              {intentData && intentData.intent === 'BUY' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm mb-6 text-left">
                  <span className="font-semibold block mb-1">Purchase Pending</span>
                  Your requested product will be available for purchase directly once your account is approved.
                </div>
              )}
            </div>
          )}

          {user?.accountStatus === 'REJECTED' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Application Rejected</h3>
              <p className="text-sm text-slate-500 mb-6">
                Unfortunately, your application to join AgriSaaS Pakistan has been rejected.
              </p>
            </div>
          )}

          <div className="mt-6">
            <Link to="/" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-agrigreen-700 bg-agrigreen-100 hover:bg-agrigreen-200 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
