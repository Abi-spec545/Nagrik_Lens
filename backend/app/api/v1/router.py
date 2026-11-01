from fastapi import APIRouter
from app.api.v1.endpoints import health

api_router = APIRouter()

# Core service health
api_router.include_router(health.router, tags=["Health"])

# Module router placeholders (to be populated as modules are developed)
# api_router.include_router(schemegraph.router, prefix="/schemegraph", tags=["SchemeGraph"])
# api_router.include_router(claimcraft.router, prefix="/claimcraft", tags=["ClaimCraft"])
# api_router.include_router(civicroute.router, prefix="/civicroute", tags=["CivicRoute"])
# api_router.include_router(policymirror.router, prefix="/policymirror", tags=["PolicyMirror"])
