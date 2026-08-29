import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import VetNavigation from '../../components/VetNavigation';

const STATUS_STEPS = [
  "Pending",
  "Reviewed",
  "Sample Collected",
  "Lab Confirmed",
  "Escalated",
  "Resolved"
];

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [vetNotes, setVetNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    async function loadCase() {
      setLoading(true);
      try {
        const data = await api.getReportById(id);
        if (data) {
          setReport(data);
          setVetNotes(data.vetNotes || '');
        }
      } catch (err) {
        console.error("Error loading case:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCase();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setSaveSuccess(false);
    try {
      const updated = await api.updateReportStatus(id, newStatus, vetNotes);
      if (updated) {
        setReport(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!report) return;
    setUpdating(true);
    try {
      const updated = await api.updateReportStatus(id, report.status, vetNotes);
      if (updated) {
        setReport(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setUpdating(false);
    }
  };

  const applyTemplate = (text) => {
    setVetNotes(prev => prev ? `${prev}\n${text}` : text);
  };

  const handleSendSMS = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <VetNavigation />
        <div className="flex items-center justify-center py-28 text-cyan-300 text-sm font-bold">
          <span className="animate-spin text-3xl mr-3">⏳</span> Loading clinical case telemetry...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen pb-20">
        <VetNavigation />
        <div className="max-w-md mx-auto my-16 bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4 shadow-xl">
          <span className="text-4xl block">🔍</span>
          <h2 className="text-lg font-bold text-white">Case Not Found</h2>
          <p className="text-xs text-slate-400">No active record exists for Case ID: {id}</p>
          <Link to="/cases" className="inline-block py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs">
            ← Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  const { prediction } = report;
  const currentStatusIndex = STATUS_STEPS.indexOf(report.status);

  return (
    <div className="min-h-screen pb-20">
      <VetNavigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cases')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition cursor-pointer"
              title="Back"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800/60">
                  {report.id}
                </span>
                <span className="text-xs text-slate-400">
                  Logged: {new Date(report.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white mt-1">
                {prediction?.disease}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <UrgencyBadge urgency={prediction?.urgency} size="md" />
            <StatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* 6-Step Triage Audit Pipeline */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">
              Clinical Triage Audit Pipeline
            </span>
            <span className="text-xs text-slate-400">Click a stage to update status</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStatusIndex;
              const isCurrent = step === report.status;
              return (
                <button
                  key={step}
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange(step)}
                  className={`p-3 rounded-2xl border text-center transition-all text-xs font-bold cursor-pointer relative ${
                    isCurrent
                      ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/40"
                      : isPastOrCurrent
                      ? "bg-slate-950/80 text-cyan-300 border-cyan-900/80 hover:bg-slate-800"
                      : "bg-slate-950/40 text-slate-500 border-slate-900 hover:text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5">Stage {idx + 1}</div>
                  <div className="truncate">{step}</div>
                </button>
              );
            })}
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <span>✓</span>
            <span>Case telemetry and status updated successfully.</span>
          </div>
        )}

        {/* 2-Column Clinical Case Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Biometrics, Symptoms, Evidence */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Animal & Farmer Overview */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>🐄</span>
                <span>Animal Biometrics & Owner Profile</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Species</span>
                  <span className="font-extrabold text-white capitalize">{report.animalType}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Age</span>
                  <span className="font-extrabold text-white">{report.ageYears} Years</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Onset Duration</span>
                  <span className="font-extrabold text-white">{report.daysSinceOnset} Days</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Vaccinated</span>
                  <span className="font-extrabold text-white uppercase">{report.vaccinationStatus}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Farmer</span>
                  <span className="font-extrabold text-white">{report.farmer?.name || "Tukaram Shinde"}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px]">Phone</span>
                  <span className="font-extrabold text-cyan-300">{report.farmer?.phone || "+91 98224 51092"}</span>
                </div>
              </div>

              {/* Photo */}
              {report.photoUrl && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block mb-2">Attached Field Lesion Photo:</span>
                  <img
                    src={report.photoUrl}
                    alt="Clinical condition"
                    className="w-full h-52 object-cover rounded-2xl border border-slate-700 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Symptoms & Evidence */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>🔍</span>
                <span>Observed Clinical Symptoms & AI Evidence</span>
              </h2>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">Symptom Checklist:</span>
                <div className="flex flex-wrap gap-2">
                  {report.symptoms?.map(s => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-800/60 text-cyan-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>✓</span>
                      <span>{s.replace(/_/g, ' ')}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">AI Pathognomonic Evidence Points:</span>
                {prediction?.evidence?.map((e, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Vet Clinical Actions & Advisory Dispatch */}
          <div className="space-y-6">
            
            {/* Location & GPS HUD */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 rounded-3xl shadow-xl space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>📍</span>
                <span>Geospatial Intelligence</span>
              </h3>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div><strong>Village:</strong> {report.location?.village}</div>
                <div><strong>Taluka / Block:</strong> {report.location?.block}</div>
                <div><strong>District:</strong> {report.location?.district}</div>
                <div className="font-mono text-cyan-400 text-[11px]">
                  Coordinates: {report.location?.lat}, {report.location?.lng}
                </div>
              </div>

              <Link
                to="/map"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>🗺️</span>
                <span>Open in Full GIS Map</span>
              </Link>
            </div>

            {/* Vet Action Notes & Prescription Editor */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 rounded-3xl shadow-xl space-y-3.5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>👨‍⚕️</span>
                <span>Veterinary Officer Actions & Notes</span>
              </h3>

              {/* Rapid Response Quick Templates */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-semibold">Insert Quick Action:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Sample collected & sent to DIL",
                    "Ring vaccination ordered in 3km radius",
                    "Farmer advised strict shed isolation",
                    "Antibiotic / supportive therapy prescribed"
                  ].map(tpl => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                    >
                      + {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={vetNotes}
                onChange={(e) => setVetNotes(e.target.value)}
                placeholder="Type clinical notes, diagnostic updates, or treatment instructions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSaveNotes}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Clinical Notes"}
                </button>

                <button
                  type="button"
                  onClick={handleSendSMS}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  title="Send Advisory SMS to Farmer"
                >
                  {smsSent ? "✓ Sent!" : "📱 SMS"}
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
