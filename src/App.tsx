import React, { useState, useEffect } from 'react';
import { 
  User, WasteReport, Notification, ActivityLog, UserRole, WasteCategory, ReportStatus, Comment 
} from './types';
import { 
  INITIAL_USERS, INITIAL_REPORTS, INITIAL_NOTIFICATIONS, INITIAL_ACTIVITY_LOGS 
} from './data/mockData';

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

// Extra helper icon imports for internal views
import { Bell, History, Search, FileText, Download } from 'lucide-react';

const MOCK_EMAILS = {
  student: 'brightokon444@gmail.com',
  staff: 'emeka.obi@unicross.edu.ng',
  admin: 'florence.effiong@unicross.edu.ng'
};

export default function App() {
  
  // View states: 'landing' | 'auth' | 'portal'
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'portal'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Database states with persistent LocalStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('unicross_ocwms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [reports, setReports] = useState<WasteReport[]>(() => {
    const saved = localStorage.getItem('unicross_ocwms_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('unicross_ocwms_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('unicross_ocwms_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unicross_ocwms_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Timeline Drilldown Detail report selection
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  // Sync to local storage upon updates
  useEffect(() => {
    localStorage.setItem('unicross_ocwms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('unicross_ocwms_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('unicross_ocwms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('unicross_ocwms_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('unicross_ocwms_active_user', JSON.stringify(currentUser));
      setViewState('portal');
    } else {
      localStorage.removeItem('unicross_ocwms_active_user');
    }
  }, [currentUser]);

  // History page filters
  const [histSearch, setHistSearch] = useState('');
  const [histCategory, setHistCategory] = useState<string>('all');
  const [histStatus, setHistStatus] = useState<string>('all');
  const [exportBanner, setExportBanner] = useState<string | null>(null);

  // AUTH TRIGGERS
  const handleLogin = (email: string, role: UserRole) => {
    // Try to find matching user in memory bank
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // If not found, spawn mock profile immediately
    if (!user) {
      user = {
        id: 'u_' + Math.floor(Math.random() * 1000),
        name: email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: email,
        role: role,
        matricNumber: role === 'student' ? 'U/2022/ENG/' + Math.floor(1000 + Math.random() * 9000) : undefined,
        phoneNumber: '+234 812 ' + Math.floor(1000000 + Math.random() * 9000000),
        department: role === 'staff' ? 'Campus Environment team C' : 'Directorate Office',
        status: 'Active',
        avatar: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };
      setUsers(prev => [user!, ...prev]);
    }

    if (user.status === 'Suspended') {
      alert('Your OCWMS directory access is currently Suspended by Prof. Effiong.');
      return;
    }

    setCurrentUser(user);
    setViewState('portal');
    setActiveTab('dashboard');
    setSelectedReport(null);
  };

  const handleRegister = (data: any) => {
    const newUser: User = {
      id: 'u_' + Math.floor(Math.random() * 1000),
      ...data,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setViewState('portal');
    setActiveTab('dashboard');
    setSelectedReport(null);

    // Append welcome audit & notification
    const welcomeNot: Notification = {
      id: 'not_' + Math.floor(Math.random() * 1000),
      title: 'Welcome to UNICROSS OCWMS!',
      message: `Profile activated successfully under Matric ${newUser.matricNumber || 'Direct'}. Start reporting trash.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    setNotifications(prev => [welcomeNot, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('landing');
  };

  // Immediate Sandbox Profile Swapper panel
  const handleToggleRoleBypass = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      // Direct email fallback trigger
      handleLogin(MOCK_EMAILS[role], role);
    }
    setActiveTab('dashboard');
    setSelectedReport(null);
  };

  // STUDENT TRIGGERS: Submit Report with automated alert logs and GPS
  const handleAddReport = (data: any) => {
    if (!currentUser) return;
    
    const newReportId = 'R-' + Math.floor(1000 + Math.random() * 9000);
    const newReport: WasteReport = {
      id: newReportId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: 'Pending',
      dateSubmitted: new Date().toISOString(),
      comments: [],
      ...data
    };

    setReports(prev => [newReport, ...prev]);

    // Create system notification
    const newNotification: Notification = {
      id: 'not_' + Math.floor(Math.random() * 1000),
      title: `${data.category} Incident Reported`,
      message: `Filing ${newReportId} registered at ${data.location.faculty} of urgency level ${data.priority}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info'
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Create system activity log
    const newLog: ActivityLog = {
      id: 'log_' + Math.floor(Math.random() * 1000),
      action: 'New Report Filed',
      user: currentUser.name,
      role: 'Student',
      timestamp: new Date().toISOString(),
      details: `Filed R-${newReportId} (${data.category}) near ${data.location.building} building.`
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // STAFF & ADMIN: Update Status (Assigned ➜ In Progress ➜ Completed)
  const handleUpdateStatus = (reportId: string, status: ReportStatus, resolutionImage?: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const updated = { 
          ...r, 
          status, 
          completionImageUrl: resolutionImage || r.completionImageUrl 
        };
        // If timber selector is drilldown previewing, synchronize details
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      }
      return r;
    }));

    // Find the student reporter to trigger localized completed notifications
    const targetRep = reports.find(r => r.id === reportId);
    if (targetRep) {
      if (status === 'Completed') {
        const compNot: Notification = {
          id: 'not_' + Math.floor(Math.random() * 1000),
          title: `Cleanup Completed (Case ${reportId})`,
          message: `Your reported incident regarding ${targetRep.category} at ${targetRep.location.faculty} is fully cleared.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'success'
        };
        setNotifications(prev => [compNot, ...prev]);
      }

      // Add audit log
      const statusLog: ActivityLog = {
        id: 'log_' + Math.floor(Math.random() * 1000),
        action: 'Status Completed',
        user: currentUser?.name || 'Sanitation Collector',
        role: currentUser?.role || 'Staff',
        timestamp: new Date().toISOString(),
        details: `Marked case ${reportId} (${targetRep.category}) as ${status}.`
      };
      setActivityLogs(prev => [statusLog, ...prev]);
    }
  };

  // ADMIN: Dispatch / Assign environmental staff
  const handleAssignStaff = (reportId: string, staffId: string, staffName: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const updated: WasteReport = { 
          ...r, 
          assignedStaffId: staffId, 
          assignedStaffName: staffName, 
          status: 'Assigned' 
        };
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      }
      return r;
    }));

    // Dispatched alert notifications
    const assignNot: Notification = {
      id: 'not_' + Math.floor(Math.random() * 1000),
      title: 'New Dispatch Assignment',
      message: `Admin Prof. Effiong allocated pickup case ${reportId} to your environmental unit stack.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info'
    };
    setNotifications(prev => [assignNot, ...prev]);

    // System audit log
    const assignLog: ActivityLog = {
      id: 'log_' + Math.floor(Math.random() * 1000),
      action: 'Task Assigned',
      user: currentUser?.name || 'Administrator',
      role: 'Admin',
      timestamp: new Date().toISOString(),
      details: `Dispatched R-${reportId} environmental case to field officer ${staffName}.`
    };
    setActivityLogs(prev => [assignLog, ...prev]);
  };

  // BOTH USER & ADMIN: Comments Thread Additions
  const handleAddComment = (reportId: string, text: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: 'c_' + Math.floor(Math.random() * 1000),
      author: currentUser.name,
      authorRole: currentUser.role,
      content: text,
      timestamp: new Date().toISOString()
    };

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const updated = { ...r, comments: [...r.comments, newComment] };
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      }
      return r;
    }));
  };

  // ADMIN DIRECTORY MANAGEMENT CONTROLS
  const handleUpdateUserStatus = (userId: string, status: User['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const handleUpdateUserRole = (userId: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // SETTINGS UPDATES
  const handleUpdateProfile = (updatedData: any) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    // Sync into user tree
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
  };

  // MOCK DATA EXPORTS SIMULATORS
  const triggerMockExport = (format: 'PDF' | 'Excel') => {
    setExportBanner(`Exporting university sanitation registry files in .${format === 'PDF' ? 'pdf' : 'xlsx'} format...`);
    setTimeout(() => {
      setExportBanner(null);
      alert(`Download complete: UNICROSS_Sanitation_Manifest_${new Date().getFullYear()}.${format === 'PDF' ? 'pdf' : 'xlsx'}`);
    }, 2800);
  };

  // Calculation of unread alerts Count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Active Notifications clear clicks
  const clearNotificationsCount = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filtering for reports History Archive Page
  const getFilteredHistoryList = () => {
    return reports.filter(rep => {
      // 1. Roll restriction: student can only inspect their own history
      const roleRestricts = currentUser?.role === 'student' ? rep.studentId === currentUser.id : true;
      
      // 2. Keyword Search
      const textMatches = rep.description.toLowerCase().includes(histSearch.toLowerCase()) || 
                          rep.location.faculty.toLowerCase().includes(histSearch.toLowerCase()) ||
                          rep.location.building.toLowerCase().includes(histSearch.toLowerCase()) ||
                          rep.id.toLowerCase().includes(histSearch.toLowerCase());
      
      // 3. Category selector
      const catMatches = histCategory === 'all' ? true : rep.category === histCategory;

      // 4. Status selector
      const statusMatches = histStatus === 'all' ? true : rep.status === histStatus;

      return roleRestricts && textMatches && catMatches && statusMatches;
    });
  };

  const activeHistoryList = getFilteredHistoryList();

  return (
    <div>
      
      {/* 1. LANDING MARKETING GREETING VIEW */}
      {viewState === 'landing' && (
        <LandingPage 
          onNavigateToLogin={() => { setViewState('auth'); setAuthMode('login'); }}
          onNavigateToRegister={() => { setViewState('auth'); setAuthMode('register'); }}
          onQuickLogin={(role) => {
            handleLogin(MOCK_EMAILS[role], role);
          }}
        />
      )}

      {/* 2. SECURITY AUTH CREDENTIALS VIEW */}
      {viewState === 'auth' && (
        <AuthScreens
          mode={authMode}
          onSwitchMode={setAuthMode}
          onLogin={(email, role) => handleLogin(email, role)}
          onRegister={(data) => handleRegister(data)}
          onBackToLanding={() => setViewState('landing')}
        />
      )}

      {/* 3. VERIFIED PORTAL WORKSPACE CONTAINER */}
      {viewState === 'portal' && currentUser && (
        <DashboardLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setSelectedReport(null); // Clear active detail scopes
          }}
          unreadNotificationsCount={unreadNotificationsCount}
          onToggleRoleBypass={handleToggleRoleBypass}
        >
          
          {/* Timeline Details page expansion */}
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
            
            // Core Tab router selections
            <>
              {/* PORTAL TAB: STUDENT ECO-DASHBOARD */}
              {activeTab === 'dashboard' && currentUser.role === 'student' && (
                <UserDashboard
                  reports={reports}
                  currentUser={currentUser}
                  onNavigateTab={setActiveTab}
                  onSelectReport={setSelectedReport}
                />
              )}

              {/* PORTAL TAB: STAFF OPERATIONS DASHBOARD */}
              {activeTab === 'dashboard' && currentUser.role === 'staff' && (
                <StaffDashboard
                  reports={reports}
                  currentUser={currentUser}
                  onUpdateStatus={handleUpdateStatus}
                  onSelectReport={setSelectedReport}
                />
              )}

              {/* PORTAL TAB: ADMIN SUPERVISORY OVERVIEW */}
              {activeTab === 'dashboard' && currentUser.role === 'admin' && (
                <AdminDashboard
                  reports={reports}
                  users={users}
                  activityLogs={activityLogs}
                  onSelectReport={setSelectedReport}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  onUpdateUserRole={handleUpdateUserRole}
                  onDeleteUser={handleDeleteUser}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* PORTAL TAB: DISPATCH / REPORT NEW INCIDENT */}
              {activeTab === 'report-waste' && (
                <ReportForm
                  onSubmitReport={handleAddReport}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* PORTAL TAB: MY SUBMISSIONS INCIDENTS (For Student only) */}
              {activeTab === 'my-reports' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Reported Waste Spots</h2>
                    <p className="text-sm text-slate-500 mt-1">Review, monitor response times, and chat with assigned sanitary crews regarding filed cases.</p>
                  </div>

                  <UserDashboard
                    reports={reports}
                    currentUser={currentUser}
                    onNavigateTab={setActiveTab}
                    onSelectReport={setSelectedReport}
                  />
                </div>
              )}

              {/* PORTAL TAB: COMMUNICATIONS / NOTIFICATION CARD FEED */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 text-left max-w-4xl">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Circular Notifications</h2>
                      <p className="text-sm text-slate-500 mt-1">In-app notifications concerning student reported cases and supervisor directives.</p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        id="btn-mark-all-read"
                        onClick={clearNotificationsCount}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition"
                      >
                        Mark All as Read✓
                      </button>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    {notifications.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 gap-1 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col items-center">
                        <Bell className="h-10 w-10 opacity-75 mx-auto" strokeWidth={1} />
                        <p className="font-extrabold text-sm">No new alert issues</p>
                      </div>
                    ) : (
                      notifications.map((not) => (
                        <div 
                          key={not.id}
                          className={`
                            p-4 rounded-2xl border flex gap-4 text-xs items-start transition duration-150 relative bg-white
                            ${not.read ? 'border-slate-100 opacity-65' : 'border-green-150 ring-1 ring-green-100'}
                          `}
                        >
                          <span className={`
                            w-2.5 h-2.5 rounded-full shrink-0 mt-1.5
                            ${not.type === 'success' ? 'bg-green-500' :
                              not.type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}
                          `} />
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                              {new Date(not.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <p className="font-black text-slate-800 text-sm leading-none">{not.title}</p>
                            <p className="text-slate-500 font-medium leading-relaxed mt-1">{not.message}</p>
                          </div>

                          {!not.read && (
                            <span className="absolute top-4 right-4 bg-green-500/10 text-green-700 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                              Unread Badge
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PORTAL TAB: HISTORY & EXPORT ARCHIVES SPREADSHEETS */}
              {activeTab === 'history' && (
                <div className="space-y-6 text-left">
                  
                  {/* Title and Download CTA Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Incidents Registry & Archive</h2>
                      <p className="text-sm text-slate-500 mt-1">Durable query system mapping comprehensive campus sanitation files.</p>
                    </div>

                    <div className="flex gap-2.5 text-xs font-bold">
                      <button
                        id="btn-export-pdf"
                        onClick={() => triggerMockExport('PDF')}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition flex items-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        Export to PDF Document
                      </button>
                      
                      <button
                        id="btn-export-excel"
                        onClick={() => triggerMockExport('Excel')}
                        className="px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 rounded-xl shadow-sm transition flex items-center gap-1.5"
                      >
                        <FileText className="h-4 w-4 text-green-600" />
                        Export to Excel Spreadsheet
                      </button>
                    </div>
                  </div>

                  {exportBanner && (
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-xs font-bold animate-pulse">
                      {exportBanner}
                    </div>
                  )}

                  {/* Filter Toolbar components */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    <div className="md:col-span-6 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="history-search-input"
                        type="text"
                        placeholder="Search archives by keywords, ID, faculty, landmarks..."
                        value={histSearch}
                        onChange={(e) => setHistSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <select
                        id="history-filter-category"
                        value={histCategory}
                        onChange={(e) => setHistCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold text-slate-500"
                      >
                        <option value="all">👁 All Materials Categories</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Glass">Glass</option>
                        <option value="Organic">Organic</option>
                        <option value="Paper">Paper</option>
                        <option value="Metal">Metal</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Mixed Waste">Mixed Waste</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select
                        id="history-filter-status"
                        value={histStatus}
                        onChange={(e) => setHistStatus(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-green-500 font-semibold text-slate-500"
                      >
                        <option value="all">👁 All Status Flags</option>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                  </div>

                  {/* List Spreadsheet Results */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    {activeHistoryList.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-bold space-y-1">
                        <p className="text-sm">No matched registry items</p>
                        <p className="text-xs font-medium text-slate-400">Expand your search keywords or disable filter parameters.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                              <th className="py-3 px-4">REGISTRY ID</th>
                              <th className="py-3 px-4">INCIDENT MATERIAL</th>
                              <th className="py-3 px-4">LOCATION DETAIL</th>
                              <th className="py-3 px-4">URGENCY LEVEL</th>
                              <th className="py-3 px-4">CHUTE STATUS</th>
                              <th className="py-3 px-4 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeHistoryList.map((rep) => (
                              <tr key={rep.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                <td className="py-4 px-4 font-mono font-bold text-slate-650">{rep.id}</td>
                                <td className="py-4 px-4 text-left">
                                  <div className="flex items-center gap-3">
                                    <img src={rep.imageUrl} alt="inc" className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0" />
                                    <div className="truncate">
                                      <p className="font-bold text-slate-800">{rep.category}</p>
                                      <p className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">{rep.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-700">
                                  {rep.location.faculty} ({rep.location.building})
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`
                                    px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                                    ${rep.priority === 'Emergency' ? 'bg-red-50 text-red-650 animate-pulse' :
                                      rep.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                                      rep.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                                  `}>
                                    {rep.priority}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`
                                    px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider
                                    ${rep.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                      rep.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 animate-pulse' :
                                      rep.status === 'Assigned' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-705'}
                                  `}>
                                    {rep.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button
                                    id={`history-btn-detail-${rep.id}`}
                                    onClick={() => setSelectedReport(rep)}
                                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-lg transition"
                                  >
                                    View Timeline
                                  </button>
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

              {/* PORTAL TAB: CONFIGURATION / SETTINGS */}
              {activeTab === 'settings' && (
                <SettingsScreen
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </>

          )}

        </DashboardLayout>
      )}

    </div>
  );
}
