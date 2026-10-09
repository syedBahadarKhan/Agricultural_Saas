import React from 'react';
import { Leaf, Sprout, AlertTriangle, TrendingUp, List } from 'lucide-react';
import { useAnalytics } from '../features/analytics/hooks/useAnalytics';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
  const { stats, loading, error } = useAnalytics();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>;
  }

  const statCards = [
    { name: 'Active Farms', value: stats?.totalFarms || 0, icon: Leaf, color: 'text-agrigreen-600', bg: 'bg-agrigreen-100' },
    { name: 'Active Crops', value: stats?.activeCrops || 0, icon: Sprout, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Listings', value: stats?.activeListings || 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Pending Orders', value: stats?.pendingOrders || 0, icon: List, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-navy-900">Dashboard Overview</h2>
         <button className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition">
           + Add New Crop
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
             <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-500">{stat.name}</p>
               <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200">
                 <thead>
                   <tr>
                     <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer</th>
                     <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Crop</th>
                     <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                     <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                     <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-slate-200">
                    {stats?.recentOrders?.length === 0 ? (
                      <tr><td colSpan="5" className="px-4 py-4 text-center text-sm text-slate-500">No recent orders found.</td></tr>
                    ) : (
                      stats?.recentOrders?.map(order => (
                        <tr key={order._id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.buyer?.firstName} {order.buyer?.lastName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{order.listing?.title}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{order.quantity}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">Rs. {order.totalPrice}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">{order.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                 </tbody>
               </table>
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Crop Health Alerts</h3>
            <div className="space-y-4">
               <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-sm font-bold text-red-800">Late Blight Detected</h4>
                        <p className="text-xs text-red-600 mt-1">Swat Valley 2 (Potato) • High Severity</p>
                     </div>
                     <button className="text-xs bg-white text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50">View Treatment</button>
                  </div>
               </div>
               <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-sm font-bold text-amber-800">Nutrient Deficiency (N)</h4>
                        <p className="text-xs text-amber-700 mt-1">Mardan Field A (Wheat) • Low Severity</p>
                     </div>
                     <button className="text-xs bg-white text-amber-700 border border-amber-200 px-2 py-1 rounded hover:bg-amber-50">View Details</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
