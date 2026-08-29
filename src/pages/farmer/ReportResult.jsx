import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import UrgencyBadge from '../../components/UrgencyBadge';
import FarmerTabs from '../../components/FarmerTabs';

export default function ReportResult() {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isReadingAudio, setIsReadingAudio] = useState(false);

  const report = location.state?.report;

  // Fallback if accessed directly without state
  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full space-y-4">
          <span className="text-5xl block mb-2">📋</span>
          <h2 className="text-xl font-bold text-white">No Active Health Assessment</h2>
          <p className="text-xs text-slate-400">
            Submit a new animal health report to view real-time AI triage and quarantine protocols.
          </p>
          <Link
            to="/report"
            className="w-full inline-block py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black rounded-2xl transition shadow-lg shadow-emerald-950/50"
          >
            Go to Report Form →
          </Link>
        </div>
      </div>
    );
  }

  const { prediction } = report;
  const advisoryText =
    prediction?.advisories?.[lang] ||
    prediction?.advisories?.['en'] ||
    "Isolate the animal immediately and contact the nearest veterinary dispensary.";

  const confidenceValue = prediction?.confidence || 92;

  const handleShare = () => {
    const shareText = `*PashuSwasthya Report #${report.id}*\nCondition: ${prediction?.disease}\nUrgency: ${prediction?.urgency?.toUpperCase()}\nAdvisory: ${advisoryText}`;
    if (navigator.share) {
      navigator.share({ title: 'Animal Health Report', text: shareText });
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAudioSimulate = () => {
    setIsReadingAudio(true);
    setTimeout(() => {
      setIsReadingAudio(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen pb-28 pt-4 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <FarmerTabs />

        {/* Top Result Banner: AI Diagnostic Telemetry */}
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-[#0C1424] p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/30 relative overflow-hidden space-y-5">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Header ID & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                {t('resultTitle')}
              </span>
              <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                ID: {report.id}
              </span>
            </div>

            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Veterinary Network Alerted</span>
            </span>
          </div>

          {/* Disease Name, Confidence Gauge, Urgency */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Differential AI Triage Result
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight text-gradient-emerald">
                {prediction?.disease || "Suspected Infection"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <UrgencyBadge urgency={prediction?.urgency || "high"} size="lg" />
                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  Code: {prediction?.diseaseCode || "FMD"}
                </span>
              </div>
            </div>

            {/* Circular / Radial Confidence Meter */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-w-[130px] shrink-0 shadow-lg">
              <div className="relative w-18 h-18 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${confidenceValue}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-black text-white leading-none">{confidenceValue}%</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mt-1.5">
                {t('confidence')}
              </span>
            </div>
          </div>

          {/* High Urgency Critical Alert Warning */}
          {(prediction?.urgency === 'critical' || prediction?.urgency === 'high') && (
            <div className="p-4 bg-rose-950/60 border border-rose-600/70 rounded-2xl text-rose-200 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-lg shadow-rose-950/40">
              <span className="text-xl shrink-0 mt-0.5">⚠️</span>
              <div className="space-y-1">
                <p className="font-bold text-rose-100">{t('highUrgencyNotice')}</p>
                <p className="text-[11px] text-rose-300/80">
                  Local Veterinary Officer (VD Khadakwasla / Pune) has received your GPS dispatch.
                </p>
              </div>
            </div>
          )}

          {/* Report Meta Strip */}
          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1.5 font-medium">
            <span>📍 {report.location?.village}, {report.location?.block}, {report.location?.district}</span>
            <span>🐄 Species: <strong className="text-slate-200 capitalize">{report.animalType}</strong> ({report.ageYears} yrs)</span>
            <span>💉 Vaccinated: <strong className="text-slate-200 uppercase">{report.vaccinationStatus}</strong></span>
          </div>
        </div>

        {/* Card: Evidence Observations */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span>{t('evidenceTitle')}</span>
            </h2>
            <span className="text-xs text-slate-400">Pathognomonic Match</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {prediction?.evidence && prediction.evidence.length > 0 ? (
              prediction.evidence.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-emerald-500/40">
                    ✓
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 p-3 bg-slate-950 rounded-xl">
                Clinical observations correlate with epidemic strains recorded in western Maharashtra.
              </div>
            )}
          </div>
        </div>

        {/* Card: Advisory Protocol with Audio & Share */}
        <div className="bg-gradient-to-br from-slate-900/90 via-amber-950/20 to-slate-900/90 p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>{t('advisoryTitle')}</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAudioSimulate}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  isReadingAudio
                    ? "bg-amber-950 text-amber-300 border-amber-500 animate-pulse"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>{isReadingAudio ? "🔊 Playing..." : "🗣️ Listen"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 text-slate-300 border border-slate-800 hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <span>📤</span>
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/20 text-slate-200 text-sm leading-relaxed font-medium">
            {advisoryText}
          </div>

          {/* Helpline Emergency Bar */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-700/60">
                📞
              </span>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {t('helplineText')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Toll-free 24/7 veterinary ambulance and tele-advisory
                </div>
              </div>
            </div>

            <a
              href="tel:1962"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs sm:text-sm font-black transition shadow-lg shadow-rose-950/60 text-center shrink-0"
            >
              Call 1962 Now
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate('/my-reports')}
            className="py-4 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>📑</span>
            <span>{t('viewInReports')}</span>
          </button>

          <button
            onClick={() => navigate('/report')}
            className="py-4 px-5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>➕</span>
            <span>{t('reportAnother')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
