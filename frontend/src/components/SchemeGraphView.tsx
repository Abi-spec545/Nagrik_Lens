import React, { useState } from 'react';
import {
  Network,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  GitBranch,
  FileCheck2,
  X,
  Info,
} from 'lucide-react';
import { evaluateEligibility, fetchSchemeGraph } from '../api/client';
import { CitizenProfile, MatchedScheme, SchemeGraphNode } from '../types/api';

interface SchemeGraphViewProps {
  onSelectSchemeForClaimCraft?: (schemeId: string) => void;
}

export const SchemeGraphView: React.FC<SchemeGraphViewProps> = ({ onSelectSchemeForClaimCraft }) => {
  const [profile, setProfile] = useState<CitizenProfile>({
    age: 34,
    gender: 'female',
    state: 'Maharashtra',
    annual_income_inr: 180000,
    occupation: 'street_vendor',
    disability: false,
    caste_category: 'OBC',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluatedSchemes, setEvaluatedSchemes] = useState<MatchedScheme[] | null>(null);
  const [totalEvaluated, setTotalEvaluated] = useState<number | null>(null);

  // Graph Modal state
  const [selectedGraphNode, setSelectedGraphNode] = useState<SchemeGraphNode | null>(null);

  const demoPresets = [
    {
      label: 'Street Vendor (Maharashtra)',
      data: {
        age: 34,
        gender: 'female',
        state: 'Maharashtra',
        annual_income_inr: 180000,
        occupation: 'street_vendor',
        disability: false,
        caste_category: 'OBC',
      },
    },
    {
      label: 'Small Farmer (UP)',
      data: {
        age: 42,
        gender: 'male',
        state: 'Uttar Pradesh',
        annual_income_inr: 120000,
        occupation: 'farmer',
        disability: false,
        caste_category: 'General',
      },
    },
    {
      label: 'Traditional Artisan (Karnataka)',
      data: {
        age: 29,
        gender: 'male',
        state: 'Karnataka',
        annual_income_inr: 220000,
        occupation: 'artisan',
        disability: false,
        caste_category: 'OBC',
      },
    },
    {
      label: 'Senior Citizen (75y)',
      data: {
        age: 75,
        gender: 'female',
        state: 'Delhi',
        annual_income_inr: 90000,
        occupation: 'retired',
        disability: true,
        caste_category: 'SC',
      },
    },
  ];

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateEligibility(profile);
      setEvaluatedSchemes(res.matched_schemes);
      setTotalEvaluated(res.total_evaluated);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate eligibility');
    } finally {
      setLoading(false);
    }
  };

  const openGraphModal = async (schemeId: string) => {
    setSelectedGraphNode(null);
    try {
      const node = await fetchSchemeGraph(schemeId);
      setSelectedGraphNode(node);
    } catch (err: any) {
      alert(`Could not load scheme graph: ${err.message}`);
    }
  };

  // Grouping results
  const eligibleSchemes = evaluatedSchemes?.filter((s) => s.eligibility_score === 1.0) || [];
  const partialSchemes = evaluatedSchemes?.filter((s) => s.eligibility_score >= 0.5 && s.eligibility_score < 1.0) || [];
  const ineligibleSchemes = evaluatedSchemes?.filter((s) => s.eligibility_score < 0.5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">SchemeGraph Discovery & Eligibility</h1>
            <p className="text-xs text-slate-500">
              Deterministic rule engine evaluating welfare eligibility without simulation or hallucinations
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Applicant Profile Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Applicant Demographic Profile</h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Form v1.0
            </span>
          </div>

          {/* Demo Presets Bar */}
          <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Load Realistic Profile (Demo Data):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {demoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfile(preset.data)}
                  className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors font-medium text-slate-700"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  required
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State of Residence</label>
              <input
                type="text"
                required
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder="e.g. Maharashtra, Karnataka, Uttar Pradesh"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Household Income (INR)</label>
              <input
                type="number"
                min="0"
                step="5000"
                required
                value={profile.annual_income_inr}
                onChange={(e) => setProfile({ ...profile, annual_income_inr: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                ₹{profile.annual_income_inr.toLocaleString('en-IN')} / year
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="street_vendor">Street Vendor</option>
                  <option value="farmer">Farmer / Agricultural</option>
                  <option value="artisan">Artisan / Craftsperson</option>
                  <option value="self_employed">Small Trader / Self-Employed</option>
                  <option value="salaried">Salaried Worker</option>
                  <option value="retired">Retired / Senior</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caste Category</label>
                <select
                  value={profile.caste_category || 'General'}
                  onChange={(e) => setProfile({ ...profile, caste_category: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="General_BPL">General (BPL)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.disability}
                  onChange={(e) => setProfile({ ...profile, disability: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">Person with Benchmark Disability (PwD)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Rules...</span>
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" />
                  <span>Evaluate Scheme Eligibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Evaluation Error: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!evaluatedSchemes && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Profile Evaluation</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Fill out the applicant demographic criteria or pick a demo profile on the left, then click
                "Evaluate Scheme Eligibility" to view deterministic welfare matches.
              </p>
              <button
                onClick={() => handleEvaluate()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Run Demo Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {evaluatedSchemes && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                <div>
                  <span className="text-slate-500">Total Evaluated: </span>
                  <span className="font-bold text-slate-900">{totalEvaluated} Schemes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {eligibleSchemes.length} Fully Eligible
                  </span>
                  <span className="inline-flex items-center text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {partialSchemes.length} Partial / Review
                  </span>
                  <span className="inline-flex items-center text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {ineligibleSchemes.length} Ineligible
                  </span>
                </div>
              </div>

              {/* 1. Fully Eligible Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Potentially Eligible Schemes (100% Match)</span>
                  <span className="text-xs font-normal text-slate-500">({eligibleSchemes.length})</span>
                </h3>

                {eligibleSchemes.length === 0 ? (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                    No schemes fully matched all criteria for this specific profile combination.
                  </div>
                ) : (
                  eligibleSchemes.map((scheme) => (
                    <SchemeResultCard
                      key={scheme.scheme_id}
                      scheme={scheme}
                      badgeType="eligible"
                      onOpenGraph={() => openGraphModal(scheme.scheme_id)}
                      onCheckDocuments={() => onSelectSchemeForClaimCraft && onSelectSchemeForClaimCraft(scheme.scheme_id)}
                    />
                  ))
                )}
              </div>

              {/* 2. Needs Review / Partial Section */}
              {partialSchemes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Requires Additional Verification (Partial Match)</span>
                    <span className="text-xs font-normal text-slate-500">({partialSchemes.length})</span>
                  </h3>

                  {partialSchemes.map((scheme) => (
                    <SchemeResultCard
                      key={scheme.scheme_id}
                      scheme={scheme}
                      badgeType="partial"
                      onOpenGraph={() => openGraphModal(scheme.scheme_id)}
                      onCheckDocuments={() => onSelectSchemeForClaimCraft && onSelectSchemeForClaimCraft(scheme.scheme_id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scheme Relationship Graph Modal */}
      {selectedGraphNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedGraphNode.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedGraphNode.scheme_id} • {selectedGraphNode.ministry}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGraphNode(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Scheme Overview:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedGraphNode.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Entitlement Benefits:</span>
                <p className="text-slate-600 bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-100 font-medium">
                  {selectedGraphNode.benefits}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Complementary & Linked Schemes in Graph:</span>
                {selectedGraphNode.related_schemes.length === 0 ? (
                  <p className="text-slate-400 italic">No linked schemes registered for this node.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {selectedGraphNode.related_schemes.map((rel, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div>
                          <span className="font-bold text-slate-800">{rel.title}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{rel.scheme_id}</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {rel.relationship}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGraphNode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Close Graph View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual scheme cards
interface SchemeResultCardProps {
  scheme: MatchedScheme;
  badgeType: 'eligible' | 'partial' | 'ineligible';
  onOpenGraph: () => void;
  onCheckDocuments?: () => void;
}

const SchemeResultCard: React.FC<SchemeResultCardProps> = ({
  scheme,
  badgeType,
  onOpenGraph,
  onCheckDocuments,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="font-mono text-[10px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            {scheme.scheme_id}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-1">{scheme.title}</h4>
          <p className="text-xs text-slate-500">{scheme.ministry}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <span
            className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
              badgeType === 'eligible'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {Math.round(scheme.eligibility_score * 100)}% Match
          </span>
        </div>
      </div>

      {/* Satisfied Criteria Chips */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Satisfied Conditions ({scheme.satisfied_criteria.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {scheme.satisfied_criteria.map((crit, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>{crit.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Criteria Chips */}
        {scheme.missing_criteria.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1">
              Unmet / Disqualifying Conditions ({scheme.missing_criteria.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {scheme.missing_criteria.map((crit, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px]"
                >
                  <XCircle className="w-3 h-3 text-amber-600" />
                  <span>{crit.replace(/_/g, ' ')}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onOpenGraph}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5 text-slate-500" />
          <span>View Scheme Graph</span>
        </button>

        {onCheckDocuments && (
          <button
            onClick={onCheckDocuments}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Check Documents (ClaimCraft)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
