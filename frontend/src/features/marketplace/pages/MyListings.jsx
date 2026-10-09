import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { marketplaceService } from '../services/marketplace.api';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    cropType: '',
    grade: 'STANDARD',
    quantityAvailable: '',
    quantityUnit: 'KG',
    pricePerUnit: '',
    district: '',
    expectedHarvestDate: ''
  });

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await marketplaceService.getMyListings();
      if (res.success) {
        setListings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrls = [];
      if (selectedImage) {
        const uploadResponse = await marketplaceService.uploadImage(selectedImage);
        imageUrls = [uploadResponse.data.url];
      }

      const payload = {
        ...formData,
        quantityAvailable: Number(formData.quantityAvailable),
        pricePerUnit: Number(formData.pricePerUnit),
        location: { district: formData.district },
        images: imageUrls,
      };
      await marketplaceService.createListing(payload);
      setShowAddModal(false);
      setFormData({
        title: '', cropType: '', grade: 'STANDARD', quantityAvailable: '', quantityUnit: 'KG', pricePerUnit: '', district: '', expectedHarvestDate: ''
      });
      setSelectedImage(null);
      fetchMyListings();
    } catch (err) {
      alert(err.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">My Listings</h2>
          <p className="text-slate-500 mt-1">Manage your active crop listings in the marketplace.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-4 py-2 rounded-md shadow-sm font-medium transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Listing
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agrigreen-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-900">No active listings</h3>
          <p className="text-slate-500 mt-1 mb-6">You haven't posted any crops to the marketplace yet.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-agrigreen-600 font-medium hover:underline"
          >
            Create your first listing
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Listing Title</th>
                <th className="p-4 font-medium">Crop & Grade</th>
                <th className="p-4 font-medium">Price/Unit</th>
                <th className="p-4 font-medium">Available Qty</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-navy-900">{listing.title}</td>
                  <td className="p-4">
                    <span className="block text-slate-800">{listing.cropType}</span>
                    <span className="text-xs text-slate-500">{listing.grade} Grade</span>
                  </td>
                  <td className="p-4 font-bold text-agrigreen-700">Rs. {listing.pricePerUnit}</td>
                  <td className="p-4 text-slate-600">{listing.quantityAvailable} {listing.quantityUnit}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      listing.status === 'ACTIVE' ? 'bg-agrigreen-100 text-agrigreen-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                      <button className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-900 flex items-center">
                <Tag className="mr-2 h-5 w-5 text-agrigreen-600" /> Create New Listing
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Listing Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-agrigreen-500 focus:border-agrigreen-500" placeholder="e.g. Premium Organic Tomatoes" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
                  <input type="text" name="cropType" required value={formData.cropType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="e.g. Tomato" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price per Unit (Rs)</label>
                  <input type="number" name="pricePerUnit" required min="1" value={formData.pricePerUnit} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="e.g. 150" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input type="number" name="quantityAvailable" required min="1" value={formData.quantityAvailable} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="e.g. 500" />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <select name="quantityUnit" value={formData.quantityUnit} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
                      <option value="KG">KG</option>
                      <option value="TON">TON</option>
                      <option value="MAUND">MAUND</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">District / Location</label>
                  <input type="text" name="district" required value={formData.district} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="e.g. Peshawar" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harvest Date (Expected)</label>
                  <input type="date" name="expectedHarvestDate" value={formData.expectedHarvestDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
              </div>

              <div>
                <label htmlFor="listing-image" className="mb-1 block text-sm font-medium text-slate-700">Produce photo <span className="font-normal text-slate-500">(optional, max 5 MB)</span></label>
                <input id="listing-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setSelectedImage(event.target.files?.[0] || null)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-agrigreen-50 file:px-3 file:py-1 file:font-medium file:text-agrigreen-700" />
                {selectedImage && <p className="mt-1 text-xs text-slate-500">Selected: {selectedImage.name}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition font-medium">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-6 py-2 rounded-md shadow-sm font-medium transition disabled:bg-slate-400">
                  {submitting ? 'Creating...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
