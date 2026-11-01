import io


def test_checklist_partial_readiness(client):
    """Test checklist generation when citizen has some documents."""
    payload = {
        "scheme_id": "PM-SVANIDHI-01",
        "citizen_context": {
            "has_aadhaar": True,
            "has_bank_account": True,
            "vendor_id_card": False,
        },
    }
    response = client.post("/api/v1/claimcraft/checklist", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["scheme_id"] == "PM-SVANIDHI-01"
    assert data["readiness_percentage"] == 66.7
    docs = data["required_documents"]
    assert len(docs) == 3

    # Aadhaar ready
    aadhaar = next(d for d in docs if "Aadhaar" in d["name"])
    assert aadhaar["status"] == "ready"

    # Vendor card action required
    vendor_doc = next(d for d in docs if "Vending" in d["name"])
    assert vendor_doc["status"] == "action_required"
    assert "Urban Local Body" in vendor_doc["issuing_authority"]


def test_checklist_full_readiness(client):
    """Test checklist generation when citizen has all mandatory documents."""
    payload = {
        "scheme_id": "PM-SVANIDHI-01",
        "citizen_context": {
            "has_aadhaar": True,
            "has_bank_account": True,
            "vendor_id_card": True,
        },
    }
    response = client.post("/api/v1/claimcraft/checklist", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["readiness_percentage"] == 100.0


def test_checklist_unknown_scheme(client):
    """Test 404 when scheme is not in document requirements dataset."""
    payload = {
        "scheme_id": "UNKNOWN-SCHEME-X",
        "citizen_context": {"has_aadhaar": True},
    }
    response = client.post("/api/v1/claimcraft/checklist", json=payload)
    assert response.status_code == 404


def test_verify_document_text_upload(client):
    """Test structured extraction from uploaded text document."""
    doc_content = (
        "GOVERNMENT OF INDIA\n"
        "Name: Rajesh Kumar Sharma\n"
        "DOB: 15/08/1985\n"
        "Gender: Male\n"
        "Aadhaar: 2345 6789 0123\n"
        "PAN: ABCDE1234F\n"
        "Address: 42 MG Road, Ward 12, Bengaluru\n"
        "PIN: 560001\n"
    )

    file_obj = io.BytesIO(doc_content.encode("utf-8"))
    files = {"file": ("application.txt", file_obj, "text/plain")}

    response = client.post("/api/v1/claimcraft/verify-document", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["filename"] == "application.txt"
    field_names = [f["field_name"] for f in data["extracted_fields"]]
    assert "aadhaar_number" in field_names
    assert "pan_number" in field_names
    assert "name" in field_names
    assert "date_of_birth" in field_names

    # Check extracted values
    aadhaar = next(f for f in data["extracted_fields"] if f["field_name"] == "aadhaar_number")
    assert aadhaar["value"] == "234567890123"
    assert aadhaar["confidence"] == "high"


def test_verify_document_detects_invalid_aadhaar(client):
    """Test detection of invalid Aadhaar format and flagging for human review."""
    # Aadhaar is only 8 digits instead of 12
    doc_content = (
        "Name: Anita Devi\n"
        "Aadhaar: 1234 5678\n"
    )
    file_obj = io.BytesIO(doc_content.encode("utf-8"))
    files = {"file": ("doc.txt", file_obj, "text/plain")}

    response = client.post("/api/v1/claimcraft/verify-document", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["needs_human_review"] is True
    assert len(data["review_reasons"]) > 0


def test_verify_document_empty_file_rejected(client):
    """Test that empty file upload returns 400 Bad Request."""
    file_obj = io.BytesIO(b"")
    files = {"file": ("empty.txt", file_obj, "text/plain")}

    response = client.post("/api/v1/claimcraft/verify-document", files=files)
    assert response.status_code == 400


def test_export_checklist_pdf(client):
    """Test generating in-memory PDF checklist with ReportLab."""
    payload = {
        "scheme_id": "PM-SVANIDHI-01",
        "citizen_context": {
            "has_aadhaar": True,
            "has_bank_account": True,
            "vendor_id_card": False,
        },
    }
    response = client.post("/api/v1/claimcraft/checklist/pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    # PDF files start with %PDF
    assert response.content.startswith(b"%PDF")
