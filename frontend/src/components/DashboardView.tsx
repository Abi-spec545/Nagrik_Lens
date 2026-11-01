import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Network,
  FileCheck2,
  GitFork,
  Scale,
  Server,
  Database,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { ScreenId } from './Header';
import { StatusBadge } from './StatusBadge';
import { HealthCheckResponse } from '../types/api';

interface DashboardViewProps {
  onNavigate: (screen: ScreenId) => void;
  healthData: HealthCheckResponse | null;
  loadingHealth: boolean;
  healthError: string | null;
  latency: number | null;
  onRefreshHealth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  healthData,
  loadingHealth,
  healthError,
  latency,
  onRefreshHealth,
}) => {
  const modules = [
    {
      id: 'schemegraph' as ScreenId,
      name: 'SchemeGraph',
      subtitle: 'Civic Scheme Discovery & Eligibility Engine',
      description:
        'Evaluate citizen profiles across welfare schemes using strict, deterministic Python rule engines without fabricated government feeds.',
      icon: Network,
      color: 'emerald',
      actionLabel: 'Check Eligibility',
      features: ['Age, income, occupation & caste checks', 'Transparent criteria satisfaction breakdown', 'Complementary scheme graph navigation'],
    },
    {
      id: 'claimcraft' as ScreenId,
      name: 'ClaimCraft',
      subtitle: 'Entitlement & Document Verification Engine',
      description:
        'Verify identity documents (PDF/TXT) with PyMuPDF, detect discrepancies, request human confirmation, and export PDF checklists with ReportLab.',
      icon: FileCheck2,
      color: 'blue',
      actionLabel: 'Verify Documents',
      features: ['Instant Aadhaar, PAN & DOB extraction', 'Discrepancy & format validation', 'Downloadable ReportLab checklist PDF'],
    },
    {
      id: 'civicroute' as ScreenId,
      name: 'CivicRoute',
      subtitle: 'Grievance Routing & Escalation Directory',
      description:
        'Navigate municipal and state grievance redressal authorities, track statutory Citizen Charter SLAs, and view multi-tier escalation pathways.',
      icon: GitFork,
      color: 'indigo',
      actionLabel: 'Route Grievance',
      features: ['Ward, municipal & district authorities', 'Statutory SLA days & milestone timelines', 'Multi-tier escalation triggers'],
    },
    {
      id: 'policymirror' as ScreenId,
      name: 'PolicyMirror',
      subtitle: 'Plain-Language Policy & Impact Reflection',
      description:
        'Compare government gazettes, simulate citizen outcomes across demographic profiles, and translate legalese using Gemini AI with deterministic fallbacks.',
      icon: Scale,
      color: 'amber',
      actionLabel: 'Compare & Simulate',
      features: ['Side-by-side policy version comparison', 'Demographic outcome simulations', 'Plain-language summaries & warnings'],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Civic Technology Platform • 48-Hour Hackathon</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Democratizing Public Entitlements & Policy Clarity
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            NagrikLens bridges the gap between complex government notifications, welfare eligibility,
            procedural red tape, and everyday citizens through transparent, deterministic intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('schemegraph')}
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Network className="w-5 h-5" />
              <span>Start Eligibility Check</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('claimcraft')}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-slate-400" />
              <span>Verify Documents (ClaimCraft)</span>
            </button>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
          <Layers className="w-96 h-96 -mr-16 -mt-16 text-emerald-400" />
        </div>
      </div>

      {/* Backend Foundation Live Health */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Backend Services Health</h2>
              <p className="text-xs text-slate-500">Connected to FastAPI server via GET /api/v1/health</p>
            </div>
          </div>

          <button
            onClick={onRefreshHealth}
            disabled={loadingHealth}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            <span>{loadingHealth ? 'Pinging...' : 'Refresh API Status'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>FastAPI Backend</span>
              <Server className="w-4 h-4 text-slate-400" />
            </div>
            <StatusBadge
              status={healthError ? 'error' : healthData?.status || 'loading'}
              label={healthError ? 'Offline' : healthData?.status || 'Connecting'}
            />
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              {healthData ? `v${healthData.version} (${healthData.environment})` : '127.0.0.1:8000'}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>SQLite Database</span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <StatusBadge
              status={healthData?.database === 'connected' ? 'connected' : healthError ? 'error' : 'loading'}
              label={healthData?.database || (healthError ? 'Disconnected' : 'Checking')}
            />
            <div className="text-[11px] text-slate-400 mt-2 font-mono">SQLAlchemy 2.0</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>API Latency</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">
              {latency !== null ? `${latency} ms` : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Vite Proxy ➔ Backend</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Modules Active</span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              4 / 4 Ready
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Full Stack Deployed</div>
          </div>
        </div>

        {healthError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <span className="font-semibold">Backend Unreachable: </span>
            <span>{healthError}. Ensure the FastAPI server is running with <code className="bg-rose-100 px-1 py-0.5 rounded">uvicorn app.main:app --port 8000</code>.</span>
          </div>
        )}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core Civic Intelligence Modules</h2>
            <p className="text-sm text-slate-500 mt-1">
              Each module delivers targeted civic empowerment through deterministic workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Ready
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {m.name}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{m.subtitle}</h3>
                  </div>

                  <p className="text-sm text-slate-600 mb-5 leading-relaxed">{m.description}</p>

                  <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                    {m.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(m.id)}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  <span>{m.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Pillars */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-100 mb-4">Core Principles for Trustworthy Civic Tech</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">Deterministic Rule Execution</span>
            <p>
              Eligibility calculations are executed by verified Python functions. No LLM ever makes
              an ungrounded determination regarding a citizen's welfare entitlement.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">Zero Fabricated Data</span>
            <p>
              All scheme definitions, department hierarchies, and Citizen Charter SLAs reflect authentic
              reference templates rather than synthetic or mock government APIs.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">Privacy & Temporary Extraction</span>
            <p>
              Citizen document credentials are parsed in-memory with PyMuPDF and immediately unlinked.
              Raw identity documents are never permanently stored on disks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
