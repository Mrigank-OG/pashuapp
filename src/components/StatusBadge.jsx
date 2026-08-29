import { useLanguage } from '../context/LanguageContext';

export default function StatusBadge({ status, size = "md" }) {
  const { t } = useLanguage();
  const normalized = (status || 'Pending').toLowerCase().replace(/\s+/g, '_');

  const styles = {
    pending: "bg-slate-900 text-slate-300 border-slate-700/80 shadow-slate-950/40",
    reviewed: "bg-blue-950/70 text-blue-300 border-blue-700/70 shadow-blue-950/40",
    sample_collected: "bg-purple-950/70 text-purple-300 border-purple-700/70 shadow-purple-950/40",
    lab_confirmed: "bg-indigo-950/70 text-indigo-300 border-indigo-600/70 shadow-indigo-950/40",
    escalated: "bg-rose-950/80 text-rose-300 border-rose-600/80 shadow-rose-950/50 font-bold",
    resolved: "bg-emerald-950/80 text-emerald-300 border-emerald-600/80 shadow-emerald-950/40 font-bold"
  };

  const keyMap = {
    pending: 'status_pending',
    reviewed: 'status_reviewed',
    sample_collected: 'status_sample_collected',
    lab_confirmed: 'status_lab_confirmed',
    escalated: 'status_escalated',
    resolved: 'status_resolved'
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-semibold",
    md: "px-3 py-1 text-xs sm:text-sm font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-bold"
  };

  const label = t(keyMap[normalized] || 'status_pending') || status;

  return (
    <span
      className={`inline-flex items-center rounded-xl font-medium border backdrop-blur-md transition-all shadow-xs ${styles[normalized] || styles.pending} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {label}
    </span>
  );
}
