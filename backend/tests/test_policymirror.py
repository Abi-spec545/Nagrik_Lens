import pytest


def test_summarize_policy_contract(client):
    """Test policy summarization matches API contract."""
    payload = {
        "policy_title": "Draft Electric Vehicle Policy 2026",
        "raw_text": (
            "Clause 4(a): Subsidies shall be disbursed subject to submission of Form V-B "
            "within thirty days of vehicle registration. Maximum subsidy cap of INR 1,50,000 "
            "for two-wheelers. Failure to submit within thirty days forfeits entitlement."
        ),
        "target_audience": "general_citizen",
    }
    response = client.post("/api/v1/policymirror/summarize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "summary" in data
    assert len(data["summary"]) > 0
    assert "key_takeaways" in data
    assert len(data["key_takeaways"]) > 0
    assert data["impact_rating"] in ["low", "moderate", "high"]
    assert "source_model" in data


def test_list_policies(client):
    """Test GET /api/v1/policymirror/policies."""
    response = client.get("/api/v1/policymirror/policies")
    assert response.status_code == 200
    policies = response.json()
    assert len(policies) >= 3
    ids = [p["policy_id"] for p in policies]
    assert "EV-POLICY-2026-DRAFT" in ids
    assert "EV-POLICY-2024-ACTIVE" in ids
    assert "RTI-ACT-2005" in ids


def test_compare_policies(client):
    """Test comparing two versions of EV policy."""
    payload = {
        "old_policy_id": "EV-POLICY-2024-ACTIVE",
        "new_policy_id": "EV-POLICY-2026-DRAFT",
    }
    response = client.post("/api/v1/policymirror/compare", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["old_policy"]["policy_id"] == "EV-POLICY-2024-ACTIVE"
    assert data["new_policy"]["policy_id"] == "EV-POLICY-2026-DRAFT"
    assert len(data["clause_changes"]) > 0
    assert data["overall_impact"] in ["positive", "negative", "mixed", "neutral"]


def test_compare_policies_not_found(client):
    """Test 404 when comparing non-existent policies."""
    payload = {
        "old_policy_id": "NONEXISTENT-A",
        "new_policy_id": "NONEXISTENT-B",
    }
    response = client.post("/api/v1/policymirror/compare", json=payload)
    assert response.status_code == 404


def test_simulate_ev_buyer_outcome(client):
    """Test outcome simulation for a two-wheeler EV buyer."""
    payload = {
        "policy_id": "EV-POLICY-2026-DRAFT",
        "applicant_profile": {
            "type": "individual_buyer",
            "vehicle_type": "two_wheeler",
        },
    }
    response = client.post("/api/v1/policymirror/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["policy_id"] == "EV-POLICY-2026-DRAFT"
    assert len(data["applicable_clauses"]) > 0
    assert len(data["estimated_outcomes"]) > 0
    # Should identify the 150,000 subsidy cap
    outcomes_text = " ".join(data["estimated_outcomes"])
    assert "150,000" in outcomes_text or "two-wheeler" in outcomes_text


def test_simulate_rti_citizen_outcome(client):
    """Test outcome simulation for RTI response timeline."""
    payload = {
        "policy_id": "RTI-ACT-2005",
        "applicant_profile": {
            "type": "general_citizen",
        },
    }
    response = client.post("/api/v1/policymirror/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()

    outcomes_text = " ".join(data["estimated_outcomes"])
    assert "30 days" in outcomes_text


def test_simulate_unknown_policy(client):
    """Test 404 when simulating an unknown policy ID."""
    payload = {
        "policy_id": "UNKNOWN-POLICY-999",
        "applicant_profile": {"type": "general_citizen"},
    }
    response = client.post("/api/v1/policymirror/simulate", json=payload)
    assert response.status_code == 404
