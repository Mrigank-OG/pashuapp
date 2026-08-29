import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import VetNavigation from '../../components/VetNavigation';

export default function CaseTable() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [diseaseFilter, setDiseaseFilter] = useState('ALL');
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const data = await api.getReports();
        setReports(data);
      } catch (err) {
        console.error("Error loading case table:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  // Filter logic
  const filtered = reports.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id?.toLowerCase().includes(q);
      const matchVillage = item.location?.village?.toLowerCase().includes(q);
      const matchDistrict = item.location?.district?.toLowerCase().includes(q);
      const matchDisease = item.prediction?.disease?.toLowerCase().includes(q);
      const matchFarmer = item.farmer?.name?.toLowerCase().includes(q);
      if (!matchId && !matchVillage && !matchDistrict && !matchDisease && !matchFarmer) {
        return false;
      }
    }

    if (urgencyFilter !== 'ALL' && item.prediction?.urgency?.toLowerCase() !== urgencyFilter.toLowerCase()) {
      return false;
    }

    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }

    if (diseaseFilter !== 'ALL' && item.prediction?.diseaseCode !== diseaseFilter) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'createdAt') {
      valA = new Date(a.createdAt || 0).getTime();
      valB = new Date(b.createdAt || 0).getTime();
    } else if (sortField === 'disease') {
      valA = a.prediction?.disease || '';
      valB = b.prediction?.disease || '';
    } else if (sortField === 'urgency') {
      const rank = { critical: 4, high: 3, moderate: 2, low: 1 };
      valA = rank[a.prediction?.urgency] || 0;
      valB = rank[b.prediction?.urgency] || 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Case ID", "Date", "Species", "Disease", "Confidence", "Urgency", "Status", "Village", "District", "Farmer"];
    const rows = sorted.map(r => [
      r.id,
      r.createdAt,
      r.animalType,
      `"${r.prediction?.disease || ''}"`,
      r.prediction?.confidence,
      r.prediction?.urgency,
      r.status,
      r.location?.village,
      r.location?.district,
      `"${r.farmer?.name || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PashuSwasthya_Cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      <VetNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header Bar */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-700/60">
                Epidemiological Registry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>📑</span>
              <span>Livestock Disease Clinical Case Registry</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search, sort, filter, and review field reports from farmers & rural dispensaries
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls HUD */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-4 sm:p-5 rounded-3xl shadow-lg space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Live Search
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ID, Village, Disease, Farmer..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            {/* Urgency Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Urgency
              </label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
              >
                <option value="ALL">All Urgencies</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="moderate">Moderate Only</option>
                <option value="low">Low Only</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Triage Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Lab Confirmed">Lab Confirmed</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Disease Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Disease Code
              </label>
              <select
                value={diseaseFilter}
                onChange={(e) => setDiseaseFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
              >
                <option value="ALL">All Diagnoses</option>
                <option value="FMD">FMD (Foot & Mouth)</option>
                <option value="LSD">LSD (Lumpy Skin)</option>
                <option value="HS">HS (Hemorrhagic Septicemia)</option>
                <option value="BQ">BQ (Black Quarter)</option>
                <option value="BRUC">Brucellosis</option>
                <option value="PPR">PPR (Goat Plague)</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Showing <strong className="text-white">{sorted.length}</strong> of {reports.length} total records</span>
            <span className="font-mono text-cyan-400">Sort: {sortField} ({sortAsc ? 'Asc' : 'Desc'})</span>
          </div>
        </div>

        {/* Case Table Data Grid */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <span className="animate-spin text-3xl block mb-2">⏳</span> Loading cases database...
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <span className="text-4xl block mb-1">🔎</span>
              <p className="text-base font-bold text-white">No cases match your filters</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or reset filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('id')}>
                      Case ID {sortField === 'id' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('createdAt')}>
                      Date / Time {sortField === 'createdAt' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="p-4">Species</th>
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('disease')}>
                      Predicted Disease {sortField === 'disease' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('urgency')}>
                      Urgency {sortField === 'urgency' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {sorted.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/cases/${item.id}`)}
                      className="hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer group"
                    >
                      <td className="p-4 font-mono font-bold text-cyan-300 group-hover:underline">
                        {item.id}
                      </td>
                      <td className="p-4 text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Recent'}
                      </td>
                      <td className="p-4 capitalize font-semibold text-slate-200">
                        🐄 {item.animalType} ({item.ageYears}y)
                      </td>
                      <td className="p-4 font-bold text-white">
                        <div>{item.prediction?.disease}</div>
                        <span className="text-[10px] text-slate-400 font-mono">Conf: {item.prediction?.confidence}%</span>
                      </td>
                      <td className="p-4">
                        <UrgencyBadge urgency={item.prediction?.urgency} size="sm" />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{item.location?.village}</div>
                        <div className="text-[10px] text-slate-400">{item.location?.district}</div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-3 py-1.5 bg-slate-800 group-hover:bg-cyan-600 text-slate-200 group-hover:text-white rounded-xl text-[11px] font-bold transition shadow-xs">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
