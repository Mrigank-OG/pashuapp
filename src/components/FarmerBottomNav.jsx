import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerBottomNav() {
  const { t } = useLanguage();

  const links = [
    { to: "/report", label: t('navReport'), icon: "🚨", key: "report" },
    { to: "/my-reports", label: t('navMyReports'), icon: "📋", key: "myReports" },
    { to: "/my-herd", label: t('navMyHerd'), icon: "🐄", key: "myHerd" }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#0A0E1A]/95 backdrop-blur-2xl border-t border-slate-800/90 text-slate-400 z-50 md:hidden shadow-2xl shadow-black/80 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-3">
        {links.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 text-center transition-all duration-200 relative group ${
                isActive
                  ? "text-emerald-400 font-extrabold scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-sm shadow-emerald-400/50" />
                )}
                <span className="text-xl leading-none mb-1 transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="text-[11px] font-medium leading-tight truncate max-w-[96px]">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
