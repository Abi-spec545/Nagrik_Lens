from fastapi import APIRouter
from app.api.v1.endpoints import health, schemegraph, claimcraft, civicroute, policymirror

api_router = APIRouter()

# Core service health
api_router.include_router(health.router, tags=["Health"])

# Civic Domain Modules
api_router.include_router(schemegraph.router, prefix="/schemegraph", tags=["SchemeGraph"])
api_router.include_router(claimcraft.router, prefix="/claimcraft", tags=["ClaimCraft"])
api_router.include_router(civicroute.router, prefix="/civicroute", tags=["CivicRoute"])
api_router.include_router(policymirror.router, prefix="/policymirror", tags=["PolicyMirror"])
