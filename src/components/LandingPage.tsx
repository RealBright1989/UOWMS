import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Menu, X, CheckCircle, Star, ChevronDown, ChevronLeft, ChevronRight, Users, Trash2, BarChart3, Recycle, Monitor, MapPin, Mail, Phone, Quote, Truck, Award, Layers } from 'lucide-react';
import UnicrossLogo from './UnicrossLogo';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onQuickLogin: (role: 'student' | 'staff' | 'admin') => void;
}

const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80',
    alt: 'Modern green garbage truck lifting waste bins on a clean university campus',
  },
  {
    url: 'https://cdn.pixabay.com/photo/2022/07/09/18/49/mack-truck-7311569_1280.jpg',
    alt: 'Heavy-duty waste disposal truck in a modern sanitation facility',
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/05/24/20/54/scrap-2341569_1280.jpg',
    alt: 'Industrial waste collection and recycling operations with heavy equipment',
  },
  {
    url: 'https://cdn.pixabay.com/photo/2021/11/14/15/55/garbage-6794932_1280.jpg',
    alt: 'Rows of waste bins and recycling containers in an urban environment',
  },
  {
    url: 'https://cdn.pixabay.com/photo/2022/02/28/12/52/waste-7039136_1280.jpg',
    alt: 'Modern eco-friendly recycling and waste sorting station with advanced equipment',
  },
  {
    url: 'https://cdn.pixabay.com/photo/2022/11/26/08/27/plastic-waste-7617451_1280.jpg',
    alt: 'Smart sanitation operations with waste processing and recycling infrastructure',
  },
];

const IMG = {
  truckOperation: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  smartBins: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  recyclingStation: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  workers: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
  reportWaste: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
  assignCollection: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
  wasteCollection: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  trackProgress: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  campusBg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  portrait1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  portrait2: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
  portrait3: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  contactBg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
  gallery1: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  gallery2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  gallery3: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  gallery4: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
  gallery5: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
  gallery6: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
};

function useCountUp(end: number, duration: number, startCounting: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let startTime: number, raf: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, startCounting]);
  return count;
}

function Counter({ end, suffix = '', duration = 2200 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(end, duration, visible);
  return <div ref={ref}>{count}{suffix}</div>;
}

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(new Array(HERO_SLIDES.length).fill(false));
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    const next = (index + 1) % HERO_SLIDES.length;
    const img = new Image();
    img.src = HERO_SLIDES[next].url;
    img.onload = () => setLoaded(prev => { const n = [...prev]; n[next] = true; return n; });
  }, []);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo]);

  useEffect(() => {
    HERO_SLIDES.forEach((s, i) => {
      const img = new Image();
      img.src = s.url;
      img.onload = () => setLoaded(prev => { const n = [...prev]; n[i] = true; return n; });
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, 3000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const handleNav = (fn: () => void) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 3000);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-18 overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            className={`w-full h-full object-cover transition-opacity duration-700 ${loaded[i] ? 'opacity-100' : 'opacity-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-slate-900/30" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/10" />

      <button
        onClick={() => handleNav(prev)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-105 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={() => handleNav(next)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-105 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20 mb-6 animate-[fadeUp_0.6s_ease-out_forwards]">
            <Truck className="h-3.5 w-3.5 text-emerald-300" />
            <span>Professional Waste Management Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6 animate-[fadeUp_0.6s_ease-out_0.1s_forwards] opacity-0">
            Smart Campus
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-300 bg-clip-text text-transparent">
              Waste Management
            </span>
            <br />
            Made Simple
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-xl leading-relaxed mb-8 animate-[fadeUp_0.6s_ease-out_0.2s_forwards] opacity-0">
            Efficient waste reporting, collection, tracking, and environmental sustainability for modern institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-[fadeUp_0.6s_ease-out_0.3s_forwards] opacity-0">
            <button id="hero-btn-report" onClick={() => {}} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 text-sm font-bold rounded-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 animate-[glow_2s_ease-in-out_infinite]">
              <Trash2 className="h-4 w-4" /> Report Waste
            </button>
            <button id="hero-btn-learn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 text-sm font-bold rounded-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Learn More <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-6 mt-10 text-sm text-slate-300 animate-[fadeUp_0.6s_ease-out_0.3s_forwards] opacity-0">
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /><span>GPS Tracking</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /><span>AI Classification</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /><span>24/7 Monitoring</span></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleNav(() => goTo(i))}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2.5 bg-emerald-400' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  );
}

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister, onQuickLogin }: LandingPageProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(5,150,105,0.3)} 50%{box-shadow:0 0 40px rgba(5,150,105,0.6)} }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-white rounded-lg p-1 shadow-sm ring-1 ring-slate-200/60">
                <UnicrossLogo size="md" theme="color" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">UNICROSS</span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-widest uppercase">Campus Waste Management System</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-emerald-600 transition">Features</a>
              <a href="#how-it-works" className="hover:text-emerald-600 transition">How It Works</a>
              <a href="#gallery" className="hover:text-emerald-600 transition">Gallery</a>
              <a href="#testimonials" className="hover:text-emerald-600 transition">Testimonials</a>
              <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onNavigateToLogin} className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">Sign In</button>
              <button onClick={onNavigateToRegister} className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-1.5">
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 py-4 px-4 space-y-3">
            {['Features','How It Works','Gallery','Testimonials','Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g,'-')}`} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition">{item}</a>
            ))}
            <button onClick={onNavigateToLogin} className="w-full py-2.5 text-sm font-semibold text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition">Sign In</button>
          </div>
        )}
      </nav>

      <HeroCarousel />

      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Professional Waste Management Operations</h2>
            <p className="text-base text-slate-500 leading-relaxed">End-to-end waste management solution for modern campuses and urban environments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: IMG.truckOperation, icon: Truck, bg: 'bg-emerald-50 text-emerald-600', title: 'Garbage Collection Fleet', desc: 'Modern compactor trucks and front loaders for efficient campus-wide waste collection and disposal.' },
              { img: IMG.smartBins, icon: Layers, bg: 'bg-blue-50 text-blue-600', title: 'Smart Waste Bins', desc: 'IoT-enabled bins with fill-level sensors that automatically notify collection teams when servicing is needed.' },
              { img: IMG.recyclingStation, icon: Recycle, bg: 'bg-violet-50 text-violet-600', title: 'Recycling Stations', desc: 'Dedicated sorting stations for plastic, glass, paper, and metal with real-time capacity monitoring.' },
              { img: IMG.workers, icon: Users, bg: 'bg-amber-50 text-amber-600', title: 'Trained Personnel', desc: 'Professional waste collection workers equipped with safety gear and mobile dispatch systems.' },
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img src={f.img} alt={f.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <div className={`p-2.5 ${f.bg} rounded-xl w-fit mb-4`}><f.icon className="h-5 w-5" /></div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">From Report to Resolution</h2>
            <p className="text-base text-slate-500 leading-relaxed">Streamlined waste management workflow connecting students, staff, and disposal teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', img: IMG.reportWaste, title: 'Report Waste', desc: 'Students and staff report overflowing bins using the mobile app with photo, location, and waste category.', color: 'bg-emerald-500' },
              { num: '02', img: IMG.assignCollection, title: 'Assign Collection', desc: 'Administrators dispatch the nearest collection crew and garbage truck to the reported location.', color: 'bg-blue-500' },
              { num: '03', img: IMG.wasteCollection, title: 'Waste Collection', desc: 'Trained operators collect waste using modern compactor trucks and transport to recycling facilities.', color: 'bg-violet-500' },
              { num: '04', img: IMG.trackProgress, title: 'Track Progress', desc: 'Real-time analytics dashboard shows collection status, truck routes, and environmental impact metrics.', color: 'bg-amber-500' },
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg z-10 ${s.color}`}>{s.num}</div>
                <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 group-hover:shadow-lg transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={IMG.campusBg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 mb-4">Operations Dashboard</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Real-Time Fleet & Waste Analytics</h2>
            <p className="text-base text-slate-400 leading-relaxed">Monitor garbage collection routes, bin fill-levels, crew assignments, and environmental impact from one dashboard.</p>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-slate-700">
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800 flex items-center gap-2 px-4 z-10">
                <span className="w-3 h-3 rounded-full bg-red-500" /><span className="w-3 h-3 rounded-full bg-amber-500" /><span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-4 text-xs text-slate-400 font-mono">CWMS Fleet & Waste Monitor</span>
              </div>
              <img src={IMG.dashboard} alt="Analytics dashboard" loading="lazy" className="w-full pt-10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Truck, label: 'Fleet Tracking', desc: 'Live garbage truck GPS locations' },
                { icon: Layers, label: 'Bin Monitoring', desc: 'Real-time fill-level sensors' },
                { icon: BarChart3, label: 'Waste Analytics', desc: 'Collection & recycling metrics' },
              ].map((d, i) => (
                <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><d.icon className="h-5 w-5" /></div>
                  <div><p className="text-sm font-bold text-white">{d.label}</p><p className="text-xs text-slate-400">{d.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={IMG.campusBg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 28450, suffix: '+', label: 'Tons of Waste Collected', icon: Truck, color: 'text-emerald-600' },
              { end: 12600, suffix: '+', label: 'Collection Routes Completed', icon: MapPin, color: 'text-blue-600' },
              { end: 1580, suffix: '+', label: 'Smart Bins Installed', icon: Layers, color: 'text-violet-600' },
              { end: 99, suffix: '%', label: 'Collection Efficiency', icon: Award, color: 'text-amber-600' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50/30 transition-all duration-300">
                  <div className={`p-3 ${s.color.replace('text', 'bg')}/10 rounded-xl w-fit mx-auto mb-4`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
                  <p className={`text-4xl md:text-5xl font-black ${s.color} tracking-tight`}><Counter end={s.end} suffix={s.suffix} /></p>
                  <p className="text-sm font-semibold text-slate-700 mt-2">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">Equipment Gallery</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Our Waste Management Fleet</h2>
            <p className="text-base text-slate-500 leading-relaxed">Modern equipment and facilities powering our campus waste management operations.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { img: IMG.gallery1, title: 'Compactor Trucks', desc: 'High-capacity waste compaction vehicles' },
              { img: IMG.gallery2, title: 'Modern Facilities', desc: 'Eco-friendly recycling stations' },
              { img: IMG.gallery3, title: 'Campus Infrastructure', desc: 'Clean urban waste management zones' },
              { img: IMG.gallery4, title: 'Community Engagement', desc: 'Students participating in sanitation' },
              { img: IMG.gallery5, title: 'Operations Center', desc: 'Dispatch and coordination hub' },
              { img: IMG.gallery6, title: 'Analytics & Tracking', desc: 'Real-time waste monitoring system' },
            ].map((g, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <img src={g.img} alt={g.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-bold text-sm">{g.title}</p>
                    <p className="text-slate-300 text-xs mt-1">{g.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Trusted by Campus Communities</h2>
            <p className="text-base text-slate-500 leading-relaxed">Hear from students, staff, and administrators using CWMS daily.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: IMG.portrait1, name: 'Bright Okon', role: 'Student Representative', quote: 'The campus waste collection has improved dramatically. I can report an overflowing bin and a truck arrives within hours.', stars: 5 },
              { img: IMG.portrait2, name: 'Dr. Sarah Adebayo', role: 'Environment Committee', quote: 'Real-time fleet tracking and bin monitoring has reduced our operational costs by 40%. The analytics are game-changing.', stars: 5 },
              { img: IMG.portrait3, name: 'Emeka Obi', role: 'Sanitation Lead', quote: 'I manage my collection routes from my phone, upload disposal photos, and track each bin\'s status. Incredibly efficient.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-5">{Array.from({ length: t.stars }).map((_, si) => (<Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />))}</div>
                <Quote className="h-8 w-8 text-emerald-100 mb-3" />
                <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <img src={t.img} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100" />
                  <div><p className="text-sm font-bold text-slate-800">{t.name}</p><p className="text-xs text-slate-400">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo-access" className="py-24 bg-gradient-to-r from-green-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-300">
                EVALUATOR SANDBOX
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Inspect Every Module Instantly!
              </h2>
              <p className="text-base text-slate-300 max-w-lg leading-relaxed">
                Skip standard registration templates by bypassing login directly. Select any predefined UNICROSS system profile below to launch and explore their personalized dashboard controls.
              </p>
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shared Database Synchronicity</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Actions taken in any dashboard profile update the central system immediately! You can submit a waste incident as a student, inspect and edit it as an Admin, or clear it as Sanitation Staff.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              {[
                {
                  role: 'student' as const,
                  title: 'Student Resident',
                  desc: 'Report overflowing bins, track collection requests, and earn green points for proper waste sorting across campus hostels and lecture halls.',
                  features: ['Report Waste Incident', 'Track Collection Status', 'View Green Points', 'Campus Announcements'],
                  icon: Users,
                },
                {
                  role: 'staff' as const,
                  title: 'Sanitation Field Staff',
                  desc: 'Receive dispatch alerts, navigate optimal collection routes, upload disposal confirmations with photos, and manage your daily manifest.',
                  features: ['Dispatch Alerts', 'Route Navigation', 'Photo Confirmation', 'Daily Manifest'],
                  icon: Truck,
                },
                {
                  role: 'admin' as const,
                  title: 'System Administrator',
                  desc: 'Oversee fleet operations, assign collection crews, monitor bin fill-levels campus-wide, and generate environmental compliance reports.',
                  features: ['Fleet Overview', 'Crew Assignment', 'Bin Analytics', 'Compliance Reports'],
                  icon: Monitor,
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => onQuickLogin(item.role)}
                  className="w-full group flex items-start gap-5 bg-white/[0.04] hover:bg-white/[0.08] border border-slate-700/50 hover:border-emerald-500/40 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{item.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 rounded-full">Quick Access</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{item.desc}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {item.features.map((f, fi) => (
                        <span key={fi} className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-500/60" />{f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 self-center text-slate-600 group-hover:text-emerald-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.contactBg} alt="" className="w-full h-full object-cover opacity-15" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 mb-4">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Ready to Modernize Waste Management?</h2>
              <p className="text-base text-slate-400 leading-relaxed mb-8">Join leading institutions using CWMS to create cleaner, more sustainable campuses with smart waste operations.</p>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: 'operations@cwms.edu.ng' },
                  { icon: Phone, text: '+234 800 CWMS HELP' },
                  { icon: MapPin, text: 'University Main Campus' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><c.icon className="h-5 w-5" /></div>
                    <span className="text-sm text-slate-300">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Request a Demo</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="Institution Name" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition" />
                <textarea rows={3} placeholder="Message" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition resize-none" />
                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">Send Message <ArrowRight className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <UnicrossLogo size="md" theme="dark" />
                <span className="font-extrabold text-sm tracking-tight text-white">UNICROSS</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">University of Cross River State — Professional campus waste management platform. Modern fleet, smart bins, and real-time analytics.</p>
            </div>
            {[
              { title: 'Operations', links: ['Collection Routes', 'Bin Monitoring', 'Fleet Tracking', 'Recycling'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'API Status', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{col.title}</p>
                <ul className="text-xs space-y-2.5">
                  {col.links.map((link, li) => (
                    <li key={li}><a href="#" className="text-slate-500 hover:text-emerald-400 transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} CWMS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-emerald-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
