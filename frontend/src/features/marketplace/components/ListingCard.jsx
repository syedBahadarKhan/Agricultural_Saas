import React from 'react';
import { MapPin, ShoppingCart, Info, UserCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function ListingCard({ listing, onBuyClick }) {
  const { user } = useAuth();
  const isOwner = user?._id === listing.farmer?._id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        {listing.images?.[0] && <img src={listing.images[0]} alt={`${listing.cropType} produce`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
        {/* Placeholder image since we don't have real images uploaded yet */}
        <div className={`absolute inset-0 bg-agrigreen-100 flex flex-col items-center justify-center text-agrigreen-800 ${listing.images?.[0] ? 'hidden' : ''}`}>
           <span className="text-3xl">🌾</span>
           <span className="font-bold uppercase tracking-wider opacity-50 text-sm mt-2">{listing.cropType}</span>
        </div>
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-navy-900 shadow">
          {listing.grade} Grade
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy-900 line-clamp-1">{listing.title}</h3>
        <p className="text-sm font-medium text-agrigreen-600 mt-1">
          Rs {listing.pricePerUnit} <span className="text-slate-500 font-normal">/ {listing.quantityUnit}</span>
        </p>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-slate-400" />
            <span className="font-semibold text-slate-800">{listing.quantityAvailable} {listing.quantityUnit}</span> &nbsp;available
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            {listing.location?.district || 'Location unverified'}
          </div>
          <div className="flex items-center">
            <UserCircle className="h-4 w-4 mr-2 text-slate-400" />
            {listing.farmer?.firstName} {listing.farmer?.lastName}
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
             {listing.listingType?.replace('_', ' ') || 'DIRECT SALE'}
          </span>
          {user?.role === 'BUYER' && !isOwner && (
            <button 
              onClick={() => onBuyClick(listing)}
              className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Buy Now
            </button>
          )}
          {isOwner && (
            <span className="text-xs font-medium text-agrigreen-600 bg-agrigreen-50 px-2 py-1 rounded">Your Listing</span>
          )}
        </div>
      </div>
    </div>
  );
}
