import { useState, useEffect } from 'react';
import { Header, ScreenId } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { SchemeGraphView } from './components/SchemeGraphView';
import { ClaimCraftView } from './components/ClaimCraftView';
import { CivicRouteView } from './components/CivicRouteView';
import { PolicyMirrorView } from './components/PolicyMirrorView';
import { fetchHealth } from './api/client';
import { HealthCheckResponse } from './types/api';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [selectedSchemeForClaimCraft, setSelectedSchemeForClaimCraft] = useState<string>('PM-SVANIDHI-01');

  // Backend Health Status State
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const checkApiHealth = async () => {
    setLoadingHealth(true);
    setHealthError(null);
    const start = performance.now();
    try {
      const data = await fetchHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealthData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend unreachable';
      setHealthError(message);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleNavigateToClaimCraft = (schemeId: string) => {
    setSelectedSchemeForClaimCraft(schemeId);
    setCurrentScreen('claimcraft');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScreenChange = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header
        currentScreen={currentScreen}
        onNavigate={handleScreenChange}
        apiStatus={healthError ? 'error' : healthData ? 'healthy' : 'loading'}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentScreen === 'dashboard' && (
          <DashboardView
            onNavigate={handleScreenChange}
            healthData={healthData}
            loadingHealth={loadingHealth}
            healthError={healthError}
            latency={latency}
            onRefreshHealth={checkApiHealth}
          />
        )}

        {currentScreen === 'schemegraph' && (
          <SchemeGraphView
            onSelectSchemeForClaimCraft={handleNavigateToClaimCraft}
          />
        )}

        {currentScreen === 'claimcraft' && (
          <ClaimCraftView
            initialSchemeId={selectedSchemeForClaimCraft}
          />
        )}

        {currentScreen === 'civicroute' && (
          <CivicRouteView />
        )}

        {currentScreen === 'policymirror' && (
          <PolicyMirrorView />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
