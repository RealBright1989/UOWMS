import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface BinMarker {
  id: string;
  name: string;
  location: [number, number];
  category: string;
  fillLevel: number;
  status: 'active' | 'full' | 'maintenance';
}

interface TruckMarker {
  id: string;
  name: string;
  location: [number, number];
  driver: string;
  status: 'en-route' | 'collecting' | 'returning' | 'idle';
}

const bins: BinMarker[] = [
  { id: 'B-001', name: 'Engineering Block A', location: [8.3512, 4.9754], category: 'Plastic', fillLevel: 87, status: 'full' },
  { id: 'B-002', name: 'Engineering Block B', location: [8.3508, 4.9758], category: 'General', fillLevel: 34, status: 'active' },
  { id: 'B-003', name: 'Biological Sciences', location: [8.352, 4.976], category: 'Organic', fillLevel: 92, status: 'full' },
  { id: 'B-004', name: 'Main Library', location: [8.3508, 4.9751], category: 'Paper', fillLevel: 65, status: 'active' },
  { id: 'B-005', name: 'CS Server Room', location: [8.3498, 4.9749], category: 'Electronic', fillLevel: 45, status: 'active' },
  { id: 'B-006', name: 'Physics Lab', location: [8.351, 4.9755], category: 'Glass', fillLevel: 78, status: 'active' },
  { id: 'B-007', name: 'Faculty of Law', location: [8.3502, 4.9745], category: 'Paper', fillLevel: 23, status: 'active' },
  { id: 'B-008', name: 'Admin Building', location: [8.3505, 4.975], category: 'General', fillLevel: 55, status: 'active' },
  { id: 'B-009', name: 'Student Hostel C', location: [8.3525, 4.9765], category: 'Mixed', fillLevel: 95, status: 'full' },
  { id: 'B-010', name: 'Cafeteria Complex', location: [8.3518, 4.9762], category: 'Organic', fillLevel: 81, status: 'maintenance' },
];

const trucks: TruckMarker[] = [
  { id: 'T-101', name: 'Compactor Alpha', location: [8.3515, 4.9756], driver: 'Emeka Obi', status: 'collecting' },
  { id: 'T-102', name: 'Dump Truck Beta', location: [8.3505, 4.9753], driver: 'Asari Bassey', status: 'en-route' },
  { id: 'T-103', name: 'Flatbed Gamma', location: [8.3522, 4.9768], driver: 'John Okon', status: 'returning' },
];

const categoryColors: Record<string, string> = {
  Plastic: '#059669',
  Organic: '#d97706',
  Paper: '#2563eb',
  Glass: '#7c3aed',
  Electronic: '#dc2626',
  Metal: '#78716c',
  General: '#64748b',
  Mixed: '#0d9488',
};

const statusColors: Record<string, string> = {
  'active': '#22c55e',
  'full': '#ef4444',
  'maintenance': '#f59e0b',
};

const center: [number, number] = [8.351, 4.9755];

const osmStyle: maplibregl.Style = {
  version: 8,
  name: 'OSM',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

function createBinGeoJSON(bins: BinMarker[]) {
  return {
    type: 'FeatureCollection' as const,
    features: bins.map(b => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: b.location },
      properties: { ...b },
    })),
  };
}

function createTruckGeoJSON(trucks: TruckMarker[]) {
  return {
    type: 'FeatureCollection' as const,
    features: trucks.map(t => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: t.location },
      properties: { ...t },
    })),
  };
}

export default function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [view, setView] = useState<'bins' | 'trucks'>('bins');
  const [selectedBin, setSelectedBin] = useState<BinMarker | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<TruckMarker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: osmStyle,
      center,
      zoom: 15,
      attributionControl: false,
    });

    m.addControl(new maplibregl.NavigationControl(), 'top-right');
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    m.on('load', () => {
      m.addSource('bins', {
        type: 'geojson',
        data: createBinGeoJSON(bins),
      });

      m.addSource('trucks', {
        type: 'geojson',
        data: createTruckGeoJSON(trucks),
      });

      m.addLayer({
        id: 'bins-pulse',
        type: 'circle',
        source: 'bins',
        filter: ['==', ['get', 'status'], 'full'],
        paint: {
          'circle-radius': 20,
          'circle-color': '#ef4444',
          'circle-opacity': 0.2,
          'circle-stroke-width': 0,
        },
      });

      m.addLayer({
        id: 'bins-layer',
        type: 'circle',
        source: 'bins',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match', ['get', 'category'],
            'Plastic', '#059669',
            'Organic', '#d97706',
            'Paper', '#2563eb',
            'Glass', '#7c3aed',
            'Electronic', '#dc2626',
            'Metal', '#78716c',
            'General', '#64748b',
            'Mixed', '#0d9488',
            '#64748b',
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      });

      m.addLayer({
        id: 'trucks-layer',
        type: 'circle',
        source: 'trucks',
        paint: {
          'circle-radius': 10,
          'circle-color': [
            'match', ['get', 'status'],
            'en-route', '#3b82f6',
            'collecting', '#22c55e',
            'returning', '#f59e0b',
            'idle', '#64748b',
            '#64748b',
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95,
        },
      });

      m.setLayoutProperty('bins-layer', 'visibility', 'visible');
      m.setLayoutProperty('bins-pulse', 'visibility', 'visible');
      m.setLayoutProperty('trucks-layer', 'visibility', 'none');

      m.on('click', 'bins-layer', e => {
        const feature = e.features?.[0];
        if (feature?.properties) {
          setSelectedBin(feature.properties as unknown as BinMarker);
          setSelectedTruck(null);
        }
      });

      m.on('click', 'trucks-layer', e => {
        const feature = e.features?.[0];
        if (feature?.properties) {
          setSelectedTruck(feature.properties as unknown as TruckMarker);
          setSelectedBin(null);
        }
      });

      m.on('mouseenter', 'bins-layer', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'bins-layer', () => { m.getCanvas().style.cursor = ''; });
      m.on('mouseenter', 'trucks-layer', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'trucks-layer', () => { m.getCanvas().style.cursor = ''; });
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const m = map.current;
    const visBins = view === 'bins' ? 'visible' : 'none';
    const visTrucks = view === 'trucks' ? 'visible' : 'none';

    try { m.setLayoutProperty('bins-layer', 'visibility', visBins); } catch {}
    try { m.setLayoutProperty('bins-pulse', 'visibility', visBins); } catch {}
    try { m.setLayoutProperty('trucks-layer', 'visibility', visTrucks); } catch {}

    if (view === 'trucks') { setSelectedBin(null); }
    if (view === 'bins') { setSelectedTruck(null); }
  }, [view]);

  return (
    <section id="live-map" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">
            Live Tracking
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Real-Time Fleet & Bin Map
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Track bin fill-levels and collection vehicle locations across campus in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setView('bins')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              view === 'bins'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Waste Bins
          </button>
          <button
            onClick={() => setView('trucks')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              view === 'trucks'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Collection Vehicles
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
          <div ref={mapContainer} className="w-full h-[500px] md:h-[550px]" />

          {view === 'bins' && (
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/60 max-w-[200px]">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bin Legend</p>
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2 py-0.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600">{cat}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 ring-2 ring-red-500 flex-shrink-0" />
                  <span className="text-xs text-slate-600">Overflowing</span>
                </div>
              </div>
            </div>
          )}

          {view === 'trucks' && (
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/60 max-w-[200px]">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Vehicle Legend</p>
              <div className="flex items-center gap-2 py-0.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" /><span className="text-xs text-slate-600">En Route</span></div>
              <div className="flex items-center gap-2 py-0.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" /><span className="text-xs text-slate-600">Collecting</span></div>
              <div className="flex items-center gap-2 py-0.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" /><span className="text-xs text-slate-600">Returning</span></div>
              <div className="flex items-center gap-2 py-0.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0" /><span className="text-xs text-slate-600">Idle</span></div>
            </div>
          )}

          {selectedBin && view === 'bins' && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 z-10 bg-white rounded-xl p-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedBin.status === 'full' ? 'bg-red-50 text-red-600' :
                  selectedBin.status === 'maintenance' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {selectedBin.status === 'full' ? 'Needs Collection' : selectedBin.status === 'maintenance' ? 'Maintenance' : 'Active'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">{selectedBin.id}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{selectedBin.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[selectedBin.category] || '#64748b' }} />
                <span className="text-xs text-slate-500">{selectedBin.category} Waste</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Fill Level</span>
                  <span className="font-bold">{selectedBin.fillLevel}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedBin.fillLevel > 85 ? 'bg-red-500' :
                      selectedBin.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedBin.fillLevel}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTruck && view === 'trucks' && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 z-10 bg-white rounded-xl p-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedTruck.status === 'collecting' ? 'bg-emerald-50 text-emerald-600' :
                  selectedTruck.status === 'en-route' ? 'bg-blue-50 text-blue-600' :
                  selectedTruck.status === 'returning' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {selectedTruck.status === 'collecting' ? 'Collecting' :
                   selectedTruck.status === 'en-route' ? 'En Route' :
                   selectedTruck.status === 'returning' ? 'Returning' : 'Idle'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">{selectedTruck.id}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{selectedTruck.name}</p>
              <p className="text-xs text-slate-500 mt-1">Driver: {selectedTruck.driver}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
