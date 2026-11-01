"""
ClaimCraft Service — Document checklist generation and text extraction.

Checklist logic is deterministic. Document text extraction uses
basic pattern matching for structured fields. Uncertain results
are flagged for human review.
"""

import re
from typing import Any, Dict, List
from app.data.documents import DOCUMENT_REQUIREMENTS


def generate_checklist(
    scheme_id: str, citizen_context: Dict[str, bool]
) -> Dict[str, Any] | None:
    """
    Generate a document checklist for a given scheme based on citizen context.

    Returns None if scheme_id is not found in the dataset.
    """
    scheme_docs = DOCUMENT_REQUIREMENTS.get(scheme_id)
    if scheme_docs is None:
        return None

    documents: List[Dict[str, Any]] = []
    mandatory_count = 0
    ready_mandatory_count = 0

    for doc in scheme_docs["documents"]:
        context_key = doc["context_key"]
        has_document = citizen_context.get(context_key, False)
        is_mandatory = doc["mandatory"]

        if is_mandatory:
            mandatory_count += 1

        status = "ready" if has_document else "action_required"
        if is_mandatory and has_document:
            ready_mandatory_count += 1

        item: Dict[str, Any] = {
            "document_type": doc["document_type"],
            "name": doc["name"],
            "status": status,
            "mandatory": is_mandatory,
        }
        if not has_document:
            item["issuing_authority"] = doc["issuing_authority"]

        documents.append(item)

    readiness = (
        round((ready_mandatory_count / mandatory_count) * 100, 1)
        if mandatory_count > 0
        else 100.0
    )

    return {
        "scheme_id": scheme_id,
        "scheme_title": scheme_docs["scheme_title"],
        "required_documents": documents,
        "readiness_percentage": readiness,
    }


# ── Document text extraction (basic pattern matching) ──────────────────────

# Common patterns for Indian identity documents (regex)
_AADHAAR_PATTERN = re.compile(r"\b(\d{4}\s?\d{4}\s?\d{4})\b")
_PAN_PATTERN = re.compile(r"\b([A-Z]{5}\d{4}[A-Z])\b")
_NAME_PATTERN = re.compile(r"(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s\.]+)", re.IGNORECASE)
_DOB_PATTERN = re.compile(
    r"(?:DOB|Date of Birth|जन्म तिथि)\s*[:\-]?\s*(\d{2}[/\-]\d{2}[/\-]\d{4})",
    re.IGNORECASE,
)
_GENDER_PATTERN = re.compile(
    r"(?:Gender|Sex|लिंग)\s*[:\-]?\s*(Male|Female|Other|पुरुष|महिला)",
    re.IGNORECASE,
)
_ADDRESS_PATTERN = re.compile(
    r"(?:Address|पता)\s*[:\-]?\s*(.+?)(?:\n|$)", re.IGNORECASE
)
_PINCODE_PATTERN = re.compile(r"\b(\d{6})\b")


def extract_fields_from_text(text: str) -> List[Dict[str, str]]:
    """
    Extract structured fields from document text using pattern matching.

    Returns a list of extracted fields with confidence levels.
    Fields with uncertain extraction are flagged for human review.
    """
    fields: List[Dict[str, str]] = []

    # Aadhaar number
    aadhaar_match = _AADHAAR_PATTERN.search(text)
    if aadhaar_match:
        fields.append({
            "field_name": "aadhaar_number",
            "value": aadhaar_match.group(1).replace(" ", ""),
            "confidence": "high",
        })

    # PAN number
    pan_match = _PAN_PATTERN.search(text)
    if pan_match:
        fields.append({
            "field_name": "pan_number",
            "value": pan_match.group(1),
            "confidence": "high",
        })

    # Name
    name_match = _NAME_PATTERN.search(text)
    if name_match:
        name_value = name_match.group(1).strip()
        confidence = "high" if len(name_value.split()) >= 2 else "medium"
        fields.append({
            "field_name": "name",
            "value": name_value,
            "confidence": confidence,
        })

    # Date of birth
    dob_match = _DOB_PATTERN.search(text)
    if dob_match:
        fields.append({
            "field_name": "date_of_birth",
            "value": dob_match.group(1),
            "confidence": "high",
        })

    # Gender
    gender_match = _GENDER_PATTERN.search(text)
    if gender_match:
        fields.append({
            "field_name": "gender",
            "value": gender_match.group(1).strip(),
            "confidence": "high",
        })

    # Address
    address_match = _ADDRESS_PATTERN.search(text)
    if address_match:
        address_value = address_match.group(1).strip()
        # Addresses are inherently less reliable from text extraction
        confidence = "medium" if len(address_value) > 20 else "low"
        fields.append({
            "field_name": "address",
            "value": address_value,
            "confidence": confidence,
        })

    # PIN Code
    pincode_match = _PINCODE_PATTERN.search(text)
    if pincode_match:
        fields.append({
            "field_name": "pincode",
            "value": pincode_match.group(1),
            "confidence": "medium",
        })

    return fields


def detect_discrepancies(
    extracted_fields: List[Dict[str, str]],
    expected_values: Dict[str, str] | None = None,
) -> List[Dict[str, str | None]]:
    """
    Detect discrepancies between extracted fields and expected values.

    If expected_values is None, performs basic validation only.
    """
    discrepancies: List[Dict[str, str | None]] = []

    for field in extracted_fields:
        field_name = field["field_name"]
        value = field["value"]

        # Basic validation rules
        if field_name == "aadhaar_number":
            clean = value.replace(" ", "")
            if len(clean) != 12 or not clean.isdigit():
                discrepancies.append({
                    "field": "aadhaar_number",
                    "expected": "12-digit number",
                    "found": value,
                    "severity": "critical",
                    "recommendation": "Aadhaar number format is invalid. Verify document authenticity.",
                })

        if field_name == "pan_number":
            if not re.match(r"^[A-Z]{5}\d{4}[A-Z]$", value):
                discrepancies.append({
                    "field": "pan_number",
                    "expected": "Format: ABCDE1234F",
                    "found": value,
                    "severity": "critical",
                    "recommendation": "PAN number format is invalid. Verify document.",
                })

        if field_name == "pincode":
            if len(value) != 6 or not value.isdigit():
                discrepancies.append({
                    "field": "pincode",
                    "expected": "6-digit number",
                    "found": value,
                    "severity": "warning",
                    "recommendation": "PIN code format appears invalid.",
                })

        # Cross-check with expected values if provided
        if expected_values and field_name in expected_values:
            expected = expected_values[field_name]
            if value.strip().lower() != expected.strip().lower():
                discrepancies.append({
                    "field": field_name,
                    "expected": expected,
                    "found": value,
                    "severity": "warning",
                    "recommendation": f"Extracted {field_name} does not match expected value. Manual verification recommended.",
                })

    return discrepancies


def should_flag_for_review(
    extracted_fields: List[Dict[str, str]],
    discrepancies: List[Dict[str, str | None]],
) -> tuple[bool, List[str]]:
    """
    Determine if the extraction result needs human review.

    Returns (needs_review, list_of_reasons).
    """
    reasons: List[str] = []

    # Flag if any field has low confidence
    for field in extracted_fields:
        if field["confidence"] == "low":
            reasons.append(
                f"Low confidence extraction for field: {field['field_name']}"
            )

    # Flag if any critical discrepancy
    for disc in discrepancies:
        if disc.get("severity") == "critical":
            reasons.append(
                f"Critical discrepancy in field: {disc['field']}"
            )

    # Flag if very few fields extracted (possibly poor quality document)
    if len(extracted_fields) < 2:
        reasons.append(
            "Very few fields could be extracted. Document may be unclear or unsupported format."
        )

    return len(reasons) > 0, reasons
