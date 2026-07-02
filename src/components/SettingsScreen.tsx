import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Sparkles, CheckCircle2 
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsScreenProps {
  currentUser: UserType;
  onUpdateProfile: (updatedData: any) => void;
}

export default function SettingsScreen({ currentUser, onUpdateProfile }: SettingsScreenProps) {
  
  // States
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phoneNumber || '');
  const [hostel, setHostel] = useState(currentUser.hostel || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [appAlerts, setAppAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saveBanner, setSaveBanner] = useState(false);
  const [pBanner, setPBanner] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phoneNumber: phone,
      hostel,
      avatar: avatarUrl
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 5000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setPBanner(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPBanner(false), 5000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Configuration Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Configure your personal profiles, directory notifications alert triggers, and system passwords.</p>
      </div>

      {saveBanner && (
        <div id="save-success-banner" className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Profile configuration criteria saved successfully into local storage directory.</span>
        </div>
      )}

      {pBanner && (
        <div id="p-success-banner" className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Your security passwords have been successfully updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Controls List */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Section 1: User Profile Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-green-600" />
              1. Profile Settings
            </h3>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'; }}
                />
                <div className="flex-1">
                  <label className="text-slate-400 block mb-1">Profile Picture URL</label>
                  <input
                    id="set-avatar"
                    type="text"
                    placeholder="Paste image URL..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="set-name" className="text-slate-400">Full Name</label>
                  <input
                    id="set-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="set-email" className="text-slate-400">Primary Email</label>
                  <input
                    id="set-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="set-phone" className="text-slate-400">Phone Contact</label>
                  <input
                    id="set-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                {currentUser.role === 'student' && (
                  <div className="space-y-1.5">
                    <label htmlFor="set-hostel" className="text-slate-400">Hostel Allocation</label>
                    <input
                      id="set-hostel"
                      type="text"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl focus:border-green-500 focus:outline-none transition"
                    />
                  </div>
                )}
              </div>

              <button
                id="set-btn-save-profile"
                type="submit"
                className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg transition"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Section 2: Notifications Toggles */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-blue-600" />
              2. Notification Preferences
            </h3>
            <p className="text-[11px] text-slate-400">Select which operational updates you expect to receive via integrated channels.</p>

            <div className="space-y-3 pt-2 text-xs font-semibold text-slate-600">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer select-none transition">
                <div className="space-y-0.5">
                  <p className="text-slate-800">Email Notifications</p>
                  <p className="text-[10px] text-slate-400 font-medium">Weekly summary digests and complete resolution logs.</p>
                </div>
                <input
                  id="set-toggle-email"
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-green-600 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer select-none transition">
                <div className="space-y-0.5">
                  <p className="text-slate-800">Interactive SMS dispatches</p>
                  <p className="text-[10px] text-slate-400 font-medium">Direct alert messages when a sweeper truck is assigned.</p>
                </div>
                <input
                  id="set-toggle-sms"
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-green-600 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer select-none transition">
                <div className="space-y-0.5">
                  <p className="text-slate-800">Critical App Banners</p>
                  <p className="text-[10px] text-slate-400 font-medium">Immediate visual warnings on campus emergency hazards.</p>
                </div>
                <input
                  id="set-toggle-app"
                  type="checkbox"
                  checked={appAlerts}
                  onChange={(e) => setAppAlerts(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-green-600 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Password Changes */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-650" />
              3. Security Credentials
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1.5">
                <label htmlFor="pass-current" className="text-slate-400">Current Password</label>
                <input
                  id="pass-current"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="pass-new" className="text-slate-400">New Password</label>
                  <input
                    id="pass-new"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="pass-confirm" className="text-slate-400">Confirm New Password</label>
                  <input
                    id="pass-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="set-btn-save-pass"
                type="submit"
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition"
              >
                Update My Security Key
              </button>
            </form>
          </div>

        </div>

        {/* Right Green Guidelines Reminder */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-green-950 to-slate-900 text-white p-6 rounded-3xl border border-green-800 relative overflow-hidden space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-green-400 flex items-center gap-1 uppercase tracking-widest leading-none">
              <Sparkles className="h-4 w-4 animate-spin text-green-450" />
              Green Code of Conduct
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
              As a verified UNICROSS platform member, you play a vital role in our local waste compliance program.
            </p>

            <div className="space-y-3 select-none text-[10px] text-slate-300">
              <div className="flex items-start gap-2.5 border-t border-slate-800 pt-3">
                <span className="p-0.5 bg-green-500/20 text-green-400 rounded">✓</span>
                <p>Ensure chemical experiments glass shards are carefully labeled as broken before leaving disposal notes.</p>
              </div>
              <div className="flex items-start gap-2.5 border-t border-slate-800 pt-3">
                <span className="p-0.5 bg-green-500/20 text-green-400 rounded">✓</span>
                <p>Do not incinerate single-use plastics in the student hostels gardens. Use corresponding green bin cages.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
