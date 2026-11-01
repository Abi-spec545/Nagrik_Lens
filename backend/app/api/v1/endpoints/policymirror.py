"""API endpoints for the PolicyMirror module."""

from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.policymirror import (
    SummarizeRequest,
    SummarizeResponse,
    PolicyListItem,
    CompareRequest,
    CompareResponse,
    SimulateRequest,
    SimulateResponse,
    ClauseComparison,
)
from app.modules.policymirror.service import (
    list_policies,
    compare_policies,
    simulate_outcome,
)
from app.modules.policymirror.ai_service import generate_policy_summary

router = APIRouter()


@router.post(
    "/summarize",
    response_model=SummarizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarize Civic Policy",
    description="Translates complex civic notifications or gazettes into plain citizen language.",
)
async def summarize_policy(request: SummarizeRequest) -> SummarizeResponse:
    result = await generate_policy_summary(
        policy_title=request.policy_title,
        raw_text=request.raw_text,
        target_audience=request.target_audience,
    )
    return SummarizeResponse(
        summary=result["summary"],
        key_takeaways=result["key_takeaways"],
        impact_rating=result["impact_rating"],
        source_model=result["source_model"],
    )


@router.get(
    "/policies",
    response_model=List[PolicyListItem],
    status_code=status.HTTP_200_OK,
    summary="List Reference Policies",
    description="Returns available reference policies for comparison and simulation.",
)
def get_policies() -> List[PolicyListItem]:
    return [PolicyListItem(**p) for p in list_policies()]


@router.post(
    "/compare",
    response_model=CompareResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare Two Policy Records",
    description="Deterministically compares two policy records and evaluates clause-level changes.",
)
def compare_policy_records(request: CompareRequest) -> CompareResponse:
    result = compare_policies(request.old_policy_id, request.new_policy_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both policy records could not be found.",
        )
    return CompareResponse(
        old_policy=PolicyListItem(**result["old_policy"]),
        new_policy=PolicyListItem(**result["new_policy"]),
        clause_changes=[ClauseComparison(**c) for c in result["clause_changes"]],
        overall_impact=result["overall_impact"],
    )


@router.post(
    "/simulate",
    response_model=SimulateResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Policy Outcomes",
    description="Simulates policy outcomes for specific applicant demographic profiles.",
)
def simulate_policy_outcome(request: SimulateRequest) -> SimulateResponse:
    result = simulate_outcome(request.policy_id, request.applicant_profile)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy '{request.policy_id}' not found.",
        )
    return SimulateResponse(
        policy_id=result["policy_id"],
        policy_title=result["policy_title"],
        applicant_profile=result["applicant_profile"],
        applicable_clauses=result["applicable_clauses"],
        estimated_outcomes=result["estimated_outcomes"],
        warnings=result["warnings"],
    )
