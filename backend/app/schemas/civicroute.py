"""Pydantic schemas for CivicRoute module — request/response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field


class LocationInfo(BaseModel):
    """Location context for grievance routing."""
    state: str = Field(..., min_length=1, description="State name")
    city: str = Field(..., min_length=1, description="City/town name")
    ward: Optional[str] = Field(None, description="Ward identifier if applicable")


class NavigateRequest(BaseModel):
    """Request body for POST /api/v1/civicroute/navigate."""
    category: str = Field(
        ..., min_length=1,
        description="Grievance category: water_supply, electricity, road_maintenance, sanitation, property_tax, ration_pds"
    )
    description: str = Field(
        ..., min_length=10, max_length=2000,
        description="Description of the grievance or issue"
    )
    location: LocationInfo


class EscalationLevel(BaseModel):
    """A single tier in the escalation hierarchy."""
    tier: int
    officer: str
    trigger_condition: str


class NavigateResponse(BaseModel):
    """Response body for POST /api/v1/civicroute/navigate."""
    primary_department: str
    officer_designation: str
    filing_channel: str
    sla_days: int
    escalation_levels: List[EscalationLevel]


class CategoryItem(BaseModel):
    """Available grievance category summary."""
    category: str
    label: str
