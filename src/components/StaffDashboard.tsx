import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle, Award, MapPin, 
  Clock, Check 
} from 'lucide-react';
import { WasteReport, User } from '../types';

interface StaffDashboardProps {
  reports: WasteReport[];
  currentUser: User;
  onUpdateStatus: (reportId: string, status: WasteReport['status'], resolutionImage?: string) => void;
  onSelectReport: (report: WasteReport) => void;
}

// Predefined mock cleanup completion images
const RESOLUTION_PHOTOS = [
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80', // clean bins
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80', // clean walkways
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80', // trash bag stack
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80'  // tidy building
];

export default function StaffDashboard({ 
  reports, 
  currentUser, 
  onUpdateStatus, 
  onSelectReport 
}: StaffDashboardProps) {

  // Fetch only reports allocated to this active Collector staff profile
  const assignedReports = reports.filter(r => r.assignedStaffId === currentUser.id);

  const totalTasks = assignedReports.length;
  const pendingTasks = assignedReports.filter(r => r.status === 'Assigned').length;
  const activeTasks = assignedReports.filter(r => r.status === 'In Progress').length;
  const completedTasks = assignedReports.filter(r => r.status === 'Completed').length;

  const [activeCompletingId, setActiveCompletingId] = useState<string | null>(null);
  const [selectedResPhoto, setSelectedResPhoto] = useState(RESOLUTION_PHOTOS[0]);

  const triggerCompletionSubmit = (reportId: string) => {
    // Call main app closure to mark completed
    onUpdateStatus(reportId, 'Completed', selectedResPhoto);
    setActiveCompletingId(null);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Metrics Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#10B981] bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full w-fit block">
          SANITATION FORCE DISPATCH
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Active Duty Chute: {currentUser.name}</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          You are clocked in for active field operations. Keep your campus communication channels open and upload resolution photos to confirm clean paths.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Assigned Tasks</span>
            <span className="p-2 bg-slate-50 text-slate-700 rounded-xl"><ClipboardList className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{totalTasks}</p>
            <p className="text-[10px] text-slate-400 mt-1">Total operational load</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Completed Resolutions</span>
            <span className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">{completedTasks}</p>
            <p className="text-[10px] text-slate-400 mt-1">Restored campus spaces</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Average Completion</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">2.4 Hrs</p>
            <p className="text-[10px] text-slate-400 mt-1">Under campus SLA guidelines</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Operational Tier</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Award className="h-4.5 w-4.5" /></span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-800">Class A</p>
            <p className="text-[10px] text-slate-400 mt-1">Top performer badge (100% SLA)</p>
          </div>
        </div>

      </div>

      {/* Task Table Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest font-mono">Dispatch Queue</span>
          <h3 className="text-lg font-black text-slate-800">Daily Incident Response Matrix</h3>
          <p className="text-xs text-slate-500">Task items requiring scanning, sweep tools, or transport cart dispatches.</p>
        </div>

        {assignedReports.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2 border-t border-dashed border-slate-100">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto opacity-75" />
            <p className="font-extrabold text-sm">All Clear! No assigned pickup requests</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">No current cleanup coordinates are dispatch assigned. Take rest or request new equipment sweeps from administrative board controls.</p>
          </div>
        ) : (
          <div className="overflow-x-auto space-y-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">TASK ID</th>
                  <th className="py-3 px-4">INCIDENT ASSETS</th>
                  <th className="py-3 px-4">LANDMARK COORDINATES</th>
                  <th className="py-3 px-4">PRIORITY</th>
                  <th className="py-3 px-4">Duty Status</th>
                  <th className="py-3 px-4 text-right">ACTION COMMANDS</th>
                </tr>
              </thead>
              <tbody>
                {assignedReports.map((rep) => {
                  const isCompleting = activeCompletingId === rep.id;

                  return (
                    <React.Fragment key={rep.id}>
                      <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150">
                        <td className="py-4 px-4 font-mono font-bold text-slate-650">{rep.id}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 max-w-[200px]">
                            <img src={rep.imageUrl} alt="Trash Spot" className="w-10 h-10 rounded-lg object-cover border shrink-0 border-slate-100" />
                            <div className="truncate text-left">
                              <p className="font-bold text-slate-800">{rep.category} incident</p>
                              <p className="text-slate-400 text-[10px] truncate">{rep.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-rose-500" />
                            <span>{rep.location.faculty} ({rep.location.building})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`
                            px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                            ${rep.priority === 'Emergency' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                              rep.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                              rep.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                          `}>
                            {rep.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={`w-2 h-2 rounded-full ${
                              rep.status === 'Completed' ? 'bg-green-500' :
                              rep.status === 'In Progress' ? 'bg-blue-500/80 animate-pulse' : 'bg-amber-500'
                            }`} />
                            <span>{rep.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right space-x-1.5">
                          {rep.status === 'Assigned' && (
                            <button
                              id={`bton-accept-${rep.id}`}
                              onClick={() => onUpdateStatus(rep.id, 'In Progress')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold"
                            >
                              Accept Task
                            </button>
                          )}

                          {rep.status === 'In Progress' && (
                            <button
                              id={`bton-trigger-complete-${rep.id}`}
                              onClick={() => {
                                if (isCompleting) {
                                  setActiveCompletingId(null);
                                } else {
                                  setActiveCompletingId(rep.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold"
                            >
                              {isCompleting ? 'Close Complete Dialog' : 'Resolve Task ✓'}
                            </button>
                          )}

                          {rep.status === 'Completed' && (
                            <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider">
                              TASK RESOLVED
                            </span>
                          )}

                          <button
                            id={`bton-inspect-${rep.id}`}
                            onClick={() => onSelectReport(rep)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition font-bold"
                          >
                            Timeline View
                          </button>
                        </td>
                      </tr>

                      {/* Dropdown panel for uploading the resolution picture */}
                      {isCompleting && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                            <div className="max-w-xl space-y-4">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">Submit Cleanup Resolution Evidence</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Pick one of our on-site verification presets to mock-upload the resolved clean space state.</p>
                              </div>

                              <div className="grid grid-cols-4 gap-3">
                                {RESOLUTION_PHOTOS.map((pho, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    id={`res-photo-btn-${idx}`}
                                    onClick={() => setSelectedResPhoto(pho)}
                                    className={`
                                      relative rounded-xl overflow-hidden aspect-square border-2 transition
                                      ${selectedResPhoto === pho ? 'border-green-600 scale-102 ring-2 ring-green-150' : 'border-transparent hover:border-slate-350'}
                                    `}
                                  >
                                    <img src={pho} alt="resol asset" className="w-full h-full object-cover" />
                                    {selectedResPhoto === pho && (
                                      <span className="absolute bottom-1 right-1 bg-green-600 text-white p-0.5 rounded-full">
                                        <Check className="h-3 w-3" />
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>

                              <div className="flex gap-3 justify-end pt-2">
                                <button
                                  id="close-completion-btn"
                                  onClick={() => setActiveCompletingId(null)}
                                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 bg-white"
                                >
                                  Cancel Dialog
                                </button>
                                <button
                                  id="confirm-completion-btn"
                                  onClick={() => triggerCompletionSubmit(rep.id)}
                                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
                                >
                                  Dispatch Cleanup Completion Report
                                </button>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
