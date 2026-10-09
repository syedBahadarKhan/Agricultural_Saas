import React, { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, IndianRupee } from 'lucide-react';

export default function CheckoutModal({ order, isOpen, onClose, onPaymentSuccess }) {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const platformFee = order.totalPrice * 0.05;
  const totalAmount = order.totalPrice + platformFee;

  const handlePay = () => {
    setProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess(order._id);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6 bg-agrigreen-700 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center"><ShieldCheck className="mr-2" /> Secure Checkout</h3>
          <button onClick={onClose} className="text-agrigreen-200 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 mb-6 text-sm text-slate-600">
             <div className="flex justify-between pb-2 border-b border-slate-100">
               <span>Order Subtotal</span>
               <span className="font-bold text-navy-900">Rs. {order.totalPrice.toLocaleString()}</span>
             </div>
             <div className="flex justify-between pb-2 border-b border-slate-100">
               <span>Platform Escrow Fee (5%)</span>
               <span className="font-bold text-navy-900">Rs. {platformFee.toLocaleString()}</span>
             </div>
             <div className="flex justify-between pt-2 text-lg font-bold text-agrigreen-700">
               <span>Total to Pay</span>
               <span>Rs. {totalAmount.toLocaleString()}</span>
             </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start text-sm text-blue-800">
             <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
             <p>Funds are held securely in escrow and only released to the farmer once you confirm delivery.</p>
          </div>

          <button 
            onClick={handlePay}
            disabled={processing}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all ${
              processing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-agrigreen-600 hover:bg-agrigreen-700 text-white shadow-md'
            }`}
          >
            {processing ? (
               <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500 mr-2"></div> Processing Payment...</>
            ) : (
               <><CreditCard className="mr-2 h-5 w-5" /> Pay Rs. {totalAmount.toLocaleString()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
