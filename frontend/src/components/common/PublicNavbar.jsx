import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  CalendarCheck2,
  Calculator,
  ChartNoAxesCombined,
  ChevronDown,
  CloudRain,
  MapPinned,
  Network,
  Settings,
  ShieldUser,
  ShoppingBag,
  Sprout,
  Tractor,
  Users,
  Handshake,
  BookOpen,
  CircleHelp,
  Mail,
  BadgeCheck,
  CreditCard,
  UserPlus,
  Store,
  PackageSearch,
  ClipboardList,
  Boxes,
} from 'lucide-react';

const navMenus = {
  Features: [
    { heading: 'PRODUCT', links: [{ label: 'Platform Overview', to: '/' }, { label: 'Marketplace', to: '/marketplace' }, { label: 'All Features', to: '/' }] },
    { heading: 'CAPABILITIES', links: [{ label: 'Crop Intelligence', to: '/platform/crop-intelligence' }, { label: 'B2B Procurement', to: '/platform/b2b-procurement' }, { label: 'Market Analytics', to: '/' }, { label: 'Verified Buyers & Farmers', to: '/marketplace' }] },
  ],
  Solutions: [
    { heading: 'BY ROLE', links: [{ label: 'For Farmers', to: '/register', icon: Sprout }, { label: 'For Buyers', to: '/register', icon: Users }, { label: 'For Aggregators', to: '/register', icon: Handshake }] },
    { heading: 'WORKFLOWS', links: [{ label: 'Manage Your Crops', to: '/login', icon: Tractor }, { label: 'Source Produce', to: '/platform/b2b-procurement', icon: Store }, { label: 'Manage Procurement', to: '/platform/b2b-procurement', icon: ClipboardList }] },
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
    { heading: 'DISCOVER', links: [{ label: 'Browse Produce', to: '/marketplace', icon: PackageSearch }, { label: 'Verified Suppliers', to: '/platform/b2b-procurement', icon: BadgeCheck }, { label: 'Buyer Requests', to: '/platform/b2b-procurement', icon: ClipboardList }] },
    { heading: 'GET STARTED', links: [{ label: 'Create Buyer Account', to: '/register', icon: UserPlus }, { label: 'List Your Produce', to: '/register', icon: Boxes }] },
  ],
};

const featureColumns = [
  [
    { label: 'Crop Intelligence', icon: Brain },
    { label: 'B2B Procurement', icon: ShoppingBag },
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

export default function PublicNavbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Avoid jitter on tiny movements
  const navItems = ['Features', 'Solutions', 'Learn & Support', 'Pricing', 'Marketplace'];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // If we are at the very top (within 20px), always show navbar without pinned styling
          if (currentScrollY <= 20) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);

            const diff = currentScrollY - lastScrollY.current;

            // Only trigger if movement exceeds threshold to prevent rapid fluttering
            if (Math.abs(diff) > scrollThreshold) {
              if (diff > 0 && currentScrollY > 80) {
                // Scrolling down -> smoothly hide
                // Also close open mega menus so they don't linger
                setIsVisible(false);
                setOpenMenu(null);
              } else if (diff < 0) {
                // Scrolling up -> smoothly bring back into view
                setIsVisible(true);
              }
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Invisible anchor spacer to preserve normal flow and eliminate layout shifts */}
      <div className="h-[68px] w-full" aria-hidden="true" />

      {/* Smart Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
            : 'bg-white border-b border-transparent py-3'
        }`}
      >
        <nav
          className="relative text-slate-800 px-4"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
            <Link to="/" className="text-2xl font-semibold tracking-tight text-agrigreen-900">
              Agri<span className="text-agrigreen-600">SaaS</span>
            </Link>

            <div className="hidden md:flex items-center gap-7 text-[15px] font-medium text-slate-700">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-expanded={openMenu === item}
                  onClick={() => setOpenMenu(openMenu === item ? null : item)}
                  onMouseEnter={() => setOpenMenu(item)}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 py-2 transition ${
                    openMenu === item
                      ? 'border-slate-800 text-slate-900'
                      : 'border-transparent hover:text-agrigreen-700'
                  }`}
                >
                  {item}
                  <ChevronDown
                    aria-hidden="true"
                    size={12}
                    strokeWidth={2.2}
                    className={`-translate-y-1 transition-transform ${openMenu === item ? 'rotate-180' : ''}`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <Link to="/login" className="font-medium text-slate-800 hover:text-agrigreen-700 transition">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-[#303030] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-black transition shadow-sm"
              >
                Start for free
              </Link>
            </div>
          </div>

          {/* Mega Menus */}
          {openMenu && (
            <div
              className="absolute left-1/2 top-full w-[calc(100%-2rem)] max-w-[1480px] -translate-x-1/2 rounded-b-2xl border-t border-slate-100 bg-white/98 backdrop-blur-md shadow-xl transition-all"
              onMouseEnter={() => setOpenMenu(openMenu)}
            >
              {openMenu === 'Features' ? (
                <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-8 sm:px-10 md:grid-cols-[minmax(220px,0.8fr)_3.2fr] md:px-12 lg:px-14">
                  <div>
                    <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">PRODUCT</h2>
                    <div className="flex flex-col gap-2 pt-7">
                      {[
                        ['Product Overview', '/'],
                        ['View Demo', '/register'],
                        ['All Features', '/'],
                      ].map(([label, to]) => (
                        <Link
                          key={label}
                          to={to}
                          onClick={() => setOpenMenu(null)}
                          className="rounded-md px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 hover:text-agrigreen-700 transition"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">CAPABILITIES</h2>
                    <div className="grid gap-x-6 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                      {featureColumns.map((column, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          {column.map(({ label, icon: Icon }) => (
                            <Link
                              key={label}
                              to={
                                label === 'Crop Intelligence'
                                  ? '/platform/crop-intelligence'
                                  : label === 'B2B Procurement'
                                  ? '/platform/b2b-procurement'
                                  : label.includes('Orders')
                                  ? '/marketplace'
                                  : '/'
                              }
                              onClick={() => setOpenMenu(null)}
                              className="flex min-h-14 items-center gap-3 rounded-md px-2 py-3 text-[15px] font-semibold leading-snug text-slate-950 hover:bg-slate-50 hover:text-agrigreen-700 transition"
                            >
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
                    <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">
                      {navMenus[openMenu][0].heading}
                    </h2>
                    <div className="flex flex-col gap-2 pt-7">
                      {navMenus[openMenu][0].links.map(({ label, to, icon: Icon = Sprout }) => (
                        <Link
                          key={label}
                          to={to}
                          onClick={() => setOpenMenu(null)}
                          className="flex min-h-14 items-center gap-3 rounded-md px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 hover:text-agrigreen-700 transition"
                        >
                          <Icon size={23} strokeWidth={1.7} className="shrink-0" />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="border-b border-stone-300 pb-2 text-sm font-semibold text-slate-800">
                      {navMenus[openMenu][1].heading}
                    </h2>
                    <div className="grid gap-x-6 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                      {navMenus[openMenu][1].links.map(({ label, to, icon: Icon = Sprout }) => (
                        <Link
                          key={label}
                          to={to}
                          onClick={() => setOpenMenu(null)}
                          className="flex min-h-14 items-center gap-3 rounded-md px-2 py-3 text-[15px] font-semibold leading-snug text-slate-950 hover:bg-slate-50 hover:text-agrigreen-700 transition"
                        >
                          <Icon size={24} strokeWidth={1.7} className="shrink-0" />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
