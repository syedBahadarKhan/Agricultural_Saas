import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../../../hooks/useAuth';

export default function Marketplace() {
  const { listings, loading, error, search, setSearch, cropType, setCropType, district, setDistrict } = useMarketplace();
  const { user } = useAuth();
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  const handleBuyClick = (listing) => {
    const intent = {
      listingId: listing._id,
      intent: 'BUY',
      timestamp: new Date().getTime()
    };

    if (!user) {
      localStorage.setItem('purchaseIntent', JSON.stringify(intent));
      navigate('/login?returnTo=purchase');
    } else if (user.role === 'FARMER') {
      alert("You are registered as a Farmer. To purchase agricultural products, you need an approved Buyer account.");
    } else {
      localStorage.setItem('purchaseIntent', JSON.stringify(intent));
      navigate(`/buyer/purchase/${listing._id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Marketplace</h2>
          <p className="text-slate-500 mt-1">Browse agricultural listings and procure direct from farmers.</p>
        </div>
        {user?.role === 'FARMER' && (
          <Link to="/farmer/listings" className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" /> Create Listing
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500"
          />
        </div>
        <div className="w-full md:w-48 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <select 
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500 appearance-none bg-white"
          >
            <option value="">All Crop Types</option>
            <option value="Tomato">Tomato</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>
        <div className="w-full md:w-48 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500 appearance-none bg-white"
          >
            <option value="">All Districts</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Swat">Swat</option>
            <option value="Mardan">Mardan</option>
            <option value="Abbottabad">Abbottabad</option>
          </select>
        </div>
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
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-900">No listings found</h3>
          <p className="text-slate-500 mt-1">Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} onBuyClick={handleBuyClick} />
          ))}
        </div>
      )}
    </div>
  );
}

// Temporary MapPin icon fallback to avoid changing imports above
function MapPin(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
