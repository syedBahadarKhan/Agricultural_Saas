import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, ExternalLink, QrCode } from 'lucide-react';
import { useAnalytics } from '../features/analytics/hooks/useAnalytics';
import { useLogistics } from '../features/logistics/hooks/useLogistics';

export default function MyOrders() {
  const { stats, loading: statsLoading } = useAnalytics();
  const { getShipmentByOrder } = useLogistics();
  const [shipments, setShipments] = useState({});

  const orders = stats?.recentOrders || [];

  useEffect(() => {
    const fetchShipments = async () => {
      const shipmentData = {};
      for (const order of orders) {
        if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
          const data = await getShipmentByOrder(order._id);
          if (data) shipmentData[order._id] = data;
        }
      }
      setShipments(shipmentData);
    };

    if (orders.length > 0) {
      fetchShipments();
    }
  }, [orders]);

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">My Procurement Orders</h2>
        <p className="text-slate-500 mt-1">Track your active orders and logistics status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-900">No active orders</h3>
          <p className="text-slate-500 mt-1">Head over to the Marketplace to procure crops.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-slate-500">Order #{order._id.substring(0, 8).toUpperCase()}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      order.status === 'DELIVERED' ? 'bg-agrigreen-100 text-agrigreen-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900">{order.listing?.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    Sold by: <span className="font-medium text-slate-700">{order.seller?.firstName} {order.seller?.lastName}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[200px] flex justify-between items-center md:block md:text-right">
                   <div>
                     <p className="text-sm text-slate-500">Total Price</p>
                     <p className="text-xl font-bold text-agrigreen-700">Rs. {order.totalPrice.toLocaleString()}</p>
                   </div>
                   <div className="md:mt-2">
                     <p className="text-sm text-slate-500">Quantity</p>
                     <p className="font-bold text-navy-900">{order.quantity} {order.listing?.quantityUnit || 'KG'}</p>
                   </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="p-6 bg-slate-50">
                <h4 className="font-bold text-navy-900 flex items-center mb-4">
                  <Truck className="h-5 w-5 mr-2 text-agrigreen-600" /> Logistics & Traceability
                </h4>

                {shipments[order._id] ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <p className="text-xs text-slate-500">Tracking Number</p>
                        <p className="font-mono font-bold text-sm text-navy-900">{shipments[order._id].trackingNumber}</p>
                     </div>
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <p className="text-xs text-slate-500">Transporter</p>
                        <p className="font-medium text-sm text-navy-900">{shipments[order._id].transporterName}</p>
                     </div>
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <p className="text-xs text-slate-500">Est. Delivery</p>
                        <p className="font-medium text-sm text-navy-900">
                          {new Date(shipments[order._id].estimatedDeliveryDate).toLocaleDateString()}
                        </p>
                     </div>
                     <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Traceability</p>
                          <p className="font-medium text-sm text-agrigreen-600 flex items-center cursor-pointer hover:underline">
                            View QR <ExternalLink className="h-3 w-3 ml-1" />
                          </p>
                        </div>
                        <QrCode className="h-6 w-6 text-slate-400" />
                     </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">
                    {order.status === 'PENDING' || order.status === 'ACCEPTED' ? 
                      'Logistics will be assigned once the farmer prepares the shipment.' : 
                      'Tracking information is currently unavailable.'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
