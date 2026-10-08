import React, { useState } from 'react';
import { ArrowRight, Camera, CheckCircle2, Sparkles, ShieldCheck, HardHat, GraduationCap } from 'lucide-react';
import { UserRole, FACULTIES } from '../types';
import UnicrossLogo from './UnicrossLogo';

interface AuthScreensProps {
  mode: 'login' | 'register';
  portalRole: UserRole;
  onChangePortal: (role: UserRole) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (data: any) => void;
  onBackToLanding: () => void;
}

const PORTALS: Record<UserRole, {
  label: string;
  tagline: string;
  person: string;
  email: string;
  gradient: string;
  glow: string;
  accent: string;
  chip: string;
  chipSolid: string;
  btn: string;
  ring: string;
  tabActive: string;
  cta: string;
  heading: string;
  blurb: string;
  feature1: [string, string];
  feature2: [string, string];
  stat1: [string, string];
  stat2: [string, string];
  stat3: [string, string];
  icon: React.ElementType;
}> = {
  student: {
    label: 'Student Portal',
    tagline: 'Report waste, track your submissions',
    person: 'Bright Okon',
    email: 'brightokon444@gmail.com',
    gradient: 'from-green-950 via-emerald-900 to-slate-950',
    glow: 'bg-green-500/10',
    accent: 'text-green-400',
    chip: 'bg-green-500/10 text-green-400',
    chipSolid: 'bg-green-500/20 text-green-400',
    btn: 'bg-green-600 hover:bg-green-700',
    ring: 'focus:border-green-500',
    tabActive: 'bg-green-600 text-white',
    cta: 'Enter Student Portal',
    heading: 'Report Waste & Track Progress',
    blurb: 'File waste incidents with AI classification, follow your submissions through every cleanup stage, and stay accountable to a greener campus.',
    feature1: ['Instant AI Classification', 'Photograph any waste and the system identifies the category instantly.'],
    feature2: ['Live Cleanup Tracking', 'Watch your report move from Pending to Assigned to Completed.'],
    stat1: ['< 30 sec', 'To file a report'],
    stat2: ['4 hrs', 'Avg cleanup time'],
    stat3: ['100%', 'Accountability'],
    icon: GraduationCap
  },
  staff: {
    label: 'Sanitation Staff Portal',
    tagline: 'Field operations and dispatch',
    person: 'Emeka Obi',
    email: 'emeka.obi@unicross.edu.ng',
    gradient: 'from-blue-950 via-slate-900 to-slate-950',
    glow: 'bg-blue-500/10',
    accent: 'text-blue-400',
    chip: 'bg-blue-500/10 text-blue-400',
    chipSolid: 'bg-blue-500/20 text-blue-400',
    btn: 'bg-blue-600 hover:bg-blue-700',
    ring: 'focus:border-blue-500',
    tabActive: 'bg-blue-600 text-white',
    cta: 'Enter Field Console',
    heading: 'Execute & Document Cleanups',
    blurb: 'Receive dispatched cleanup tasks, accept them on the ground, and close each case with photographic proof of completion.',
    feature1: ['Dispatched Task Queue', 'Only the cleanups actually allocated to you, nothing else.'],
    feature2: ['Photo Evidence Closure', 'Resolve a case only after uploading completion proof.'],
    stat1: ['2.4 hrs', 'Avg completion'],
    stat2: ['Class A', 'Operational tier'],
    stat3: ['Live', 'Duty status'],
    icon: HardHat
  },
  admin: {
    label: 'Administrator Console',
    tagline: 'Campus-wide oversight and analytics',
    person: 'Prof Florence',
    email: 'florence.effiong@unicross.edu.ng',
    gradient: 'from-violet-950 via-slate-900 to-slate-950',
    glow: 'bg-violet-500/10',
    accent: 'text-violet-400',
    chip: 'bg-violet-500/10 text-violet-400',
    chipSolid: 'bg-violet-500/20 text-violet-400',
    btn: 'bg-violet-600 hover:bg-violet-700',
    ring: 'focus:border-violet-500',
    tabActive: 'bg-violet-600 text-white',
    cta: 'Enter Administrator Console',
    heading: 'Govern the Whole Operation',
    blurb: 'Dispatch officers to incidents, manage the user directory, monitor campus-wide waste trends and audit every action taken on the system.',
    feature1: ['Officer Dispatch Control', 'Allocate field crews to pending incidents in one click.'],
    feature2: ['Full Audit Trail', 'Every action recorded with actor, role and timestamp.'],
    stat1: ['28k+', 'Tons collected'],
    stat2: ['1,580', 'Smart bins'],
    stat3: ['99%', 'Efficiency'],
    icon: ShieldCheck
  }
};

export default function AuthScreens({ mode, portalRole, onChangePortal, onSwitchMode, onLogin, onRegister, onBackToLanding }: AuthScreensProps) {
  const portal = PORTALS[portalRole];
  const canRegister = portalRole === 'student';

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('Engineering');
  const [department, setDepartment] = useState('');
  const [hostel, setHostel] = useState('Hostel Block C, Room 14');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPassportPhoto(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const showLogin = mode === 'login' || !canRegister;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Please enter your university email directory.');
      return;
    }
    // The portal decides the role - no cross-role guessing.
    onLogin(email.toLowerCase().trim(), portalRole);
  };

  const handleQuickLogin = () => {
    // Honour whatever the user typed so we never silently sign in as the
    // wrong person (e.g. the staff demo default) instead of the typed account.
    const target = email.trim() ? email.toLowerCase().trim() : portal.email;
    setEmail(target);
    setPassword('password');
    setRememberMe(true);
    onLogin(target, portalRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !matricNumber || !email || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!passportPhoto) {
      setRegError('Please upload your passport photograph before continuing.');
      return;
    }

    onRegister({
      name: fullName,
      avatar: passportPhoto,
      matricNumber,
      email,
      phoneNumber: phone,
      faculty,
      department,
      hostel,
      status: 'Active'
    });
  };

  const PortalIcon = portal.icon;

  return (
    <div className="min-h-screen bg-slate-900 grid grid-cols-1 lg:grid-cols-12 font-sans overflow-hidden">

      {/* Left Column: Role-branded panel */}
      <div className={`hidden lg:flex lg:col-span-5 bg-gradient-to-br ${portal.gradient} p-12 flex-col justify-between relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-80 h-80 ${portal.glow} rounded-full blur-3xl pointer-events-none`} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="flex items-center gap-3.5 z-10 cursor-pointer" onClick={onBackToLanding}>
          <UnicrossLogo size="sm" className="h-12 w-12 shrink-0 bg-white p-1 rounded-xl shadow-lg" />
          <div>
            <p className="font-black text-white text-lg tracking-tight">UNICROSS OCWMS</p>
            <p className={`text-[10px] ${portal.accent} font-mono tracking-widest uppercase`}>{portal.label}</p>
          </div>
        </div>

        {/* Center content */}
        <div className="space-y-6 z-10 max-w-sm">
          <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold ${portal.chipSolid}`}>
            <PortalIcon className="h-3 w-3" />
            <span>{portal.tagline}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            {portal.heading}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {portal.blurb}
          </p>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-start gap-3">
              <span className={`p-1 ${portal.chipSolid} rounded-lg text-xs mt-0.5 font-bold`}>✓</span>
              <div>
                <p className="text-xs font-bold text-slate-100">{portal.feature1[0]}</p>
                <p className="text-[11px] text-slate-400">{portal.feature1[1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={`p-1 ${portal.chipSolid} rounded-lg text-xs mt-0.5 font-bold`}>✓</span>
              <div>
                <p className="text-xs font-bold text-slate-100">{portal.feature2[0]}</p>
                <p className="text-[11px] text-slate-400">{portal.feature2[1]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="border-t border-slate-800 pt-6 z-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Campus Statistics</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-black text-white">{portal.stat1[0]}</p>
              <p className="text-[9px] text-slate-400">{portal.stat1[1]}</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">{portal.stat2[0]}</p>
              <p className="text-[9px] text-slate-400">{portal.stat2[1]}</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">{portal.stat3[0]}</p>
              <p className="text-[9px] text-slate-400">{portal.stat3[1]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login / Register workspace */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 bg-slate-900 relative">
        <div className={`absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 ${portal.glow} rounded-full blur-3xl pointer-events-none`} />

        <div className="w-full max-w-lg bg-slate-800/45 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">

          <div className={`absolute -top-10 -right-10 w-32 h-32 ${portal.glow} rounded-full blur-2xl pointer-events-none`} />

          {/* Header: back + login/register toggle */}
          <div className="flex justify-between items-center mb-6">
            <button
              id="switch-btn-back"
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              ← Back to site
            </button>
            {canRegister ? (
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  id="tab-select-login"
                  onClick={() => { onSwitchMode('login'); setLoginError(''); setRegError(''); }}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition ${mode === 'login' ? portal.tabActive : 'text-slate-400 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  id="tab-select-register"
                  onClick={() => { onSwitchMode('register'); setLoginError(''); setRegError(''); }}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition ${mode === 'register' ? portal.tabActive : 'text-slate-400 hover:text-white'}`}
                >
                  Register
                </button>
              </div>
            ) : (
              <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${portal.chip}`}>
                {portal.label}
              </span>
            )}
          </div>

          {/* LOGIN VIEW */}
          {showLogin ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{portal.label}</h3>
                <p className="text-xs text-slate-400 mt-1">Sign in with your authorised {portalRole} directory credentials.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="text-xs font-semibold text-slate-300">University Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder={portal.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label htmlFor="login-pass" className="text-xs font-semibold text-slate-300">Account Password</label>
                    <button type="button" className={`text-xs hover:underline ${portal.accent}`}>Forgot password?</button>
                  </div>
                  <input
                    id="login-pass"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      id="login-remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 focus:ring-0 w-4 h-4"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className={`w-full py-3.5 text-white font-bold rounded-xl mt-2 transition text-sm flex items-center justify-center gap-2 ${portal.btn}`}
                >
                  {portal.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Quick access for THIS role only */}
              <div className="border-t border-slate-800 pt-6 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 text-center">
                  Evaluator Sandbox - {portal.label}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    id={`shortcut-${portalRole}`}
                    type="button"
                    onClick={handleQuickLogin}
                    className={`p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left flex items-center justify-between`}
                  >
                    <div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black uppercase ${portal.chip}`}>{portalRole}</span>
                      <span className="text-[11px] font-bold text-slate-200 mt-1 block">{portal.person}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{portal.email}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // REGISTER VIEW (student portal only)
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Create Student Account</h3>
                <p className="text-xs text-slate-400 mt-1">Please provide accurate academic directory information for waste pick-up dispatching.</p>
              </div>

              {regError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

                {/* Passport photograph upload */}
                <div className="flex items-center gap-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <label htmlFor="reg-passport" className="cursor-pointer shrink-0">
                    {passportPhoto ? (
                      <img src={passportPhoto} alt="passport" className="w-16 h-20 object-cover rounded-lg border-2 border-green-500" />
                    ) : (
                      <div className="w-16 h-20 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                        <Camera className="h-5 w-5" />
                      </div>
                    )}
                  </label>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      Passport Photograph
                      {passportPhoto && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                      Attach a clear passport photo. It will be displayed beside your name across all dashboards and reports.
                    </p>
                    <label
                      htmlFor="reg-passport"
                      className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer transition ${portal.ring}`}
                    >
                      <Camera className="h-3.5 w-3.5" />
                      {passportPhoto ? 'Retake / Change Photo' : 'Upload or Take Photo'}
                    </label>
                  </div>
                  <input
                    id="reg-passport"
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handlePassportUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-xs font-semibold text-slate-300">Full Legal Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Bright Okon"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-matric" className="text-xs font-semibold text-slate-300">Matric Number</label>
                    <input
                      id="reg-matric"
                      type="text"
                      required
                      placeholder="U/2021/ENG/0441"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="reg-phone" className="text-xs font-semibold text-slate-300">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+234 812 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-xs font-semibold text-slate-300">Active Email Directory</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="student@student.unicross.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-faculty" className="text-xs font-semibold text-slate-300">Faculty</label>
                    <select
                      id="reg-faculty"
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    >
                      {FACULTIES.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="reg-dept" className="text-xs font-semibold text-slate-300">Department</label>
                    <input
                      id="reg-dept"
                      type="text"
                      placeholder="e.g. Civil Engineering"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-hostel" className="text-xs font-semibold text-slate-300">Hostel Allocation / Location</label>
                  <input
                    id="reg-hostel"
                    type="text"
                    placeholder="e.g. Hostel Block C, Room 14"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:outline-none transition animate-pulse ${portal.ring}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-pass" className="text-xs font-semibold text-slate-300">Password</label>
                    <input
                      id="reg-pass"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-300">Confirm Password</label>
                    <input
                      id="reg-confirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:outline-none transition ${portal.ring}`}
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className={`w-full py-3 text-white font-bold rounded-xl mt-3 transition text-sm flex items-center justify-center gap-2 ${portal.btn}`}
                >
                  Create My Ecosystem Profile
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-slate-500 text-[11px]">By registering you agree to maintain verified trash guidelines on campus.</span>
              </div>
            </div>
          )}

          {/* Portal separation - switch to another role portal */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">
              Not the right portal? Sign in elsewhere
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'staff', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  id={`go-portal-${r}`}
                  type="button"
                  onClick={() => { setLoginError(''); setRegError(''); onChangePortal(r); }}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition ${
                    r === portalRole
                      ? `${PORTALS[r].chip} border-current`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {r === 'admin' ? 'Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-3">
              Each role has its own secured entry point.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}