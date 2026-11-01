from typing import Dict
from datetime import datetime
from pydantic import BaseModel, Field


class ModuleStatus(BaseModel):
    name: str
    status: str = Field(..., description="Operational status: ready, initialized, pending")
    description: str


class HealthCheckResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "healthy"})
    app_name: str
    version: str
    environment: str
    timestamp: datetime
    database: str = Field(..., json_schema_extra={"example": "connected"})
    modules: Dict[str, ModuleStatus]
