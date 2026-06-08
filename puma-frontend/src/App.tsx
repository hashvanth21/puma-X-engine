import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavBar } from '@/components';
import { useAppStore } from '@/stores';

// Lazy-load screens for code splitting
import { lazy, Suspense, useEffect } from 'react';
const Screen1Problem = lazy(() => import('@/screens/Screen1Problem/Screen1Problem'));
const Screen2FootScan = lazy(() => import('@/screens/Screen2FootScan/Screen2FootScan'));
const Screen3Questions = lazy(() => import('@/screens/Screen3Questions/Screen3Questions'));
const Screen4Match = lazy(() => import('@/screens/Screen4Match/Screen4Match'));
const Screen5Compare = lazy(() => import('@/screens/Screen5Compare/Screen5Compare'));
const Screen6Ecosystem = lazy(() => import('@/screens/Screen6Ecosystem/Screen6Ecosystem'));

const ScreenFallback = () => (
  <div className="min-h-screen bg-bg-main flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent-red rounded-full border-t-transparent animate-spin" />
  </div>
);

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAll } = useAppStore();

  // Flush remaining interaction events on tab close via sendBeacon
  useEffect(() => {
    const handleUnload = () => {
      const events = useAppStore.getState().interactionBuffer;
      if (events.length > 0) {
        navigator.sendBeacon(
          `${API_BASE}/api/events`,
          JSON.stringify({ events })
        );
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  const isOnFlow = location.pathname !== '/';
  const screenToStep: Record<string, number> = {
    '/scan': 1,
    '/questions': 2,
    '/match': 3,
    '/compare': 4,
    '/ecosystem': 5,
  };
  const currentStep = screenToStep[location.pathname];

  return (
    <div className="min-h-screen bg-bg-main">
      <NavBar
        currentStep={isOnFlow ? currentStep : undefined}
        totalSteps={isOnFlow ? 5 : undefined}
        onReset={isOnFlow ? handleReset : undefined}
      />

      <Suspense fallback={<ScreenFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Screen1Problem />} />
            <Route path="/scan" element={<Screen2FootScan />} />
            <Route path="/questions" element={<Screen3Questions />} />
            <Route path="/match" element={<Screen4Match />} />
            <Route path="/compare" element={<Screen5Compare />} />
            <Route path="/ecosystem" element={<Screen6Ecosystem />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
