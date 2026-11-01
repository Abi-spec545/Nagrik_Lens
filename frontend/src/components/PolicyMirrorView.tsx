import React, { useState, useEffect } from 'react';
import {
  Scale,
  GitCompare,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  fetchPolicies,
  comparePolicies,
  simulatePolicy,
  summarizePolicy,
} from '../api/client';
import {
  PolicyListItem,
  CompareResponse,
  SimulateResponse,
  SummarizeResponse,
} from '../types/api';

export const PolicyMirrorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'simulate' | 'summarize'>('compare');

  const [policies, setPolicies] = useState<PolicyListItem[]>([]);

  // Compare Tab state
  const [oldPolicyId, setOldPolicyId] = useState<string>('EV-POLICY-2024-ACTIVE');
  const [newPolicyId, setNewPolicyId] = useState<string>('EV-POLICY-2026-DRAFT');
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Simulate Tab state
  const [simulatePolicyId, setSimulatePolicyId] = useState<string>('EV-POLICY-2026-DRAFT');
  const [profileType, setProfileType] = useState<string>('individual_buyer');
  const [vehicleType, setVehicleType] = useState<string>('two_wheeler');
  const [claimAmount, setClaimAmount] = useState<number>(500000);
  const [simulateResult, setSimulateResult] = useState<SimulateResponse | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);

  // Summarize Tab state
  const [summaryTitle, setSummaryTitle] = useState<string>('Draft Electric Vehicle Policy 2026');
  const [summaryText, setSummaryText] = useState<string>(
    'Clause 4(a): Subsidies shall be disbursed subject to submission of Form V-B within thirty days of vehicle registration. Maximum subsidy cap of INR 1,50,000 for two-wheelers. Failure to submit Form V-B within thirty days will permanently forfeit the subsidy entitlement.'
  );
  const [targetAudience, setTargetAudience] = useState<string>('general_citizen');
  const [summaryResult, setSummaryResult] = useState<SummarizeResponse | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicies()
      .then((data) => {
        setPolicies(data);
        if (data.length >= 2) {
          setOldPolicyId(data[1].policy_id);
          setNewPolicyId(data[0].policy_id);
        }
      })
      .catch(() => {});
  }, []);

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setComparing(true);
    setCompareError(null);
    try {
      const res = await comparePolicies(oldPolicyId, newPolicyId);
      setCompareResult(res);
    } catch (err: any) {
      setCompareError(err.message || 'Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSimulating(true);
    setSimulateError(null);
    try {
      const profilePayload: Record<string, any> = {
        type: profileType,
        vehicle_type: vehicleType,
        claim_amount_inr: claimAmount,
      };
      const res = await simulatePolicy(simulatePolicyId, profilePayload);
      setSimulateResult(res);
    } catch (err: any) {
      setSimulateError(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSummarizing(true);
    setSummaryError(null);
    try {
      const res = await summarizePolicy(summaryTitle, summaryText, targetAudience);
      setSummaryResult(res);
    } catch (err: any) {
      setSummaryError(err.message || 'Summarization failed');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">PolicyMirror Analysis & Outcome Simulation</h1>
              <p className="text-xs text-slate-500">
                Compare policy versions, simulate applicant impact outcomes, and translate official gazettes into citizen language
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'compare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Policy Comparison
            </button>
            <button
              onClick={() => setActiveTab('simulate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'simulate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outcome Simulation
            </button>
            <button
              onClick={() => setActiveTab('summarize')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'summarize' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain-Language AI
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Compare Two Policies */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Select Two Policies to Compare</h2>
            <p className="text-xs text-slate-500 mb-4">
              Identify clause-level additions, modifications, and statutory shifts across policy records.
            </p>

            <form onSubmit={handleCompare} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Baseline (Old Policy)</label>
                <select
                  value={oldPolicyId}
                  onChange={(e) => setOldPolicyId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {policies.map((p) => (
                    <option key={p.policy_id} value={p.policy_id}>
                      {p.title} ({p.policy_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">New / Amended Policy</label>
                <select
                  value={newPolicyId}
                  onChange={(e) => setNewPolicyId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {policies.map((p) => (
                    <option key={p.policy_id} value={p.policy_id}>
                      {p.title} ({p.policy_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={comparing || oldPolicyId === newPolicyId}
                  className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  {comparing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <GitCompare className="w-3.5 h-3.5" />
                  )}
                  <span>Compare</span>
                </button>
              </div>
            </form>
          </div>

          {compareError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
              {compareError}
            </div>
          )}

          {!compareResult && !comparing && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Ready for Policy Comparison</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Select policies above and click "Compare" to view side-by-side clause changes and overall impact ratings.
              </p>
              <button
                onClick={() => handleCompare()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Run Demo Comparison</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {compareResult && (
            <div className="space-y-6">
              {/* Comparison Meta Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Baseline Policy</span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{compareResult.old_policy.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{compareResult.old_policy.issuing_authority} • {compareResult.old_policy.date_published}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Amended Policy</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        compareResult.overall_impact === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : compareResult.overall_impact === 'mixed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Overall Impact: {compareResult.overall_impact}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{compareResult.new_policy.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{compareResult.new_policy.issuing_authority} • {compareResult.new_policy.date_published}</p>
                </div>
              </div>

              {/* Clause Changes Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Clause-by-Clause Modifications ({compareResult.clause_changes.length} Areas)
                </h3>

                <div className="space-y-3">
                  {compareResult.clause_changes.map((change, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-amber-800">
                          Impact Area: {change.impact_area.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">{change.change_description}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Previous Provision:</span>
                          <p className="text-slate-600 text-[11px]">{change.old_value || 'None (No provision existed)'}</p>
                        </div>

                        <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-amber-800 font-bold block mb-1">New Provision:</span>
                          <p className="text-slate-900 text-[11px] font-medium">{change.new_value || 'Omitted in new policy'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Outcome Simulation */}
      {activeTab === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls on Left (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Configure Simulation Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate exact monetary subsidies, timelines, and statutory risks for a specific applicant profile.
              </p>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Policy</label>
                <select
                  value={simulatePolicyId}
                  onChange={(e) => setSimulatePolicyId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {policies.map((p) => (
                    <option key={p.policy_id} value={p.policy_id}>
                      {p.title} ({p.policy_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Applicant Classification</label>
                <select
                  value={profileType}
                  onChange={(e) => setProfileType(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white capitalize"
                >
                  <option value="individual_buyer">Individual Buyer</option>
                  <option value="fleet_operator">Commercial Fleet Operator</option>
                  <option value="manufacturer">EV Manufacturer / OEM</option>
                  <option value="general_citizen">General Citizen (RTI / Consumer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type (if EV Policy)</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="two_wheeler">Electric Two-Wheeler (2W)</option>
                  <option value="four_wheeler">Electric Four-Wheeler (4W)</option>
                  <option value="commercial">Commercial Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Claim / Valuation Amount (INR)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used for consumer court jurisdiction & subsidy calculation caps
                </span>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
              >
                {simulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Simulating Rules...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Run Outcome Simulation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Simulation Display on Right (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {simulateError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {simulateError}
              </div>
            )}

            {!simulateResult && !simulating && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Profile Selection</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Select policy and applicant parameters on the left to simulate statutory outcomes, subsidy limits,
                  and forfeiture deadlines.
                </p>
                <button
                  onClick={() => handleSimulate()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <span>Run Demo Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {simulateResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {simulateResult.policy_id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{simulateResult.policy_title}</h3>
                </div>

                {/* Warnings */}
                {simulateResult.warnings.length > 0 && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Statutory Warnings & Deadlines:</span>
                    </span>
                    {simulateResult.warnings.map((w, i) => (
                      <p key={i} className="text-rose-800 text-[11px] pl-5">• {w}</p>
                    ))}
                  </div>
                )}

                {/* Estimated Outcomes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Projected Applicant Outcomes</span>
                  </h4>

                  <div className="space-y-2">
                    {simulateResult.estimated_outcomes.map((outcome, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium">
                        ✓ {outcome}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applicable Clauses */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Governing Policy Clauses
                  </h4>
                  <div className="space-y-1.5">
                    {simulateResult.applicable_clauses.map((clause, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 font-mono">
                        {clause}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Plain-Language AI Summarizer */}
      {activeTab === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input on Left (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Plain-Language Policy Digest</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Translates complex civic notifications or gazette clauses into citizen-centric summaries with Gemini AI.
              </p>
            </div>

            <form onSubmit={handleSummarize} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Policy / Gazette Title</label>
                <input
                  type="text"
                  required
                  value={summaryTitle}
                  onChange={(e) => setSummaryTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="general_citizen">General Citizen</option>
                  <option value="farmer">Farmer / Rural Family</option>
                  <option value="vendor">Street Vendor / Micro-Enterprise</option>
                  <option value="senior_citizen">Senior Citizen / Pensioner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Policy Text</label>
                <textarea
                  rows={5}
                  required
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Paste official notification clause..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={summarizing || summaryText.length < 10}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
              >
                {summarizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing with AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Plain-Language Digest</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Display on Right (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {summaryError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {summaryError}
              </div>
            )}

            {!summaryResult && !summarizing && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Text Input</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Enter policy clauses on the left or click below to generate an AI summary with key takeaways and
                  impact ratings.
                </p>
                <button
                  onClick={() => handleSummarize()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <span>Summarize Demo Clause</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {summaryResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Plain-Language Citizen Digest</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Engine: {summaryResult.source_model}</span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      summaryResult.impact_rating === 'high'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : summaryResult.impact_rating === 'moderate'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Impact: {summaryResult.impact_rating}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">Executive Summary:</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{summaryResult.summary}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Key Citizen Takeaways & Deadlines:
                  </h4>
                  <div className="space-y-1.5">
                    {summaryResult.key_takeaways.map((takeaway, idx) => (
                      <div key={idx} className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
