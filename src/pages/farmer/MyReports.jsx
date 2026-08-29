import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import FarmerTabs from '../../components/FarmerTabs';

export default function MyReports() {
  const { lang, t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredReports = reports.filter((rep) => {
    if (filterUrgency !== 'ALL' && rep.prediction?.urgency?.toLowerCase() !== filterUrgency.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = rep.id?.toLowerCase().includes(q);
      const matchDisease = rep.prediction?.disease?.toLowerCase().includes(q);
      const matchVillage = rep.location?.village?.toLowerCase().includes(q);
      if (!matchId && !matchDisease && !matchVillage) return false;
    }
    return true;
  });

  const totalReports = reports.length;
  const criticalCount = reports.filter(r => r.prediction?.urgency === 'critical' || r.prediction?.urgency === 'high').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="min-h-screen pb-28 pt-4 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <FarmerTabs />

        {/* Header & Quick Summary */}
        <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <span className="text-2xl">📋</span>
                <span>{t('myReportsTitle')}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {t('myReportsSubtitle')}
              </p>
            </div>

            <Link
              to="/report"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-950/50 transition active:scale-95 self-start sm:self-auto cursor-pointer"
            >
              <span>➕</span>
              <span>{t('navReport')}</span>
            </Link>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-slate-400 text-[11px] block font-bold">Total Filed</span>
              <span className="text-lg sm:text-xl font-black text-white">{totalReports}</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-rose-400 text-[11px] block font-bold">High / Critical</span>
              <span className="text-lg sm:text-xl font-black text-rose-300">{criticalCount}</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-emerald-400 text-[11px] block font-bold">Resolved Cases</span>
              <span className="text-lg sm:text-xl font-black text-emerald-300">{resolvedCount}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, Disease, Village..."
                className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Urgency Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterUrgency(lvl)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    filterUrgency === lvl
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Feed */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <span className="animate-spin text-3xl block mb-3">⏳</span>
            {t('loading')}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 text-center space-y-4">
            <span className="text-5xl block mb-1">📭</span>
            <p className="text-base font-bold text-slate-200">{t('noReports')}</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No reports match your selected search criteria. File a new report to trigger health surveillance.
            </p>
            <Link
              to="/report"
              className="inline-block py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black rounded-xl shadow-lg"
            >
              {t('navReport')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredReports.map((rep) => {
              const isExpanded = expandedId === rep.id;
              const dateStr = rep.createdAt ? new Date(rep.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recently';

              const advisory = rep.prediction?.advisories?.[lang] || rep.prediction?.advisories?.['en'];

              return (
                <div
                  key={rep.id}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/90 shadow-lg overflow-hidden transition-all duration-200 hover:border-emerald-500/40"
                >
                  <div
                    onClick={() => toggleExpand(rep.id)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 select-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-cyan-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                          {rep.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          🕒 {dateStr}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                        {rep.prediction?.disease || "Reported Health Condition"}
                      </h3>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-bold text-emerald-400 capitalize">
                          🐄 {rep.animalType} ({rep.ageYears} yrs)
                        </span>
                        <span>📍 {rep.location?.village}, {rep.location?.district}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:flex-col sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                      <UrgencyBadge urgency={rep.prediction?.urgency} size="sm" />
                      <StatusBadge status={rep.status} size="sm" />
                    </div>
                  </div>

                  {/* Collapsible Details Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 p-5 border-t border-slate-800/90 text-xs space-y-4">
                      {/* Symptoms Chips */}
                      <div>
                        <span className="font-bold text-slate-300 block mb-1.5">
                          Reported Clinical Symptoms:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rep.symptoms?.map((s) => (
                            <span
                              key={s}
                              className="bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-xl text-slate-200 font-semibold"
                            >
                              ✓ {s.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Photo Thumbnail */}
                      {rep.photoUrl && (
                        <div>
                          <span className="font-bold text-slate-300 block mb-1.5">Attached Image:</span>
                          <img
                            src={rep.photoUrl}
                            alt="Reported condition"
                            onClick={() => setSelectedPhoto(rep.photoUrl)}
                            className="w-36 h-36 object-cover rounded-2xl border border-slate-700 cursor-pointer hover:opacity-90 transition shadow-md"
                          />
                        </div>
                      )}

                      {/* Advisory Box */}
                      {advisory && (
                        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-amber-200 space-y-1">
                          <span className="font-black text-amber-300 flex items-center gap-1.5">
                            <span>📋</span>
                            <span>Advisory / उपचारात्मक सल्ला:</span>
                          </span>
                          <p className="leading-relaxed text-slate-200">{advisory}</p>
                        </div>
                      )}

                      {/* Vet Official Note */}
                      {rep.vetNotes && (
                        <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-cyan-200 space-y-1">
                          <span className="font-black text-cyan-300 flex items-center gap-1.5">
                            <span>👨‍⚕️</span>
                            <span>Veterinary Officer Case Notes:</span>
                          </span>
                          <p className="leading-relaxed text-slate-200">{rep.vetNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
          >
            <div className="max-w-lg w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-2">
              <img src={selectedPhoto} alt="Zoomed view" className="w-full h-auto rounded-2xl max-h-[75vh] object-contain" />
              <p className="text-center text-xs text-slate-400 py-2">Tap anywhere to dismiss</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
