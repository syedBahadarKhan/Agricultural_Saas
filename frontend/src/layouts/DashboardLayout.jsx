import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Leaf, Sprout, HeartPulse, Stethoscope, ShoppingBag, List, ClipboardList, Wallet, BarChart3, UserCircle, Settings, Bell, LogOut, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ApplicationStatus from '../features/verification/pages/ApplicationStatus';

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const farmerNav = [
    { name: 'Dashboard', href: '/farmer', icon: LayoutDashboard },
    { name: 'My Farms', href: '/farmer/farms', icon: Leaf },
    { name: 'My Crops', href: '/farmer/crops', icon: Sprout },
    { name: 'Crop Health', href: '/farmer/health', icon: HeartPulse },
    { name: 'Disease & Treatment', href: '/farmer/disease', icon: Stethoscope },
    { name: 'Market', href: '/farmer/market', icon: ShoppingBag },
    { name: 'Buyer Requests', href: '/farmer/requests', icon: List },
    { name: 'My Listings', href: '/farmer/listings', icon: ClipboardList },
    { name: 'Payments', href: '/farmer/payments', icon: Wallet },
    { name: 'Analytics', href: '/farmer/analytics', icon: BarChart3 },
  ];

  const buyerNav = [
    { name: 'Dashboard', href: '/buyer', icon: LayoutDashboard },
    { name: 'Marketplace', href: '/buyer/market', icon: ShoppingBag },
    { name: 'Buyer Requests', href: '/buyer/requests', icon: List },
    { name: 'My Orders', href: '/buyer/orders', icon: ClipboardList },
    { name: 'Payments', href: '/buyer/payments', icon: Wallet },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Verification Center', href: '/admin/verification', icon: ShieldCheck },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const getNavByRole = (role) => {
    switch (role) {
      case 'BUYER': return buyerNav;
      case 'FARMER': return farmerNav;
      case 'ADMIN': return adminNav;
      default: return farmerNav; // fallback
    }
  };

  const currentNav = getNavByRole(user?.role);
  
  // Old users might not have accountStatus, assume they are APPROVED
  const isApproved = user?.accountStatus === 'APPROVED' || !user?.accountStatus;
  
  if (user && user.role !== 'ADMIN' && !isApproved) {
    return <ApplicationStatus />;
  }
  
  const getPortalName = (role) => {
    switch (role) {
      case 'BUYER': return 'Buyer Portal';
      case 'FARMER': return 'Farmer Portal';
      case 'ADMIN': return 'Admin Portal';
      default: return 'User Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-navy-800 bg-agrigreen-900">
          <Link to="/" className="text-xl font-bold text-agrigreen-50">AgriSaaS</Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              // Exact match for dashboard root to avoid highlighting everything
              const isExact = item.href === '/farmer' || item.href === '/buyer';
              const actuallyActive = isExact ? location.pathname === item.href : isActive;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    actuallyActive ? 'bg-agrigreen-700 text-white' : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${actuallyActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link to="/farmer/profile" className="flex items-center text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-navy-800">
             <UserCircle className="mr-3 h-5 w-5 text-slate-400" /> Profile
          </Link>
          <Link to="/farmer/settings" className="flex items-center text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-navy-800">
             <Settings className="mr-3 h-5 w-5 text-slate-400" /> Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-navy-800 transition">
             <LogOut className="mr-3 h-5 w-5 text-slate-400" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">{getPortalName(user?.role)}</h1>
          <div className="flex items-center space-x-4">
             <button className="text-slate-400 hover:text-agrigreen-600 relative">
               <Bell className="h-6 w-6" />
               <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
             </button>
             <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-agrigreen-100 flex items-center justify-center text-agrigreen-700 font-bold uppercase">
                  {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
