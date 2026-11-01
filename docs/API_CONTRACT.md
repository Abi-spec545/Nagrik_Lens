# NagrikLens API Contract (v1)

This document specifies the initial API contracts for the NagrikLens platform. All requests and responses communicate using standard JSON payloads over HTTP.

---

## 1. Global Standards & Conventions

- **Base URL (Local)**: `http://127.0.0.1:8000`
- **API Prefix**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token / API Key header (`Authorization: Bearer <token>`) where required in future milestones.
- **Time Representation**: All timestamps are formatted as ISO 8601 UTC strings (`YYYY-MM-DDTHH:MM:SSZ`).

### Standard Error Response Format
When any request fails with a 4xx or 5xx code, the body conforms to:
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Detailed human-readable error description",
      "type": "value_error"
    }
  ]
}
```

---

## 2. Core Service Endpoints

### 2.1 Root Meta Info
- **Method**: `GET`
- **Path**: `/`
- **Description**: Returns system metadata, documentation links, and registered modules.

**Response `200 OK`**:
```json
{
  "project": "NagrikLens API",
  "version": "0.1.0",
  "docs": "/docs",
  "health": "/api/v1/health",
  "modules": ["SchemeGraph", "ClaimCraft", "CivicRoute", "PolicyMirror"]
}
```

---

### 2.2 Health Check Endpoint
- **Method**: `GET`
- **Path**: `/api/v1/health`
- **Description**: Verifies operational readiness of the API, SQLite database connection, and civic module statuses.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "app_name": "NagrikLens API",
  "version": "0.1.0",
  "environment": "development",
  "timestamp": "2026-11-01T10:55:00Z",
  "database": "connected",
  "modules": {
    "schemegraph": {
      "name": "SchemeGraph",
      "status": "initialized",
      "description": "Civic welfare scheme eligibility and relationship discovery graph."
    },
    "claimcraft": {
      "name": "ClaimCraft",
      "status": "initialized",
      "description": "Citizen entitlement claim verification and document guidance engine."
    },
    "civicroute": {
      "name": "CivicRoute",
      "status": "initialized",
      "description": "Administrative grievance escalation and department routing navigator."
    },
    "policymirror": {
      "name": "PolicyMirror",
      "status": "initialized",
      "description": "Plain-language civic policy analysis and impact reflection tool."
    }
  }
}
```

---

## 3. Module Endpoint Contracts (Planned for 48h Sprint)

### 3.1 SchemeGraph (Scheme Discovery & Eligibility)

#### `POST /api/v1/schemegraph/evaluate`
Evaluates a citizen demographic profile against welfare scheme criteria.
- **Request Body**:
```json
{
  "profile": {
    "age": 34,
    "gender": "female",
    "state": "Maharashtra",
    "annual_income_inr": 180000,
    "occupation": "artisan",
    "disability": false,
    "caste_category": "OBC"
  }
}
```
- **Response `200 OK`**:
```json
{
  "matched_schemes": [
    {
      "scheme_id": "PM-SVANIDHI-01",
      "title": "PM Street Vendor's AtmaNirbhar Nidhi",
      "ministry": "Ministry of Housing and Urban Affairs",
      "eligibility_score": 1.0,
      "satisfied_criteria": ["occupation_match", "income_within_bracket"],
      "missing_criteria": []
    }
  ],
  "total_evaluated": 15
}
```

#### `GET /api/v1/schemegraph/schemes/{scheme_id}/graph`
Retrieves prerequisite dependencies, overlapping benefits, and related schemes for graph visualization.

---

### 3.2 ClaimCraft (Entitlement & Document Verification)

#### `POST /api/v1/claimcraft/checklist`
Generates required documents and verification steps for a target scheme.
- **Request Body**:
```json
{
  "scheme_id": "PM-SVANIDHI-01",
  "citizen_context": {
    "has_aadhaar": true,
    "has_bank_account": true,
    "vendor_id_card": false
  }
}
```
- **Response `200 OK`**:
```json
{
  "scheme_id": "PM-SVANIDHI-01",
  "required_documents": [
    {
      "document_type": "Identity & Address",
      "name": "Aadhaar Card",
      "status": "ready"
    },
    {
      "document_type": "Eligibility Proof",
      "name": "Certificate of Vending (CoV) / Letter of Recommendation",
      "status": "action_required",
      "issuing_authority": "Urban Local Body (ULB) / Town Vending Committee"
    }
  ],
  "readiness_percentage": 66.7
}
```

---

### 3.3 CivicRoute (Grievance Routing & Escalation)

#### `POST /api/v1/civicroute/navigate`
Routes an issue to the correct department authority and provides tiered escalation steps.
- **Request Body**:
```json
{
  "category": "water_supply",
  "description": "Contaminated municipal drinking water pipeline issue in Ward 14",
  "location": {
    "state": "Karnataka",
    "city": "Bengaluru",
    "ward": "Ward 14"
  }
}
```
- **Response `200 OK`**:
```json
{
  "primary_department": "Bangalore Water Supply and Sewerage Board (BWSSB)",
  "officer_designation": "Assistant Executive Engineer (Water Quality Division)",
  "filing_channel": "BWSSB Citizen Portal / Helpline 1916",
  "sla_days": 7,
  "escalation_levels": [
    {
      "tier": 1,
      "officer": "Executive Engineer (Sub-Division)",
      "trigger_condition": "Unresolved after 7 business days"
    },
    {
      "tier": 2,
      "officer": "Chief Engineer / Appellate Authority",
      "trigger_condition": "Unresolved after 15 business days"
    }
  ]
}
```

---

### 3.4 PolicyMirror (Plain-Language Civic Analysis)

#### `POST /api/v1/policymirror/summarize`
Translates complex civic notifications or gazette clauses into plain citizen language using Gemini API.
- **Request Body**:
```json
{
  "policy_title": "Draft Electric Vehicle Policy 2026",
  "raw_text": "Clause 4(a): Subsidies shall be disbursed subject to submission of Form V-B within thirty days of vehicle registration...",
  "target_audience": "general_citizen"
}
```
- **Response `200 OK`**:
```json
{
  "summary": "You can get an EV subsidy if you submit Form V-B within 30 days after registering your vehicle.",
  "key_takeaways": [
    "Subsidies require Form V-B submission within 30 days of registration.",
    "Delaying submission beyond 30 days forfeits the direct subsidy."
  ],
  "impact_rating": "moderate",
  "source_model": "gemini-1.5-flash"
}
```
