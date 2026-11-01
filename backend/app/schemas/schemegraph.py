"""Pydantic schemas for SchemeGraph module — request/response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field


class CitizenProfile(BaseModel):
    """Citizen demographic profile for eligibility evaluation."""
    age: int = Field(..., ge=0, le=150, description="Citizen age in years")
    gender: str = Field(..., min_length=1, description="Gender: male, female, other")
    state: str = Field(..., min_length=1, description="State of residence")
    annual_income_inr: float = Field(..., ge=0, description="Annual income in INR")
    occupation: str = Field(..., min_length=1, description="Primary occupation")
    disability: bool = Field(False, description="Whether citizen has a disability")
    caste_category: Optional[str] = Field(
        None, description="Caste category: General, OBC, SC, ST, or None"
    )


class EvaluateRequest(BaseModel):
    """Request body for POST /api/v1/schemegraph/evaluate."""
    profile: CitizenProfile


class MatchedScheme(BaseModel):
    """A scheme that matched (fully or partially) the citizen profile."""
    scheme_id: str
    title: str
    ministry: str
    eligibility_score: float = Field(
        ..., ge=0.0, le=1.0,
        description="Fraction of criteria satisfied (1.0 = fully eligible)"
    )
    satisfied_criteria: List[str]
    missing_criteria: List[str]


class EvaluateResponse(BaseModel):
    """Response body for POST /api/v1/schemegraph/evaluate."""
    matched_schemes: List[MatchedScheme]
    total_evaluated: int


class RelatedScheme(BaseModel):
    """A scheme related to the queried scheme."""
    scheme_id: str
    title: str
    relationship: str = Field(
        ..., description="Nature of relationship: co-benefit, prerequisite, complementary"
    )


class SchemeGraphNode(BaseModel):
    """Graph node representing a scheme and its relationships."""
    scheme_id: str
    title: str
    ministry: str
    description: str
    benefits: str
    related_schemes: List[RelatedScheme]


class SchemeListItem(BaseModel):
    """Summary item for listing all schemes."""
    scheme_id: str
    title: str
    ministry: str
    description: str
