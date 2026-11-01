"""
SchemeGraph Rule Engine — Deterministic eligibility evaluation.

All eligibility decisions are made by pure Python functions.
No LLM or AI is involved in determining eligibility.
"""

from typing import Any, Dict, List, Tuple
from app.data.schemes import SCHEMES_DATASET


def _normalize(value: str) -> str:
    """Lowercase and strip whitespace for comparison."""
    return value.strip().lower()


def _check_age(
    citizen_age: int, min_age: int | None, max_age: int | None
) -> Tuple[bool, str]:
    """Check if citizen age is within the scheme's age bracket."""
    if min_age is not None and citizen_age < min_age:
        return False, "age_below_minimum"
    if max_age is not None and citizen_age > max_age:
        return False, "age_above_maximum"
    return True, "age_within_range"


def _check_income(
    citizen_income: float, max_income: float | None
) -> Tuple[bool, str]:
    """Check if citizen income is within the scheme's income cap."""
    if max_income is None:
        return True, "income_no_cap"
    if citizen_income <= max_income:
        return True, "income_within_bracket"
    return False, "income_exceeds_limit"


def _check_occupation(
    citizen_occupation: str, allowed_occupations: list | None
) -> Tuple[bool, str]:
    """Check if citizen occupation matches scheme requirements."""
    if allowed_occupations is None:
        return True, "occupation_no_restriction"
    normalized_citizen = _normalize(citizen_occupation)
    normalized_allowed = [_normalize(o) for o in allowed_occupations]
    if normalized_citizen in normalized_allowed:
        return True, "occupation_match"
    return False, "occupation_mismatch"


def _check_gender(
    citizen_gender: str, allowed_genders: list | None
) -> Tuple[bool, str]:
    """Check if citizen gender matches scheme requirements."""
    if allowed_genders is None:
        return True, "gender_no_restriction"
    normalized_citizen = _normalize(citizen_gender)
    normalized_allowed = [_normalize(g) for g in allowed_genders]
    if normalized_citizen in normalized_allowed:
        return True, "gender_match"
    return False, "gender_mismatch"


def _check_caste(
    citizen_caste: str | None, allowed_castes: list | None
) -> Tuple[bool, str]:
    """Check if citizen caste category matches scheme requirements."""
    if allowed_castes is None:
        return True, "caste_no_restriction"
    if citizen_caste is None:
        return False, "caste_not_specified"
    normalized_citizen = _normalize(citizen_caste)
    normalized_allowed = [_normalize(c) for c in allowed_castes]
    if normalized_citizen in normalized_allowed:
        return True, "caste_category_match"
    # Also check if "general_bpl" contains the citizen category
    if any(normalized_citizen in a or a in normalized_citizen for a in normalized_allowed):
        return True, "caste_category_match"
    return False, "caste_category_mismatch"


def _check_state(
    citizen_state: str, allowed_states: list | None
) -> Tuple[bool, str]:
    """Check if citizen state is covered by the scheme."""
    if allowed_states is None:
        return True, "state_no_restriction"
    normalized_citizen = _normalize(citizen_state)
    normalized_allowed = [_normalize(s) for s in allowed_states]
    if normalized_citizen in normalized_allowed:
        return True, "state_covered"
    return False, "state_not_covered"


def evaluate_single_scheme(
    profile: Dict[str, Any], scheme: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluate a single scheme against a citizen profile.

    Returns a dict with scheme_id, title, ministry, eligibility_score,
    satisfied_criteria, and missing_criteria.
    """
    rules = scheme["eligibility_rules"]
    satisfied: List[str] = []
    missing: List[str] = []

    # 1. Age check
    passed, criterion = _check_age(
        profile["age"], rules.get("min_age"), rules.get("max_age")
    )
    (satisfied if passed else missing).append(criterion)

    # 2. Income check
    passed, criterion = _check_income(
        profile["annual_income_inr"], rules.get("max_annual_income_inr")
    )
    (satisfied if passed else missing).append(criterion)

    # 3. Occupation check
    passed, criterion = _check_occupation(
        profile["occupation"], rules.get("occupation")
    )
    (satisfied if passed else missing).append(criterion)

    # 4. Gender check
    passed, criterion = _check_gender(
        profile["gender"], rules.get("gender")
    )
    (satisfied if passed else missing).append(criterion)

    # 5. Caste category check
    passed, criterion = _check_caste(
        profile.get("caste_category"), rules.get("caste_category")
    )
    (satisfied if passed else missing).append(criterion)

    # 6. State check
    passed, criterion = _check_state(
        profile["state"], rules.get("states")
    )
    (satisfied if passed else missing).append(criterion)

    total_criteria = len(satisfied) + len(missing)
    score = len(satisfied) / total_criteria if total_criteria > 0 else 0.0

    return {
        "scheme_id": scheme["scheme_id"],
        "title": scheme["title"],
        "ministry": scheme["ministry"],
        "eligibility_score": round(score, 4),
        "satisfied_criteria": satisfied,
        "missing_criteria": missing,
    }


def evaluate_all_schemes(
    profile: Dict[str, Any], min_score: float = 0.5
) -> Dict[str, Any]:
    """
    Evaluate all schemes in the dataset against a citizen profile.

    Returns schemes with eligibility_score >= min_score, sorted by score descending.
    """
    results = []
    for scheme in SCHEMES_DATASET:
        result = evaluate_single_scheme(profile, scheme)
        if result["eligibility_score"] >= min_score:
            results.append(result)

    results.sort(key=lambda x: x["eligibility_score"], reverse=True)

    return {
        "matched_schemes": results,
        "total_evaluated": len(SCHEMES_DATASET),
    }


def get_scheme_by_id(scheme_id: str) -> Dict[str, Any] | None:
    """Look up a single scheme by its ID."""
    for scheme in SCHEMES_DATASET:
        if scheme["scheme_id"] == scheme_id:
            return scheme
    return None


def get_scheme_graph(scheme_id: str) -> Dict[str, Any] | None:
    """
    Build a graph node for a scheme showing its relationships.
    """
    scheme = get_scheme_by_id(scheme_id)
    if scheme is None:
        return None

    related = []
    for related_id in scheme.get("related_schemes", []):
        related_scheme = get_scheme_by_id(related_id)
        if related_scheme:
            related.append({
                "scheme_id": related_scheme["scheme_id"],
                "title": related_scheme["title"],
                "relationship": "complementary",
            })

    return {
        "scheme_id": scheme["scheme_id"],
        "title": scheme["title"],
        "ministry": scheme["ministry"],
        "description": scheme["description"],
        "benefits": scheme["benefits"],
        "related_schemes": related,
    }


def list_all_schemes() -> List[Dict[str, str]]:
    """Return a summary list of all schemes in the dataset."""
    return [
        {
            "scheme_id": s["scheme_id"],
            "title": s["title"],
            "ministry": s["ministry"],
            "description": s["description"],
        }
        for s in SCHEMES_DATASET
    ]
