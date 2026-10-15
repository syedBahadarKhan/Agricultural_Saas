import React, { useLayoutEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Brain, CalendarCheck2, Calculator, ChartNoAxesCombined, ChevronDown, CloudRain, MapPinned, Network, Settings, ShieldUser, ShoppingBag, Sprout, Tractor, Users, Handshake, BookOpen, CircleHelp, Mail, BadgeCheck, CreditCard, UserPlus, Store, PackageSearch, ClipboardList, Boxes } from 'lucide-react';
import Landing from '../pages/public/Landing';
import CropIntelligence from '../pages/public/CropIntelligence';
import B2BProcurement from '../pages/public/B2BProcurement';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import FarmerDashboard from '../pages/FarmerDashboard';
import FarmerFarms from '../features/farms/pages/FarmerFarms';
import FarmerCrops from '../features/crops/pages/FarmerCrops';
import CropHealth from '../features/crop-health/pages/CropHealth';
import DiseaseCenter from '../features/crop-health/pages/DiseaseCenter';
import Marketplace from '../features/marketplace/pages/Marketplace';
import MyListings from '../features/marketplace/pages/MyListings';
import BuyerRequests from '../features/rfq/pages/BuyerRequests';
import FarmerBuyerRequests from '../features/marketplace/pages/FarmerBuyerRequests';
import BuyerRequestDetails from '../features/marketplace/pages/BuyerRequestDetails';
import PurchaseListing from '../features/marketplace/pages/PurchaseListing';
import BuyerDashboard from '../pages/BuyerDashboard';
import MyOrders from '../pages/MyOrders';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import VerificationCenter from '../features/admin/pages/VerificationCenter';
import PlaceholderPage from '../components/ui/PlaceholderPage';
import PublicNavbar from '../components/common/PublicNavbar';

function PublicFooter() {
  return (
    <footer className="bg-navy-900 py-8 text-center text-slate-300">
      <p>© 2026 AgriSaaS Pakistan. Empowering KP&apos;s Agriculture.</p>
    </footer>
  );
}

function ProtectedRoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const roleHome = { ADMIN: '/admin', BUYER: '/buyer', FARMER: '/farmer' };
    return <Navigate to={roleHome[user.role] || '/'} replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes without Navbar for simplicity, or we can keep it */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
              <Landing />
            </main>
            <PublicFooter />
          </div>
        } />

        <Route path="/platform/crop-intelligence" element={
          <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
              <CropIntelligence />
            </main>
            <PublicFooter />
          </div>
        } />

        <Route path="/platform/b2b-procurement" element={
          <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
              <B2BProcurement />
            </main>
            <PublicFooter />
          </div>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Marketplace Route */}
        <Route path="/marketplace" element={
          <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
              <Marketplace />
            </main>
          </div>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/farmer" element={<ProtectedRoleRoute allowedRoles={['FARMER']}><DashboardLayout /></ProtectedRoleRoute>}>
          <Route index element={<FarmerDashboard />} />
          <Route path="farms" element={<FarmerFarms />} />
          <Route path="crops" element={<FarmerCrops />} />
          <Route path="health" element={<CropHealth />} />
          <Route path="disease" element={<DiseaseCenter />} />
          <Route path="market" element={<Marketplace />} />
          <Route path="requests" element={<FarmerBuyerRequests />} />
          <Route path="buyer-requests/:requestId" element={<BuyerRequestDetails />} />
          <Route path="requests/:requestId" element={<BuyerRequestDetails />} />
          <Route path="rfqs" element={<BuyerRequests />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        </Route>

        <Route path="/buyer" element={<ProtectedRoleRoute allowedRoles={['BUYER']}><DashboardLayout /></ProtectedRoleRoute>}>
          <Route index element={<BuyerDashboard />} />
          <Route path="market" element={<Marketplace />} />
          <Route path="purchase/:id" element={<PurchaseListing />} />
          <Route path="requests" element={<BuyerRequests />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoleRoute allowedRoles={['ADMIN']}><DashboardLayout /></ProtectedRoleRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="verification" element={<VerificationCenter />} />
          <Route path="users" element={<PlaceholderPage title="Users Management" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
