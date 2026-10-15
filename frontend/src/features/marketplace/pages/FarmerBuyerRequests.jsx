import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  RefreshCw,
  Building2,
  BadgeCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { marketplaceService } from '../../marketplace/services/marketplace.api';
import { analyticsService } from '../../analytics/services/analytics.api';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    icon: XCircle,
  },
  PROCESSING: {
    label: 'Processing',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    icon: RefreshCw,
  },
  PAID: {
    label: 'Paid',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: 'Shipped',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    dotClass: 'bg-teal-500',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-500',
    icon: XCircle,
  },
};

export default function FarmerBuyerRequests() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        const response = await marketplaceService.getSellerOrders(statusFilter, searchTerm);
        if (response.success) {
          setOrders(response.data || []);
          return;
        }
      } catch (apiErr) {
        // If the new endpoint returns 404 (e.g. Remote Vercel deployment hasn't redeployed yet),
        // fallback gracefully to analytics dashboard recentOrders so the farmer sees all buyer requests immediately!
        console.warn('seller-orders returned error, attempting fallback to analytics stats:', apiErr);
        const statsRes = await analyticsService.getDashboardStats();
        if (statsRes.success && statsRes.data?.recentOrders) {
          let list = statsRes.data.recentOrders || [];
          if (statusFilter && statusFilter !== 'ALL') {
            list = list.filter((o) => o.status === statusFilter);
          }
          if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            list = list.filter((order) => {
              const buyerName = `${order.buyer?.firstName || ''} ${order.buyer?.lastName || ''}`.toLowerCase();
              const businessName = (order.buyer?.businessName || '').toLowerCase();
              const cropTitle = (order.listing?.title || '').toLowerCase();
              return buyerName.includes(term) || businessName.includes(term) || cropTitle.includes(term);
            });
          }
          setOrders(list);
          return;
        }
        throw apiErr;
      }
    } catch (err) {
      setError(err.message || 'Failed to load incoming buyer requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleQuickStatusUpdate = async (orderId, newStatus, e) => {
    e.stopPropagation();
    setIsUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
    try {
      await marketplaceService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message || 'Error occurred'}`);
    } finally {
      setIsUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Buyer Requests & Purchase Orders</h2>
          <p className="text-slate-500 text-sm mt-1">
            Review incoming purchase requests, orders, and wholesale inquiries submitted by registered buyers for your produce.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 self-start md:self-auto px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-agrigreen-600' : 'text-slate-500'}`} />
          Refresh Requests
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">All Requests</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {orders.filter((o) => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Accepted / In Progress</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {orders.filter((o) => ['ACCEPTED', 'PAID', 'PROCESSING'].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Dispatched / Completed</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {orders.filter((o) => ['SHIPPED', 'DELIVERED'].includes(o.status)).length}
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by buyer, business, crop, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-20 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrigreen-500/20 focus:border-agrigreen-500 transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-agrigreen-600 text-white rounded-md hover:bg-agrigreen-700 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {['ALL', 'PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content states */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to fetch buyer requests</p>
            <p className="text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-medium px-3 py-1 rounded-md transition"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-agrigreen-600"></div>
          <p className="text-sm font-medium text-slate-600 mt-3">Loading buyer requests & purchase orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="h-16 w-16 bg-agrigreen-50 rounded-2xl flex items-center justify-center mx-auto text-agrigreen-600 mb-4 border border-agrigreen-100">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No buyer requests found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {statusFilter !== 'ALL'
              ? `There are currently no buyer requests with the "${statusFilter}" status.`
              : 'You have not received any purchase orders or purchase requests from buyers yet. As buyers discover your active listings, their orders will appear here.'}
          </p>
          <div className="flex justify-center gap-3">
            {statusFilter !== 'ALL' ? (
              <button
                onClick={() => setStatusFilter('ALL')}
                className="px-4 py-2 text-sm font-medium text-navy-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                Clear Filter
              </button>
            ) : (
              <Link
                to="/farmer/listings"
                className="px-4 py-2 text-sm font-medium text-white bg-agrigreen-600 rounded-lg hover:bg-agrigreen-700 transition"
              >
                Manage Produce Listings
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Buyer & Organization</th>
                  <th className="px-5 py-3.5">Crop / Product</th>
                  <th className="px-5 py-3.5">Quantity</th>
                  <th className="px-5 py-3.5">Offered / Budget Price</th>
                  <th className="px-5 py-3.5">Delivery Location</th>
                  <th className="px-5 py-3.5">Request Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orders.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.icon;
                  const isPending = order.status === 'PENDING';

                  return (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/farmer/buyer-requests/${order._id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Buyer info */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-agrigreen-50 text-agrigreen-700 font-bold flex items-center justify-center shrink-0 border border-agrigreen-100 text-xs uppercase">
                            {order.buyer?.firstName ? order.buyer.firstName[0] : 'B'}
                            {order.buyer?.lastName ? order.buyer.lastName[0] : ''}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-navy-900 group-hover:text-agrigreen-700 transition">
                              <span>
                                {order.buyer?.firstName} {order.buyer?.lastName}
                              </span>
                              {order.buyer?.isVerified && (
                                <span title="Verified Buyer">
                                  <BadgeCheck className="h-4 w-4 text-agrigreen-600 inline" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[160px]">
                                {order.buyer?.businessName || 'Independent Wholesale Buyer'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Crop info */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-navy-900">{order.listing?.title || 'Farm Produce'}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                            {order.listing?.cropType || 'Produce'}
                          </span>
                          {order.listing?.grade && (
                            <span className="text-slate-400">• Grade {order.listing.grade}</span>
                          )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-navy-900">
                          {order.quantity?.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            {order.listing?.quantityUnit || 'KG'}
                          </span>
                        </div>
                      </td>

                      {/* Offered Price */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-agrigreen-700">
                          {order.currency || 'PKR'} {order.totalPrice?.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          @{order.currency || 'PKR'} {order.unitPrice}/{order.listing?.quantityUnit || 'KG'}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1 text-slate-600 text-xs">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate max-w-[150px]">
                            {order.deliveryDetails?.address || order.listing?.location?.district || 'Not specified'}
                          </span>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConf.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dotClass}`}></span>
                          {statusConf.label}
                        </span>
                      </td>

                      {/* View Details action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {isPending && (
                            <>
                              <button
                                disabled={isUpdatingStatus[order._id]}
                                onClick={(e) => handleQuickStatusUpdate(order._id, 'ACCEPTED', e)}
                                className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                disabled={isUpdatingStatus[order._id]}
                                onClick={(e) => handleQuickStatusUpdate(order._id, 'REJECTED', e)}
                                className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <Link
                            to={`/farmer/buyer-requests/${order._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-agrigreen-700 bg-agrigreen-50 hover:bg-agrigreen-100 border border-agrigreen-200 rounded-md transition"
                          >
                            <span>View Details</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
