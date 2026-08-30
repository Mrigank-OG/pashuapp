import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import FarmerBottomNav from './components/FarmerBottomNav';

// Farmer pages
import ReportForm from './pages/farmer/ReportForm';
import ReportResult from './pages/farmer/ReportResult';
import MyReports from './pages/farmer/MyReports';
import MyHerd from './pages/farmer/MyHerd';

// Vet pages
import Dashboard from './pages/vet/Dashboard';
import MapView from './pages/vet/MapView';
import CaseTable from './pages/vet/CaseTable';
import CaseDetail from './pages/vet/CaseDetail';
import OutbreakAlerts from './pages/vet/OutbreakAlerts';
import HerdLookup from './pages/vet/HerdLookup';

function AppLayout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('pashu-theme') === 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem('pashu-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const isFarmerRoute = ['/report', '/report-result', '/my-reports', '/my-herd'].some(p => location.pathname.startsWith(p));

  return (
    <div className={`${darkMode ? 'pashu-dark-theme' : 'pashu-light-theme'} min-h-screen flex flex-col bg-[#080C15] text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-300 antialiased overflow-x-hidden`}>
      {/* Dynamic Ambient Background Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isFarmerRoute ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl rounded-full transition-all duration-700" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/5 blur-3xl rounded-full" />
            <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b from-cyan-500/12 via-indigo-500/6 to-transparent blur-3xl rounded-full transition-all duration-700" />
            <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-600/8 blur-3xl rounded-full" />
            <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-600/8 blur-3xl rounded-full" />
          </>
        )}
        {/* Subtle grid pattern overlay for high-tech telemetry texture */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Navbar */}
      <div className="relative z-40">
        <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10">
        <Routes>
          {/* Default redirect to farmer report form */}
          <Route path="/" element={<Navigate to="/report" replace />} />

          {/* Farmer-Facing Routes */}
          <Route path="/report" element={<ReportForm />} />
          <Route path="/report-result" element={<ReportResult />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/my-herd" element={<MyHerd />} />

          {/* Vet-Official Facing Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/cases" element={<CaseTable />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/outbreaks" element={<OutbreakAlerts />} />
          <Route path="/herds" element={<HerdLookup />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/report" replace />} />
        </Routes>
      </div>

      {/* Mobile Farmer Bottom Navigation Dock */}
      {isFarmerRoute && <FarmerBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LanguageProvider>
  );
}
