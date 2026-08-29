import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import FarmerTabs from '../../components/FarmerTabs';

export default function MyHerd() {
  const { t } = useLanguage();
  const [herdData, setHerdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState('ALL');
  const [searchTag, setSearchTag] = useState('');

  // Modals state
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [selectedTagForVaccine, setSelectedTagForVaccine] = useState('');

  // Add Animal form states
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('Cattle');
  const [newAge, setNewAge] = useState(3);

  // Add Vaccine form states
  const [vaccineName, setVaccineName] = useState('FMD (Foot & Mouth)');
  const [vaccineDate, setVaccineDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDue, setNextDue] = useState('6 Months');

  const fetchHerd = async () => {
    setLoading(true);
    try {
      const data = await api.getHerds();
      setHerdData(data);
    } catch (err) {
      console.error("Error fetching herd:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHerd();
  }, []);

  const handleAddAnimalSubmit = async (e) => {
    e.preventDefault();
    await api.addAnimalToHerd({
      tagId: newTag || `MH-12-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName || "Cow",
      species: newSpecies,
      age: Number(newAge) || 2
    });
    setShowAddAnimalModal(false);
    setNewTag('');
    setNewName('');
    fetchHerd();
  };

  const handleAddVaccineSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTagForVaccine) return;
    await api.addVaccinationRecord(selectedTagForVaccine, {
      vaccine: vaccineName,
      date: vaccineDate,
      nextDue: nextDue
    });
    setShowAddVaccineModal(false);
    fetchHerd();
  };

  const currentHerd = herdData[0] || { ownerName: "Tukaram G. Shinde", village: "Khadakwasla, Haveli, Pune", animals: [] };
  const allAnimals = currentHerd.animals || [];

  const filteredAnimals = allAnimals.filter((animal) => {
    if (selectedSpeciesFilter !== 'ALL' && animal.species.toLowerCase() !== selectedSpeciesFilter.toLowerCase()) {
      return false;
    }
    if (searchTag.trim()) {
      const q = searchTag.toLowerCase();
      const matchTag = animal.tagId?.toLowerCase().includes(q);
      const matchName = animal.name?.toLowerCase().includes(q);
      if (!matchTag && !matchName) return false;
    }
    return true;
  });

  const totalVaccinated = allAnimals.filter(a => a.vaccinations && a.vaccinations.length > 0).length;
  const vacRate = allAnimals.length > 0 ? Math.round((totalVaccinated / allAnimals.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-28 pt-4 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <FarmerTabs />

        {/* Herd Profile Header Deck */}
        <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  National Livestock Registry
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>🐄</span>
                <span>{t('myHerdTitle')}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {currentHerd.ownerName} • 📍 {currentHerd.village || "Khadakwasla, Haveli, Pune"}
              </p>
            </div>

            <button
              onClick={() => setShowAddAnimalModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-950/50 transition active:scale-95 self-start sm:self-auto cursor-pointer"
            >
              <span>➕</span>
              <span>{t('addAnimal')}</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-slate-400 text-[11px] block font-bold">Total Herd</span>
              <span className="text-lg sm:text-xl font-black text-white">{allAnimals.length}</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-emerald-400 text-[11px] block font-bold">Vaccine Coverage</span>
              <span className="text-lg sm:text-xl font-black text-emerald-300">{vacRate}%</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-cyan-400 text-[11px] block font-bold">Health Tracked</span>
              <span className="text-lg sm:text-xl font-black text-cyan-300">100%</span>
            </div>
          </div>

          {/* Search & Species Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                placeholder="Search by Ear Tag ID or Name..."
                className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['ALL', 'Cattle', 'Buffalo', 'Goat', 'Sheep'].map(sp => (
                <button
                  key={sp}
                  onClick={() => setSelectedSpeciesFilter(sp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedSpeciesFilter === sp
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animals Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <span className="animate-spin text-3xl block mb-3">⏳</span>
            {t('loading')}
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 text-center space-y-4">
            <span className="text-5xl block mb-1">🐄</span>
            <p className="text-base font-bold text-slate-200">{t('noAnimals')}</p>
            <button
              onClick={() => setShowAddAnimalModal(true)}
              className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
            >
              {t('addAnimal')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAnimals.map((animal) => (
              <div
                key={animal.tagId}
                className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-5 sm:p-6 shadow-lg hover:border-emerald-500/40 transition-all duration-200 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-black bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                        <span>🏷️</span>
                        <span>{animal.tagId}</span>
                      </span>
                      <span className="text-xs font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {animal.species} • {animal.age} yrs
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">
                      {animal.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTagForVaccine(animal.tagId);
                      setShowAddVaccineModal(true);
                    }}
                    className="px-3.5 py-2 bg-slate-800/90 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/60 rounded-xl text-xs font-bold transition shrink-0 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>💉</span>
                    <span>Log Vaccine</span>
                  </button>
                </div>

                {/* Vaccination History Records */}
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 block mb-2">
                    💉 {t('vaccineHistory')}:
                  </span>

                  {animal.vaccinations && animal.vaccinations.length > 0 ? (
                    <div className="space-y-2">
                      {animal.vaccinations.map((vac, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🛡️</span>
                            <span className="font-bold text-slate-200">
                              {vac.vaccine}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                            <span>Given: <strong className="text-slate-300">{vac.date}</strong></span>
                            {vac.nextDue && (
                              <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-600/50 font-bold">
                                Next: {vac.nextDue}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      {t('noVaccines')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Animal */}
        {showAddAnimalModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🐄</span>
                  <span>{t('addAnimal')}</span>
                </h3>
                <button
                  onClick={() => setShowAddAnimalModal(false)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAnimalSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ear Tag ID (बिल्ला क्र.)
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. MH-12-9921"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Animal Name / Identifier (नाव) *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ganga Cow"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Species *
                    </label>
                    <select
                      value={newSpecies}
                      onChange={(e) => setNewSpecies(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Cattle">Cattle (गाय)</option>
                      <option value="Buffalo">Buffalo (म्हैस)</option>
                      <option value="Goat">Goat (शेळी)</option>
                      <option value="Sheep">Sheep (मेंढी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAnimalModal(false)}
                    className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Vaccine Record */}
        {showAddVaccineModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>💉</span>
                  <span>{t('addVaccination')}</span>
                </h3>
                <button
                  onClick={() => setShowAddVaccineModal(false)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs bg-emerald-950/60 text-emerald-300 p-3 rounded-2xl border border-emerald-500/40">
                Logging for Ear Tag ID: <strong className="font-mono">{selectedTagForVaccine}</strong>
              </div>

              <form onSubmit={handleAddVaccineSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Vaccine Protocol *
                  </label>
                  <select
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="FMD (Foot & Mouth)">FMD (Foot & Mouth Disease)</option>
                    <option value="Lumpy Skin Booster">Lumpy Skin Disease (LSD) Booster</option>
                    <option value="HS (Hemorrhagic Septicemia)">HS (Hemorrhagic Septicemia)</option>
                    <option value="BQ (Black Quarter)">BQ (Black Quarter)</option>
                    <option value="Brucellosis S19">Brucellosis S19</option>
                    <option value="PPR (Goat Plague)">PPR (Peste des Petits Ruminants)</option>
                    <option value="Anthrax Spore Vaccine">Anthrax Spore Vaccine</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Date Given *
                    </label>
                    <input
                      type="date"
                      value={vaccineDate}
                      onChange={(e) => setVaccineDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-100 cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Next Due Interval
                    </label>
                    <input
                      type="text"
                      value={nextDue}
                      onChange={(e) => setNextDue(e.target.value)}
                      placeholder="e.g. 6 Months"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddVaccineModal(false)}
                    className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
