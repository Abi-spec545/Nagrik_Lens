"""Pydantic schemas for ClaimCraft module — request/response validation."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ChecklistRequest(BaseModel):
    """Request body for POST /api/v1/claimcraft/checklist."""
    scheme_id: str = Field(..., min_length=1, description="Target scheme identifier")
    citizen_context: Dict[str, bool] = Field(
        ...,
        description="Map of document/condition keys to boolean availability",
        json_schema_extra={"example": {"has_aadhaar": True, "has_bank_account": True}},
    )


class DocumentItem(BaseModel):
    """A single document requirement with its readiness status."""
    document_type: str
    name: str
    status: str = Field(
        ..., description="ready, action_required, or not_applicable"
    )
    mandatory: bool = True
    issuing_authority: Optional[str] = None


class ChecklistResponse(BaseModel):
    """Response body for POST /api/v1/claimcraft/checklist."""
    scheme_id: str
    scheme_title: str
    required_documents: List[DocumentItem]
    readiness_percentage: float = Field(
        ..., ge=0.0, le=100.0,
        description="Percentage of mandatory documents that are ready"
    )


class ExtractedField(BaseModel):
    """A single field extracted from a document."""
    field_name: str
    value: str
    confidence: str = Field(
        ..., description="high, medium, or low — indicates extraction certainty"
    )


class DiscrepancyItem(BaseModel):
    """A detected discrepancy in document data."""
    field: str
    expected: Optional[str] = None
    found: str
    severity: str = Field(
        ..., description="critical, warning, or info"
    )
    recommendation: str


class DocumentVerifyResponse(BaseModel):
    """Response body for POST /api/v1/claimcraft/verify-document."""
    filename: str
    extracted_fields: List[ExtractedField]
    discrepancies: List[DiscrepancyItem]
    needs_human_review: bool = Field(
        ...,
        description="True if any extraction has low confidence or critical discrepancy found"
    )
    review_reasons: List[str] = Field(
        default_factory=list,
        description="List of reasons why human review is recommended"
    )
