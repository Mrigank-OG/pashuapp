import { useLanguage } from '../context/LanguageContext';

export default function UrgencyBadge({ urgency, size = "md" }) {
  const { t } = useLanguage();
  const level = (urgency || 'low').toLowerCase();

  const styles = {
    low: "bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-emerald-950/30",
    moderate: "bg-amber-950/70 text-amber-300 border-amber-700/60 shadow-amber-950/30",
    high: "bg-orange-950/70 text-orange-300 border-orange-700/60 shadow-orange-950/30",
    critical: "bg-rose-950/80 text-rose-200 border-rose-600/70 shadow-rose-950/50 ring-1 ring-rose-500/30"
  };

  const dots = {
    low: "bg-emerald-400 shadow-emerald-400/50",
    moderate: "bg-amber-400 shadow-amber-400/50",
    high: "bg-orange-400 shadow-orange-400/50",
    critical: "bg-rose-500 shadow-rose-500/80 animate-ping"
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-bold gap-1.5",
    md: "px-3 py-1 text-xs sm:text-sm font-bold gap-2",
    lg: "px-4 py-2 text-sm sm:text-base font-extrabold gap-2.5 shadow-md"
  };

  const keyMap = {
    low: 'urgency_low',
    moderate: 'urgency_moderate',
    high: 'urgency_high',
    critical: 'urgency_critical'
  };

  const label = t(keyMap[level] || 'urgency_low');

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-150 select-none shadow-sm ${styles[level] || styles.low} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className="relative flex h-2 w-2">
        {level === 'critical' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dots[level] || dots.low}`} />
      </span>
      <span>{label}</span>
    </span>
  );
}
