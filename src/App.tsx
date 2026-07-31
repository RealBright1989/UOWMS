import React, { useState, useEffect } from 'react';
import { User, WasteReport, Notification, ActivityLog, UserRole, WasteCategory, ReportStatus, Comment, WASTE_CATEGORIES } from './types';
import { api } from './api';

// Component imports
import LandingPage from './components/LandingPage';
import AuthScreens from './components/AuthScreens';
import DashboardLayout from './components/DashboardLayout';
import UserDashboard from './components/UserDashboard';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import ReportForm from './components/ReportForm';
import ReportDetails from './components/ReportDetails';
import SettingsScreen from './components/SettingsScreen';
import MapSection from './components/MapSection';

import { Bell, Search, FileText, Download } from 'lucide-react';

const MOCK_EMAILS = {
  student: 'brightokon444@gmail.com',
  staff: 'emeka.obi@unicross.edu.ng',
  admin: 'florence.effiong@unicross.edu.ng'
};

export default function App() {
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'portal'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unicross_ocwms_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  useEffect(() => {
    if (currentUser) {
      setViewState('portal');
    }
  }, [currentUser]);

  // Fetch data from server on mount
  useEffect(() => {
    api.getReports().then(setReports).catch(() => {});
    api.getUsers().then(setUsers).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getLogs().then(setActivityLogs).catch(() => {});
  }, []);

  // History filters
  const [histSearch, setHistSearch] = useState('');
  const [histCategory, setHistCategory] = useState<string>('all');
  const [histStatus, setHistStatus] = useState<string>('all');
  const [exportBanner, setExportBanner] = useState<string | null>(null);

  // AUTH
  const handleLogin = async (email: string, role: UserRole) => {
    try {
      const res = await api.login(email, role);
      setCurrentUser(res.user);
      setViewState('portal');
      setActiveTab('dashboard');
      setSelectedReport(null);
      // Refresh server data
      api.getReports().then(setReports).catch(() => {});
      api.getNotifications().then(setNotifications).catch(() => {});
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      const res = await api.register(data);
      setCurrentUser(res.user);
      setViewState('portal');
      setActiveTab('dashboard');
      setSelectedReport(null);
      api.getReports().then(setReports).catch(() => {});
      api.getNotifications().then(setNotifications).catch(() => {});
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('landing');
  };

  const handleToggleRoleBypass = async (role: UserRole) => {
    try {
      const res = await api.login(MOCK_EMAILS[role], role);
      setCurrentUser(res.user);
      setActiveTab('dashboard');
      setSelectedReport(null);
      api.getReports().then(setReports).catch(() => {});
    } catch {}
  };

  // REPORTS
  const handleAddReport = async (data: any) => {
    if (!currentUser) return;
    try {
      const reportData = { ...data, studentId: currentUser.id, studentName: currentUser.name };
      const newReport = await api.createReport(reportData);
      setReports(prev => [newReport, ...prev]);
      api.getNotifications().then(setNotifications).catch(() => {});
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch (e: any) {
      alert('Failed to submit report: ' + e.message);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: ReportStatus, resolutionImage?: string) => {
    try {
      const updated = await api.updateReportStatus(reportId, status, resolutionImage, currentUser?.name);
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      if (selectedReport?.id === reportId) setSelectedReport(updated);
      if (status === 'Completed') api.getNotifications().then(setNotifications).catch(() => {});
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch (e: any) {
      alert('Failed to update status: ' + e.message);
    }
  };

  const handleAssignStaff = async (reportId: string, staffId: string, staffName: string) => {
    try {
      const updated = await api.assignReport(reportId, staffId, staffName, currentUser?.name);
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      if (selectedReport?.id === reportId) setSelectedReport(updated);
      api.getNotifications().then(setNotifications).catch(() => {});
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch (e: any) {
      alert('Failed to assign staff: ' + e.message);
    }
  };

  const handleAddComment = async (reportId: string, text: string) => {
    if (!currentUser) return;
    try {
      const comment = await api.addComment(reportId, currentUser.name, currentUser.role, text);
      setReports(prev => prev.map(r => {
        if (r.id === reportId) {
          const updated = { ...r, comments: [...r.comments, comment] };
          if (selectedReport?.id === reportId) setSelectedReport(updated);
          return updated;
        }
        return r;
      }));
    } catch (e: any) {
      alert('Failed to add comment: ' + e.message);
    }
  };

  // USER MANAGEMENT
  const handleUpdateUserStatus = async (userId: string, status: User['status']) => {
    try {
      await api.updateUserStatus(userId, status, currentUser?.name);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch {}
  };

  const handleUpdateUserRole = async (userId: string, role: User['role']) => {
    try {
      await api.updateUserRole(userId, role, currentUser?.name);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch {}
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId, currentUser?.name);
      setUsers(prev => prev.filter(u => u.id !== userId));
      api.getLogs().then(setActivityLogs).catch(() => {});
    } catch {}
  };

  // SETTINGS
  const handleUpdateProfile = async (updatedData: any) => {
    if (!currentUser) return;
    try {
      await api.updateUser(currentUser.id, updatedData);
      const updated = { ...currentUser, ...updatedData };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
    } catch {}
  };

  // EXPORT
  const triggerMockExport = (format: 'PDF' | 'Excel') => {
    setExportBanner(`Exporting sanitation records as .${format === 'PDF' ? 'pdf' : 'xlsx'}...`);
    setTimeout(() => {
      setExportBanner(null);
      alert(`Download: UNICROSS_Sanitation_Manifest_${new Date().getFullYear()}.${format === 'PDF' ? 'pdf' : 'xlsx'}`);
    }, 2800);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const clearNotificationsCount = async () => {
    try {
      await api.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const getFilteredHistoryList = () => {
    return reports.filter(rep => {
      const roleRestricts = currentUser?.role === 'student' ? rep.studentId === currentUser.id : true;
      const textMatches = rep.description.toLowerCase().includes(histSearch.toLowerCase()) ||
        rep.location.faculty.toLowerCase().includes(histSearch.toLowerCase()) ||
        rep.location.building.toLowerCase().includes(histSearch.toLowerCase()) ||
        rep.id.toLowerCase().includes(histSearch.toLowerCase());
      const catMatches = histCategory === 'all' ? true : rep.category === histCategory;
      const statusMatches = histStatus === 'all' ? true : rep.status === histStatus;
      return roleRestricts && textMatches && catMatches && statusMatches;
    });
  };

  const activeHistoryList = getFilteredHistoryList();

  return (
    <div>
      {viewState === 'landing' && (
        <LandingPage
          onNavigateToLogin={() => { setViewState('auth'); setAuthMode('login'); }}
          onNavigateToRegister={() => { setViewState('auth'); setAuthMode('register'); }}
          onQuickLogin={(role) => handleLogin(MOCK_EMAILS[role], role)}
        />
      )}

      {viewState === 'auth' && (
        <AuthScreens
          mode={authMode}
          onSwitchMode={setAuthMode}
          onLogin={(email, role) => handleLogin(email, role)}
          onRegister={(data) => handleRegister(data)}
          onBackToLanding={() => setViewState('landing')}
        />
      )}

      {viewState === 'portal' && currentUser && (
        <DashboardLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          onNavigateTab={(tab) => { setActiveTab(tab); setSelectedReport(null); }}
          unreadNotificationsCount={unreadNotificationsCount}
          onToggleRoleBypass={handleToggleRoleBypass}
        >
          {selectedReport ? (
            <ReportDetails
              report={selectedReport}
              userRole={currentUser.role}
              userName={currentUser.name}
              onBack={() => setSelectedReport(null)}
              onAddComment={handleAddComment}
              onUpdateStatus={handleUpdateStatus}
              onAssignStaff={handleAssignStaff}
              staffList={users.filter(u => u.role === 'staff').map(s => ({ id: s.id, name: s.name }))}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && currentUser.role === 'student' && (
                <UserDashboard reports={reports} currentUser={currentUser} onNavigateTab={setActiveTab} onSelectReport={setSelectedReport} />
              )}
              {activeTab === 'dashboard' && currentUser.role === 'staff' && (
                <StaffDashboard reports={reports} currentUser={currentUser} onUpdateStatus={handleUpdateStatus} onSelectReport={setSelectedReport} />
              )}
              {activeTab === 'dashboard' && currentUser.role === 'admin' && (
                <AdminDashboard reports={reports} users={users} activityLogs={activityLogs} onSelectReport={setSelectedReport} onUpdateUserStatus={handleUpdateUserStatus} onUpdateUserRole={handleUpdateUserRole} onDeleteUser={handleDeleteUser} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'report-waste' && (
                <ReportForm onSubmitReport={handleAddReport} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'my-reports' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Reported Waste Spots</h2>
                    <p className="text-sm text-slate-500 mt-1">Review, monitor response times, and chat with assigned sanitary crews.</p>
                  </div>
                  <UserDashboard reports={reports} currentUser={currentUser} onNavigateTab={setActiveTab} onSelectReport={setSelectedReport} />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 text-left max-w-4xl">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Circular Notifications</h2>
                      <p className="text-sm text-slate-500 mt-1">In-app notifications concerning student reported cases and supervisor directives.</p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button onClick={clearNotificationsCount} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition">Mark All as Read✓</button>
                    )}
                  </div>
                  <div className="space-y-3.5">
                    {notifications.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 gap-1 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col items-center">
                        <Bell className="h-10 w-10 opacity-75 mx-auto" strokeWidth={1} />
                        <p className="font-extrabold text-sm">No new alerts</p>
                      </div>
                    ) : (
                      notifications.map((not) => (
                        <div key={not.id} className={`p-4 rounded-2xl border flex gap-4 text-xs items-start transition duration-150 relative bg-white ${not.read ? 'border-slate-100 opacity-65' : 'border-green-150 ring-1 ring-green-100'}`}>
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${not.type === 'success' ? 'bg-green-500' : not.type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono font-bold">{new Date(not.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <p className="font-black text-slate-800 text-sm leading-none">{not.title}</p>
                            <p className="text-slate-500 font-medium leading-relaxed mt-1">{not.message}</p>
                          </div>
                          {!not.read && <span className="absolute top-4 right-4 bg-green-500/10 text-green-700 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">Unread</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Incidents Registry & Archive</h2>
                      <p className="text-sm text-slate-500 mt-1">Durable query system mapping comprehensive campus sanitation files.</p>
                    </div>
                    <div className="flex gap-2.5 text-xs font-bold">
                      <button onClick={() => triggerMockExport('PDF')} className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition flex items-center gap-1.5"><Download className="h-4 w-4" /> Export PDF</button>
                      <button onClick={() => triggerMockExport('Excel')} className="px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 rounded-xl shadow-sm transition flex items-center gap-1.5"><FileText className="h-4 w-4 text-green-600" /> Export Excel</button>
                    </div>
                  </div>
                  {exportBanner && <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-xs font-bold animate-pulse">{exportBanner}</div>}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="text" placeholder="Search archives..." value={histSearch} onChange={(e) => setHistSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold" />
                    </div>
                    <div className="md:col-span-3">
                      <select value={histCategory} onChange={(e) => setHistCategory(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold text-slate-500">
                        <option value="all">All Categories</option>
                        {WASTE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <select value={histStatus} onChange={(e) => setHistStatus(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold text-slate-500">
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    {activeHistoryList.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-bold"><p>No matched registry items</p></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                              <th className="py-3 px-4">ID</th>
                              <th className="py-3 px-4">MATERIAL</th>
                              <th className="py-3 px-4">LOCATION</th>
                              <th className="py-3 px-4">URGENCY</th>
                              <th className="py-3 px-4">STATUS</th>
                              <th className="py-3 px-4 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeHistoryList.map((rep) => (
                              <tr key={rep.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                <td className="py-4 px-4 font-mono font-bold">{rep.id}</td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    {rep.imageUrl && <img src={rep.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0" />}
                                    <div><p className="font-bold text-slate-800">{rep.category}</p><p className="text-[10px] text-slate-400 truncate max-w-[140px]">{rep.description}</p></div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-700">{rep.location.faculty} ({rep.location.building})</td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${rep.priority === 'Emergency' ? 'bg-red-50 text-red-600 animate-pulse' : rep.priority === 'High' ? 'bg-amber-50 text-amber-700' : rep.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{rep.priority}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${rep.status === 'Completed' ? 'bg-green-50 text-green-700' : rep.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 animate-pulse' : rep.status === 'Assigned' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{rep.status}</span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button onClick={() => setSelectedReport(rep)} className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition">View Timeline</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <SettingsScreen currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
              )}

              {activeTab === 'live-map' && (
                <MapSection />
              )}

              {activeTab === 'admin-users' && (
                <AdminDashboard reports={reports} users={users} activityLogs={activityLogs} onSelectReport={setSelectedReport} onUpdateUserStatus={handleUpdateUserStatus} onUpdateUserRole={handleUpdateUserRole} onDeleteUser={handleDeleteUser} onNavigateTab={setActiveTab} initialTab="user-manager" />
              )}
            </>
          )}
        </DashboardLayout>
      )}
    </div>
  );
}
