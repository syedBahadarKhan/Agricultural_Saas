import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  Handshake,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/heroimage.png';

const buyerWorkspace = encodeURIComponent('/buyer/market');
const rfqWorkspace = encodeURIComponent('/buyer/requests');

const workflow = [
  { title: 'Source', description: 'Browse active produce listings by crop and district.', icon: Search, status: 'Available' },
  { title: 'Request', description: 'Create an RFQ with your crop, volume, grade, and delivery needs.', icon: ClipboardList, status: 'Available' },
  { title: 'Compare quotes', description: 'Review farmer bids and accept the offer that fits your requirements.', icon: Handshake, status: 'Available' },
  { title: 'Confirm order', description: 'Place a marketplace order or accept an RFQ bid.', icon: PackageCheck, status: 'Available' },
  { title: 'Inspect quality', description: 'Digital inspection records and quality checkpoints.', icon: ClipboardCheck, status: 'Preview' },
  { title: 'Coordinate delivery', description: 'Follow order status and shipment details as they become available.', icon: Truck, status: 'Available' },
];

const roleBenefits = [
  {
    title: 'For bulk buyers',
    description: 'Discover available produce, compare listing details, place orders, and collect supplier offers through RFQs.',
    icon: ShoppingBasket,
    tone: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'For farmers',
    description: 'Publish produce listings and respond to open buyer requests with a price and delivery estimate.',
    icon: Sprout,
    tone: 'bg-agrigreen-100 text-agrigreen-700',
  },
  {
    title: 'For suppliers & aggregators',
    description: 'Connect supply with business demand. Listing and bidding actions depend on an approved account and enabled role.',
    icon: Boxes,
    tone: 'bg-amber-100 text-amber-800',
  },
];

export default function B2BProcurement() {
  return (
    <div className="bg-white">
      <section
        className="relative isolate overflow-hidden bg-agrigreen-900 bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 35, 20, .94) 0%, rgba(8, 35, 20, .82) 53%, rgba(8, 35, 20, .3) 100%), url(${heroImage})` }}
      >
        <div className="container mx-auto grid min-h-[570px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-agrigreen-100 backdrop-blur">
              <Handshake size={15} /> B2B agricultural procurement
            </span>
            <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Smarter agricultural sourcing starts here.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Bring farmers, suppliers, aggregators, and bulk buyers into one clearer flow—from discovering produce to coordinating a confirmed order.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/register?returnTo=${buyerWorkspace}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-agrigreen-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-agrigreen-400"
              >
                Start Sourcing <ArrowRight size={18} />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Marketplace <Search size={18} />
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/65">
              Sourcing, orders, and RFQ actions require an approved account and role authorization.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/15" />
            <div className="relative rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-agrigreen-100">Procurement at a glance</p>
                  <p className="mt-2 text-xl font-bold">One connected supply flow</p>
                </div>
                <div className="rounded-2xl bg-agrigreen-400/20 p-3 text-agrigreen-100">
                  <Boxes size={25} />
                </div>
              </div>
              <div className="mt-7 space-y-3">
                {[
                  ['Find produce', 'Compare price, quantity, grade & district'],
                  ['Request a quote', 'Gather and review supplier bids'],
                  ['Confirm & coordinate', 'Follow order and shipment status'],
                ].map(([title, detail], index) => (
                  <div key={title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/20 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agrigreen-300/15 text-agrigreen-100">
                      {index === 0 ? <Search size={17} /> : index === 1 ? <ClipboardList size={17} /> : <Truck size={17} />}
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-white/55">
                Quality inspection and batch traceability features are previews, not live platform tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-agrigreen-700">A more direct way to do business</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">
              Connect supply and demand with less guesswork.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              AgriSaaS brings produce discovery, buyer requirements, farmer bids, and order coordination together in one agricultural marketplace.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { title: 'One shared marketplace', text: 'Buyers can browse active produce listings without signing in; purchasing and seller actions remain access-controlled.', icon: Search },
              { title: 'Clear listing details', text: 'Review the listed crop, price per unit, available quantity, grade, seller, and district before sourcing.', icon: MapPin },
              { title: 'A practical negotiation path', text: 'Buyers can create RFQs, farmers can submit bids, and buyers can accept a bid in the existing workspace.', icon: Handshake },
            ].map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-agrigreen-100 text-agrigreen-700">
                  <Icon size={23} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-navy-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-agrigreen-700 px-6 py-3.5 font-bold text-white transition hover:bg-agrigreen-800">
              Explore Marketplace <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.2em] text-agrigreen-700">A connected procurement workflow</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">
                Move from sourcing to delivery with a clear next step.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Use public listings to discover available supply, gather offers through RFQs, and follow orders as sellers and logistics information are updated.
              </p>
              <Link to={`/login?returnTo=${rfqWorkspace}`} className="mt-7 inline-flex items-center gap-2 font-bold text-agrigreen-700 hover:text-agrigreen-800">
                Create an RFQ <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workflow.map(({ title, description, icon: Icon, status }, index) => (
                <div key={title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-agrigreen-50 text-agrigreen-700">
                      <Icon size={21} />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${status === 'Available' ? 'bg-agrigreen-50 text-agrigreen-700' : 'bg-amber-50 text-amber-800'}`}>
                      {status}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold tracking-[.15em] text-slate-400">STEP 0{index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-navy-900">{title}</h3>
                  <p className="mt-2 leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 sm:px-6">
            <BadgeCheck size={20} className="mt-0.5 shrink-0 text-amber-700" />
            <p>
              <strong>Quality & traceability:</strong> listings include seller-provided grade details, and shipment tracking is available when shipment records exist. Independent inspection records and batch-level traceability are not currently implemented.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-agrigreen-700">Built for each side of the trade</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">A useful workspace for the whole supply chain.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {roleBenefits.map(({ title, description, icon: Icon, tone }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={23} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-navy-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 sm:px-6">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-agrigreen-700" />
            <p>
              Accounts for buyers and farmers go through the existing review process. Marketplace, RFQ, and order actions continue to enforce their backend role permissions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-agrigreen-900 px-5 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Build your next agricultural supply connection.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-agrigreen-100">
            Browse the marketplace publicly, or sign in to source produce, create an RFQ, place orders, or respond to buyer requests.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={`/register?returnTo=${buyerWorkspace}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-agrigreen-900 transition hover:bg-agrigreen-50">
              Start Sourcing <ArrowRight size={17} />
            </Link>
            <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
              Explore Marketplace <Search size={17} />
            </Link>
            <Link to={`/login?returnTo=${rfqWorkspace}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
              Create an RFQ <ClipboardList size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
