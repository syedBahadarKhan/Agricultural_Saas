import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Brain,
  BarChart3,
  Network,
  ClipboardCheck,
  Sprout,
  Star,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

/* ─── Feature Data ──────────────────────────────────────────────────── */
const features = [
  {
    id: 'crop-intelligence',
    icon: Leaf,
    accentIcon: Brain,
    label: 'Crop Intelligence',
    tagline: 'AI-Powered Farm Science',
    color: 'green',
    gradient: 'from-agrigreen-900 to-agrigreen-700',
    iconBg: 'bg-agrigreen-100',
    iconColor: 'text-agrigreen-600',
    description:
      'Manage farm and crop records and search the disease and treatment knowledge base. Crop assessments and automated diagnostics are clearly marked as upcoming.',
    bullets: [
      'Farm and crop record management',
      'Searchable disease and treatment knowledge',
      'Crop health assessment preview',
      'Automated alerts and forecasting coming soon',
    ],
    cta: { label: 'Explore Crop Intelligence', to: '/platform/crop-intelligence' },
    stat: { value: 'Crop care', label: 'Records and guidance in one place' },
  },
  {
    id: 'b2b-procurement',
    icon: ShoppingCart,
    accentIcon: Network,
    label: 'B2B Procurement',
    tagline: 'Direct Farm-to-Business',
    color: 'blue',
    gradient: 'from-blue-900 to-blue-700',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description:
      'Discover produce listings, place bulk orders, and manage RFQs and supplier bids through the existing buyer and farmer workspaces.',
    bullets: [
      'Browse produce by crop and district',
      'Compare listing price, quantity, grade, and location',
      'Create RFQs and review supplier bids',
      'Place orders and follow shipment status',
    ],
    cta: { label: 'Start Sourcing', to: '/platform/b2b-procurement' },
    stat: { value: 'Farm to business', label: 'One connected sourcing workflow' },
  },
  {
    id: 'market-analytics',
    icon: TrendingUp,
    accentIcon: BarChart3,
    label: 'Market Analytics',
    tagline: 'Live Price Intelligence',
    color: 'amber',
    gradient: 'from-amber-900 to-amber-700',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    description:
      'Track commodity price trends, harvest forecasts, and regional supply data to make better procurement and sales decisions.',
    bullets: [
      'Real-time regional price benchmarks',
      'Harvest forecast & supply pipeline',
      'Demand trend forecasting',
      'Competitive price comparison tools',
    ],
    cta: { label: 'View Analytics', to: '/login' },
    stat: { value: '12+', label: 'KP districts tracked' },
  },
  {
    id: 'quality-trust',
    icon: ShieldCheck,
    accentIcon: ClipboardCheck,
    label: 'Quality & Trust',
    tagline: 'Verified & Transparent',
    color: 'purple',
    gradient: 'from-purple-900 to-purple-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description:
      'Verified users, quality inspection reports, transparent dispute management, and end-to-end supply chain traceability.',
    bullets: [
      'Multi-step seller & buyer verification',
      'Quality grade inspection reports',
      'Transparent dispute resolution center',
      'End-to-end transaction traceability',
    ],
    cta: { label: 'Learn About Trust', to: '/register' },
    stat: { value: '99.2%', label: 'Dispute resolution rate' },
  },
];

/* ─── Color-to-Tailwind class resolver ──────────────────────────────── */
const colorMap = {
  green: {
    iconRing: 'ring-agrigreen-200',
    bullet: 'text-agrigreen-500',
    cardBorderActive: 'border-agrigreen-400 ring-2 ring-agrigreen-200',
    ctaBtn: 'bg-agrigreen-600 hover:bg-agrigreen-700 text-white',
    statBadge: 'bg-agrigreen-50 border-agrigreen-200 text-agrigreen-800',
    statValue: 'text-agrigreen-700',
    sectionDot: 'bg-agrigreen-400',
    tagBg: 'bg-agrigreen-50 border-agrigreen-200 text-agrigreen-700',
  },
  blue: {
    iconRing: 'ring-blue-200',
    bullet: 'text-blue-500',
    cardBorderActive: 'border-blue-400 ring-2 ring-blue-200',
    ctaBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    statBadge: 'bg-blue-50 border-blue-200 text-blue-800',
    statValue: 'text-blue-700',
    sectionDot: 'bg-blue-400',
    tagBg: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  amber: {
    iconRing: 'ring-amber-200',
    bullet: 'text-amber-500',
    cardBorderActive: 'border-amber-400 ring-2 ring-amber-200',
    ctaBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    statBadge: 'bg-amber-50 border-amber-200 text-amber-800',
    statValue: 'text-amber-700',
    sectionDot: 'bg-amber-400',
    tagBg: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  purple: {
    iconRing: 'ring-purple-200',
    bullet: 'text-purple-500',
    cardBorderActive: 'border-purple-400 ring-2 ring-purple-200',
    ctaBtn: 'bg-purple-600 hover:bg-purple-700 text-white',
    statBadge: 'bg-purple-50 border-purple-200 text-purple-800',
    statValue: 'text-purple-700',
    sectionDot: 'bg-purple-400',
    tagBg: 'bg-purple-50 border-purple-200 text-purple-700',
  },
};

/* ─── Feature Selector Tab Card ─────────────────────────────────────── */
function FeatureTabCard({ feature, isActive, onClick }) {
  const c = colorMap[feature.color];
  const Icon = feature.icon;
  return (
    <button
      id={`platform-feature-tab-${feature.id}`}
      type="button"
      onClick={onClick}
      className={[
        'group w-full text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer bg-white shadow-sm',
        isActive
          ? `${c.cardBorderActive} shadow-md`
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md',
      ].join(' ')}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ring-4 transition-all',
            feature.iconBg,
            feature.iconColor,
            isActive ? c.iconRing : 'ring-transparent',
          ].join(' ')}
        >
          <Icon size={22} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm mb-0.5">{feature.label}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{feature.tagline}</p>
        </div>
        {isActive && (
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.sectionDot}`} />
        )}
      </div>
    </button>
  );
}

/* ─── Expanded Detail Panel ─────────────────────────────────────────── */
function FeatureDetailPanel({ feature }) {
  const c = colorMap[feature.color];
  const Icon = feature.icon;
  const AccentIcon = feature.accentIcon;

  return (
    <div
      id={`platform-feature-detail-${feature.id}`}
      className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
    >
      {/* Accent top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${feature.gradient}`} />

      <div className="p-8 md:p-10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ── Left: Content ── */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border mb-5 ${c.tagBg}`}
            >
              <Sprout size={11} />
              {feature.tagline}
            </span>

            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              {feature.label}
            </h3>

            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {feature.description}
            </p>

            <ul className="space-y-3 mb-10">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className={`flex-shrink-0 mt-0.5 ${c.bullet}`}
                    strokeWidth={2}
                  />
                  <span className="text-slate-700 text-sm leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <Link
              to={feature.cta.to}
              id={`platform-feature-cta-${feature.id}`}
              className={[
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md',
                'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
                c.ctaBtn,
              ].join(' ')}
            >
              {feature.cta.label}
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>

          {/* ── Right: Visual ── */}
          <div className="flex flex-col gap-5">
            {/* Icon showcase card */}
            <div
              className={`relative w-full rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}
              style={{ aspectRatio: '4/3' }}
            >
              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              {/* Decorative rings */}
              <div className="absolute top-6 right-6 w-28 h-28 rounded-full border border-white/10" />
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border border-white/10" />

              {/* Icons */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
                  <Icon size={44} className="text-white" strokeWidth={1.4} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                  <AccentIcon size={20} className="text-white/80" strokeWidth={1.4} />
                </div>
              </div>

              {/* Floating stat */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <p className={`text-xl font-black ${c.statValue}`}>{feature.stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{feature.stat.label}</p>
              </div>
            </div>

            {/* Key highlights badge */}
            <div className={`rounded-2xl border p-5 ${c.statBadge}`}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={13} className={c.statValue} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">Key Highlights</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {feature.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-medium">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.sectionDot}`} />
                    <span className="line-clamp-1">{b.split('&')[0].trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section Export ───────────────────────────────────────────── */
export default function PlatformFeatures() {
  const [activeId, setActiveId] = useState(features[0].id);
  const activeFeature = features.find((f) => f.id === activeId);

  return (
    <section
      id="platform-features"
      className="py-20 md:py-28 px-4 bg-slate-50 relative overflow-hidden"
      aria-label="Platform Features"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(20,83,45,0.04) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative container mx-auto max-w-7xl">
        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-agrigreen-700 bg-agrigreen-50 border border-agrigreen-200 px-4 py-1.5 rounded-full mb-5">
            <Sprout size={12} />
            Built for Agriculture
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight">
            Platform{' '}
            <span className="relative inline-block">
              <span className="text-agrigreen-700">Features</span>
              <span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-agrigreen-400/60"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            One integrated platform to manage crops, source produce, analyze markets, and build
            trust across your entire agricultural supply chain.
          </p>
        </div>

        {/* ── Feature Selector Grid ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          role="tablist"
          aria-label="Platform feature categories"
        >
          {features.map((feat) => (
            <FeatureTabCard
              key={feat.id}
              feature={feat}
              isActive={feat.id === activeId}
              onClick={() => setActiveId(feat.id)}
            />
          ))}
        </div>

        {/* ── Detail Panel ── */}
        {activeFeature && (
          <div
            role="tabpanel"
            aria-labelledby={`platform-feature-tab-${activeFeature.id}`}
          >
            <FeatureDetailPanel feature={activeFeature} />
          </div>
        )}

        {/* ── Bottom CTA Row ── */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">
            All features included in every account — no feature gating.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              id="platform-features-get-started-cta"
              className="inline-flex items-center gap-2 bg-agrigreen-600 hover:bg-agrigreen-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
            <Link
              to="/marketplace"
              id="platform-features-explore-cta"
              className="inline-flex items-center gap-2 text-agrigreen-700 hover:text-agrigreen-800 font-semibold px-6 py-3.5 rounded-xl border border-agrigreen-200 hover:border-agrigreen-400 transition-all duration-200 hover:bg-agrigreen-50"
            >
              Explore Marketplace
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
