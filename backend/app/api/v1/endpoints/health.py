from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.schemas.health import HealthCheckResponse, ModuleStatus

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
    description="Returns the operational status of the API, database connectivity, and civic module registries.",
)
def get_health(db: Session = Depends(get_db)) -> HealthCheckResponse:
    # Verify DB connectivity
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unreachable: {str(exc)}"

    return HealthCheckResponse(
        status="healthy" if db_status == "connected" else "degraded",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
        database=db_status,
        modules={
            "schemegraph": ModuleStatus(
                name="SchemeGraph",
                status="initialized",
                description="Civic welfare scheme eligibility and relationship discovery graph.",
            ),
            "claimcraft": ModuleStatus(
                name="ClaimCraft",
                status="initialized",
                description="Citizen entitlement claim verification and document guidance engine.",
            ),
            "civicroute": ModuleStatus(
                name="CivicRoute",
                status="initialized",
                description="Administrative grievance escalation and department routing navigator.",
            ),
            "policymirror": ModuleStatus(
                name="PolicyMirror",
                status="initialized",
                description="Plain-language civic policy analysis and impact reflection tool.",
            ),
        },
    )
