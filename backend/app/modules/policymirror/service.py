"""
PolicyMirror Service — Deterministic policy comparison and outcome simulation.

Policy comparison and outcome simulation are fully deterministic.
AI-based summarization is isolated in a separate function and clearly
labeled as AI-generated output.
"""

from typing import Any, Dict, List
from app.data.policies import POLICY_RECORDS


def list_policies() -> List[Dict[str, str]]:
    """Return a summary list of all available policy records."""
    return [
        {
            "policy_id": p["policy_id"],
            "title": p["title"],
            "issuing_authority": p["issuing_authority"],
            "date_published": p["date_published"],
            "status": p["status"],
            "category": p["category"],
        }
        for p in POLICY_RECORDS.values()
    ]


def get_policy_by_id(policy_id: str) -> Dict[str, Any] | None:
    """Look up a single policy by ID."""
    return POLICY_RECORDS.get(policy_id)


def compare_policies(
    old_policy_id: str, new_policy_id: str
) -> Dict[str, Any] | None:
    """
    Compare two policy records and identify clause-level changes.

    Returns None if either policy is not found.
    """
    old_policy = POLICY_RECORDS.get(old_policy_id)
    new_policy = POLICY_RECORDS.get(new_policy_id)

    if old_policy is None or new_policy is None:
        return None

    # Build impact area maps
    old_clauses: Dict[str, Dict[str, Any]] = {}
    for clause in old_policy.get("key_clauses", []):
        old_clauses[clause["impact_area"]] = clause

    new_clauses: Dict[str, Dict[str, Any]] = {}
    for clause in new_policy.get("key_clauses", []):
        new_clauses[clause["impact_area"]] = clause

    # Find all impact areas across both
    all_areas = set(old_clauses.keys()) | set(new_clauses.keys())

    changes: List[Dict[str, str | None]] = []
    positive_count = 0
    negative_count = 0

    for area in sorted(all_areas):
        old_clause = old_clauses.get(area)
        new_clause = new_clauses.get(area)

        if old_clause is None and new_clause is not None:
            changes.append({
                "impact_area": area,
                "old_value": None,
                "new_value": new_clause.get("text", "New provision added"),
                "change_description": f"New provision introduced for {area}.",
            })
            positive_count += 1
        elif old_clause is not None and new_clause is None:
            changes.append({
                "impact_area": area,
                "old_value": old_clause.get("text", "Previous provision"),
                "new_value": None,
                "change_description": f"Provision for {area} removed in new policy.",
            })
            negative_count += 1
        elif old_clause is not None and new_clause is not None:
            old_text = old_clause.get("text", "")
            new_text = new_clause.get("text", "")
            if old_text != new_text:
                changes.append({
                    "impact_area": area,
                    "old_value": old_text,
                    "new_value": new_text,
                    "change_description": f"Provision for {area} has been modified.",
                })
                positive_count += 1  # Neutral default, could be either

    # Determine overall impact
    if positive_count > 0 and negative_count == 0:
        overall = "positive"
    elif negative_count > 0 and positive_count == 0:
        overall = "negative"
    elif positive_count > 0 and negative_count > 0:
        overall = "mixed"
    else:
        overall = "neutral"

    def _make_summary(p: Dict[str, Any]) -> Dict[str, str]:
        return {
            "policy_id": p["policy_id"],
            "title": p["title"],
            "issuing_authority": p["issuing_authority"],
            "date_published": p["date_published"],
            "status": p["status"],
            "category": p["category"],
        }

    return {
        "old_policy": _make_summary(old_policy),
        "new_policy": _make_summary(new_policy),
        "clause_changes": changes,
        "overall_impact": overall,
    }


def simulate_outcome(
    policy_id: str, applicant_profile: Dict[str, Any]
) -> Dict[str, Any] | None:
    """
    Simulate policy outcomes for a given applicant profile.

    Uses deterministic rules from policy clause data.
    Returns None if policy is not found.
    """
    policy = POLICY_RECORDS.get(policy_id)
    if policy is None:
        return None

    applicable_clauses: List[str] = []
    estimated_outcomes: List[str] = []
    warnings: List[str] = []

    applicant_type = applicant_profile.get("type", "general_citizen")

    # Check if applicant is in target beneficiaries
    if applicant_type not in policy.get("target_beneficiaries", []):
        warnings.append(
            f"Applicant type '{applicant_type}' is not listed as a target beneficiary for this policy."
        )

    for clause in policy.get("key_clauses", []):
        clause_id = clause.get("clause_id", "unknown")
        impact_area = clause.get("impact_area", "")

        # ── Subsidy amount simulation ──
        if impact_area == "subsidy_amount":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")

            vehicle_type = applicant_profile.get("vehicle_type", "").lower()
            if "subsidy_cap_2w" in clause and vehicle_type in ("two_wheeler", "2w"):
                cap = clause["subsidy_cap_2w"]
                estimated_outcomes.append(
                    f"Maximum subsidy for two-wheeler: INR {cap:,}"
                )
            elif "subsidy_cap_4w" in clause and vehicle_type in ("four_wheeler", "4w"):
                cap = clause["subsidy_cap_4w"]
                estimated_outcomes.append(
                    f"Maximum subsidy for four-wheeler: INR {cap:,}"
                )
            elif "incentive_per_kwh" in clause:
                battery_kwh = applicant_profile.get("battery_kwh", 0)
                vehicle_cost = applicant_profile.get("vehicle_cost", 0)
                max_percent = clause.get("max_percent_of_cost", 100)
                if battery_kwh > 0:
                    raw_incentive = battery_kwh * clause["incentive_per_kwh"]
                    capped = min(raw_incentive, vehicle_cost * max_percent / 100) if vehicle_cost > 0 else raw_incentive
                    estimated_outcomes.append(
                        f"Estimated incentive: INR {capped:,.0f} (based on {battery_kwh} kWh battery)"
                    )
                else:
                    estimated_outcomes.append(
                        "Provide battery_kwh in profile to calculate per-kWh incentive."
                    )

        # ── Deadline simulation ──
        elif impact_area == "subsidy_access":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            deadline = clause.get("deadline_days")
            if deadline:
                estimated_outcomes.append(
                    f"Form submission deadline: {deadline} days from registration."
                )
                warnings.append(
                    f"Missing the {deadline}-day deadline will forfeit the subsidy."
                )

        elif impact_area == "response_timeline":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            deadline = clause.get("deadline_days")
            if deadline:
                estimated_outcomes.append(
                    f"Information must be provided within {deadline} days of request."
                )

        elif impact_area == "urgent_response":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            hours = clause.get("deadline_hours")
            if hours:
                estimated_outcomes.append(
                    f"For life/liberty matters: response within {hours} hours."
                )

        elif impact_area == "filing_deadline":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            years = clause.get("deadline_years")
            if years:
                estimated_outcomes.append(
                    f"Complaint must be filed within {years} years of cause of action."
                )

        elif impact_area == "resolution_timeline":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            months_no_test = clause.get("resolution_months_no_test")
            months_with_test = clause.get("resolution_months_with_test")
            if months_no_test:
                estimated_outcomes.append(
                    f"Resolution timeline: {months_no_test} months (without testing), "
                    f"{months_with_test} months (with testing)."
                )

        elif impact_area == "appeal_process":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            first = clause.get("first_appeal_days")
            second = clause.get("second_appeal_days")
            if first:
                estimated_outcomes.append(
                    f"First appeal: within {first} days. Second appeal: within {second} days."
                )

        elif impact_area == "state_top_up":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            max_pct = clause.get("max_state_percent")
            if max_pct is not None:
                estimated_outcomes.append(
                    f"State governments may provide additional subsidy up to {max_pct}% of ex-showroom price."
                )
            else:
                estimated_outcomes.append(
                    "No state-level subsidy coordination mandated under this policy."
                )

        elif impact_area == "manufacturing":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            min_local = clause.get("min_localization_percent")
            if min_local:
                estimated_outcomes.append(
                    f"Vehicle must meet minimum {min_local}% localization requirement."
                )

        elif impact_area == "jurisdiction":
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")
            claim_amount = applicant_profile.get("claim_amount_inr", 0)
            if claim_amount > 0:
                if claim_amount <= 10000000:  # 1 crore
                    estimated_outcomes.append(
                        f"Claim of INR {claim_amount:,} falls under District Consumer Commission jurisdiction."
                    )
                elif claim_amount <= 100000000:  # 10 crore
                    estimated_outcomes.append(
                        f"Claim of INR {claim_amount:,} falls under State Consumer Commission jurisdiction."
                    )
                else:
                    estimated_outcomes.append(
                        f"Claim of INR {claim_amount:,} falls under National Consumer Commission jurisdiction."
                    )
            else:
                estimated_outcomes.append(
                    "Provide claim_amount_inr in profile to determine jurisdiction."
                )

        else:
            # Generic clause processing
            applicable_clauses.append(f"Clause {clause_id}: {clause.get('text', '')}")

    if not applicable_clauses:
        warnings.append("No directly applicable clauses found for this applicant profile.")

    return {
        "policy_id": policy["policy_id"],
        "policy_title": policy["title"],
        "applicant_profile": applicant_profile,
        "applicable_clauses": applicable_clauses,
        "estimated_outcomes": estimated_outcomes,
        "warnings": warnings,
    }


def summarize_policy_deterministic(raw_text: str, policy_title: str) -> Dict[str, Any]:
    """
    Produce a basic deterministic summary of policy text.

    This is the fallback when Gemini API is unavailable.
    It extracts key sentences and produces a structured summary.
    """
    sentences = [s.strip() for s in raw_text.replace("\n", " ").split(".") if s.strip()]

    # Take first few substantive sentences as summary
    summary_sentences = [s for s in sentences if len(s) > 20][:3]
    summary = ". ".join(summary_sentences) + "." if summary_sentences else raw_text[:200]

    # Extract key takeaways: sentences with numbers, deadlines, or amounts
    takeaways: List[str] = []
    import re
    for s in sentences:
        if re.search(r"\d+", s) and len(s) > 15:
            takeaways.append(s.strip() + ".")
            if len(takeaways) >= 3:
                break

    if not takeaways:
        takeaways = [f"Review the full text of {policy_title} for specific provisions."]

    # Simple impact rating based on content signals
    text_lower = raw_text.lower()
    if any(w in text_lower for w in ["penalty", "fine", "revoke", "forfeit", "prohibit"]):
        impact = "high"
    elif any(w in text_lower for w in ["subsidy", "benefit", "incentive", "grant", "exemption"]):
        impact = "moderate"
    else:
        impact = "low"

    return {
        "summary": summary,
        "key_takeaways": takeaways,
        "impact_rating": impact,
        "source_model": "deterministic",
    }
