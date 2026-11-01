export interface ModuleStatus {
  name: string;
  status: 'ready' | 'initialized' | 'pending' | 'degraded' | string;
  description: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | string;
  app_name: string;
  version: string;
  environment: string;
  timestamp: string;
  database: string;
  modules: {
    schemegraph: ModuleStatus;
    claimcraft: ModuleStatus;
    civicroute: ModuleStatus;
    policymirror: ModuleStatus;
    [key: string]: ModuleStatus;
  };
}

// SchemeGraph Types
export interface CitizenProfile {
  age: number;
  gender: string;
  state: string;
  annual_income_inr: number;
  occupation: string;
  disability: boolean;
  caste_category?: string;
}

export interface MatchedScheme {
  scheme_id: string;
  title: string;
  ministry: string;
  eligibility_score: number;
  satisfied_criteria: string[];
  missing_criteria: string[];
}

export interface EvaluateResponse {
  matched_schemes: MatchedScheme[];
  total_evaluated: number;
}

export interface SchemeListItem {
  scheme_id: string;
  title: string;
  ministry: string;
  description: string;
}

export interface RelatedScheme {
  scheme_id: string;
  title: string;
  relationship: string;
}

export interface SchemeGraphNode {
  scheme_id: string;
  title: string;
  ministry: string;
  description: string;
  benefits: string;
  related_schemes: RelatedScheme[];
}

// ClaimCraft Types
export interface DocumentItem {
  document_type: string;
  name: string;
  status: 'ready' | 'action_required' | string;
  mandatory: boolean;
  issuing_authority?: string;
}

export interface ChecklistResponse {
  scheme_id: string;
  scheme_title: string;
  required_documents: DocumentItem[];
  readiness_percentage: number;
}

export interface ExtractedField {
  field_name: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface DiscrepancyItem {
  field: string;
  expected?: string;
  found: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation: string;
}

export interface DocumentVerifyResponse {
  filename: string;
  extracted_fields: ExtractedField[];
  discrepancies: DiscrepancyItem[];
  needs_human_review: boolean;
  review_reasons: string[];
}

// CivicRoute Types
export interface LocationInfo {
  state: string;
  city: string;
  ward?: string;
}

export interface EscalationLevel {
  tier: number;
  officer: string;
  trigger_condition: string;
}

export interface NavigateResponse {
  primary_department: string;
  officer_designation: string;
  filing_channel: string;
  sla_days: number;
  escalation_levels: EscalationLevel[];
}

export interface CategoryItem {
  category: string;
  label: string;
}

// PolicyMirror Types
export interface PolicyListItem {
  policy_id: string;
  title: string;
  issuing_authority: string;
  date_published: string;
  status: string;
  category: string;
}

export interface SummarizeResponse {
  summary: string;
  key_takeaways: string[];
  impact_rating: 'low' | 'moderate' | 'high';
  source_model: string;
}

export interface ClauseComparison {
  impact_area: string;
  old_value?: string;
  new_value?: string;
  change_description: string;
}

export interface CompareResponse {
  old_policy: PolicyListItem;
  new_policy: PolicyListItem;
  clause_changes: ClauseComparison[];
  overall_impact: 'positive' | 'negative' | 'mixed' | 'neutral';
}

export interface SimulateResponse {
  policy_id: string;
  policy_title: string;
  applicant_profile: Record<string, any>;
  applicable_clauses: string[];
  estimated_outcomes: string[];
  warnings: string[];
}
