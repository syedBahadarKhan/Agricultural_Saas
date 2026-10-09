import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../services/admin.api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApps: 0,
    approvedFarmers: 0,
    approvedBuyers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy-900">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Total Users</h3>
            <div className="bg-slate-100 p-2 rounded-md">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Pending Approvals</h3>
            <div className="bg-yellow-50 p-2 rounded-md">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.pendingApps}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Approved Farmers</h3>
            <div className="bg-agrigreen-50 p-2 rounded-md">
              <CheckCircle className="h-5 w-5 text-agrigreen-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.approvedFarmers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Approved Buyers</h3>
            <div className="bg-blue-50 p-2 rounded-md">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.approvedBuyers}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Recent Activity</h3>
        <p className="text-slate-500">More detailed platform statistics will appear here.</p>
      </div>
    </div>
  );
}
