import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import VetNavigation from '../../components/VetNavigation';

export default function OutbreakAlerts() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [broadcastActiveId, setBroadcastActiveId] = useState(null);

  useEffect(() => {
    async function loadOutbreaks() {
      setLoading(true);
      try {
        const data = await api.getOutbreaks();
        setOutbreaks(data);
      } catch (err) {
        console.error("Error loading outbreaks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOutbreaks();
  }, []);

  const filtered = outbreaks.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleSimulateBroadcast = (id) => {
    setBroadcastActiveId(id);
    setTimeout(() => {
      setBroadcastActiveId(null);
      alert("Broadcast SMS dispatched to 1,240 livestock farmers within the containment buffer.");
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20">
      <VetNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900/95 via-[#161220] to-slate-900/95 border border-rose-900/50 p-6 sm:p-7 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-950/80 px-3 py-0.5 rounded-full border border-rose-700/60">
                Epidemic Cluster Early Warning Protocol
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>⚠️</span>
              <span>Prioritized Outbreak & Cluster Threat Intelligence</span>
            </h1>
            <p className="text-xs text-slate-300">
              Automated syndromic spatio-temporal clustering across Maharashtra talukas
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            {['ALL', 'Active', 'Contained', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Outbreaks Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="animate-spin text-3xl block mb-2">⏳</span>
            Analyzing spatial epidemic clusters...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl text-center text-slate-400 space-y-3">
            <span className="text-5xl block mb-1">🛡️</span>
            <p className="text-base font-bold text-white">No outbreaks found under '{statusFilter}' status.</p>
            <p className="text-xs text-slate-500">Jurisdiction quarantine status is currently clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ob) => {
              const isActive = ob.status === 'Active';
              const isBroadcasting = broadcastActiveId === ob.id;

              return (
                <div
                  key={ob.id}
                  className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl space-y-4 relative overflow-hidden transition-all duration-200 hover:border-slate-600 ${
                    isActive ? "border-rose-900/60 ring-1 ring-rose-500/20 shadow-rose-950/20" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-black bg-slate-950 px-2.5 py-1 rounded-lg text-cyan-300 border border-slate-800">
                      {ob.id}
                    </span>
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full border shadow-sm ${
                        isActive
                          ? "bg-rose-950/80 text-rose-200 border-rose-600/80 animate-pulse"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-600/80"
                      }`}
                    >
                      {ob.status}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-white leading-tight">
                      {ob.diseaseName}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      📍 {ob.village}, Taluka {ob.block}, {ob.district}
                    </p>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Cluster Cases</span>
                      <span className="text-base font-black text-rose-400">{ob.casesCount} Animals</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">First Logged</span>
                      <span className="font-bold text-slate-200">{ob.firstReported}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Buffer Zone</span>
                      <span className="font-bold text-cyan-300">{ob.radiusKm} km Radius</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Containment</span>
                      <span className="font-bold text-amber-300">Tier 1 Ring</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-300 block">Containment Protocol:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                      {ob.containmentAction}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      disabled={isBroadcasting}
                      onClick={() => handleSimulateBroadcast(ob.id)}
                      className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isBroadcasting ? "Broadcasting..." : "📲 Broadcast Alert"}
                    </button>

                    <Link
                      to="/map"
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold text-center transition"
                    >
                      GIS Radar →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
