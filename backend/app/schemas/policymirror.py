"""Pydantic schemas for PolicyMirror module — request/response validation."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SummarizeRequest(BaseModel):
    """Request body for POST /api/v1/policymirror/summarize."""
    policy_title: str = Field(..., min_length=1, description="Title of the policy/notification")
    raw_text: str = Field(
        ..., min_length=10, max_length=10000,
        description="Raw text of the policy clause or notification"
    )
    target_audience: str = Field(
        "general_citizen",
        description="Target audience: general_citizen, farmer, vendor, student, senior_citizen"
    )


class SummarizeResponse(BaseModel):
    """Response body for POST /api/v1/policymirror/summarize."""
    summary: str
    key_takeaways: List[str]
    impact_rating: str = Field(
        ..., description="low, moderate, or high"
    )
    source_model: str = Field(
        ..., description="Model used for summarization or 'deterministic' if rule-based"
    )


class PolicyListItem(BaseModel):
    """Summary item for listing available policy records."""
    policy_id: str
    title: str
    issuing_authority: str
    date_published: str
    status: str
    category: str


class ClauseComparison(BaseModel):
    """Comparison of a clause across two policy versions."""
    impact_area: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    change_description: str


class CompareRequest(BaseModel):
    """Request body for POST /api/v1/policymirror/compare."""
    old_policy_id: str = Field(..., min_length=1)
    new_policy_id: str = Field(..., min_length=1)


class CompareResponse(BaseModel):
    """Response body for POST /api/v1/policymirror/compare."""
    old_policy: PolicyListItem
    new_policy: PolicyListItem
    clause_changes: List[ClauseComparison]
    overall_impact: str = Field(
        ..., description="positive, negative, mixed, or neutral"
    )


class SimulateRequest(BaseModel):
    """Request body for POST /api/v1/policymirror/simulate."""
    policy_id: str = Field(..., min_length=1)
    applicant_profile: Dict[str, Any] = Field(
        ...,
        description="Applicant profile for outcome simulation",
        json_schema_extra={"example": {"type": "individual_buyer", "vehicle_type": "two_wheeler"}},
    )


class SimulateResponse(BaseModel):
    """Response body for POST /api/v1/policymirror/simulate."""
    policy_id: str
    policy_title: str
    applicant_profile: Dict[str, Any]
    applicable_clauses: List[str]
    estimated_outcomes: List[str]
    warnings: List[str] = Field(default_factory=list)
