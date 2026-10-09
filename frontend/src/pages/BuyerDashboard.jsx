import React from 'react';
import { ShoppingCart, FileSignature, Truck, Search, IndianRupee } from 'lucide-react';
import { useAnalytics } from '../features/analytics/hooks/useAnalytics';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
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
    { name: 'Active Orders', value: stats?.activeOrders || 0, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-agrigreen-600', bg: 'bg-agrigreen-100' },
    { name: 'Total Spent', value: `Rs. ${stats?.totalSpent || 0}`, icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Market Listings', value: stats?.marketListings?.length || 0, icon: Search, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-navy-900">Procurement Dashboard</h2>
         <button className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition">
           + Create New RFQ
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

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
         <h3 className="text-lg font-bold text-navy-900 mb-4">Recent Orders</h3>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller</th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Crop</th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                 {stats?.recentOrders?.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-4 text-center text-sm text-slate-500">No recent orders found.</td></tr>
                 ) : (
                    stats?.recentOrders?.map(order => (
                      <tr key={order._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.seller?.firstName} {order.seller?.lastName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{order.listing?.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{order.quantity}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{order.status}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-agrigreen-600">Rs. {order.totalPrice}</td>
                      </tr>
                    ))
                 )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
