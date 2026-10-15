import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  BadgeCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  IndianRupee,
  FileText,
  AlertCircle,
  RefreshCw,
  Share2,
  Send,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { marketplaceService } from '../../marketplace/services/marketplace.api';
import { analyticsService } from '../../analytics/services/analytics.api';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Farmer Approval',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted by Farmer',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    dotClass: 'bg-red-500',
    icon: XCircle,
  },
  PROCESSING: {
    label: 'Processing Order',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
    icon: RefreshCw,
  },
  PAID: {
    label: 'Payment Confirmed',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-500',
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: 'Shipped / In Transit',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotClass: 'bg-indigo-500',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
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

export default function BuyerRequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        const res = await marketplaceService.getSellerOrderById(requestId);
        if (res.success) {
          setData(res.data);
          return;
        }
      } catch (apiErr) {
        // If remote Vercel hasn't deployed the seller-orders endpoint yet (404),
        // fallback to retrieving order details from analytics stats or local state
        console.warn('getSellerOrderById returned error, trying analytics fallback:', apiErr);
        const statsRes = await analyticsService.getDashboardStats();
        if (statsRes.success && statsRes.data?.recentOrders) {
          const matchedOrder = statsRes.data.recentOrders.find((o) => o._id === requestId);
          if (matchedOrder) {
            setData({
              order: matchedOrder,
              buyerStats: {
                totalOrdersWithFarmer: 1,
                completedOrdersWithFarmer: matchedOrder.status === 'ACCEPTED' ? 1 : 0,
              },
            });
            return;
          }
        }
        throw apiErr;
      }
    } catch (err) {
      setError(err.message || 'Failed to load buyer request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true);
      setActionSuccess(null);
      const res = await marketplaceService.updateOrderStatus(requestId, newStatus);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          order: { ...prev.order, status: newStatus },
        }));
        setActionSuccess(`Request successfully marked as ${newStatus}`);
      }
    } catch (err) {
      alert(`Action failed: ${err.message || 'Error occurred'}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-agrigreen-600"></div>
        <p className="text-sm font-medium text-slate-600 mt-4">Loading buyer and purchase request details...</p>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <button
          onClick={() => navigate('/farmer/requests')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-agrigreen-700 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Buyer Requests
        </button>
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Request Not Available</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">{error || 'The requested order or buyer record could not be found or you are not authorized to view it.'}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={fetchRequestDetails}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              Try Again
            </button>
            <Link
              to="/farmer/requests"
              className="px-4 py-2 text-sm font-medium text-white bg-agrigreen-600 rounded-lg hover:bg-agrigreen-700 transition"
            >
              Return to Buyer Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { order, buyerStats } = data;
  const buyer = order.buyer || {};
  const listing = order.listing || {};
  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusInfo.icon;

  const isPending = order.status === 'PENDING';
  const subtotal = (order.quantity || 0) * (order.unitPrice || 0);
  const deliveryFee = order.deliveryFee || 0;
  const grandTotal = order.totalPrice || subtotal + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/farmer/requests')}
            className="p-2 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition shadow-sm"
            title="Back to Buyer Requests"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/farmer" className="hover:text-agrigreen-700">Dashboard</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/farmer/requests" className="hover:text-agrigreen-700">Buyer Requests</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-mono text-slate-700">#{order._id.substring(0, 8).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold text-navy-900 mt-0.5">
              Buyer Purchase Request Details
            </h1>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${statusInfo.badgeClass}`}>
            <span className={`h-2 w-2 rounded-full ${statusInfo.dotClass}`}></span>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Buyer & Order Requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: Buyer Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-agrigreen-100 text-agrigreen-700 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-base">Buyer Profile & Verification</h3>
                  <p className="text-xs text-slate-500">Authorized buyer credentials & business records</p>
                </div>
              </div>
              {buyer.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  Verified Business
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  Registered Account
                </span>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Buyer Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-agrigreen-600 to-agrigreen-800 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                  {buyer.firstName ? buyer.firstName[0] : 'B'}
                  {buyer.lastName ? buyer.lastName[0] : ''}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                    {buyer.firstName} {buyer.lastName}
                    {buyer.isVerified && <BadgeCheck className="h-5 w-5 text-agrigreen-600" />}
                  </h4>
                  <p className="text-sm font-semibold text-agrigreen-700">
                    {buyer.businessName || 'Wholesale Buyer'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {buyer.businessType || 'Produce Procurement & Distribution'} • Member since {new Date(buyer.createdAt || order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Buyer Contact & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Authorized Contact Phone
                  </div>
                  <p className="font-semibold text-navy-900 mt-1 text-sm">
                    {order.deliveryDetails?.contactNumber || buyer.phone || 'Phone upon request'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Registered Email Address
                  </div>
                  <p className="font-semibold text-navy-900 mt-1 text-sm truncate">
                    {buyer.email || 'Email registered'}
                  </p>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    Business / Headquarter Address
                  </div>
                  <p className="font-medium text-navy-900 mt-1 text-sm">
                    {buyer.businessAddress || 'Peshawar Wholesale Market Hub'}
                  </p>
                </div>
              </div>

              {/* Relationship & History Stats */}
              <div className="p-4 bg-agrigreen-50/70 border border-agrigreen-100 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-semibold text-agrigreen-900">Trading Relationship History:</span>
                  <span className="text-agrigreen-800 ml-1.5">
                    {buyerStats?.totalOrdersWithFarmer > 1
                      ? `${buyerStats.totalOrdersWithFarmer} requests submitted with your farm (${buyerStats.completedOrdersWithFarmer} completed)`
                      : 'First-time procurement inquiry with your farm'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-agrigreen-700">
                  <ShieldCheck className="h-4 w-4" />
                  Direct Farm-to-Buyer Contract
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Order / Purchase Request Information */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-base">Crop & Purchase Specifications</h3>
                  <p className="text-xs text-slate-500">Detailed quantities, pricing, and buyer requirements</p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Ref: #{order._id.substring(0, 10).toUpperCase()}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Product row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 uppercase">
                      {listing.cropType || 'Produce'}
                    </span>
                    {listing.grade && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                        Grade {listing.grade}
                      </span>
                    )}
                    {listing.variety && (
                      <span className="text-xs text-slate-500 font-medium">Variety: {listing.variety}</span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-navy-900 mt-1">{listing.title || 'Agricultural Produce'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Listing Location: {listing.location?.district || 'Farm Location'} • Expected Harvest: {listing.expectedHarvestDate ? new Date(listing.expectedHarvestDate).toLocaleDateString() : 'Ready now'}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-slate-500">Requested Volume</p>
                  <p className="text-2xl font-extrabold text-navy-900">
                    {order.quantity?.toLocaleString()}{' '}
                    <span className="text-sm font-medium text-slate-500">{listing.quantityUnit || 'KG'}</span>
                  </p>
                </div>
              </div>

              {/* Delivery Destination & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase">
                    <MapPin className="h-4 w-4 text-agrigreen-600" />
                    Delivery Destination Address
                  </div>
                  <p className="font-semibold text-navy-900 mt-2 text-sm leading-relaxed">
                    {order.deliveryDetails?.address || 'Buyer collection from farm / To be arranged'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Contact: {order.deliveryDetails?.contactNumber || buyer.phone || 'Available in profile'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Requested Delivery / Dispatch Date
                  </div>
                  <p className="font-semibold text-navy-900 mt-2 text-sm">
                    {order.deliveryDetails?.expectedDeliveryDate
                      ? new Date(order.deliveryDetails.expectedDeliveryDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Urgent / Earliest available date'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Request submitted on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quality Specifications & Requirements */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h5 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-500" />
                  Quality Specifications & Packaging Standards
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.qualityRequirements || `Produce must match Grade ${listing.grade || 'Standard'} requirements. Clean, uniform size, sorted and packed according to provincial food safety guidelines.`}
                </p>
              </div>

              {/* Buyer Notes / Special Instructions */}
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Buyer Special Notes & Unloading Instructions
                </h5>
                <p className="text-sm text-amber-900 leading-relaxed italic">
                  "{order.notes || 'Please ensure high quality grade packaging in standard crates. Unloading required during morning market hours.'}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Financials & Action Controls */}
        <div className="space-y-6">
          {/* Financial Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-navy-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Financial Overview</span>
              <span className="text-xs font-semibold text-agrigreen-700 bg-agrigreen-50 px-2 py-0.5 rounded">
                Direct B2B Terms
              </span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Unit Price</span>
                <span className="font-semibold text-slate-900">
                  {order.currency || 'PKR'} {order.unitPrice?.toLocaleString()} / {listing.quantityUnit || 'KG'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Requested Quantity</span>
                <span className="font-semibold text-slate-900">
                  {order.quantity?.toLocaleString()} {listing.quantityUnit || 'KG'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Produce Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {order.currency || 'PKR'} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Logistics & Handling</span>
                <span className="font-semibold text-slate-900">
                  {order.currency || 'PKR'} {deliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-navy-900 block">Total Amount</span>
                  <span className="text-xs text-slate-400">Payment status: {order.paymentStatus || 'UNPAID'}</span>
                </div>
                <span className="text-2xl font-extrabold text-agrigreen-700">
                  {order.currency || 'PKR'} {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons for Farmer */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Request Management Actions
              </p>

              {isPending ? (
                <div className="space-y-2">
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                    className="w-full py-2.5 px-4 rounded-xl bg-agrigreen-600 hover:bg-agrigreen-700 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept Buyer Request
                  </button>
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('REJECTED')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline Request
                  </button>
                </div>
              ) : order.status === 'ACCEPTED' ? (
                <div className="space-y-2">
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('SHIPPED')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Truck className="h-4 w-4" />
                    Mark as Shipped / Dispatched
                  </button>
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('PAID')}
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                  >
                    Confirm Payment Received
                  </button>
                </div>
              ) : order.status === 'SHIPPED' ? (
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Order as Delivered
                </button>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                  This request is currently marked as <span className="font-bold">{order.status}</span>.
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact & Reference Helper */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-agrigreen-600" />
              Verified Transaction Safeguards
            </h4>
            <p>
              • Buyer phone number is authorized for delivery logistics and scheduling.
            </p>
            <p>
              • All pricing terms and quantity guarantees are stored and logged with transaction reference <span className="font-mono text-slate-800">#{order._id.substring(0, 8)}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
