import {
  HealthCheckResponse,
  CitizenProfile,
  EvaluateResponse,
  SchemeListItem,
  SchemeGraphNode,
  ChecklistResponse,
  DocumentVerifyResponse,
  CategoryItem,
  NavigateResponse,
  LocationInfo,
  PolicyListItem,
  SummarizeResponse,
  CompareResponse,
  SimulateResponse,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.detail) {
        if (typeof errJson.detail === 'string') {
          errorDetail = errJson.detail;
        } else if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      }
    } catch {
      // Use fallback errorDetail
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

// 1. Health
export async function fetchHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/health`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<HealthCheckResponse>(res);
}

// 2. SchemeGraph
export async function evaluateEligibility(profile: CitizenProfile): Promise<EvaluateResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/schemegraph/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ profile }),
  });
  return handleResponse<EvaluateResponse>(res);
}

export async function fetchSchemes(): Promise<SchemeListItem[]> {
  const res = await fetch(`${BASE_URL}/api/v1/schemegraph/schemes`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<SchemeListItem[]>(res);
}

export async function fetchSchemeGraph(schemeId: string): Promise<SchemeGraphNode> {
  const res = await fetch(`${BASE_URL}/api/v1/schemegraph/schemes/${encodeURIComponent(schemeId)}/graph`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<SchemeGraphNode>(res);
}

// 3. ClaimCraft
export async function fetchChecklist(schemeId: string, citizenContext: Record<string, boolean>): Promise<ChecklistResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/claimcraft/checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, citizen_context: citizenContext }),
  });
  return handleResponse<ChecklistResponse>(res);
}

export async function verifyDocument(file: File): Promise<DocumentVerifyResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/v1/claimcraft/verify-document`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  return handleResponse<DocumentVerifyResponse>(res);
}

export async function downloadChecklistPdf(schemeId: string, citizenContext: Record<string, boolean>): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/v1/claimcraft/checklist/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, citizen_context: citizenContext }),
  });
  if (!res.ok) {
    throw new Error(`PDF generation failed: ${res.statusText}`);
  }
  return res.blob();
}

// 4. CivicRoute
export async function fetchCivicCategories(): Promise<CategoryItem[]> {
  const res = await fetch(`${BASE_URL}/api/v1/civicroute/categories`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<CategoryItem[]>(res);
}

export async function navigateGrievance(
  category: string,
  description: string,
  location: LocationInfo
): Promise<NavigateResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/civicroute/navigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ category, description, location }),
  });
  return handleResponse<NavigateResponse>(res);
}

// 5. PolicyMirror
export async function fetchPolicies(): Promise<PolicyListItem[]> {
  const res = await fetch(`${BASE_URL}/api/v1/policymirror/policies`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<PolicyListItem[]>(res);
}

export async function summarizePolicy(
  policyTitle: string,
  rawText: string,
  targetAudience: string = 'general_citizen'
): Promise<SummarizeResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/policymirror/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      policy_title: policyTitle,
      raw_text: rawText,
      target_audience: targetAudience,
    }),
  });
  return handleResponse<SummarizeResponse>(res);
}

export async function comparePolicies(oldPolicyId: string, newPolicyId: string): Promise<CompareResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/policymirror/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      old_policy_id: oldPolicyId,
      new_policy_id: newPolicyId,
    }),
  });
  return handleResponse<CompareResponse>(res);
}

export async function simulatePolicy(
  policyId: string,
  applicantProfile: Record<string, any>
): Promise<SimulateResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/policymirror/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      policy_id: policyId,
      applicant_profile: applicantProfile,
    }),
  });
  return handleResponse<SimulateResponse>(res);
}
