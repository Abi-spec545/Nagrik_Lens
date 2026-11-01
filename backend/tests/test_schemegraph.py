import pytest


def test_evaluate_artisan_vendor_profile(client):
    """Test evaluation of a vendor/artisan profile matching PM SVANidhi."""
    payload = {
        "profile": {
            "age": 34,
            "gender": "female",
            "state": "Maharashtra",
            "annual_income_inr": 180000,
            "occupation": "street_vendor",
            "disability": False,
            "caste_category": "OBC",
        }
    }
    response = client.post("/api/v1/schemegraph/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["total_evaluated"] >= 10
    matched_ids = [s["scheme_id"] for s in data["matched_schemes"]]
    assert "PM-SVANIDHI-01" in matched_ids

    # Find the PM-SVANIDHI-01 match
    svanidhi = next(s for s in data["matched_schemes"] if s["scheme_id"] == "PM-SVANIDHI-01")
    assert svanidhi["eligibility_score"] == 1.0
    assert "occupation_match" in svanidhi["satisfied_criteria"]
    assert len(svanidhi["missing_criteria"]) == 0


def test_evaluate_farmer_profile(client):
    """Test that a farmer profile deterministically matches farmer schemes."""
    payload = {
        "profile": {
            "age": 42,
            "gender": "male",
            "state": "Uttar Pradesh",
            "annual_income_inr": 120000,
            "occupation": "farmer",
            "disability": False,
            "caste_category": "General",
        }
    }
    response = client.post("/api/v1/schemegraph/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()

    matched_ids = [s["scheme_id"] for s in data["matched_schemes"]]
    assert "PM-KISAN-01" in matched_ids
    assert "PM-FASAL-BIMA-01" in matched_ids


def test_evaluate_age_restriction(client):
    """Test deterministic rejection of schemes with age limits."""
    # A 75-year-old cannot qualify for PMJJBY (max age 50) or PMSBY (max age 70)
    payload = {
        "profile": {
            "age": 75,
            "gender": "male",
            "state": "Karnataka",
            "annual_income_inr": 300000,
            "occupation": "retired",
            "disability": False,
        }
    }
    response = client.post("/api/v1/schemegraph/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Neither PMJJBY nor PMSBY should be in 100% matched schemes
    perfect_matches = [
        s["scheme_id"] for s in data["matched_schemes"] if s["eligibility_score"] == 1.0
    ]
    assert "PMJJBY-01" not in perfect_matches
    assert "PMSBY-01" not in perfect_matches


def test_list_all_schemes(client):
    """Test GET /api/v1/schemegraph/schemes."""
    response = client.get("/api/v1/schemegraph/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 10
    ids = [s["scheme_id"] for s in schemes]
    assert "PM-KISAN-01" in ids
    assert "PM-SVANIDHI-01" in ids


def test_scheme_graph_endpoint(client):
    """Test GET /api/v1/schemegraph/schemes/{id}/graph."""
    response = client.get("/api/v1/schemegraph/schemes/PM-SVANIDHI-01/graph")
    assert response.status_code == 200
    graph = response.json()
    assert graph["scheme_id"] == "PM-SVANIDHI-01"
    assert "related_schemes" in graph
    assert len(graph["related_schemes"]) > 0


def test_scheme_graph_not_found(client):
    """Test 404 for non-existent scheme graph."""
    response = client.get("/api/v1/schemegraph/schemes/NONEXISTENT-999/graph")
    assert response.status_code == 404


def test_evaluate_validation_error(client):
    """Test Pydantic input validation on invalid profile."""
    # Negative age is disallowed by ge=0
    payload = {
        "profile": {
            "age": -5,
            "gender": "male",
            "state": "Delhi",
            "annual_income_inr": 50000,
            "occupation": "student",
        }
    }
    response = client.post("/api/v1/schemegraph/evaluate", json=payload)
    assert response.status_code == 422
