import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import VetNavigation from '../../components/VetNavigation';

// Custom Glowing SVG Pin Generator for Leaflet
function createUrgencyIcon(urgency = 'low') {
  const colors = {
    low: '#10b981',      // Emerald Green
    moderate: '#f59e0b', // Amber Yellow
    high: '#f97316',     // Orange
    critical: '#ef4444'  // Crimson Red
  };
  const color = colors[urgency.toLowerCase()] || '#10b981';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.45; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 28px; height: 28px; border-radius: 9999px; background: linear-gradient(135deg, ${color}, #090D16); border: 2px solid #ffffff; box-shadow: 0 0 15px ${color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: bold;">
          ${urgency === 'critical' ? '⚠️' : urgency === 'high' ? '🚨' : '📍'}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

// Subcomponent to animate map center changes smoothly
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function MapView() {
  const [reports, setReports] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [showOutbreakRadius, setShowOutbreakRadius] = useState(true);
  const [mapCenter, setMapCenter] = useState([18.25, 74.6]);
  const [mapZoom, setMapZoom] = useState(8);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      try {
        const [repData, obData] = await Promise.all([
          api.getReports(),
          api.getOutbreaks()
        ]);
        setReports(repData);
        setOutbreaks(obData);
      } catch (err) {
        console.error("Map data error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (selectedUrgency === 'ALL') return true;
    return r.prediction?.urgency?.toLowerCase() === selectedUrgency.toLowerCase();
  });

  const handleDistrictJump = (coords, zoom = 10) => {
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  return (
    <div className="h-screen flex flex-col bg-[#080C15] text-slate-100 overflow-hidden">
      <VetNavigation />

      {/* Map Control HUD Bar */}
      <div className="bg-[#0B101D]/95 backdrop-blur-xl border-b border-slate-800/90 px-4 py-3 z-20 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg shadow-black/40">
        
        {/* Title & Live Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h1 className="text-sm sm:text-base font-black text-white">
              Maharashtra GIS Epidemiological Radar Map
            </h1>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700/60 shadow-xs">
            {filteredReports.length} Cases Plotted
          </span>
        </div>

        {/* Filters & District Quick Jumps */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Urgency Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedUrgency(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedUrgency === lvl
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Buffer Toggle */}
          <button
            onClick={() => setShowOutbreakRadius(!showOutbreakRadius)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              showOutbreakRadius
                ? "bg-rose-950 text-rose-300 border-rose-600/70 shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-400"
            }`}
          >
            <span>🔥</span>
            <span>Hotspot Rings (5km)</span>
          </button>

          {/* District Jumps */}
          <div className="hidden xl:flex items-center gap-1 text-xs">
            <span className="text-slate-500 mr-1 font-bold">Jump:</span>
            {[
              { name: 'Pune', coords: [18.5204, 73.8567] },
              { name: 'Satara', coords: [17.6805, 74.0183] },
              { name: 'Solapur', coords: [17.6599, 75.9064] }
            ].map(d => (
              <button
                key={d.name}
                onClick={() => handleDistrictJump(d.coords, 10)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg font-semibold transition cursor-pointer"
              >
                {d.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative flex-1 w-full h-full bg-[#090D16]">
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-cyan-300 font-bold text-sm">
            <span className="animate-spin text-2xl mr-2.5">⏳</span> Loading geospatial coordinates...
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full dark-map-tiles"
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* Free satellite imagery from Esri World Imagery. Attribution is required for production use. */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />

          {/* Transparent reference overlay for place names and administrative boundaries. */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            opacity={0.92}
          />

          {/* Outbreak Hotspot Buffer Rings */}
          {showOutbreakRadius &&
            outbreaks.map((ob, idx) => {
              const coords = idx === 0 ? [18.5204, 73.8567] : idx === 1 ? [17.6805, 74.0183] : [17.6599, 75.9064];
              const isActive = ob.status === 'Active';
              return (
                <Circle
                  key={ob.id}
                  center={coords}
                  radius={(ob.radiusKm || 5) * 1000}
                  pathOptions={{
                    color: isActive ? '#ef4444' : '#10b981',
                    fillColor: isActive ? '#ef4444' : '#10b981',
                    fillOpacity: 0.18,
                    weight: 2,
                    dashArray: '6, 6'
                  }}
                >
                  <Popup>
                    <div className="p-2 space-y-2 text-slate-100 max-w-xs">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="text-[10px] font-black uppercase text-rose-400">🔥 Epidemic Hotspot</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">{ob.status}</span>
                      </div>
                      <div>
                        <div className="font-black text-sm text-white">{ob.diseaseName}</div>
                        <div className="text-xs text-slate-400">📍 {ob.village}, {ob.district}</div>
                      </div>
                      <div className="text-xs bg-slate-900/90 p-2 rounded-xl border border-slate-800 space-y-1">
                        <div className="text-rose-300 font-bold">{ob.casesCount} active cluster cases</div>
                        <div className="text-slate-400 text-[11px]">{ob.radiusKm} km containment zone</div>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

          {/* Case Pins */}
          {filteredReports.map((rep) => {
            const pos = [rep.location?.lat || 18.5204, rep.location?.lng || 73.8567];
            const icon = createUrgencyIcon(rep.prediction?.urgency);

            return (
              <Marker key={rep.id} position={pos} icon={icon}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 space-y-3 max-w-xs text-slate-100">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
                      <span className="font-mono text-xs font-bold text-cyan-300">{rep.id}</span>
                      <UrgencyBadge urgency={rep.prediction?.urgency} size="sm" />
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white leading-tight">
                        {rep.prediction?.disease}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {rep.location?.village}, {rep.location?.block}, {rep.location?.district}
                      </p>
                    </div>

                    <div className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div>🐄 <strong>Species:</strong> {rep.animalType} ({rep.ageYears}y)</div>
                      <div>🩺 <strong>Symptoms:</strong> {rep.symptoms?.slice(0, 3).join(', ')}</div>
                      <div>👨‍🌾 <strong>Farmer:</strong> {rep.farmer?.name || "Farmer"}</div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <StatusBadge status={rep.status} size="sm" />
                      <Link
                        to={`/cases/${rep.id}`}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                      >
                        Inspect Case →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Telemetry Legend HUD */}
        <div className="absolute bottom-6 right-4 z-30 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-4 rounded-3xl shadow-2xl text-xs space-y-2 pointer-events-auto">
          <div className="font-black text-slate-200 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <span>📡</span>
            <span>Surveillance Legend</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500 shrink-0 animate-ping" />
            <span className="font-medium">Critical Urgency (FMD/HS)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500 shrink-0" />
            <span className="font-medium">High Urgency (LSD/PPR/BQ)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500 shrink-0" />
            <span className="font-medium">Moderate Urgency</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 shrink-0" />
            <span className="font-medium">Low Urgency / Routine</span>
          </div>
        </div>

      </div>
    </div>
  );
}
