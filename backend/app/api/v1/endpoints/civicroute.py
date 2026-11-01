"""API endpoints for the CivicRoute module."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.civicroute import (
    NavigateRequest,
    NavigateResponse,
    EscalationLevel,
    CategoryItem,
)
from app.modules.civicroute.service import (
    navigate_grievance,
    get_available_categories,
)

router = APIRouter()


@router.post(
    "/navigate",
    response_model=NavigateResponse,
    status_code=status.HTTP_200_OK,
    summary="Route Grievance to Department",
    description="Routes a civic grievance to the correct department and provides escalation steps.",
)
def navigate(request: NavigateRequest) -> NavigateResponse:
    result = navigate_grievance(
        category=request.category,
        state=request.location.state,
        city=request.location.city,
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance category '{request.category}' is not recognized. "
                   f"Use GET /api/v1/civicroute/categories for valid options.",
        )
    return NavigateResponse(
        primary_department=result["primary_department"],
        officer_designation=result["officer_designation"],
        filing_channel=result["filing_channel"],
        sla_days=result["sla_days"],
        escalation_levels=[EscalationLevel(**e) for e in result["escalation_levels"]],
    )


@router.get(
    "/categories",
    response_model=list[CategoryItem],
    status_code=status.HTTP_200_OK,
    summary="List Grievance Categories",
    description="Returns all available grievance categories supported by the routing engine.",
)
def list_categories() -> list[CategoryItem]:
    return [CategoryItem(**c) for c in get_available_categories()]
