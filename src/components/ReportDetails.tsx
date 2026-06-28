import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, MapPin, User, AlertTriangle, 
  Send, MessageSquare, CheckCircle, ShieldAlert, Sparkles 
} from 'lucide-react';
import { WasteReport, UserRole, Comment } from '../types';

interface ReportDetailsProps {
  report: WasteReport;
  userRole: UserRole;
  userName: string;
  onBack: () => void;
  onAddComment: (reportId: string, text: string) => void;
  onUpdateStatus?: (reportId: string, status: WasteReport['status']) => void;
  onAssignStaff?: (reportId: string, staffId: string, staffName: string) => void;
  staffList?: { id: string; name: string }[];
}

export default function ReportDetails({ 
  report, 
  userRole, 
  userName, 
  onBack, 
  onAddComment, 
  onUpdateStatus, 
  onAssignStaff,
  staffList = []
}: ReportDetailsProps) {
  const [commentText, setCommentText] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(report.id, commentText);
    setCommentText('');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigneeId) return;
    const staff = staffList.find(s => s.id === assigneeId);
    if (staff && onAssignStaff) {
      onAssignStaff(report.id, staff.id, staff.name);
    }
  };

  // Timeline progress values
  const statuses = ['Pending', 'Assigned', 'In Progress', 'Completed'];
  const currentStatusIndex = statuses.indexOf(report.status);

  return (
    <div className="space-y-8 text-left">
      
      {/* Back CTA */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button 
          onClick={onBack}
          className="px-4 py-2 hover:bg-slate-100 rounded-xl transition text-xs font-bold text-slate-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to list
        </button>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
          ID: {report.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Photo + Status Timeline + Metadata */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Photo Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Reported Incident Photo</span>
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 aspect-video max-h-[360px] flex items-center justify-center">
              <img 
                src={report.imageUrl || "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80"} 
                alt="Waste spot" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`
                  px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide shadow-md
                  ${report.priority === 'Emergency' ? 'bg-red-600 text-white animate-pulse' : 
                    report.priority === 'High' ? 'bg-amber-500 text-black' : 
                    report.priority === 'Medium' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}
                `}>
                  {report.priority} Priority
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-slate-900/90 text-white shadow-md">
                  {report.category}
                </span>
              </div>
            </div>
          </div>

          {/* Incident Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description & Analysis</span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">{report.category} Waste Leakage</h3>
              <p className="text-sm font-semibold text-slate-500 mt-2 leading-relaxed">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-50 pt-5 text-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Report Geography</p>
                    <p className="font-bold text-slate-800">{report.location.faculty}</p>
                    <p className="text-xs text-slate-500">{report.location.building}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reporter Identity</p>
                    <p className="font-bold text-slate-800">{report.studentName}</p>
                    <p className="text-xs text-slate-500">Student Directory</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Submitted</p>
                    <p className="font-bold text-slate-800">
                      {new Date(report.dateSubmitted).toLocaleDateString(undefined, { 
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Sanitary Officer</p>
                    <p className="font-bold text-slate-800">
                      {report.assignedStaffName || 'Team selection pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* If there is AI classification data saved, show it here magnificently */}
            {report.aiClassification && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 text-xs shadow-md">
                <p className="text-green-400 font-black flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <Sparkles className="h-4 w-4" />
                  Ecosystem AI Diagnostic Summary
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-bold">Suggested Category:</span>
                    <span className="font-bold text-slate-100">{report.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Recyclability:</span>
                    <span className="font-bold text-teal-300">{report.aiClassification.recyclePotential || 'High'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Collector Specific Advisory:</span>
                  <p className="text-slate-200 mt-0.5 leading-snug">{report.aiClassification.handlingTip}</p>
                </div>
              </div>
            )}

            {/* Resolution image when completed */}
            {report.status === 'Completed' && report.completionImageUrl && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs flex flex-col sm:flex-row gap-4 items-center">
                <img 
                  src={report.completionImageUrl} 
                  alt="Resolution proof" 
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-emerald-100" 
                />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-800">Cleanup Resolution Approved</p>
                  <p className="text-slate-600 leading-relaxed">
                    The incident spot has been vacuumed, trash was sorted under UNICROSS recycling rules, and pedestrian access has been successfully restored. Thank you for reporting!
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Timeline Process Map Indicator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Collection Chute Timeline</span>
            
            <div className="relative">
              <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-10 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {statuses.map((statusName, index) => {
                  const isDone = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={statusName} className="flex md:flex-col items-center gap-3.5 md:text-center">
                      
                      <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 border-2
                        ${isDone ? 'bg-green-600 border-green-600 font-black' : 'bg-white border-slate-200 text-slate-400'}
                        ${isCurrent ? 'ring-4 ring-green-100' : ''}
                      `}>
                        {isDone ? '✓' : index + 1}
                      </div>

                      <div className="text-left md:text-center space-y-0.5">
                        <p className={`text-xs font-extrabold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {statusName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {statusName === 'Pending' ? 'Awaiting assignment' :
                           statusName === 'Assigned' ? 'Officer dispatched' :
                           statusName === 'In Progress' ? 'Sweeper on-site' : 'Restored'}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Admin Staff Assignment panel + Comments list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Admin Control Assignment Widget */}
          {userRole === 'admin' && onAssignStaff && report.status !== 'Completed' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                <ShieldAlert className="h-4 w-4 text-emerald-600" />
                Administrative Dispatch
              </h4>
              <p className="text-[11px] text-slate-500">Pick an active environment officer to dispatch equipment cart teams.</p>
              
              <form onSubmit={handleAssignSubmit} className="space-y-3">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-green-500 focus:outline-none transition font-semibold"
                >
                  <option value="">-- Choose Field Collector --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (Sanitation Team)</option>
                  ))}
                </select>
                
                <button
                  id="admin-btn-assign-staff"
                  type="submit"
                  disabled={!assigneeId}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
                >
                  Dispatch Selected Officer
                </button>
              </form>
            </div>
          )}

          {/* Quick status change buttons for STAFF collectors */}
          {userRole === 'staff' && onUpdateStatus && report.status !== 'Completed' && (
            <div className="bg-gradient-to-br from-blue-950 to-slate-900 p-6 rounded-3xl text-white space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                <ShieldAlert className="h-4 w-4" />
                Officer Incident Directives
              </h4>
              <p className="text-[11px] text-slate-300">Set active on-site response statuses for student visibility.</p>
              
              <div className="space-y-2">
                {report.status === 'Assigned' && (
                  <button
                    id="staff-btn-accept"
                    onClick={() => onUpdateStatus(report.id, 'In Progress')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Accept & Mark In Progress
                  </button>
                )}
                
                {report.status === 'In Progress' && (
                  <button
                    id="staff-btn-complete"
                    onClick={() => onUpdateStatus(report.id, 'Completed')}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Mark Cleanup as Completed ✓
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Comments Feed Thread */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px] justify-between">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-green-600" />
                Ecosystem Chute Chat
              </span>
              <span className="text-[10px] bg-slate-150 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                {report.comments.length} texts
              </span>
            </div>

            {/* Scroll lists */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1.5 custom-scrollbar text-xs">
              {report.comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-1 mt-4">
                  <MessageSquare className="h-8 w-8 stroke-1 opacity-60" />
                  <p className="font-bold">No communication yet</p>
                  <p className="text-[10px]">Add updates or collection hints below.</p>
                </div>
              ) : (
                report.comments.map((comm) => {
                  const isAdmin = comm.authorRole === 'admin';
                  const isStaff = comm.authorRole === 'staff';

                  return (
                    <div key={comm.id} className="space-y-1 bg-slate-50 p-2.5 rounded-xl hover:bg-slate-100 transition duration-150">
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          {comm.author}
                          <span className={`
                            text-[8px] px-1 py-0.1 select-none rounded font-mono font-black uppercase
                            ${isAdmin ? 'bg-emerald-100 text-emerald-700' : isStaff ? 'bg-blue-100 text-blue-700' : 'bg-slate-150 text-slate-600'}
                          `}>
                            {comm.authorRole}
                          </span>
                        </span>
                        <span className="text-slate-400">
                          {new Date(comm.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-normal leading-relaxed text-xs">{comm.content}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Form text input comment */}
            <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-50 flex gap-2">
              <input
                id="comment-input-box"
                type="text"
                placeholder="Write text instructions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-100 border-0 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
              />
              <button
                id="comment-btn-submit"
                type="submit"
                className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
