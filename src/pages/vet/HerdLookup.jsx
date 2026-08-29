import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import VetNavigation from '../../components/VetNavigation';

export default function HerdLookup() {
  const [herds, setHerds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHerds = async (q = '') => {
    setLoading(true);
    try {
      const data = await api.getHerds(q);
      setHerds(data);
    } catch (err) {
      console.error("Error fetching herds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHerds();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHerds(searchQuery);
  };

  return (
    <div className="min-h-screen pb-20">
      <VetNavigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header Bar */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-700/60">
              National Livestock Identification System (NLIS)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>🔍</span>
            <span>Livestock & Herd Registry Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cross-district lookup for RFID ear tags, vaccination pedigree, owner profiles and geographical dispensaries
          </p>
        </div>

        {/* Search & Quick Suggestions */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 rounded-3xl shadow-lg space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Owner Name, Village, District, Ear Tag ID (e.g. MH-12-8812)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-2xl transition shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick preset tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-[11px] text-slate-500">Quick Filters:</span>
            {['MH-12-8812', 'Khadakwasla', 'Pune', 'Tukaram', 'Koregaon'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  fetchHerds(tag);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Stream */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="animate-spin text-3xl block mb-2">⏳</span>
            Searching state livestock database...
          </div>
        ) : herds.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl text-center text-slate-400 space-y-3">
            <span className="text-5xl block mb-1">🔎</span>
            <p className="text-base font-bold text-white">No records found for '{searchQuery}'.</p>
            <p className="text-xs text-slate-500">Please check tag ID syntax or verify district jurisdiction.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {herds.map((herd, hIdx) => (
              <div
                key={hIdx}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition"
              >
                {/* Herd Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">
                      Livestock Holding Record
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {herd.ownerName}
                    </h2>
                    <p className="text-xs text-slate-300">
                      📍 {herd.village}, Taluka {herd.block}, {herd.district} • 📞 <strong className="text-cyan-300">{herd.phone}</strong>
                    </p>
                  </div>

                  <span className="text-xs bg-slate-950 text-cyan-300 font-bold px-3.5 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto shadow-xs">
                    {herd.animals?.length || 0} Registered Animals
                  </span>
                </div>

                {/* Animals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {herd.animals?.map((animal) => (
                    <div
                      key={animal.tagId}
                      className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-md hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-cyan-300 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                              🏷️ {animal.tagId}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                              {animal.species} • {animal.age} yrs
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white">
                            {animal.name}
                          </h4>
                        </div>
                      </div>

                      {/* Vaccinations */}
                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                          💉 Vaccination Pedigree:
                        </span>
                        {animal.vaccinations && animal.vaccinations.length > 0 ? (
                          <div className="space-y-1.5">
                            {animal.vaccinations.map((vac, vIdx) => (
                              <div
                                key={vIdx}
                                className="flex items-center justify-between text-[11px] bg-slate-900/90 p-2 rounded-xl border border-slate-800"
                              >
                                <span className="font-bold text-slate-200">
                                  🛡️ {vac.vaccine}
                                </span>
                                <span className="text-slate-400">
                                  {vac.date}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">No vaccine entries logged</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
