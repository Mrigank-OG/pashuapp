import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerTabs() {
  const { t } = useLanguage();

  const links = [
    { to: "/report", label: t('navReport'), icon: "🚨" },
    { to: "/my-reports", label: t('navMyReports'), icon: "📋" },
    { to: "/my-herd", label: t('navMyHerd'), icon: "🐄" }
  ];

  return (
    <div className="hidden md:flex items-center justify-center gap-3 mb-6">
      <div className="bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-800/90 shadow-xl shadow-black/30">
        {links.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
              }`
            }
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
