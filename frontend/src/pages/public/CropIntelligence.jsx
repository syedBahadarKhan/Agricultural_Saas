import React from 'react';
import { ArrowDownRight, ArrowRight, Check, ClipboardList, Leaf, Search, ShieldCheck, Sprout, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/heroimage.png';

const cropToolsReturnTo = encodeURIComponent('/farmer/disease');

const capabilities = [
  {
    icon: Sprout,
    label: 'Available now',
    title: 'Farm & crop records',
    description: 'Keep farm and crop information together in your farmer workspace, with dedicated pages to add and manage your records.',
    tone: 'bg-agrigreen-100 text-agrigreen-700',
  },
  {
    icon: Stethoscope,
    label: 'Available now',
    title: 'Disease & treatment library',
    description: 'Search the crop disease knowledge base by crop, disease, or symptom and review the available treatment guidance.',
    tone: 'bg-blue-100 text-blue-700',
  },
  {
    icon: ShieldCheck,
    label: 'Preview',
    title: 'Crop health assessments',
    description: 'A guided health-assessment experience is being developed. Automated image diagnosis and live alerts are not available yet.',
    tone: 'bg-amber-100 text-amber-800',
  },
];

const steps = [
  {
    number: '01',
    title: 'Set up your farm records',
    description: 'Add your farm and the crops you grow in the farmer workspace.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Look up symptoms and risks',
    description: 'Search the available disease library for crop-specific information and treatment options.',
    icon: Search,
  },
  {
    number: '03',
    title: 'Review guidance with care',
    description: 'Use the information as a starting point and confirm treatment decisions with local agricultural experts.',
    icon: ShieldCheck,
  },
];

export default function CropIntelligence() {
  return (
    <div className="bg-white">
      <section
        className="relative isolate overflow-hidden bg-agrigreen-900 bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 35, 20, .94) 0%, rgba(8, 35, 20, .82) 52%, rgba(8, 35, 20, .28) 100%), url(${heroImage})` }}
      >
        <div className="container mx-auto grid min-h-[590px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-agrigreen-100 backdrop-blur">
              <Leaf size={14} /> Crop Intelligence
            </span>
            <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Better crop decisions start with a clearer picture.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Organize farm and crop records, find practical disease and treatment knowledge, and build a more informed crop-care routine.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/register?returnTo=${cropToolsReturnTo}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-agrigreen-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-agrigreen-400"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                to={`/login?returnTo=${cropToolsReturnTo}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Access Crop Tools <ArrowDownRight size={18} />
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/65">
              Crop tools require an approved account. Explore the current capabilities below.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/15" />
            <div className="relative rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-agrigreen-100">Your crop workspace</p>
                  <p className="mt-2 text-xl font-bold">From records to guidance</p>
                </div>
                <div className="rounded-2xl bg-agrigreen-400/20 p-3 text-agrigreen-100">
                  <Sprout size={25} />
                </div>
              </div>
              <div className="mt-7 space-y-3">
                {[
                  ['Farm & crop records', 'Manage your fields and crops'],
                  ['Disease knowledge', 'Search symptoms and treatments'],
                  ['Automated assessments', 'Preview — in development'],
                ].map(([title, detail], index) => (
                  <div key={title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/20 p-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index === 2 ? 'bg-amber-300/15 text-amber-200' : 'bg-agrigreen-300/15 text-agrigreen-100'}`}>
                      {index === 2 ? <Search size={17} /> : <Check size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-white/55">
                Guidance supports decision-making and is not a substitute for expert diagnosis or local label instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-agrigreen-700">Useful today, transparent about what’s next</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">
              Crop care tools built around real farm workflows.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Start with the capabilities already available in AgriSaaS. Upcoming assessment features are clearly marked, so you know what is ready to use.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, label, title, description, tone }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={23} />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[.15em] text-slate-500">{label}</p>
                <h3 className="mt-2 text-xl font-bold text-navy-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 sm:px-6">
            <strong>Coming soon:</strong> automated photo-based diagnosis, real-time crop health alerts, yield predictions, and soil-health insights. These capabilities are not currently presented as working tools.
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.2em] text-agrigreen-700">A practical workflow</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">From the field to a more informed next step.</h2>
              <p className="mt-5 leading-8 text-slate-600">
                Keep your crop information organized, use the knowledge base to investigate symptoms, and bring reliable context into conversations with an agricultural professional.
              </p>
              <Link to={`/login?returnTo=${cropToolsReturnTo}`} className="mt-7 inline-flex items-center gap-2 font-bold text-agrigreen-700 hover:text-agrigreen-800">
                Open Crop Tools <ArrowRight size={17} />
              </Link>
            </div>
            <div className="space-y-4">
              {steps.map(({ number, title, description, icon: Icon }) => (
                <div key={number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-agrigreen-50 text-agrigreen-700">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[.16em] text-agrigreen-700">STEP {number}</p>
                    <h3 className="mt-1 text-lg font-bold text-navy-900">{title}</h3>
                    <p className="mt-2 leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-agrigreen-900 px-5 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Make your next crop decision with better context.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-agrigreen-100">
            Create an account to organize crop records and access the disease and treatment library in the farmer workspace.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={`/register?returnTo=${cropToolsReturnTo}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-agrigreen-900 transition hover:bg-agrigreen-50">
              Get Started <ArrowRight size={17} />
            </Link>
            <Link to={`/login?returnTo=${cropToolsReturnTo}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
              Access Crop Tools <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
