import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/api/client';
import { MapPin, Calendar, Box, Truck } from 'lucide-react';

export default function PurchaseListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [quantity, setQuantity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear intent from local storage since we are here now
    localStorage.removeItem('purchaseIntent');

    const fetchListing = async () => {
      try {
        const response = await apiClient.get(`/marketplace/listings/${id}`);
        setListing(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load listing. It may be unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const qty = Number(quantity);
    if (qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (qty > listing.quantityAvailable) {
      setError(`Only ${listing.quantityAvailable} ${listing.quantityUnit} is currently available.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/marketplace/orders', {
        listingId: listing._id,
        quantity: qty,
        deliveryDetails: {
          address: deliveryAddress,
          contactNumber,
          expectedDeliveryDate: expectedDate,
        },
        notes
      });

      if (response.data.success) {
        navigate('/buyer/orders');
      }
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">This listing is no longer available</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => navigate('/marketplace')} className="bg-agrigreen-600 text-white px-4 py-2 rounded-md hover:bg-agrigreen-700 transition">
          Explore Marketplace
        </button>
      </div>
    );
  }

  const subtotal = quantity ? (Number(quantity) * listing.pricePerUnit) : 0;
  const deliveryFee = 5000; // Mock delivery fee or calculated backend fee
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Purchase Request</h2>
        <p className="text-slate-500 mt-1">Complete your procurement details for this listing.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Details Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-navy-900 mb-4 border-b pb-2">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Product</p>
                <p className="font-medium text-slate-900">{listing.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Seller</p>
                <p className="font-medium text-slate-900">{listing.farmer?.firstName} {listing.farmer?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Available Quantity</p>
                <p className="font-medium text-slate-900">{listing.quantityAvailable} {listing.quantityUnit}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="font-medium text-agrigreen-700">{listing.currency} {listing.pricePerUnit} / {listing.quantityUnit}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium text-slate-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                  {listing.location?.district || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Quality Grade</p>
                <p className="font-medium text-slate-900">{listing.grade}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="purchase-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-semibold text-navy-900 border-b pb-2">Order Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Quantity ({listing.quantityUnit})</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Box className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    max={listing.quantityAvailable}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
                    placeholder="Enter amount..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Delivery Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Truck className="h-5 w-5 text-slate-400" />
                </div>
                <textarea
                  required
                  rows="3"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
                  placeholder="Complete shipping address..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes / Packaging Requirements</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
                placeholder="Any special handling or packaging instructions..."
              />
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4 border-b pb-2">Order Summary</h3>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Unit Price</span>
                <span>{listing.currency} {listing.pricePerUnit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Quantity</span>
                <span>{quantity || 0} {listing.quantityUnit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{listing.currency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Est. Delivery</span>
                <span>{listing.currency} {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-navy-900">
                <span>Total</span>
                <span>{listing.currency} {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="purchase-form"
              disabled={isSubmitting || !quantity || !deliveryAddress}
              className="w-full bg-agrigreen-600 text-white font-medium py-3 px-4 rounded-md hover:bg-agrigreen-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              By confirming, you agree to the B2B procurement terms. This will submit a purchase request to the seller.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
