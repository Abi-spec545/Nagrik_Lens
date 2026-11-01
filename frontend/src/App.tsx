import { useState, useEffect } from 'react';
import {
  Network,
  FileCheck2,
  GitFork,
  Scale,
  RefreshCw,
  Database,
  Server,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModuleCard } from './components/ModuleCard';
import { StatusBadge } from './components/StatusBadge';
import { fetchHealth } from './api/client';
import { HealthCheckResponse } from './types/api';

export function App() {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  const loadHealthStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await fetchHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealthData(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown communication error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const modules = [
    {
      title: 'Civic Scheme Discovery & Eligibility Graph',
      codename: 'SchemeGraph',
      description:
        'Knowledge graph representing welfare schemes, citizen eligibility criteria, and benefit dependencies with zero simulated government data.',
      status: healthData?.modules?.schemegraph?.status || 'initialized',
      badgeLabel: healthData?.modules?.schemegraph?.status || 'Initialized',
      icon: Network,
      highlights: [
        'Multi-criteria citizen eligibility mapping',
        'Scheme relationship & co-benefit traversal',
        'Transparent qualifying conditions analyzer',
      ],
    },
    {
      title: 'Entitlement & Document Verification Engine',
      codename: 'ClaimCraft',
      description:
        'Guided citizen claim assistant providing document checklists, procedural requirements, and AI-assisted application readiness validation.',
      status: healthData?.modules?.claimcraft?.status || 'initialized',
      badgeLabel: healthData?.modules?.claimcraft?.status || 'Initialized',
      icon: FileCheck2,
      highlights: [
        'Prerequisite document checklist generation',
        'Discrepancy and missing-criterion detector',
        'Application drafting and readiness validation',
      ],
    },
    {
      title: 'Grievance Routing & Escalation Navigator',
      codename: 'CivicRoute',
      description:
        'Interactive navigation system through administrative authorities, SLA timelines, and tiered grievance redressal pathways.',
      status: healthData?.modules?.civicroute?.status || 'initialized',
      badgeLabel: healthData?.modules?.civicroute?.status || 'Initialized',
      icon: GitFork,
      highlights: [
        'Jurisdictional department routing tree',
        'Citizen charter SLA and milestone tracking',
        'Tiered administrative escalation pathways',
      ],
    },
    {
      title: 'Plain-Language Policy & Impact Reflection',
      codename: 'PolicyMirror',
      description:
        'Demystifies official civic notifications, gazettes, and policy mandates into clear citizen-centric summaries with impact simulations.',
      status: healthData?.modules?.policymirror?.status || 'initialized',
      badgeLabel: healthData?.modules?.policymirror?.status || 'Initialized',
      icon: Scale,
      highlights: [
        'Gazette and notification summarization via Gemini',
        'Demographic-specific impact reflection',
        'Clause-by-clause rights and duty breakdown',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header apiStatus={error ? 'error' : healthData ? 'healthy' : 'loading'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>48-Hour Hackathon Project Foundation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              NagrikLens Platform
            </h1>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              Empowering citizens through transparent civic intelligence. Bridging the gap
              between complex government policies, welfare entitlements, administrative procedures,
              and everyday civic action.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                Stack: React 18 + Vite + TypeScript + Tailwind CSS
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                Backend: FastAPI + SQLite + SQLAlchemy + Pytest
              </span>
            </div>
          </div>
        </div>

        {/* Live System Health Section */}
        <div className="mb-10 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">System Foundation Health</h2>
                <p className="text-xs text-slate-500">Live API communication status via GET /api/v1/health</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadHealthStatus}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Checking...' : 'Refresh Status'}</span>
              </button>

              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline"
              >
                {showRawJson ? 'Hide Payload' : 'View Payload'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>FastAPI Backend</span>
                <Server className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge
                  status={error ? 'error' : healthData?.status || 'loading'}
                  label={error ? 'Unreachable' : healthData?.status || 'Connecting'}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                {error ? 'Check backend server' : healthData ? `v${healthData.version} (${healthData.environment})` : 'Connecting...'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>SQLite Database</span>
                <Database className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge
                  status={healthData?.database === 'connected' ? 'connected' : error ? 'error' : 'loading'}
                  label={healthData?.database || (error ? 'Disconnected' : 'Checking')}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                Engine: SQLAlchemy 2.0
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Round-Trip Latency</span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {latency !== null ? `${latency} ms` : '—'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Vite Proxy ➔ 127.0.0.1:8000
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Active Modules</span>
                <Code2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {healthData?.modules ? Object.keys(healthData.modules).length : 4} Registered
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Ready for Hackathon Modules
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-800 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-semibold">Backend Connection Note: </span>
                <span>{error}. Ensure the FastAPI server is running on port 8000 (uvicorn app.main:app --port 8000).</span>
              </div>
            </div>
          )}

          {showRawJson && healthData && (
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-xs font-mono text-slate-400 mb-2 flex justify-between">
                <span>JSON Response Payload (GET /api/v1/health):</span>
                <span>Content-Type: application/json</span>
              </div>
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Four Modules Overview Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Civic Technology Modules</h2>
              <p className="text-xs text-slate-500">
                Core domain capabilities ready for iterative 48-hour development.
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modular Architecture</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((m) => (
              <ModuleCard key={m.codename} {...m} />
            ))}
          </div>
        </div>

        {/* Foundation & Next Steps */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Hackathon Engineering Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div className="font-semibold text-slate-800 mb-1">1. Zero Simulated Government Data</div>
              <p>All scheme and civic data models adhere to authentic schema representations without fabricating live government feeds.</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div className="font-semibold text-slate-800 mb-1">2. Strict Security & API Keys</div>
              <p>Secrets like GEMINI_API_KEY belong in local .env files and are never committed to version control.</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div className="font-semibold text-slate-800 mb-1">3. Modular API Contracts</div>
              <p>Modules expose isolated endpoints under /api/v1/[module], documented in docs/API_CONTRACT.md.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
