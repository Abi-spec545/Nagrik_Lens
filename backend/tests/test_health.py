def test_root_endpoint(client):
    """Test that root endpoint returns API information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "NagrikLens API"
    assert "health" in data
    assert "modules" in data
    assert len(data["modules"]) == 4


def test_health_endpoint(client):
    """Test the GET /api/v1/health endpoint for operational status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()

    # Core health checks
    assert data["status"] == "healthy"
    assert data["app_name"] == "NagrikLens API"
    assert data["database"] == "connected"
    assert "timestamp" in data
    assert "version" in data
    assert data["environment"] == "development"

    # Module registry checks
    modules = data["modules"]
    assert "schemegraph" in modules
    assert "claimcraft" in modules
    assert "civicroute" in modules
    assert "policymirror" in modules

    assert modules["schemegraph"]["status"] in ("ready", "initialized")
    assert modules["claimcraft"]["status"] in ("ready", "initialized")
    assert modules["civicroute"]["status"] in ("ready", "initialized")
    assert modules["policymirror"]["status"] in ("ready", "initialized")
