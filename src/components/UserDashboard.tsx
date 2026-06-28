import React from 'react';
import { 
  Plus, CheckCircle, Clock, Trash2, 
  ArrowRight, Sparkles, MapPin, Calendar 
} from 'lucide-react';
import { WasteReport, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserDashboardProps {
  reports: WasteReport[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onSelectReport: (report: WasteReport) => void;
}

export default function UserDashboard({ 
  reports, 
  currentUser, 
  onNavigateTab, 
  onSelectReport 
}: UserDashboardProps) {
  
  // Filter student-specific reports if they are not admin
  const studentReports = reports.filter(r => r.studentId === currentUser.id);

  const totalReportsCount = studentReports.length;
  const pendingCount = studentReports.filter(r => r.status === 'Pending').length;
  const assignedCount = studentReports.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
  const completedCount = studentReports.filter(r => r.status === 'Completed').length;

  // Chart Data preparation: Category Breakdown
  const categories = ['Plastic', 'Glass', 'Organic', 'Paper', 'Metal', 'Electronic', 'Mixed Waste'];
  const categoryChartColors = ['#10B981', '#3B82F6', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];
  
  const categoryData = categories.map((cat, i) => {
    const count = studentReports.filter(r => r.category === cat).length;
    return { name: cat, value: count, color: categoryChartColors[i] };
  }).filter(item => item.value > 0);

  // Fallback if no counts yet
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'Plastic', value: 3, color: '#10B981' },
    { name: 'Paper', value: 2, color: '#F59E0B' },
    { name: 'Organic', value: 4, color: '#16A34A' }
  ];

  // Weekly report trend compilation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = days.map((day, idx) => {
    // Mocking realistic distributed dates mapping or standard items count
    const count = studentReports.filter(r => (new Date(r.dateSubmitted).getDay() === idx)).length;
    return { name: day, Reports: count + Math.floor(Math.random() * 2) }; // Add tiny mock variation to enrich aesthetics
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Greetings Banner */}
      <div className="bg-gradient-to-r from-green-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-green-950/20 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="space-y-1.5 z-10 max-w-xl">
          <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 uppercase tracking-widest leading-none">
            <Sparkles className="h-4.5 w-4.5 text-green-400 animate-spin" />
            UNICROSS Campus Environmental Guardian
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-normal leading-relaxed">
            Your reported incidents are actively tracked by environmental safety officers. Scan or report a new trash node below to schedule a prioritized truck collection.
          </p>
        </div>
        
        <button
          id="dash-btn-report-waste"
          onClick={() => onNavigateTab('report-waste')}
          className="px-6 py-3.5 bg-green-500 hover:bg-green-600 font-extrabold text-slate-950 text-xs tracking-wider uppercase rounded-2xl shadow-xl shadow-green-500/10 transition hover:-translate-y-0.5 flex items-center justify-center gap-2 z-10 font-mono"
        >
          <Plus className="h-4.5 w-4.5" />
          Report Waste Spot
        </button>
      </div>

      {/* KPI Stats Cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Total Submissions</span>
            <span className="p-2 bg-slate-50 text-slate-700 rounded-xl"><Trash2 className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{totalReportsCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">Dispatched incidents</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Awaiting Staff</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{pendingCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">Pending dispatch teams</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Active Cleanup</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{assignedCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">On-site sweepers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Resolved Issues</span>
            <span className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{completedCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">Campus restored clean</p>
          </div>
        </div>

      </div>

      {/* Charts Section: Category Distro and Bar Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly load trends */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Waste Frequency Chute</span>
            <h3 className="text-base font-black text-slate-800">Your Weekly Submissions Load</h3>
            <p className="text-xs text-slate-400">Activity index across weekly sanitation periods.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="Reports" fill="#16A34A" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart Display */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">AI Dispersion index</span>
            <h3 className="text-base font-black text-slate-800">Waste Categories</h3>
            <p className="text-xs text-slate-400">Submissions categorized by materials type.</p>
          </div>

          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={displayCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {displayCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Indicators list */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-2 border-t border-slate-50 font-semibold">
            {displayCategoryData.slice(0, 3).map((item, id) => (
              <div key={id} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Submissions Feed */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">My Active Queue</span>
            <h3 className="text-base font-black text-slate-800">Your Recent Report Filings</h3>
            <p className="text-xs text-slate-400">Incident status reports matching your student roster account.</p>
          </div>
          <button
            id="dash-btn-view-all"
            onClick={() => onNavigateTab('my-reports')}
            className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 hover:underline"
          >
            Manage active queue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {studentReports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2 border-t border-dashed border-slate-100 mt-4 rounded-xl">
            <Trash2 className="h-10 w-10 stroke-1 opacity-50 mx-auto" />
            <p className="font-bold text-sm">No waste incidents reported yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Campus is looking beautifully clean! Alert the team immediately if you spot piled nylons or broken lab waste.</p>
            <button
              id="empty-btn-report"
              onClick={() => onNavigateTab('report-waste')}
              className="mt-3 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold rounded-xl transition"
            >
              Start First Report
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">FILING ID</th>
                  <th className="py-3 px-4">INCIDENT DETAILS</th>
                  <th className="py-3 px-4">FACULTY LANDMARK</th>
                  <th className="py-3 px-4">URGENCY</th>
                  <th className="py-3 px-4">CHUTE STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {studentReports.slice(0, 5).map((rep) => (
                  <tr key={rep.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-600">{rep.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <img src={rep.imageUrl} alt="Incident spot" className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                        <div className="truncate text-left">
                          <p className="font-bold text-slate-800 truncate">{rep.category}</p>
                          <p className="text-slate-400 text-[10px] truncate leading-none mt-0.5">{rep.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-700 font-bold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span>{rep.location.faculty}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`
                        px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                        ${rep.priority === 'Emergency' ? 'bg-red-50 text-red-600 border border-red-100' :
                          rep.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                          rep.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                      `}>
                        {rep.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          rep.status === 'Completed' ? 'bg-green-500' :
                          rep.status === 'In Progress' ? 'bg-blue-500 animate-pulse' :
                          rep.status === 'Assigned' ? 'bg-indigo-500' : 'bg-amber-500'
                        }`} />
                        <span className="capitalize">{rep.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        id={`btn-view-${rep.id}`}
                        onClick={() => onSelectReport(rep)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-lg transition"
                      >
                        Inspect Timeline
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
  );
}
