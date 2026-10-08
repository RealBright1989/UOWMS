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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const MOCK_EMAILS: Record<UserRole, string> = {
  student: 'brightokon444@gmail.com',
  staff: 'emeka.obi@unicross.edu.ng',
  admin: 'florence.effiong@unicross.edu.ng'
};

export const ROLE_PATHS: Record<UserRole, string> = {
  student: '/portal/student',
  staff: '/portal/staff',
  admin: '/portal/admin'
};

export function pathToRole(path: string): UserRole | null {
  const segments = path.replace(/\/+$/, '').split('/').filter(Boolean);
  if (segments[0] === 'portal' && segments[1] && ['student', 'staff', 'admin'].includes(segments[1])) {
    return segments[1] as UserRole;
  }
  return null;
}

export default function App() {
  const [portalRole, setPortalRole] = useState<UserRole | null>(() => pathToRole(window.location.pathname));
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'portal'>(
    () => (pathToRole(window.location.pathname) ? 'auth' : 'landing')
  );
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

  const goToPortal = (role: UserRole, mode: 'login' | 'register' = 'login') => {
    window.history.pushState({}, '', ROLE_PATHS[role]);
    setPortalRole(role);
    setAuthMode(role === 'student' ? mode : 'login');
    setViewState('auth');
  };

  const goToLanding = () => {
    window.history.pushState({}, '', '/');
    setPortalRole(null);
    setViewState('landing');
  };

  // Keep the browser back/forward buttons working across portals.
  useEffect(() => {
    const onPopState = () => {
      const role = pathToRole(window.location.pathname);
      setPortalRole(role);
      if (!role) {
        setViewState('landing');
        return;
      }
      setAuthMode('login');
      setCurrentUser(prev => (prev && prev.role !== role ? null : prev));
      setViewState('portal');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setPortalRole(currentUser.role);
      window.history.pushState({}, '', ROLE_PATHS[currentUser.role]);
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

  // Live sync: poll the server so a job assigned elsewhere shows up in the
  // staff portal (and admin/student views) without a manual reload.
  useEffect(() => {
    const refresh = async () => {
      try {
        const [reps, usrs, nots, lgs] = await Promise.all([
          api.getReports(),
          api.getUsers(),
          api.getNotifications(),
          api.getLogs(),
        ]);
        setReports(reps);
        setUsers(usrs);
        setNotifications(nots);
        setActivityLogs(lgs);
        setSelectedReport(prev => (prev ? (reps.find(r => r.id === prev.id) ?? prev) : prev));
      } catch {
        /* transient network error - keep last known state */
      }
    };
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  // History filters
  const [histSearch, setHistSearch] = useState('');
  const [histCategory, setHistCategory] = useState<string>('all');
  const [histStatus, setHistStatus] = useState<string>('all');
  const [exportBanner, setExportBanner] = useState<string | null>(null);

  // AUTH
  const handleLogin = async (email: string, role: UserRole) => {
    if (portalRole && role !== portalRole) {
      alert(`This is the ${portalRole} portal. Please sign in from the correct portal.`);
      return;
    }
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
    if (portalRole && portalRole !== 'student') {
      alert('Registration is only available on the Student portal.');
      return;
    }
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
    localStorage.removeItem('unicross_ocwms_active_user');
    window.history.pushState({}, '', '/');
    setPortalRole(null);
    setViewState('landing');
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
  const exportRows = () => {
    return activeHistoryList.map(rep => ({
      id: rep.id,
      category: rep.category,
      location: `${rep.location.faculty} - ${rep.location.building}`,
      description: rep.description,
      priority: rep.priority,
      status: rep.status,
      reporter: rep.studentName,
      date: new Date(rep.dateSubmitted).toLocaleDateString()
    }));
  };

  const buildSanitationPdf = (rows: ReturnType<typeof exportRows>) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;
    const CW = W - M * 2;

    const CATEGORY_COLORS: Record<string, [number, number, number]> = {
      Plastic: [34, 197, 94], Glass: [168, 85, 247], Organic: [180, 83, 9],
      Paper: [37, 99, 235], Metal: [107, 114, 128], Electronic: [239, 68, 68], 'Mixed Waste': [13, 148, 136]
    };
    const grey: [number, number, number] = [100, 116, 139];
    const dark: [number, number, number] = [15, 23, 42];

    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = String(text).split(' ');
      const lines: string[] = [];
      let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (doc.getTextWidth(test) > maxWidth && line) {
          lines.push(line);
          line = word;
        } else line = test;
      }
      if (line) lines.push(line);
      return lines.length ? lines : [''];
    };

    // ── Header ──
    let y = 16;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, 30, 'F');
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 30, W, 1.6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('UNIVERSITY OF CROSS RIVER STATE', W / 2, 11, { align: 'center' });
    doc.setFontSize(16);
    doc.text('CAMPUS WASTE MANAGEMENT SYSTEM', W / 2, 18, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Incidents Registry & Archive Report', W / 2, 24, { align: 'center' });

    y = 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text('Report Summary', M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grey);
    const generated = `Generated: ${new Date().toLocaleString()}`;
    doc.text(generated, W - M, y, { align: 'right' });
    y += 6;

    const statusMap = new Map<string, number>();
    rows.forEach(r => statusMap.set(r.status, (statusMap.get(r.status) || 0) + 1));
    const statuses = ['Pending', 'Assigned', 'In Progress', 'Completed'];
    const counts = statuses.map(s => ({ s, c: statusMap.get(s) || 0 }));
    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [['Total Records', ...statuses.map(s => `${s} (${statusMap.get(s) || 0})`)]],
      body: [[String(rows.length), ...counts.map(ct => `${Math.round((ct.c / (rows.length || 1)) * 100)}%`)]],
      theme: 'grid',
      styles: { fontSize: 9, halign: 'center', textColor: dark, lineColor: [226, 232, 240], lineWidth: 0.2 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // ── Record cards ──
    if (rows.length === 0) {
      doc.setFontSize(11);
      doc.setTextColor(...grey);
      doc.text('No archive records to export.', W / 2, 80, { align: 'center' });
    }

    let page = 1;
    const pageFooter = () => {
      const total = doc.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...grey);
      doc.text(`UNICROSS OCWMS  |  Page ${page} of ${total}`, W / 2, H - 8, { align: 'center' });
    };

    for (const r of rows) {
      const catCol = CATEGORY_COLORS[r.category] || CATEGORY_COLORS['Mixed Waste'];
      const cardH = 44;

      // page break check
      if (y + cardH > H - 18) {
        pageFooter();
        doc.addPage();
        page++;
        y = 18;
      }

      // ── Card band ──
      doc.setFillColor(...dark);
      doc.roundedRect(M, y, CW, 9, 1.2, 1.2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(r.id, M + 4, y + 6);
      doc.setFontSize(8.5);
      doc.text(`Priority: ${r.priority}`, M + 45, y + 6);
      // category chip
      doc.setFillColor(...catCol);
      doc.roundedRect(W - M - 52, y + 1.5, 48, 6, 1, 1, 'F');
      doc.setFontSize(8.5);
      doc.text(r.category.toUpperCase(), W - M - 28, y + 5.7, { align: 'center' });
      y += 9;

      // ── Card body ──
      const bodyLeft = M;
      const colW = CW / 2 - 3;
      const paintPair = (label: string, value: string, x: number, yy: number, w: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...grey);
        doc.text(label.toUpperCase(), x, yy);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const wrapped = wrapText(value, w);
        wrapped.slice(0, 2).forEach((ln, i) => doc.text(ln, x, yy + 4.5 + i * 4.2));
        return Math.max(0, wrapped.length - 2);
      };

      const overflowL1 = paintPair('Location', r.location, bodyLeft, y + 5, colW - 2);
      const overflowL2 = paintPair('Reported By', r.reporter, bodyLeft + colW + 6, y + 5, colW - 2);
      const overflowL3 = paintPair('Submitted', r.date, bodyLeft, y + 16, colW - 2);
      const overflowL4 = paintPair('Status', r.status, bodyLeft + colW + 6, y + 16, colW - 2);
      const maxOverflow = Math.max(overflowL1, overflowL2, overflowL3, overflowL4);

      const descY = y + 27 + maxOverflow * 4.2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...grey);
      doc.text('DESCRIPTION', bodyLeft, descY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...dark);
      const descLines = wrapText(r.description, CW - 4).slice(0, 3);
      descLines.forEach((ln, i) => doc.text(ln, bodyLeft, descY + 4.5 + i * 4.2));

      const right = M + CW;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(M, descY + 16.5 + (descLines.length - 1) * 4.2, right, descY + 16.5 + (descLines.length - 1) * 4.2);

      y = descY + 18 + (descLines.length - 1) * 4.2;
    }

    pageFooter();
    doc.save(`UNICROSS_Sanitation_Manifest_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const triggerExport = (format: 'PDF' | 'Excel') => {
    const rows = exportRows();
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'PDF') {
      buildSanitationPdf(rows);
    } else {
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [{ wch: 10 }, { wch: 14 }, { wch: 28 }, { wch: 40 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 12 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sanitation Records');
      XLSX.writeFile(wb, `UNICROSS_Sanitation_Manifest_${stamp}.xlsx`);
    }
    setExportBanner(`Downloaded ${rows.length} record(s) as .${format === 'PDF' ? 'pdf' : 'xlsx'}`);
    setTimeout(() => setExportBanner(null), 4000);
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
          onNavigateToLogin={() => goToPortal('student', 'login')}
          onNavigateToRegister={() => goToPortal('student', 'register')}
          onQuickLogin={(role) => goToPortal(role, 'login')}
        />
      )}

      {viewState === 'auth' && (
        <AuthScreens
          mode={authMode}
          portalRole={portalRole || 'student'}
          onChangePortal={goToPortal}
          onSwitchMode={setAuthMode}
          onLogin={(email, role) => handleLogin(email, role)}
          onRegister={(data) => handleRegister(data)}
          onBackToLanding={goToLanding}
        />
      )}

      {viewState === 'portal' && currentUser && (
        <DashboardLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          onNavigateTab={(tab) => { setActiveTab(tab); setSelectedReport(null); }}
          unreadNotificationsCount={unreadNotificationsCount}
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
                      <button onClick={() => triggerExport('PDF')} className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition flex items-center gap-1.5"><Download className="h-4 w-4" /> Export PDF</button>
                      <button onClick={() => triggerExport('Excel')} className="px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 rounded-xl shadow-sm transition flex items-center gap-1.5"><FileText className="h-4 w-4 text-green-600" /> Export Excel</button>
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
