import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ darkMode = false, onToggleTheme = () => {} }) {
  const { lang, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isVetRoute = ['/dashboard', '/map', '/cases', '/outbreaks', '/herds'].some(p => location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-40 bg-[#0D1322]/85 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 transition-colors duration-300 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Identity */}
          <Link
            to={isVetRoute ? "/dashboard" : "/report"}
            className="flex items-center gap-3 group focus:outline-none select-none"
          >
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md transition-all duration-300 group-hover:scale-105 ${
              isVetRoute 
                ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-cyan-500/25 ring-1 ring-cyan-400/40" 
                : "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40"
            }`}>
              {isVetRoute ? "🩺" : "🐄"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-white group-hover:text-cyan-300 transition-colors">
                  {t('appTitle')}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider border transition-all ${
                  isVetRoute
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/60 shadow-xs shadow-cyan-900/50"
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-xs shadow-emerald-900/50"
                }`}>
                  {isVetRoute ? "Vet Command" : "Farmer Portal"}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block truncate mt-0.5">
                {t('appSubtitle')}
              </p>
            </div>
          </Link>

          {/* Right Actions Bar */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            
            {/* Live Telemetry Ping */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-400">Mesh Sync:</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>

            {/* Emergency Helpline Pill */}
            <a
              href="tel:1962"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 bg-rose-950/50 border-rose-800/60 text-rose-300 hover:bg-rose-900/60 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-950/50 group"
              title="Toll-Free 24x7 Emergency Veterinary Helpline"
            >
              <span className="group-hover:animate-bounce">📞</span>
              <span className="hidden xs:inline">1962</span>
              <span className="hidden md:inline font-normal text-rose-300/80">(पशु संजीवनी)</span>
            </a>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                aria-label="Select Language"
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-xs font-bold py-1.5 sm:py-2 pl-2.5 pr-6 rounded-xl border bg-slate-900/90 border-slate-700/80 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 hover:border-slate-600 transition cursor-pointer appearance-none shadow-sm"
              >
                <option value="mr" className="bg-slate-900 text-slate-100">मराठी (MR)</option>
                <option value="en" className="bg-slate-900 text-slate-100">English (EN)</option>
                <option value="hi" className="bg-slate-900 text-slate-100">हिंदी (HI)</option>
              </select>
              <span className="absolute right-2 pointer-events-none text-[10px] text-slate-400">▼</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>{darkMode ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Portal Switcher Button */}
            <button
              onClick={() => {
                if (isVetRoute) {
                  navigate('/report');
                } else {
                  navigate('/dashboard');
                }
              }}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md border transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                isVetRoute
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500/60 shadow-emerald-950/40 hover:shadow-emerald-500/20"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-500/60 shadow-cyan-950/40 hover:shadow-cyan-500/20"
              }`}
            >
              <span className="text-sm">{isVetRoute ? "🌾" : "🩺"}</span>
              <span className="hidden sm:inline">
                {isVetRoute ? t('farmerPortal') : t('vetPortal')}
              </span>
              <span className="sm:hidden">
                {isVetRoute ? "Farmer" : "Vet"}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
