import React, { useEffect, useState } from 'react';
import { 
  Bell, Settings, LogOut, Menu, X, BarChart3, 
  Plus, ClipboardList, History, MapPin, Users, ShieldCheck
} from 'lucide-react';
import { User, UserRole } from '../types';
import UnicrossLogo from './UnicrossLogo';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  unreadNotificationsCount: number;
  children: React.ReactNode;
}

const THEMES = {
  student: {
    sidebar: 'bg-stone-900 border-stone-800/80',
    brand: 'from-amber-500 to-orange-600',
    active: 'bg-amber-600 text-white shadow-amber-950/25',
    hover: 'hover:bg-stone-800/50 hover:text-amber-300',
    iconHover: 'group-hover:text-amber-400',
    status: 'bg-amber-500',
    statusBg: 'bg-amber-50 text-amber-700 border-amber-100/50',
    badge: 'bg-amber-500/25 text-amber-200',
    topbarBadge: 'bg-amber-50 text-amber-700 border-amber-100',
    switchActive: 'bg-amber-600 text-white',
    switchInactive: 'bg-stone-800 text-stone-400 hover:text-white',
    label: 'text-amber-400',
    heading: 'text-amber-500',
  },
  staff: {
    sidebar: 'bg-slate-900 border-slate-800/80',
    brand: 'from-blue-500 to-cyan-600',
    active: 'bg-blue-600 text-white shadow-blue-950/25',
    hover: 'hover:bg-slate-800/50 hover:text-blue-300',
    iconHover: 'group-hover:text-blue-400',
    status: 'bg-blue-500',
    statusBg: 'bg-blue-50 text-blue-700 border-blue-100/50',
    badge: 'bg-blue-500/25 text-blue-200',
    topbarBadge: 'bg-blue-50 text-blue-700 border-blue-100',
    switchActive: 'bg-blue-600 text-white',
    switchInactive: 'bg-slate-800 text-slate-400 hover:text-white',
    label: 'text-blue-400',
    heading: 'text-blue-500',
  },
  admin: {
    sidebar: 'bg-violet-950 border-violet-900/80',
    brand: 'from-violet-500 to-purple-700',
    active: 'bg-violet-600 text-white shadow-violet-950/25',
    hover: 'hover:bg-violet-900/50 hover:text-violet-300',
    iconHover: 'group-hover:text-violet-400',
    status: 'bg-violet-500',
    statusBg: 'bg-violet-50 text-violet-700 border-violet-100/50',
    badge: 'bg-violet-500/25 text-violet-200',
    topbarBadge: 'bg-violet-50 text-violet-700 border-violet-100',
    switchActive: 'bg-violet-600 text-white',
    switchInactive: 'bg-violet-900 text-violet-400 hover:text-white',
    label: 'text-violet-400',
    heading: 'text-violet-500',
  },
};

export default function DashboardLayout({ 
  currentUser, 
  onLogout, 
  activeTab, 
  onNavigateTab, 
  unreadNotificationsCount, 
  children 
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const theme = THEMES[currentUser.role];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Configure navigation lists based on role
  const getSidebarItems = () => {
    const items = [
      { id: 'dashboard', label: 'Ecosystem Dashboard', adminLabel: 'Control Centre', icon: BarChart3, roles: ['student', 'staff', 'admin'] },
      { id: 'report-waste', label: 'Report Waste', adminLabel: 'Dispatch Board', icon: Plus, roles: ['student', 'admin'] },
      { id: 'my-reports', label: 'My Submissions', icon: ClipboardList, roles: ['student'] },
      { id: 'history', label: 'History & Archives', adminLabel: 'Archive & Audit', icon: History, roles: ['student', 'staff', 'admin'] },
      { id: 'live-map', label: 'Live Fleet Map', adminLabel: 'Fleet Command', icon: MapPin, roles: ['student', 'staff', 'admin'] },
      { id: 'notifications', label: 'Notifications', adminLabel: 'Alert Centre', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, roles: ['student', 'staff', 'admin'] },
      { id: 'admin-users', label: 'User Directory', adminLabel: 'Directory & Access', icon: Users, roles: ['admin'] },
      { id: 'settings', label: 'Configuration', adminLabel: 'System Config', icon: Settings, roles: ['student', 'staff', 'admin'] },
    ];
    return items
      .filter(item => item.roles.includes(currentUser.role))
      .map(item => ({
        ...item,
        label: currentUser.role === 'admin' && item.adminLabel ? item.adminLabel : item.label,
      }));
  };

  const navItems = getSidebarItems();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row relative">
      
      {/* Mobile Navbar Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <UnicrossLogo size="sm" className="h-9 w-9 shrink-0" />
          <span className={`font-extrabold text-sm tracking-tight bg-gradient-to-r ${theme.brand} bg-clip-text text-transparent`}>UNICROSS OCWMS</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick notify badge on mobile */}
          <button onClick={() => onNavigateTab('notifications')} className="relative p-1 text-slate-600">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1.5 bg-slate-100 rounded-lg text-slate-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation: Desktop & Mobile Drawer */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-72 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out md:shrink-0 ${theme.sidebar} text-slate-300 border-r
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/65 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UnicrossLogo size="sm" className="h-11 w-11 shrink-0" theme="dark" />
            <div>
              <span className="font-black text-white text-base tracking-tight block">UNICROSS</span>
              <span className={`text-[10px] ${theme.heading} font-mono tracking-wider block uppercase`}>
                {currentUser.role === 'admin' ? 'OCWMS CONTROL' : 'OCWMS PORTAL'}
              </span>
            </div>
          </div>
          <button className="md:hidden p-1 bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className={`text-[9px] ${theme.label} font-bold tracking-widest uppercase px-3.5 mb-3`}>
            {currentUser.role === 'admin' ? 'Governance Hierarchy' : 'Core Operation Console'}
          </p>
          
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  onNavigateTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all group
                  ${isActive 
                    ? theme.active 
                    : `text-slate-400 ${theme.hover}`}
                `}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : `text-slate-400 ${theme.iconHover}`}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-white text-green-700' : 'bg-red-500 text-white animate-pulse'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active profile card + logout (roles are separated by portal, no in-app switching) */}
        <div className="p-4 border-t border-slate-800/70 bg-slate-950/30">

          <div className="mb-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80 text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`h-3.5 w-3.5 ${theme.label}`} />
              <span className={`text-[9px] font-bold ${theme.label} uppercase tracking-widest`}>
                {currentUser.role === 'admin' ? 'Administrator Console' : currentUser.role === 'staff' ? 'Sanitation Staff Portal' : 'Student Portal'}
              </span>
            </div>
          </div>

          {/* User Profile Info Card */}
          <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2.5">
              <img 
                src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-full object-cover border border-slate-700" 
              />
              <div className="text-left">
                <p className="text-[11px] font-bold text-white max-w-[130px] truncate">{currentUser.name}</p>
                <p className="text-[9px] text-slate-500 capitalize tracking-wider font-mono">
                  {currentUser.role} Directory
                </p>
              </div>
            </div>
            
            <button 
              id="sidebar-btn-logout"
              onClick={onLogout}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition"
              title="Logout session"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* Main Work Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar: Desktop Header */}
        <header id="topbar" className="hidden md:flex h-16 bg-white border-b border-slate-100 items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' ? (
              <>
                <ShieldCheck className="h-5 w-5 text-violet-600" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Executive Node</span>
                <span className="text-sm font-extrabold uppercase px-3 py-1 rounded-lg bg-violet-600 text-white tracking-wider shadow-sm shadow-violet-200">
                  Administrator Console
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Station</span>
                <span className={`text-sm font-extrabold capitalize px-3 py-1 rounded-lg ${theme.topbarBadge}`}>
                  {currentUser.role} Space
                </span>
              </>
            )}
          </div>

          {/* Right Top Header section */}
          <div className="flex items-center gap-4">
            
            {/* Simulation Clock Indicator */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border ${theme.statusBg}`}>
              <span className={`w-2 h-2 ${theme.status} rounded-full animate-ping`} />
              <span>Simulated Campus Node Operational</span>
            </div>

            {/* Bell Quick notifications click */}
            <button 
              id="topbar-btn-bell"
              onClick={() => onNavigateTab('notifications')} 
              className="relative p-2 hover:bg-slate-50 rounded-xl transition text-slate-600"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px] font-black leading-none animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Topbar Separator */}
            <div className="w-px h-6 bg-slate-100" />

            {/* User credentials */}
            <div className="flex items-center gap-2">
              <img 
                src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt="user avatar" 
                className="w-8 w-8 rounded-full object-cover border border-slate-100" 
              />
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser.name}</span>
                <span className="block text-[10px] text-slate-400 leading-none truncate max-w-[120px] font-mono">{currentUser.email}</span>
              </div>
            </div>

          </div>
        </header>

        {/* Admin-only command strip: distinct structural element absent from student/staff */}
        {currentUser.role === 'admin' && (
          <div className="hidden md:flex flex-wrap items-center justify-between gap-4 px-8 py-2.5 bg-white border-b border-violet-100 border-t-[3px] border-t-violet-600">
            <div className="flex items-center gap-5 flex-wrap">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-violet-700">
                Command Strip
              </span>
              <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Campus Node Online
              </span>
              <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
                RBAC Enforced
              </span>
              <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                Audit Recording
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                {now.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-md tabular-nums">
                {now.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </div>

      </main>

    </div>
  );
}
