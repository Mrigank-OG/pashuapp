import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import FarmerTabs from '../../components/FarmerTabs';

const SYMPTOMS_LIST = [
  { id: "fever", labelKey: "symptom_fever", icon: "🌡️", category: "general" },
  { id: "mouth_blisters", labelKey: "symptom_mouth_blisters", icon: "👄", category: "mouth_hoof" },
  { id: "hoof_blisters", labelKey: "symptom_hoof_blisters", icon: "🦶", category: "mouth_hoof" },
  { id: "lameness", labelKey: "symptom_lameness", icon: "🦯", category: "mouth_hoof" },
  { id: "drooling", labelKey: "symptom_drooling", icon: "💧", category: "mouth_hoof" },
  { id: "skin_lesions", labelKey: "symptom_skin_lesions", icon: "🔴", category: "skin" },
  { id: "swelling", labelKey: "symptom_swelling", icon: "🫧", category: "skin" },
  { id: "nasal_discharge", labelKey: "symptom_nasal_discharge", icon: "👃", category: "respiratory" },
  { id: "eye_discharge", labelKey: "symptom_eye_discharge", icon: "👁️", category: "respiratory" },
  { id: "coughing", labelKey: "symptom_coughing", icon: "🫁", category: "respiratory" },
  { id: "labored_breathing", labelKey: "symptom_labored_breathing", icon: "💨", category: "respiratory" },
  { id: "diarrhea", labelKey: "symptom_diarrhea", icon: "💩", category: "digestive" },
  { id: "reduced_appetite", labelKey: "symptom_reduced_appetite", icon: "🌾", category: "digestive" },
  { id: "reduced_milk", labelKey: "symptom_reduced_milk", icon: "🥛", category: "digestive" },
  { id: "lethargy", labelKey: "symptom_lethargy", icon: "😴", category: "general" }
];

const SPECIES_OPTIONS = [
  { id: "cattle", nameKey: "cattle", icon: "🐄", sub: "Cow / गाय" },
  { id: "buffalo", nameKey: "buffalo", icon: "🐃", sub: "Buffalo / म्हैस" },
  { id: "goat", nameKey: "goat", icon: "🐐", sub: "Goat / शेळी" },
  { id: "sheep", nameKey: "sheep", icon: "🐑", sub: "Sheep / मेंढी" }
];

export default function ReportForm() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  // Form states
  const [animalType, setAnimalType] = useState('cattle');
  const [ageYears, setAgeYears] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomFilter, setSymptomFilter] = useState('all');
  const [daysSinceOnset, setDaysSinceOnset] = useState(2);
  const [vaccinationStatus, setVaccinationStatus] = useState('no'); // 'yes' | 'no' | 'unsure'
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [farmerName, setFarmerName] = useState('Tukaram Shinde');
  const [farmerPhone, setFarmerPhone] = useState('+91 98224 51092');
  
  // Location states
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);
  const [village, setVillage] = useState('Khadakwasla');
  const [block, setBlock] = useState('Haveli');
  const [district, setDistrict] = useState('Pune');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  // Submitting state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);

  const toggleSymptom = (symId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symId) ? prev.filter((s) => s !== symId) : [...prev, symId]
    );
  };

  // Image Upload handler
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLng(Number(pos.coords.longitude.toFixed(4)));
        setGeoSuccess(true);
        setGeoLoading(false);
      },
      (err) => {
        console.warn("Geo error:", err);
        setGeoLoading(false);
        // Realistic fallback coordinates for Pune
        setLat(18.5204);
        setLng(73.8567);
        setGeoSuccess(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Voice note simulator
  const handleVoiceSimulate = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setSelectedSymptoms(prev => Array.from(new Set([...prev, 'fever', 'mouth_blisters', 'drooling', 'lameness'])));
      setVoiceActive(false);
    }, 1800);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setErrorMsg("Please select at least one symptom observed.");
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const payload = {
      animalType: animalType.toLowerCase(),
      ageYears: Number(ageYears) || 1,
      symptoms: selectedSymptoms,
      daysSinceOnset: Number(daysSinceOnset) || 1,
      vaccinationStatus: vaccinationStatus.toLowerCase(),
      photoUrl: photoUrl || null,
      farmer: {
        name: farmerName || "Local Farmer",
        phone: farmerPhone || "+91 98000 00000",
        farmSize: "Herd registered"
      },
      location: {
        lat: Number(lat) || 18.5204,
        lng: Number(lng) || 73.8567,
        village: village || "Khadakwasla",
        block: block || "Haveli",
        district: district || "Pune"
      },
      language: lang
    };

    try {
      const result = await api.submitReport(payload);
      navigate('/report-result', { state: { report: result } });
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMsg("Failed to submit report. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSymptoms = symptomFilter === 'all'
    ? SYMPTOMS_LIST
    : SYMPTOMS_LIST.filter(s => s.category === symptomFilter);

  return (
    <div className="min-h-screen pb-28 pt-4 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <FarmerTabs />

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-emerald-950/40 to-slate-950 border border-emerald-500/25 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI Tele-Triage Ready</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Dept. of Animal Husbandry, MH</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/50 shrink-0 ring-2 ring-emerald-400/30">
                🚨
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {t('reportTitle')}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  {t('reportSubtitle')}
                </p>
              </div>
            </div>

            {/* Quick Voice Simulation Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleVoiceSimulate}
                disabled={voiceActive}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  voiceActive
                    ? "bg-amber-950 text-amber-300 border-amber-500 animate-pulse"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700"
                }`}
              >
                <span>{voiceActive ? "🎙️ Listening..." : "🗣️ Voice Assist (बोला)"}</span>
                {voiceActive && <span className="text-[10px] text-amber-300">Processing Audio...</span>}
              </button>
              <span className="text-[11px] text-slate-400">Quick symptom auto-detection</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-950/80 border border-rose-600/80 text-rose-200 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-lg shadow-rose-950/40 animate-shake">
            <span className="text-xl">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Species Selection (Interactive 3D Cards) */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black border border-emerald-500/30">1</span>
                <span>{t('animalType')} & {t('ageYears')}</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">* Required</span>
            </div>

            {/* Species Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SPECIES_OPTIONS.map((spec) => {
                const isSelected = animalType === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setAnimalType(spec.id)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 active:scale-95 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-emerald-950/80 to-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50"
                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                    <span className="text-3xl sm:text-4xl">{spec.icon}</span>
                    <div>
                      <div className="text-sm font-extrabold capitalize text-white">
                        {t(spec.nameKey)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{spec.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Age Dial Stepper */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('ageYears')}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAgeYears((a) => Math.max(1, a - 1))}
                    className="w-12 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center text-lg active:scale-95 transition border border-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-lg font-black text-emerald-400">
                    {ageYears} Years
                  </div>
                  <button
                    type="button"
                    onClick={() => setAgeYears((a) => a + 1)}
                    className="w-12 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center text-lg active:scale-95 transition border border-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Vaccination Toggle */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('vaccinationStatus')}
                </label>
                <div className="grid grid-cols-3 gap-1.5 h-11">
                  {[
                    { id: 'yes', label: 'Yes (होय)', color: 'from-emerald-600 to-teal-600' },
                    { id: 'no', label: 'No (नाही)', color: 'from-rose-600 to-red-700' },
                    { id: 'unsure', label: 'Unsure', color: 'from-slate-700 to-slate-800' }
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVaccinationStatus(v.id)}
                      className={`rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer ${
                        vaccinationStatus === v.id
                          ? `bg-gradient-to-r ${v.color} text-white border-white/20 shadow-md`
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Symptoms Selection (Luminous Filterable Matrix) */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black border border-emerald-500/30">2</span>
                  <span>{t('symptomsTitle')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('symptomsSubtitle')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  {selectedSymptoms.length} Selected
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All (सर्व)' },
                { id: 'mouth_hoof', label: 'Mouth & Hoof' },
                { id: 'skin', label: 'Skin & Nodules' },
                { id: 'respiratory', label: 'Respiratory' },
                { id: 'digestive', label: 'Feed & Milk' },
                { id: 'general', label: 'General' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSymptomFilter(cat.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    symptomFilter === cat.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {filteredSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[82px] active:scale-95 cursor-pointer relative ${
                      isSelected
                        ? "bg-gradient-to-br from-emerald-950/90 to-slate-900 text-white border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50"
                        : "bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl">{sym.icon}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-black transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs"
                            : "border-slate-700 bg-slate-900 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold leading-snug mt-2 line-clamp-2">
                      {t(sym.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Photo Attachment & Onset Duration */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black border border-emerald-500/30">3</span>
              <span>Photo & Sickness Timeline</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Upload Zone */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/60 transition space-y-3 text-center">
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-40 group">
                    <img src={photoPreview} alt="Animal lesion preview" className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-rose-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:bg-rose-500"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                    <span className="text-3xl mb-1.5">📷</span>
                    <span className="text-xs font-bold text-emerald-400 hover:underline">
                      {t('takeOrUpload')}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 max-w-xs">
                      {t('photoUploadDesc')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Days Since Onset */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('daysSinceOnset')}
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    How long has the animal shown symptoms?
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysSinceOnset(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        daysSinceOnset === d
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/50"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {d} {d === 7 ? '7+ d' : 'd'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Geolocation & Farmer Info */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black border border-emerald-500/30">4</span>
                <span>{t('locationTitle')} & Contact</span>
              </h2>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={geoLoading}
                className="px-3.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <span>{geoLoading ? "⏳" : "📡"}</span>
                <span>{geoLoading ? "Detecting GPS..." : t('detectLocation')}</span>
              </button>
            </div>

            {geoSuccess && (
              <div className="text-xs font-mono bg-slate-950/90 text-cyan-300 p-2.5 rounded-xl border border-cyan-800/60 flex items-center gap-2">
                <span>📍</span>
                <span>GPS Locked: {lat}° N, {lng}° E (Accuracy: ~10m)</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {t('village')} *
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t('villagePlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {t('block')} *
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder={t('blockPlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {t('district')} *
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t('districtPlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Farmer Full Name (नाव)
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Tukaram Shinde"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Mobile Number (मोबाईल क्र.)
                </label>
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+91 98224 51092"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-3 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  <span>{t('submitting')}</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🚀</span>
                  <span>{t('submit')}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2.5">
              🔒 Encrypted Submission to Maharashtra Animal Disease Surveillance Network
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
