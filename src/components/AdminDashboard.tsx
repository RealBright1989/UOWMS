import React, { useState } from 'react';
import { 
  Users, ClipboardList, ShieldAlert, CheckCircle2, Search, 
  Filter, MapPin, Trash2, Edit2 
} from 'lucide-react';
import { WasteReport, User, ActivityLog, WASTE_CATEGORIES } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

interface AdminDashboardProps {
  reports: WasteReport[];
  users: User[];
  activityLogs: ActivityLog[];
  onSelectReport: (report: WasteReport) => void;
  onUpdateUserStatus: (userId: string, newStatus: User['status']) => void;
  onUpdateUserRole: (userId: string, newRole: User['role']) => void;
  onDeleteUser: (userId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function AdminDashboard({
  reports,
  users,
  activityLogs,
  onSelectReport,
  onUpdateUserStatus,
  onUpdateUserRole,
  onDeleteUser,
  onNavigateTab
}: AdminDashboardProps) {
  
  // Local sub-tabs
  const [adminSubTab, setAdminSubTab] = useState<'analytics' | 'user-manager' | 'activities'>('analytics');
  
  // User Manager states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'staff' | 'admin'>('all');

  // KPI Calculations based on real list counts
  const totalUsersCount = users.length;
  const staffMembersCount = users.filter(u => u.role === 'staff').length;
  const totalReportsCount = reports.length;
  const completedCollectionsCount = reports.filter(r => r.status === 'Completed').length;
  const activeJobsCount = reports.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
  
  // Charts preparation
  const categories = WASTE_CATEGORIES;
  const colors = ['#10B981', '#3B82F6', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];
  
  const categoryChartData = categories.map((cat, i) => {
    const count = reports.filter(r => r.category === cat).length;
    return { name: cat, count, fill: colors[i] };
  });

  // Weekly counts mock
  const monthlyTimelineData = [
    { name: 'Week 1', Reports: 12, Completed: 10 },
    { name: 'Week 2', Reports: 25, Completed: 18 },
    { name: 'Week 3', Reports: 18, Completed: 14 },
    { name: 'Week 4', Reports: totalReportsCount, Completed: completedCollectionsCount }
  ];

  // Status pie chart
  const statusData = [
    { name: 'Completed', value: completedCollectionsCount, color: '#16A34A' },
    { name: 'Pending', value: reports.filter(r => r.status === 'Pending').length, color: '#F59E0B' },
    { name: 'Assigned', value: reports.filter(r => r.status === 'Assigned').length, color: '#3B82F6' },
    { name: 'In Progress', value: reports.filter(r => r.status === 'In Progress').length, color: '#8B5CF6' }
  ].filter(item => item.value > 0);

  // Top waste locations count
  const locationsMap: { [key: string]: number } = {};
  reports.forEach(r => {
    locationsMap[r.location.faculty] = (locationsMap[r.location.faculty] || 0) + 1;
  });
  const topLocations = Object.keys(locationsMap).map(facName => ({
    name: facName,
    count: locationsMap[facName]
  })).sort((a,b) => b.count - a.count);

  // User management filtering
  const filteredUsers = users.filter(usr => {
    const matchesSearch = usr.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (usr.matricNumber && usr.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' ? true : usr.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Top operational metrics overview banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">University Sanitation Control Center</h2>
          <p className="text-sm text-slate-500">Board administrative view managing active sweepers, student directories, and waste analytics.</p>
        </div>

        {/* Local Admin Views switch controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs text-slate-700 font-bold">
          <button
            id="admin-tab-analytics"
            onClick={() => setAdminSubTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-all ${adminSubTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Sanitation Analytics
          </button>
          <button
            id="admin-tab-users"
            onClick={() => setAdminSubTab('user-manager')}
            className={`px-4 py-2 rounded-lg transition-all ${adminSubTab === 'user-manager' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            User Directory ({totalUsersCount})
          </button>
          <button
            id="admin-tab-activities"
            onClick={() => setAdminSubTab('activities')}
            className={`px-4 py-2 rounded-lg transition-all ${adminSubTab === 'activities' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            System Audit logs
          </button>
        </div>
      </div>

      {/* KPI Top level metrics metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Users</span>
            <Users className="h-4.5 w-4.5 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{totalUsersCount}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Students + Field Staff</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Field Crew</span>
            <Users className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{staffMembersCount}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Dispatched truck staff</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Reports</span>
            <ClipboardList className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{totalReportsCount}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Filings across semesters</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Resolutions</span>
            <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{completedCollectionsCount}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Successfully clean restored</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Active Trucks</span>
            <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{activeJobsCount}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Jobs in current queue</p>
        </div>

      </div>

      {/* RENDER ANALYTICS TAB */}
      {adminSubTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Main big graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Area trend line */}
            <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Operations Timeline</span>
                <h3 className="text-base font-black text-slate-800">Monthly Disposal Timeline</h3>
                <p className="text-xs text-slate-400">Cumulative reports vs success resolutions index.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTimelineData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="Reports" stroke="#EF4444" fillOpacity={0.05} fill="url(#colorReports)" />
                    <Area type="monotone" dataKey="Completed" stroke="#10B981" fillOpacity={0.08} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status distribution */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Status allocation map</span>
                <h3 className="text-base font-black text-slate-800">Campus Queue Dispersion</h3>
                <p className="text-xs text-slate-400">Operational tasks segmented by on-site progress.</p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-50 pt-3">
                {statusData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-500">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Categories bar + Top locations bento rows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category breakdown bar chart */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Materials segregation metrics</span>
                <h3 className="text-base font-black text-slate-800">Audit by Waste Category</h3>
                <p className="text-xs text-slate-400">Total volume filed per materials categorization.</p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={24}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Waste Locations list */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-left">
              <div>
                <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Incident Geography clusters</span>
                <h3 className="text-base font-black text-slate-800">Top Waste Faculty Landmarks</h3>
                <p className="text-xs text-slate-400">Hotspots requiring systemic bin installations.</p>
              </div>

              <div className="space-y-3 pt-2">
                {topLocations.length === 0 ? (
                  <p className="text-xs text-slate-400">No active incidents charted yet.</p>
                ) : (
                  topLocations.slice(0, 4).map((loc, idx) => {
                    const ratio = Math.min(100, (loc.count / reports.length) * 100);

                    return (
                      <div key={idx} className="space-y-1.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 transition duration-150 rounded-xl">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-rose-500" />
                            {loc.name}
                          </span>
                          <span className="font-black text-slate-900 font-mono text-[10px]">{loc.count} Reports</span>
                        </div>
                        
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${ratio}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Simple Recent Incidents Board Quick access */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Live board feeds</span>
              <h3 className="text-base font-black text-slate-800">Latest Campus Filings</h3>
              <p className="text-xs text-slate-400">Most recent student submissions ready for evaluation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.slice(0, 4).map((rep) => (
                <div 
                  key={rep.id} 
                  id={`recent-report-card-${rep.id}`}
                  onClick={() => onSelectReport(rep)}
                  className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100/50 hover:border-slate-350 rounded-2xl cursor-pointer transition flex justify-between items-start"
                >
                  <div className="flex items-start gap-3">
                    <img src={rep.imageUrl} alt="inc" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 shadow-sm" />
                    <div className="text-left space-y-0.5 max-w-[200px]">
                      <span className="text-[9px] font-mono font-bold text-slate-400">ID: {rep.id} • {rep.category}</span>
                      <p className="text-xs font-bold text-slate-800 truncate">{rep.description}</p>
                      <span className="text-[10px] text-slate-500 font-medium block flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                        {rep.location.faculty} ({rep.location.building})
                      </span>
                    </div>
                  </div>

                  <span className={`
                    px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0
                    ${rep.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      rep.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}
                  `}>
                    {rep.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RENDER USER MANAGEMENT TAB */}
      {adminSubTab === 'user-manager' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4">
            <div>
              <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">System Accounts Directory</span>
              <h3 className="text-lg font-black text-slate-800">University Roster Directory</h3>
              <p className="text-xs text-slate-500">Edit, suspend, delete, or promote student reporters and environment field staff.</p>
            </div>
          </div>

          {/* Search bar + filter toolbar */}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="search-user-bar"
                type="text"
                placeholder="Search by full name, email address, or Matric number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none transition font-semibold"
              />
            </div>
            
            <select
              id="filter-role-selector"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none font-semibold text-slate-700"
            >
              <option value="all">👁 All Directory Roles</option>
              <option value="student">Student Residences</option>
              <option value="staff">Field Sanitation Staff</option>
              <option value="admin">System Supervisor Board</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">UNICROSS USER MEMBER</th>
                  <th className="py-3 px-4">CONTACT DIRECTORY</th>
                  <th className="py-3 px-4">ROLE LEVEL</th>
                  <th className="py-3 px-4">HOSTEL / UNIT DETAILS</th>
                  <th className="py-3 px-4">ACCOUNT STATUS</th>
                  <th className="py-3 px-4 text-right">SYSTEM ACTION DRIVES</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={usr.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                          alt="usr av" 
                          className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0" 
                        />
                        <div className="text-left text-xs">
                          <p className="font-extrabold text-slate-800">{usr.name}</p>
                          <p className="text-slate-400 text-[10px] font-mono leading-none mt-0.5">
                            {usr.matricNumber || 'STAFF_ID_VERIFIED'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-left">
                      <p className="font-bold text-slate-700">{usr.email}</p>
                      <p className="text-slate-400 text-[10px] leading-none mt-0.5">{usr.phoneNumber || 'Not mapped'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        id={`role-modify-${usr.id}`}
                        value={usr.role}
                        onChange={(e) => onUpdateUserRole(usr.id, e.target.value as any)}
                        className="py-1 px-2.5 bg-slate-50 border border-slate-150 rounded-lg text-[10.5px] font-bold transition focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Supervisor</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-left font-semibold text-slate-600">
                      {usr.role === 'student' ? (
                        <div>
                          <p>{usr.hostel}</p>
                          <p className="text-[10px] text-slate-400">{usr.faculty} ({usr.department})</p>
                        </div>
                      ) : (
                        <p>{usr.department || 'Envir. services teams'}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        id={`status-modify-${usr.id}`}
                        value={usr.status}
                        onChange={(e) => onUpdateUserStatus(usr.id, e.target.value as any)}
                        className={`
                          py-1 px-2 rounded-lg text-[10.5px] font-black uppercase tracking-wider focus:outline-none
                          ${usr.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-150' : 
                            usr.status === 'Suspended' ? 'bg-red-50 text-red-700 border border-red-150' : 'bg-amber-50 text-amber-700'}
                        `}
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        id={`action-suspend-user-${usr.id}`}
                        onClick={() => onUpdateUserStatus(usr.id, usr.status === 'Suspended' ? 'Active' : 'Suspended')}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition ${usr.status === 'Suspended' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
                      >
                        {usr.status === 'Suspended' ? 'Activate' : 'Suspend'}
                      </button>
                      <button
                        id={`action-delete-user-${usr.id}`}
                        onClick={() => {
                          if (confirm(`Remove ${usr.name} from directory permanently?`)) {
                            onDeleteUser(usr.id);
                          }
                        }}
                        className="p-1 px-2.5 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER SYSTEM AUDIT LOGS TAB */}
      {adminSubTab === 'activities' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Operations telemetry log</span>
            <h3 className="text-lg font-black text-slate-800">Operational System Audit</h3>
            <p className="text-xs text-slate-500">Continuous telemetry registering report dispatches, cleanup resolutions and status edits.</p>
          </div>

          <div className="space-y-3 pt-2">
            {activityLogs.map((log) => {
              const matchesAction = log.action === 'Emergency Dispatch' || log.action === 'Status Completed' || log.action === 'New Report Created';
              return (
                <div key={log.id} className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between border border-slate-100 text-xs">
                  <div className="flex items-center gap-3.5">
                    <span className={`
                      w-2 h-2 rounded-full shrink-0
                      ${log.action === 'Emergency Dispatch' ? 'bg-red-500 animate-pulse' : 
                        log.action === 'Status Completed' ? 'bg-green-500' : 'bg-blue-500'}
                    `} />
                    <div className="text-left">
                      <span className="font-extrabold text-slate-800">{log.action}: </span>
                      <span className="text-slate-600 font-medium">{log.details}</span>
                      <p className="text-[10px] text-slate-400 leading-none mt-1">
                        Triggered by {log.user} ({log.role})
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono font-bold">
                    {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
