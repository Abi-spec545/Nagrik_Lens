import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Navigation,
  Clock,
  Building,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  Info,
} from 'lucide-react';
import { fetchCivicCategories, navigateGrievance } from '../api/client';
import { CategoryItem, NavigateResponse } from '../types/api';

export const CivicRouteView: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [category, setCategory] = useState<string>('water_supply');
  const [description, setDescription] = useState<string>(
    'Contaminated municipal drinking water pipeline issue in Ward 14 with irregular supply'
  );
  const [state, setState] = useState<string>('Karnataka');
  const [city, setCity] = useState<string>('Bengaluru');
  const [ward, setWard] = useState<string>('Ward 14');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeResult, setRouteResult] = useState<NavigateResponse | null>(null);

  // Remediation checklist state (citizen can mark steps as they complete them)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchCivicCategories()
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  const demoPresets = [
    {
      label: 'Water Contamination (Bengaluru Ward 14)',
      category: 'water_supply',
      description: 'Contaminated municipal drinking water pipeline issue in Ward 14 with irregular supply',
      state: 'Karnataka',
      city: 'Bengaluru',
      ward: 'Ward 14',
    },
    {
      label: 'Frequent Power Outage (BESCOM)',
      category: 'electricity',
      description: 'Recurring power cuts and low voltage issues damaging household appliances',
      state: 'Karnataka',
      city: 'Bengaluru',
      ward: 'Ward 22',
    },
    {
      label: 'Road Potholes & Damage (BBMP)',
      category: 'road_maintenance',
      description: 'Hazardous deep potholes on 80ft main road causing safety risk for commuters',
      state: 'Karnataka',
      city: 'Bengaluru',
      ward: 'Ward 104',
    },
    {
      label: 'Municipal Water Issue (Mumbai BMC)',
      category: 'water_supply',
      description: 'Low water pressure and pipe leakage causing contamination near building entrance',
      state: 'Maharashtra',
      city: 'Mumbai',
      ward: 'Ward K-West',
    },
  ];

  const handleNavigate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await navigateGrievance(category, description, { state, city, ward });
      setRouteResult(res);
      setCompletedSteps({});
    } catch (err: any) {
      setError(err.message || 'Routing failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps({ ...completedSteps, [stepIdx]: !completedSteps[stepIdx] });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CivicRoute Escalation & Remediation Navigator</h1>
            <p className="text-xs text-slate-500">
              Jurisdictional grievance pathways, Citizen Charter statutory SLAs, and tiered administrative escalation
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Remediation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Grievance Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Grievance & Jurisdiction Details</h2>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Civic Dispatch
            </span>
          </div>

          {/* Demo Presets */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Load Realistic Grievance (Demo Data):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {demoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCategory(preset.category);
                    setDescription(preset.description);
                    setState(preset.state);
                    setCity(preset.city);
                    setWard(preset.ward);
                  }}
                  className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors font-medium text-slate-700 text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleNavigate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grievance Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white capitalize"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.category} value={c.category}>
                      {c.label} ({c.category.replace(/_/g, ' ')})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="water_supply">Water Supply & Quality</option>
                    <option value="electricity">Electricity & Power Supply</option>
                    <option value="road_maintenance">Road & Infrastructure</option>
                    <option value="sanitation">Sanitation & Solid Waste</option>
                    <option value="property_tax">Property Tax & Assessment</option>
                    <option value="ration_pds">Ration & PDS Distribution</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Description</label>
              <textarea
                rows={3}
                required
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the civic issue with specifics (minimum 10 characters)..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {description.length} characters (min 10)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Municipality</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ward / Zone (Optional)</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Ward 14, Zone 3"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || description.length < 10}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Determining Route & SLAs...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Route Grievance & Escalation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Remediation & Escalation Display on Right (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Routing Error: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!routeResult && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <GitFork className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Grievance Input</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Select your grievance category and municipality on the left, or pick a demo preset, to generate
                the verified remediation steps and SLA timeline.
              </p>
              <button
                onClick={() => handleNavigate()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Run Demo Navigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {routeResult && (
            <div className="space-y-6">
              {/* Primary Department & SLA Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Primary Jurisdictional Authority
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{routeResult.primary_department}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{routeResult.officer_designation}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Citizen Charter SLA</span>
                    <span className="text-2xl font-black text-indigo-600">
                      {routeResult.sla_days} Days
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Filing Channel & Access:
                    </span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{routeResult.filing_channel}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Resolution Clock:
                    </span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Starts on complaint token generation</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Remediation Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Actionable Citizen Remediation Steps</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {Object.values(completedSteps).filter(Boolean).length} of 4 Completed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      step: 1,
                      title: 'File First-Tier Grievance',
                      desc: `Submit formal complaint via ${routeResult.filing_channel} addressed to ${routeResult.officer_designation}.`,
                    },
                    {
                      step: 2,
                      title: 'Secure Complaint Reference Token / Acknowledgment',
                      desc: 'Save the generated Docket / Reference Number. Citizen Charter SLA timer officially starts upon issuance.',
                    },
                    {
                      step: 3,
                      title: `Track SLA Expiry (${routeResult.sla_days} Business Days)`,
                      desc: `If grievance is unaddressed by Day ${routeResult.sla_days}, the statutory violation triggers automatic Tier 1 escalation.`,
                    },
                    {
                      step: 4,
                      title: 'Initiate Tier 1 Escalation',
                      desc: `Escalate to ${routeResult.escalation_levels[0]?.officer || 'Appellate Officer'} citing the original reference token.`,
                    },
                  ].map((item) => {
                    const isChecked = !!completedSteps[item.step];
                    return (
                      <div
                        key={item.step}
                        onClick={() => toggleStep(item.step)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-xs ${
                          isChecked
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <span className={`font-bold block ${isChecked ? 'line-through text-emerald-700' : ''}`}>
                            Step {item.step}: {item.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi-tier Escalation Pathways */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Statutory Escalation Pathways ({routeResult.escalation_levels.length} Tiers)
                  </h4>
                </div>

                <div className="space-y-3">
                  {routeResult.escalation_levels.map((lvl) => (
                    <div
                      key={lvl.tier}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start space-x-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        T{lvl.tier}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">Escalation Tier {lvl.tier}: {lvl.officer}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          <span className="font-semibold text-slate-700">Trigger Condition: </span>
                          <span className="text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {lvl.trigger_condition}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
