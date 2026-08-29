import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function VetNavigation() {
  const { t } = useLanguage();

  const links = [
    { to: "/dashboard", label: t('navDashboard'), icon: "📊" },
    { to: "/map", label: t('navMap'), icon: "🗺️" },
    { to: "/cases", label: t('navCases'), icon: "📑" },
    { to: "/outbreaks", label: t('navOutbreaks'), icon: "⚠️", badge: "Live" },
    { to: "/herds", label: t('navHerds'), icon: "🔍" }
  ];

  return (
    <div className="bg-[#0B101D]/90 backdrop-blur-xl border-b border-slate-800/90 text-slate-300 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/50 border border-cyan-400/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-700/80 animate-pulse">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
