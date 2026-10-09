import React, { useState } from 'react';
import { FileText, Send, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useRfq } from '../hooks/useRfq';
import { useAuth } from '../../../hooks/useAuth';

export default function BuyerRequests() {
  const { rfqs, loading, error, submitBid, acceptBid } = useRfq();
  const { user } = useAuth();
  
  const [activeRfq, setActiveRfq] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  
  const handleBidSubmit = async (e, rfqId) => {
    e.preventDefault();
    if (!bidAmount) return;
    
    try {
      await submitBid(rfqId, {
        pricePerUnit: bidAmount,
        totalQuantityOffered: activeRfq.requiredQuantity, // For simplicity
        estimatedDeliveryDate: activeRfq.requiredByDate
      });
      setBidAmount('');
      setActiveRfq(null);
      alert('Bid submitted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await acceptBid(bidId);
      alert('Bid accepted! The RFQ is now closed.');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Buyer Requests (RFQs)</h2>
          <p className="text-slate-500 mt-1">
            {user?.role === 'FARMER' 
              ? 'Browse open procurement requests from buyers and submit your bids.' 
              : 'Manage your Requests for Quotation and review bids from farmers.'}
          </p>
        </div>
        {user?.role === 'BUYER' && (
          <button className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition flex items-center">
            <FileText className="h-5 w-5 mr-2" /> New Request
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-900">No open requests found</h3>
          <p className="text-slate-500 mt-1">Check back later for new buyer procurement requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div key={rfq._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700 uppercase tracking-wider">{rfq.cropType}</span>
                    <span className="px-2 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-600">Grade: {rfq.preferredGrade}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900">{rfq.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-400" /> By {new Date(rfq.requiredByDate).toLocaleDateString()}</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-slate-400" /> {rfq.deliveryLocation?.district || 'TBD'}</div>
                  </div>
                </div>
                
                <div className="text-left md:text-right bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[200px]">
                  <p className="text-sm text-slate-500 mb-1">Required Quantity</p>
                  <p className="text-2xl font-bold text-agrigreen-700">{rfq.requiredQuantity} <span className="text-base text-slate-500 font-medium">{rfq.quantityUnit}</span></p>
                </div>
              </div>

              {/* Bidding Section */}
              <div className="bg-slate-50 p-6">
                {user?.role === 'FARMER' ? (
                  <div>
                    {rfq.bids.some(b => b.farmer === user._id) ? (
                      <div className="flex items-center text-agrigreen-700 bg-agrigreen-50 p-3 rounded border border-agrigreen-100">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">You have submitted a bid for this request.</span>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleBidSubmit(e, rfq._id)} className="flex items-end gap-4 max-w-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Your Price per {rfq.quantityUnit} (Rs.)</label>
                          <input 
                            type="number" 
                            required
                            min="1"
                            value={activeRfq?._id === rfq._id ? bidAmount : ''}
                            onChange={(e) => {
                              setActiveRfq(rfq);
                              setBidAmount(e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
                            placeholder="e.g. 150"
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={!bidAmount || activeRfq?._id !== rfq._id}
                          className="bg-agrigreen-600 hover:bg-agrigreen-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition flex items-center h-[42px]"
                        >
                          <Send className="h-4 w-4 mr-2" /> Submit Bid
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-navy-900 mb-3 flex items-center">
                      Submitted Bids <span className="ml-2 bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs">{rfq.bids.length}</span>
                    </h4>
                    {rfq.bids.length === 0 ? (
                      <p className="text-sm text-slate-500">No bids have been submitted yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {rfq.bids.map(bid => (
                          <div key={bid._id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                            <div>
                              <p className="font-bold text-navy-900">Rs. {bid.pricePerUnit} / {rfq.quantityUnit}</p>
                              <p className="text-xs text-slate-500 mt-1">Delivery by: {new Date(bid.estimatedDeliveryDate).toLocaleDateString()}</p>
                            </div>
                            <button 
                              onClick={() => handleAcceptBid(bid._id)}
                              className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-4 py-1.5 rounded font-medium transition"
                            >
                              Accept Bid
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
