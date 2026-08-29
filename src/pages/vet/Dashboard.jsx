import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import VetNavigation from '../../components/VetNavigation';

export default function Dashboard() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [repData, obData] = await Promise.all([
          api.getReports(),
          api.getOutbreaks()
        ]);
        setReports(repData);
        setOutbreaks(obData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute KPIs
  const totalReportsToday = reports.length;
  const activeOutbreaks = outbreaks.filter(o => o.status === 'Active');
  const activeOutbreakCount = activeOutbreaks.length;
  const highCriticalCases = reports.filter(r => 
    r.prediction?.urgency === 'high' || r.prediction?.urgency === 'critical'
  ).length;

  return (
    <div className="min-h-screen pb-20">
      <VetNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Command Center Jurisdiction Header */}
        <div className="bg-gradient-to-r from-slate-900/95 via-[#0D1527] to-slate-900/95 border border-cyan-500/25 p-6 sm:p-7 rounded-3xl shadow-2xl shadow-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-700/60">
                  Government of Maharashtra • Animal Disease Surveillance Network
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Western Maharashtra Triage & Outbreak Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Real-time syndromic feed, AI-assisted pathognomonic triage & spatial epidemic clustering
              </p>
            </div>

            {/* Quick Command Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/map"
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                <span>🗺️</span>
                <span>GIS Radar Map</span>
              </Link>
              <Link
                to="/outbreaks"
                className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-750 text-rose-300 border border-rose-800/60 hover:border-rose-600 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>⚠️</span>
                <span>Threat Alerts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Cyber KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          
          {/* KPI 1 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-6 rounded-3xl shadow-xl hover:border-cyan-500/50 transition-all duration-200 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('totalReportsToday')}
              </span>
              <span className="text-xl p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                📋
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white mt-1">
              {loading ? "..." : totalReportsToday}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-3 font-semibold">
              <span className="bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-700/60">↑ 18%</span>
              <span className="text-slate-400">vs 7-day baseline</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-900/50 p-5 sm:p-6 rounded-3xl shadow-xl hover:border-rose-500/60 transition-all duration-200 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                {t('highUrgencyCases')}
              </span>
              <span className="text-xl p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-700/60 animate-pulse">
                🚨
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-rose-200 mt-1">
              {loading ? "..." : highCriticalCases}
            </div>
            <div className="text-[11px] text-rose-400 flex items-center gap-1.5 mt-3 font-semibold">
              <span>⚠️ Action required:</span>
              <span className="text-slate-300">Triage pending</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-6 rounded-3xl shadow-xl hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('activeOutbreakClusters')}
              </span>
              <span className="text-xl p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60">
                🔥
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-300 mt-1">
              {loading ? "..." : activeOutbreakCount}
            </div>
            <div className="text-[11px] text-amber-400 flex items-center gap-1.5 mt-3 font-semibold">
              <span>🛡️ Tier-1 buffer:</span>
              <span className="text-slate-300">5km active rings</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-6 rounded-3xl shadow-xl hover:border-indigo-500/50 transition-all duration-200 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('avgResponseTime')}
              </span>
              <span className="text-xl p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
                ⚡
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-indigo-300 mt-1">
              2.4 hrs
            </div>
            <div className="text-[11px] text-indigo-400 flex items-center gap-1.5 mt-3 font-semibold">
              <span className="bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-700/60">Target: &lt;4h</span>
              <span className="text-slate-400">98% on-time</span>
            </div>
          </div>

        </div>

        {/* 2-Column Command Deck Content: Active Threat Radar & Rapid Triage Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Live Rapid Triage Queue (2 Cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Incoming Field Triage Queue
                </h2>
              </div>
              <Link
                to="/cases"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Full Registry ({reports.length}) →
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <span className="animate-spin text-2xl block mb-2">⏳</span> Loading triage feed...
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-4 sm:p-5 shadow-lg hover:border-cyan-500/40 transition-all duration-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                          {rep.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          📍 {rep.location?.village}, {rep.location?.district}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <UrgencyBadge urgency={rep.prediction?.urgency} size="sm" />
                        <StatusBadge status={rep.status} size="sm" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <h3 className="text-base font-black text-white leading-tight">
                          {rep.prediction?.disease}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          🐄 <strong>{rep.animalType?.toUpperCase()}</strong> ({rep.ageYears}y) • Farmer: {rep.farmer?.name || "Local Farmer"} • 📞 {rep.farmer?.phone}
                        </p>
                      </div>

                      <Link
                        to={`/cases/${rep.id}`}
                        className="px-4 py-2 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <span>Review & Dispatch</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Active Outbreak Threats & Species Breakdown */}
          <div className="space-y-4">
            
            {/* Outbreak Threat Radar Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Active Outbreak Clusters
                  </h3>
                </div>
                <Link to="/outbreaks" className="text-xs font-bold text-cyan-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {outbreaks.slice(0, 3).map((ob) => (
                  <div
                    key={ob.id}
                    className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-rose-600/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{ob.diseaseName}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        ob.status === 'Active' ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}>
                        {ob.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      📍 {ob.village}, Taluka {ob.block}, {ob.district}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900 text-slate-300 font-semibold">
                      <span className="text-rose-400">🔥 {ob.casesCount} Cases</span>
                      <span>Buffer: {ob.radiusKm} km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Species Susceptibility Breakdown */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3.5">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>📊</span>
                <span>Species Syndromic Breakdown</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: "Cattle (गाय)", pct: 64, color: "bg-emerald-500" },
                  { name: "Buffalo (म्हैस)", pct: 22, color: "bg-cyan-500" },
                  { name: "Goat (शेळी)", pct: 10, color: "bg-amber-500" },
                  { name: "Sheep (मेंढी)", pct: 4, color: "bg-purple-500" }
                ].map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-400">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
