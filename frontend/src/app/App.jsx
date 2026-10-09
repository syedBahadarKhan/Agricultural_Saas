import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CalendarCheck2, Calculator, ChartNoAxesCombined, ChevronDown, CloudRain, MapPinned, Network, Settings, ShieldUser, ShoppingBag, Sprout, Tractor, Users, Handshake, BookOpen, CircleHelp, Mail, BadgeCheck, CreditCard, UserPlus, Store, PackageSearch, ClipboardList, Boxes } from 'lucide-react';
import Landing from '../pages/public/Landing';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import FarmerDashboard from '../pages/FarmerDashboard';
import FarmerFarms from '../features/farms/pages/FarmerFarms';
import FarmerCrops from '../features/crops/pages/FarmerCrops';
import CropHealth from '../features/crop-health/pages/CropHealth';
import DiseaseCenter from '../features/crop-health/pages/DiseaseCenter';
import Marketplace from '../features/marketplace/pages/Marketplace';
import MyListings from '../features/marketplace/pages/MyListings';
import BuyerRequests from '../features/rfq/pages/BuyerRequests';
import PurchaseListing from '../features/marketplace/pages/PurchaseListing';
import BuyerDashboard from '../pages/BuyerDashboard';
import MyOrders from '../pages/MyOrders';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import VerificationCenter from '../features/admin/pages/VerificationCenter';
import PlaceholderPage from '../components/PlaceholderPage';

const navMenus = {
  Features: [
    { heading: 'PRODUCT', links: [{ label: 'Platform Overview', to: '/' }, { label: 'Marketplace', to: '/marketplace' }, { label: 'All Features', to: '/' }] },
    { heading: 'CAPABILITIES', links: [{ label: 'Crop Intelligence', to: '/' }, { label: 'B2B Procurement', to: '/marketplace' }, { label: 'Market Analytics', to: '/' }, { label: 'Verified Buyers & Farmers', to: '/marketplace' }] },
  ],
  Solutions: [
    { heading: 'BY ROLE', links: [{ label: 'For Farmers', to: '/register', icon: Sprout }, { label: 'For Buyers', to: '/register', icon: Users }, { label: 'For Aggregators', to: '/register', icon: Handshake }] },
    { heading: 'WORKFLOWS', links: [{ label: 'Manage Your Crops', to: '/login', icon: Tractor }, { label: 'Source Produce', to: '/marketplace', icon: Store }, { label: 'Manage Procurement', to: '/register', icon: ClipboardList }] },
  ],
  'Learn & Support': [
    { heading: 'LEARN', links: [{ label: 'Getting Started', to: '/register', icon: BookOpen }, { label: 'Agriculture Resources', to: '/', icon: Sprout }, { label: 'Platform Guides', to: '/', icon: ClipboardList }] },
    { heading: 'SUPPORT', links: [{ label: 'Help Center', to: '/login', icon: CircleHelp }, { label: 'Contact Support', to: '/login', icon: Mail }, { label: 'FAQs', to: '/', icon: BookOpen }] },
  ],
  Pricing: [
    { heading: 'PLANS', links: [{ label: 'Get Started for Free', to: '/register', icon: UserPlus }, { label: 'Sign in to Your Account', to: '/login', icon: Users }] },
    { heading: 'MARKETPLACE', links: [{ label: 'Browse Produce', to: '/marketplace', icon: Store }, { label: 'Buyer & Farmer Accounts', to: '/register', icon: CreditCard }] },
  ],
  Marketplace: [
    { heading: 'DISCOVER', links: [{ label: 'Browse Produce', to: '/marketplace', icon: PackageSearch }, { label: 'Verified Suppliers', to: '/marketplace', icon: BadgeCheck }, { label: 'Buyer Requests', to: '/login', icon: ClipboardList }] },
    { heading: 'GET STARTED', links: [{ label: 'Create Buyer Account', to: '/register', icon: UserPlus }, { label: 'List Your Produce', to: '/register', icon: Boxes }] },
  ],
};

const featureColumns = [
  [
    { label: 'Task & Work Management', icon: CalendarCheck2 },
    { label: 'Livestock Management', icon: Tractor },
    { label: 'Crop Planning & Management', icon: Sprout },
    { label: 'Resource Management', icon: Settings },
  ],
  [
    { label: 'Farm Accounting', icon: Calculator },
    { label: 'Farm Mapping', icon: MapPinned },
    { label: 'Climate & Weather', icon: CloudRain },
    { label: 'App Integrations', icon: Network },
  ],
  [
    { label: 'Orders & eCommerce', icon: ShoppingBag },
    { label: 'Reports & Analytics', icon: ChartNoAxesCombined },
    { label: 'Admin & Security', icon: ShieldUser },
  ],
];

function PublicNavbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const navItems = ['Features', 'Solutions', 'Learn & Support', 'Pricing', 'Marketplace'];

  return (
    <nav className="relative z-20 bg-white text-slate-800 px-4 py-3 shadow-sm" onMouseLeave={() => setOpenMenu(null)}>
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-agrigreen-900">Agri<span className="text-agrigreen-600">SaaS</span></Link>
        <div className="hidden md:flex items-center gap-7 text-[15px] font-medium text-slate-700">
          {navItems.map((item) => (
            <button key={item} type="button" aria-expanded={openMenu === item} onClick={() => setOpenMenu(openMenu === item ? null : item)} onMouseEnter={() => setOpenMenu(item)} className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 py-2 transition ${openMenu === item ? 'border-slate-800 text-slate-900' : 'border-transparent hover:text-agrigreen-700'}`}>
              {item}<ChevronDown aria-hidden="true" size={12} strokeWidth={2.2} className={`-translate-y-1 transition-transform ${openMenu === item ? 'rotate-180' : ''}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <Link to="/login" className="font-medium text-slate-800 hover:text-agrigreen-700 transition">Sign in</Link>
          <Link to="/register" className="bg-[#303030] text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition">Start for free</Link>
        </div>
      </div>
      {openMenu && (
        <div className="absolute left-1/2 top-full w-[calc(100%-2rem)] max-w-[1480px] -translate-x-1/2 rounded-b-xl border-t border-slate-100 bg-white shadow-lg" onMouseEnter={() => setOpenMenu(openMenu)}>
          {openMenu === 'Features' ? (
            <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-8 sm:px-10 md:grid-cols-[minmax(220px,0.8fr)_3.2fr] md:px-12 lg:px-14">
              <div>
                <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">PRODUCT</h2>
                <div className="flex flex-col gap-2 pt-7">
                  {[['Product Overview', '/'], ['View Demo', '/register'], ['All Features', '/']].map(([label, to]) => (
                    <Link key={label} to={to} onClick={() => setOpenMenu(null)} className="rounded-md px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 hover:text-agrigreen-700">{label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">CAPABILITIES</h2>
                <div className="grid gap-x-6 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                  {featureColumns.map((column, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      {column.map(({ label, icon: Icon }) => (
                        <Link key={label} to={label.includes('Orders') ? '/marketplace' : '/'} onClick={() => setOpenMenu(null)} className="flex min-h-14 items-center gap-3 rounded-md px-2 py-3 text-[15px] font-semibold leading-snug text-slate-950 hover:bg-slate-50 hover:text-agrigreen-700">
                          <Icon size={24} strokeWidth={1.7} className="shrink-0" />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-8 sm:px-10 md:grid-cols-[minmax(220px,0.8fr)_3.2fr] md:px-12 lg:px-14">
              <div>
                <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">{navMenus[openMenu][0].heading}</h2>
                <div className="flex flex-col gap-2 pt-7">
                  {navMenus[openMenu][0].links.map(({ label, to, icon: Icon = Sprout }) => (
                    <Link key={label} to={to} onClick={() => setOpenMenu(null)} className="flex min-h-14 items-center gap-3 rounded-md px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 hover:text-agrigreen-700">
                      <Icon size={23} strokeWidth={1.7} className="shrink-0" /><span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">{navMenus[openMenu][1].heading}</h2>
                <div className="grid gap-x-6 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                  {navMenus[openMenu][1].links.map(({ label, to, icon: Icon = Sprout }) => (
                    <Link key={label} to={to} onClick={() => setOpenMenu(null)} className="flex min-h-14 items-center gap-3 rounded-md px-2 py-3 text-[15px] font-semibold leading-snug text-slate-950 hover:bg-slate-50 hover:text-agrigreen-700">
                      <Icon size={24} strokeWidth={1.7} className="shrink-0" /><span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes without Navbar for simplicity, or we can keep it */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
              <Landing />
            </main>
            <footer className="bg-navy-900 text-slate-300 py-8 text-center">
              <p>© 2026 AgriSaaS Pakistan. Empowering KP's Agriculture.</p>
            </footer>
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
        <Route path="/farmer" element={<DashboardLayout />}>
          <Route index element={<FarmerDashboard />} />
          <Route path="farms" element={<FarmerFarms />} />
          <Route path="crops" element={<FarmerCrops />} />
          <Route path="health" element={<CropHealth />} />
          <Route path="disease" element={<DiseaseCenter />} />
          <Route path="market" element={<Marketplace />} />
          <Route path="requests" element={<BuyerRequests />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        </Route>

        <Route path="/buyer" element={<DashboardLayout />}>
          <Route index element={<BuyerDashboard />} />
          <Route path="market" element={<Marketplace />} />
          <Route path="purchase/:id" element={<PurchaseListing />} />
          <Route path="requests" element={<BuyerRequests />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
        </Route>

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="verification" element={<VerificationCenter />} />
          <Route path="users" element={<PlaceholderPage title="Users Management" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
