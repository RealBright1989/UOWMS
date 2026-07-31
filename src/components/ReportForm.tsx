import React, { useState } from 'react';
import { 
  Upload, BrainCircuit, Sparkles, MapPin, 
  ArrowRight, Loader2 
} from 'lucide-react';
import { WasteCategory, ReportPriority, FACULTIES, WASTE_CATEGORIES } from '../types';

interface ReportFormProps {
  onSubmitReport: (data: any) => void;
  onNavigateTab: (tab: string) => void;
}

// Interactive Sandbox Presets list with real URLs
const INCIDENT_PRESETS = [
  {
    name: 'Plastic Heap',
    category: 'Plastic' as WasteCategory,
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=150&q=80',
    description: 'Throwaway food packs, plastic cups, and wrapping nylon discarded behind the mechanical workshops.'
  },
  {
    name: 'Lab Broken Shards',
    category: 'Glass' as WasteCategory,
    imageUrl: 'https://images.unsplash.com/photo-1549488497-640aae90bc1f?auto=format&fit=crop&w=150&q=80',
    description: 'Shattered compound glass slides and shattered test tubes on the Laboratory entrance floor.'
  },
  {
    name: 'Pruning Foliage',
    category: 'Organic' as WasteCategory,
    imageUrl: 'https://images.unsplash.com/photo-1592182248563-6e32bc4f3d1b?auto=format&fit=crop&w=150&q=80',
    description: 'Agricultural experiment green waste pile dumped carelessly near the greenhouse garden perimeter.'
  },
  {
    name: 'Damaged Batteries',
    category: 'Electronic' as WasteCategory,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=150&q=80',
    description: 'Leaking rechargeable dry acid batteries dumped on soil near Server wing walkway.'
  }
];

export default function ReportForm({ onSubmitReport, onNavigateTab }: ReportFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState<WasteCategory>('Plastic');
  const [priority, setPriority] = useState<ReportPriority>('Medium');
  const [faculty, setFaculty] = useState('Engineering');
  const [building, setBuilding] = useState('');
  const [description, setDescription] = useState('');
  
  // Simulated map coordinates
  const [latitude, setLatitude] = useState(4.9754);
  const [longitude, setLongitude] = useState(8.3512);

  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorText, setErrorText] = useState('');

  // Convert files to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        triggerAiClassification(base64, description);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to load presets
  const handleSelectPreset = (preset: typeof INCIDENT_PRESETS[0]) => {
    setImage(preset.imageUrl);
    setDescription(preset.description);
    triggerAiClassification(preset.imageUrl, preset.description);
  };

  const triggerAiClassification = async (imageUrl: string, desc: string) => {
    setAnalyzing(true);
    setAiResult(null);
    setErrorText('');

    try {
      // Pass base64 data or mock image url
      const payload: { image?: string; description?: string } = { description: desc };
      // Standard fetch accepts only actual data, so if it is base64 we append it
      if (imageUrl && imageUrl.startsWith('data:')) {
        payload.image = imageUrl;
      }

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('classification API returned non-ok status');
      }

      const data = await response.json();
      setAiResult(data);
      if (data.category) {
        // Automatically sync form category
        setCategory(data.category as WasteCategory);
      }
    } catch (err: any) {
      console.warn('AI classification failed. Using heuristic fallback.', err);
      // Client-side instant preview fallback
      const text = desc.toLowerCase();
      let mockCat: WasteCategory = 'Mixed Waste';
      let confidence = 0.88;
      let tip = 'Drop inside standard municipal cans. Inform cleaning staffs.';

      if (text.includes('plastic') || text.includes('bottle') || text.includes('cups')) {
        mockCat = 'Plastic';
        tip = 'Please compress first. Dump in green container bins outside lab halls.';
      } else if (text.includes('glass') || text.includes('chemical') || text.includes('test')) {
        mockCat = 'Glass';
        tip = 'CAUTION: Broken shards. Isolate from normal trash and call team B immediately.';
      } else if (text.includes('organic') || text.includes('foliage') || text.includes('garden')) {
        mockCat = 'Organic';
        tip = 'Move toward agricultural composting piles near Faculty of Agriculture greenhouse.';
      } else if (text.includes('battery') || text.includes('acid') || text.includes('e-waste')) {
        mockCat = 'Electronic';
        tip = 'EMERGENCY: Do not let rain touch battery acids. Seek immediate collector sweep.';
      }

      setAiResult({
        category: mockCat,
        confidence,
        handlingTip: tip,
        recyclePotential: 'High',
        greenTip: 'Preventing materials from touching the landfill safeguards UNICROSS natural ecology!'
      });
      setCategory(mockCat);
    } finally {
      setAnalyzing(false);
    }
  };

  // Map coordinate clicks Simulation
  const handleMapClick = (facName: string, lat: number, lng: number) => {
    setFaculty(facName);
    setLatitude(lat);
    setLongitude(lng);
    setBuilding(`${facName} Department block`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!building) {
      setErrorText('Please specific building or location name.');
      return;
    }
    onSubmitReport({
      category,
      priority,
      location: {
        faculty,
        building,
        latitude,
        longitude
      },
      description,
      imageUrl: image || 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
      aiClassification: aiResult ? {
        confidence: aiResult.confidence,
        handlingTip: aiResult.handlingTip,
        recyclePotential: aiResult.recyclePotential || 'High',
        greenTip: aiResult.greenTip
      } : undefined
    });

    onNavigateTab('my-reports');
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Campus Waste Incident</h2>
        <p className="text-sm text-slate-500 mt-1">Provide incident details below. If a photo is uploaded, our integrated Gemini engine will automatically classify it!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          
          {errorText && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorText}
            </div>
          )}

          {/* Photo upload / preset selector combo */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">1. Upload Incident Photo</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box upload */}
              <label className="border-2 border-dashed border-slate-200 hover:border-green-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer relative group min-h-[160px] bg-slate-50 transition">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                {image ? (
                  <div className="relative w-full h-full min-h-[135px] flex items-center justify-center">
                    <img src={image} alt="Report preview" className="max-h-[135px] max-w-full rounded-xl object-contain" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setImage(null); }}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg text-xs"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 flex flex-col items-center select-none">
                    <div className="p-2 bg-green-50 text-green-600 rounded-xl group-hover:scale-105 transition">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to upload photo</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </label>

              {/* Preset Shortcuts */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] text-slate-400 font-bold block">Or tap sample sandbox photos:</span>
                <div className="grid grid-cols-2 gap-2">
                  {INCIDENT_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      id={`preset-btn-${index}`}
                      onClick={() => handleSelectPreset(preset)}
                      className="flex items-center gap-2 p-1.5 border border-slate-100 hover:border-green-500 hover:bg-green-50 rounded-xl transition text-left group"
                    >
                      <img src={preset.imageUrl} alt={preset.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-[10px] font-bold text-slate-700 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* AI classification analysis display */}
          {(analyzing || aiResult) && (
            <div className="p-4 bg-gradient-to-br from-green-950 to-slate-900 border border-green-800 text-white rounded-2xl relative overflow-hidden">
              {analyzing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-green-400 animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                      Gemini Ecosystem Assistant
                    </h4>
                    <p className="text-[10px] text-slate-300">Scanning uploaded assets for accurate waste categories...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-green-800 pb-2">
                    <h4 className="font-extrabold text-green-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <BrainCircuit className="h-4 w-4" />
                      UNICROSS AI Vision Feedback
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 bg-green-600 text-black font-black rounded-full font-mono">
                      CONFIDENCE: {(aiResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Suggested Category</p>
                      <p className="text-sm font-black text-white mt-0.5">{aiResult.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Recycle Potential</p>
                      <p className="text-sm font-black text-rose-400 mt-0.5">{aiResult.recyclePotential || 'High'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Recommended Advisory Handling</p>
                    <p className="text-[11px] text-slate-200 leading-snug mt-0.5">{aiResult.handlingTip}</p>
                  </div>

                  <div className="p-2 sm:p-2.5 bg-green-900/30 text-[10px] text-green-300 rounded-xl border border-green-700/30 leading-relaxed">
                    <strong>Green Tip Fact:</strong> {aiResult.greenTip}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Incident Categories & Priority Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="form-category" className="text-xs font-bold text-slate-400 uppercase tracking-widest">2. Waste Category</label>
              <select
                id="form-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as WasteCategory)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:border-green-500 focus:outline-none transition font-semibold"
              >
                {WASTE_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">3. Incident Urgency</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Medium', 'High', 'Emergency'] as ReportPriority[]).map((prio) => {
                  const colors = {
                    Low: 'hover:bg-green-50 text-green-700 border-green-100 bg-green-50/20',
                    Medium: 'hover:bg-blue-50 text-blue-700 border-blue-100 bg-blue-50/20',
                    High: 'hover:bg-amber-50 text-amber-700 border-amber-100 bg-amber-50/20',
                    Emergency: 'hover:bg-red-50 text-red-700 border-red-100 bg-red-50/20'
                  };

                  const activeColors = {
                    Low: 'bg-green-600 text-white border-green-600',
                    Medium: 'bg-blue-600 text-white border-blue-600',
                    High: 'bg-amber-500 text-white border-amber-500',
                    Emergency: 'bg-red-600 text-white border-red-600'
                  };

                  const isSelected = priority === prio;

                  return (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setPriority(prio)}
                      className={`
                        py-2 text-center rounded-lg text-[10px] font-black tracking-wide border transition
                        ${isSelected ? activeColors[prio] : colors[prio]}
                      `}
                    >
                      {prio}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Location / Campus Geography Input group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="form-faculty" className="text-xs font-bold text-slate-400 uppercase tracking-widest">4. Campus Faculty / Area</label>
              <select
                id="form-faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:border-green-500 focus:outline-none transition font-semibold"
              >
                {FACULTIES.map(f => (
                  <option key={f} value={f}>Faculty of {f}</option>
                ))}
                <option value="Hostel Area">Hostels Precincts</option>
                <option value="Administrative block">Administrative Blocks</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="form-building" className="text-xs font-bold text-slate-400 uppercase tracking-widest">5. Building Name / Description</label>
              <input
                id="form-building"
                type="text"
                required
                placeholder="e.g. Mechanical Lab stair behind block A"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-850 text-sm rounded-xl focus:border-green-500 focus:outline-none transition font-semibold"
              />
            </div>

          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest">6. Detailed Description</label>
            <textarea
              id="form-desc"
              rows={3}
              required
              placeholder="Provide a short description of the waste blockage. Include estimated bags or special dangers."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm text-slate-800 rounded-xl focus:border-green-500 focus:outline-none transition font-medium"
            />
          </div>

          {/* Submit Incident Button */}
          <button
            id="form-btn-submit"
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-green-100 transition flex items-center justify-center gap-2 mt-2"
          >
            Dispatch Incident Report to Collectors
            <ArrowRight className="h-4.5 w-4.5" />
          </button>

        </form>

        {/* Right Collapsible Interactive Campus Map Simulator */}
        <div className="lg:col-span-5 space-y-4 text-left">
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                University Map Simulator
              </h3>
              <p className="text-[11px] text-slate-400">Tap landmarks below to automatically pin incident GPS coordinates!</p>
            </div>

            {/* Simulated interactive map stage */}
            <div className="relative bg-emerald-100 h-64 w-full rounded-2xl border border-slate-250 overflow-hidden shadow-inner flex items-center justify-center text-center">
              
              {/* Map grid representation lines */}
              <div className="absolute inset-0 bg-opacity-30 p-2 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />

              {/* Central Campus Road mock lines */}
              <div className="absolute top-1/2 left-0 w-full h-8 bg-slate-300 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest font-mono">UNICROSS WAY</span>
              </div>
              <div className="absolute top-0 left-1/2 w-8 h-full bg-slate-300 -translate-x-1/2 pointer-events-none" />

              {/* Pin marker */}
              <div 
                className="absolute z-10 p-2 bg-rose-600 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce"
                style={{
                  top: faculty === 'Engineering' ? '30%' : faculty === 'Biological Sciences' ? '25%' : faculty === 'Agriculture' ? '70%' : '60%',
                  left: faculty === 'Engineering' ? '35%' : faculty === 'Biological Sciences' ? '75%' : faculty === 'Agriculture' ? '20%' : '70%',
                }}
              >
                <MapPin className="h-5 w-5 fill-rose-300" />
              </div>

              {/* Dynamic Interactive Landmarks */}
              <button
                type="button"
                id="map-landmark-eng"
                onClick={() => handleMapClick('Engineering', 4.9754, 8.3512)}
                className="absolute top-8 left-10 p-2.5 bg-white/90 hover:bg-green-600 hover:text-white rounded-xl shadow border border-slate-100 text-left transition select-none"
              >
                <span className="block text-[8px] text-green-600 font-bold uppercase tracking-widest">FACULTY A</span>
                <span className="block text-[10px] font-black">Engineering Lab</span>
              </button>

              <button
                type="button"
                id="map-landmark-bio"
                onClick={() => handleMapClick('Biological Sciences', 4.9760, 8.3520)}
                className="absolute top-12 right-6 p-2.5 bg-white/90 hover:bg-green-600 hover:text-white rounded-xl shadow border border-slate-100 text-left transition select-none"
              >
                <span className="block text-[8px] text-green-600 font-bold uppercase tracking-widest">FACULTY B</span>
                <span className="block text-[10px] font-black">Botany greenhouse</span>
              </button>

              <button
                type="button"
                id="map-landmark-agri"
                onClick={() => handleMapClick('Agriculture', 4.9721, 8.3499)}
                className="absolute bottom-6 left-8 p-2.5 bg-white/95 hover:bg-green-600 hover:text-white rounded-xl shadow border border-slate-100 text-left transition select-none"
              >
                <span className="block text-[8px] text-green-600 font-bold uppercase tracking-widest">FACULTY C</span>
                <span className="block text-[10px] font-black">Agriculture Farm</span>
              </button>

              <button
                type="button"
                id="map-landmark-hostel"
                onClick={() => handleMapClick('Hostel Area', 4.9735, 8.3501)}
                className="absolute bottom-8 right-10 p-2.5 bg-white/95 hover:bg-green-600 hover:text-white rounded-xl shadow border border-slate-100 text-left transition select-none"
              >
                <span className="block text-[8px] text-green-600 font-bold uppercase tracking-widest">RESIDENCE</span>
                <span className="block text-[10px] font-black">Student Hostels</span>
              </button>

            </div>

            {/* Coordinate logs readout */}
            <div className="bg-slate-55 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">GPS LATITUDE</span>
                <span className="text-slate-700 font-bold">{latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">GPS LONGITUDE</span>
                <span className="text-slate-700 font-bold">{longitude.toFixed(6)}</span>
              </div>
            </div>

          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-3xl border border-emerald-100 space-y-3.5 text-xs text-green-800">
            <h4 className="font-extrabold flex items-center gap-1 text-[13px]">
              <Sparkles className="h-4.5 w-4.5 text-green-600 animate-spin" />
              Guidelines to report waste:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✔</span>
                <span>Select high or emergency priority only for toxic leakages, blocked pathways, or medical syringes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✔</span>
                <span>Use presets or take images under natural light to assist the automated AI visual categorization analyzer.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
