import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingCart, TrendingUp, ShieldCheck } from 'lucide-react';
import heroImage from '../../assets/images/heroimage.png';

export default function Landing() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-agrigreen-900 text-white py-28 md:py-36 px-4 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(8, 35, 20, 0.72), rgba(8, 35, 20, 0.72)), url(${heroImage})` }}>
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 text-agrigreen-50">From Farm to Market — One Intelligent Agricultural Platform</h1>
          <p className="text-xl text-agrigreen-100 mb-10">Manage crops, discover agricultural solutions, connect with verified buyers, streamline procurement and manage the complete agricultural supply chain from one platform</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-agrigreen-500 hover:bg-agrigreen-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg">Get Started</Link>
            <Link to="/marketplace" className="bg-white text-agrigreen-900 hover:bg-slate-100 font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg">Explore Marketplace</Link>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-2">Fresh Produce Available</h2>
              <p className="text-slate-600">Source directly from verified farmers across the region</p>
            </div>
            <Link to="/marketplace" className="text-agrigreen-600 font-medium hover:text-agrigreen-700">View All Listings &rarr;</Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mock Listing 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-red-100 relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-navy-900">Premium Grade A</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-navy-900">Fresh Tomatoes</h3>
                  <span className="text-agrigreen-600 font-bold">Rs. 150/KG</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Quantity:</span> 2,000 KG
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Location:</span> Peshawar
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Seller:</span> 
                    <span className="flex items-center text-agrigreen-700 ml-1">
                      <ShieldCheck size={14} className="mr-1" /> Verified Farmer
                    </span>
                  </div>
                </div>
                <Link to="/login" className="block w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition">
                  Buy / Request
                </Link>
              </div>
            </div>

            {/* Mock Listing 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-yellow-100 relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-navy-900">Standard Grade</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-navy-900">Potatoes</h3>
                  <span className="text-agrigreen-600 font-bold">Rs. 80/KG</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Quantity:</span> 5,000 KG
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Location:</span> Swat
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Seller:</span> 
                    <span className="flex items-center text-agrigreen-700 ml-1">
                      <ShieldCheck size={14} className="mr-1" /> Verified Farmer
                    </span>
                  </div>
                </div>
                <Link to="/login" className="block w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition">
                  Buy / Request
                </Link>
              </div>
            </div>

            {/* Mock Listing 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-purple-100 relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-navy-900">Premium Grade A</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-navy-900">Onions</h3>
                  <span className="text-agrigreen-600 font-bold">Rs. 120/KG</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Quantity:</span> 1,500 KG
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Location:</span> Mardan
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-medium">Seller:</span> 
                    <span className="flex items-center text-agrigreen-700 ml-1">
                      <ShieldCheck size={14} className="mr-1" /> Verified Farmer
                    </span>
                  </div>
                </div>
                <Link to="/login" className="block w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition">
                  Buy / Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-navy-900">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-agrigreen-100 text-agrigreen-600 rounded-lg flex items-center justify-center mb-4">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Crop Intelligence</h3>
              <p className="text-slate-600">Access verified disease and treatment knowledge backed by agricultural experts.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">B2B Procurement</h3>
              <p className="text-slate-600">Create RFQs and negotiate directly with verified farmers and aggregators.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Market Analytics</h3>
              <p className="text-slate-600">Track price trends and expected harvest supply for better decision making.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality & Trust</h3>
              <p className="text-slate-600">Verified users, quality inspection reports, and transparent dispute management.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
