def test_navigate_water_supply_bengaluru(client):
    """Test grievance routing for water supply in Bengaluru (exact city match)."""
    payload = {
        "category": "water_supply",
        "description": "Contaminated municipal drinking water pipeline issue in Ward 14",
        "location": {
            "state": "Karnataka",
            "city": "Bengaluru",
            "ward": "Ward 14",
        },
    }
    response = client.post("/api/v1/civicroute/navigate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["primary_department"] == "Bangalore Water Supply and Sewerage Board (BWSSB)"
    assert data["officer_designation"] == "Assistant Executive Engineer (Water Quality Division)"
    assert data["sla_days"] == 7
    assert "BWSSB Citizen Portal" in data["filing_channel"]

    # Escalation levels
    tiers = data["escalation_levels"]
    assert len(tiers) == 2
    assert tiers[0]["tier"] == 1
    assert tiers[1]["tier"] == 2
    assert "7 business days" in tiers[0]["trigger_condition"]


def test_navigate_electricity_bengaluru(client):
    """Test grievance routing for electricity in Bengaluru."""
    payload = {
        "category": "electricity",
        "description": "Frequent unannounced power outages in residential layout",
        "location": {
            "state": "Karnataka",
            "city": "Bengaluru",
        },
    }
    response = client.post("/api/v1/civicroute/navigate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "BESCOM" in data["primary_department"]
    assert data["sla_days"] == 3


def test_navigate_fallback_location(client):
    """Test hierarchical fallback for a city without custom routing."""
    payload = {
        "category": "sanitation",
        "description": "Garbage pile-up at neighborhood crossroad creating hazard",
        "location": {
            "state": "Assam",
            "city": "Guwahati",
        },
    }
    response = client.post("/api/v1/civicroute/navigate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Falls back to default municipal sanitation department
    assert "Sanitation" in data["primary_department"] or "Municipal" in data["primary_department"]
    assert data["sla_days"] > 0
    assert len(data["escalation_levels"]) > 0


def test_navigate_unknown_category(client):
    """Test 404 for an unknown grievance category."""
    payload = {
        "category": "space_travel_complaint",
        "description": "Spaceship landing zone is too noisy near my house",
        "location": {
            "state": "Karnataka",
            "city": "Bengaluru",
        },
    }
    response = client.post("/api/v1/civicroute/navigate", json=payload)
    assert response.status_code == 404


def test_list_categories(client):
    """Test GET /api/v1/civicroute/categories."""
    response = client.get("/api/v1/civicroute/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 5
    cat_keys = [c["category"] for c in categories]
    assert "water_supply" in cat_keys
    assert "electricity" in cat_keys
    assert "road_maintenance" in cat_keys
    assert "sanitation" in cat_keys


def test_navigate_validation_error(client):
    """Test description validation (description min_length=10)."""
    payload = {
        "category": "water_supply",
        "description": "Bad",  # too short
        "location": {
            "state": "Karnataka",
            "city": "Bengaluru",
        },
    }
    response = client.post("/api/v1/civicroute/navigate", json=payload)
    assert response.status_code == 422
