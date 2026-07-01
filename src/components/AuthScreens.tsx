import React, { useState } from 'react';
import { Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole, FACULTIES } from '../types';
import UnicrossLogo from './UnicrossLogo';

interface AuthScreensProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (data: any) => void;
  onBackToLanding: () => void;
}

export default function AuthScreens({ mode, onSwitchMode, onLogin, onRegister, onBackToLanding }: AuthScreensProps) {
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Please enter your university email directory.');
      return;
    }
    // Simple mock routing based on email patterns to switch roles automatically
    const trimmedEmail = email.toLowerCase().trim();
    if (trimmedEmail.includes('admin') || trimmedEmail === 'florence.effiong@unicross.edu.ng') {
      onLogin(trimmedEmail, 'admin');
    } else if (trimmedEmail.includes('staff') || trimmedEmail === 'emeka.obi@unicross.edu.ng' || trimmedEmail === 'asari.bassey@unicross.edu.ng') {
      onLogin(trimmedEmail, 'staff');
    } else {
      onLogin(trimmedEmail, 'student'); // Default to student
    }
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
    
    onRegister({
      name: fullName,
      matricNumber,
      email,
      phoneNumber: phone,
      faculty,
      department,
      hostel,
      status: 'Active'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 grid grid-cols-1 lg:grid-cols-12 font-sans overflow-hidden">
      
      {/* Left Column: Premium Interactive Campus Illustration Mock */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-green-950 via-emerald-900 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract vector orbits */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="flex items-center gap-3.5 z-10 cursor-pointer" onClick={onBackToLanding}>
          <UnicrossLogo size="sm" className="h-12 w-12 shrink-0 bg-white p-1 rounded-xl shadow-lg" />
          <div>
            <p className="font-black text-white text-lg tracking-tight">UNICROSS OCWMS</p>
            <p className="text-[10px] text-green-400 font-mono tracking-widest uppercase">Safe Campus Haven</p>
          </div>
        </div>

        {/* Center content */}
        <div className="space-y-6 z-10 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/15 border border-green-500/20 rounded-full text-xs font-semibold text-green-400">
            <Sparkles className="h-3 w-3" />
            <span>Digital Sanitation Initiative</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Elevating UNICROSS Hygiene & Environmental Sustainability.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Report broken pipes, plastic build-ups, chemical leaks, and general campus waste directly to environmental teams with smart geolocation and instant AI feedback channels.
          </p>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-start gap-3">
              <span className="p-1 bg-green-500/20 text-green-400 rounded-lg text-xs mt-0.5 font-bold">✓</span>
              <div>
                <p className="text-xs font-bold text-slate-100">Clean Classrooms & Hostels</p>
                <p className="text-[11px] text-slate-400">Report in under 30 seconds straight from lecture halls.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 bg-green-500/20 text-green-400 rounded-lg text-xs mt-0.5 font-bold">✓</span>
              <div>
                <p className="text-xs font-bold text-slate-100">Live Collection Map</p>
                <p className="text-[11px] text-slate-400">Track sanitation dispatch trucks with turn-oriented statuses.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats inside illustration column */}
        <div className="border-t border-slate-800 pt-6 z-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Campus Statistics</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-black text-white">100%</p>
              <p className="text-[9px] text-slate-400">Accountability</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">&lt; 4 Hours</p>
              <p className="text-[9px] text-slate-400">Average Cleanup</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">9k+ kg</p>
              <p className="text-[9px] text-slate-400">Composted Organics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Login/Register Form Workspace */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 bg-slate-900 relative">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-800/45 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Circular accents in the card */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header switch buttons */}
          <div className="flex justify-between items-center mb-6">
            <button 
              id="switch-btn-back"
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              ← Back to site
            </button>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                id="tab-select-login"
                onClick={() => { onSwitchMode('login'); setLoginError(''); setRegError(''); }}
                className={`px-4 py-1.5 rounded-lg font-semibold transition ${mode === 'login' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Sign In
              </button>
              <button
                id="tab-select-register"
                onClick={() => { onSwitchMode('register'); setLoginError(''); setRegError(''); }}
                className={`px-4 py-1.5 rounded-lg font-semibold transition ${mode === 'register' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Register
              </button>
            </div>
          </div>

          {/* LOGIN VIEW */}
          {mode === 'login' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Access Campus Dashboard</h3>
                <p className="text-xs text-slate-400 mt-1">Sign in using your authorized UNICROSS student or staff directory credentials.</p>
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
                    placeholder="student@student.unicross.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label htmlFor="login-pass" className="text-xs font-semibold text-slate-300">Account Password</label>
                    <button type="button" className="text-xs text-green-400 hover:underline">Forgot password?</button>
                  </div>
                  <input
                    id="login-pass"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      id="login-remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-green-600 focus:ring-0 w-4 h-4"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl mt-2 transition text-sm flex items-center justify-center gap-2"
                >
                  Enter Operational Panel
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Instant profile selector shortcuts */}
              <div className="border-t border-slate-800 pt-6 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 text-center">
                  Quick Access Profiles (Evaluator Sandbox)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button 
                    id="shortcut-student"
                    type="button"
                    onClick={() => {
                      setEmail('brightokon444@gmail.com');
                      setPassword('password');
                      setRememberMe(true);
                      // Auto triggering the submit logic
                      onLogin('brightokon444@gmail.com', 'student');
                    }}
                    className="p-2 sm:p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left flex flex-col justify-between"
                  >
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-mono font-black uppercase">STUDENT</span>
                    <span className="text-[11px] font-bold text-slate-200 mt-1 truncate">Bright Okon</span>
                  </button>
                  <button 
                    id="shortcut-staff"
                    type="button"
                    onClick={() => {
                      setEmail('emeka.obi@unicross.edu.ng');
                      setPassword('password');
                      setRememberMe(true);
                      onLogin('emeka.obi@unicross.edu.ng', 'staff');
                    }}
                    className="p-2 sm:p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left flex flex-col justify-between"
                  >
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono font-black uppercase">STAFF</span>
                    <span className="text-[11px] font-bold text-slate-200 mt-1 truncate">Emeka Obi</span>
                  </button>
                  <button 
                    id="shortcut-admin"
                    type="button"
                    onClick={() => {
                      setEmail('florence.effiong@unicross.edu.ng');
                      setPassword('password');
                      setRememberMe(true);
                      onLogin('florence.effiong@unicross.edu.ng', 'admin');
                    }}
                    className="p-2 sm:p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left flex flex-col justify-between"
                  >
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-black uppercase">ADMIN</span>
                    <span className="text-[11px] font-bold text-slate-200 mt-1 truncate">Prof Florence</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // REGISTER VIEW WITH UNIVERSITY HOSTEL AND DEPT FIELDS
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
                
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-xs font-semibold text-slate-300">Full Legal Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Bright Okon"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-faculty" className="text-xs font-semibold text-slate-300">Faculty</label>
                    <select
                      id="reg-faculty"
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:border-green-500 focus:outline-none transition animate-pulse"
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
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
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
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-sm text-white rounded-xl focus:border-green-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl mt-3 transition text-sm flex items-center justify-center gap-2"
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

        </div>
      </div>

    </div>
  );
}
