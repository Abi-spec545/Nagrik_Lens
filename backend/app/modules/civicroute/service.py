"""
CivicRoute Service — Deterministic grievance routing and escalation.

Routes grievances to correct departments based on category, state, and city
using the verified local dataset. No AI involved in routing decisions.
"""

from typing import Any, Dict, List
from app.data.departments import DEPARTMENT_ROUTES


def get_available_categories() -> List[Dict[str, str]]:
    """Return all available grievance categories."""
    return [
        {"category": key, "label": val["category_label"]}
        for key, val in DEPARTMENT_ROUTES.items()
    ]


def navigate_grievance(
    category: str, state: str, city: str
) -> Dict[str, Any] | None:
    """
    Route a grievance to the appropriate department based on category, state, and city.

    Uses hierarchical fallback:
    1. Exact state + city match
    2. State + _default city
    3. _default state + _default city

    Returns None if the category is not recognized.
    """
    route = DEPARTMENT_ROUTES.get(category)
    if route is None:
        return None

    departments = route["departments"]

    # Try exact state match
    state_routes = departments.get(state)
    if state_routes is None:
        # Fall back to _default state
        state_routes = departments.get("_default", {})

    # Try exact city match within state
    city_route = state_routes.get(city)
    if city_route is None:
        # Fall back to _default city within state
        city_route = state_routes.get("_default")

    if city_route is None:
        # Ultimate fallback: _default state, _default city
        default_state = departments.get("_default", {})
        city_route = default_state.get("_default")

    if city_route is None:
        return None

    return {
        "primary_department": city_route["primary_department"],
        "officer_designation": city_route["officer_designation"],
        "filing_channel": city_route["filing_channel"],
        "sla_days": city_route["sla_days"],
        "escalation_levels": city_route["escalation_levels"],
    }
