"""API endpoints for the SchemeGraph module."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.schemegraph import (
    EvaluateRequest,
    EvaluateResponse,
    MatchedScheme,
    SchemeGraphNode,
    RelatedScheme,
    SchemeListItem,
)
from app.modules.schemegraph.engine import (
    evaluate_all_schemes,
    get_scheme_graph,
    list_all_schemes,
)

router = APIRouter()


@router.post(
    "/evaluate",
    response_model=EvaluateResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Citizen Eligibility",
    description="Evaluates a citizen profile against all welfare schemes using deterministic rules.",
)
def evaluate_eligibility(request: EvaluateRequest) -> EvaluateResponse:
    profile_dict = request.profile.model_dump()
    result = evaluate_all_schemes(profile_dict)
    return EvaluateResponse(
        matched_schemes=[MatchedScheme(**s) for s in result["matched_schemes"]],
        total_evaluated=result["total_evaluated"],
    )


@router.get(
    "/schemes",
    response_model=list[SchemeListItem],
    status_code=status.HTTP_200_OK,
    summary="List All Schemes",
    description="Returns a summary list of all welfare schemes in the dataset.",
)
def list_schemes() -> list[SchemeListItem]:
    return [SchemeListItem(**s) for s in list_all_schemes()]


@router.get(
    "/schemes/{scheme_id}/graph",
    response_model=SchemeGraphNode,
    status_code=status.HTTP_200_OK,
    summary="Scheme Relationship Graph",
    description="Retrieves a scheme's details and related scheme relationships for graph visualization.",
)
def get_scheme_graph_endpoint(scheme_id: str) -> SchemeGraphNode:
    result = get_scheme_graph(scheme_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme '{scheme_id}' not found in the dataset.",
        )
    return SchemeGraphNode(
        scheme_id=result["scheme_id"],
        title=result["title"],
        ministry=result["ministry"],
        description=result["description"],
        benefits=result["benefits"],
        related_schemes=[RelatedScheme(**r) for r in result["related_schemes"]],
    )
