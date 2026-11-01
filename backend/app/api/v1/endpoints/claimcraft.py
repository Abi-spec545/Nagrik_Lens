"""API endpoints for the ClaimCraft module."""

import tempfile
import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Response, status
from app.schemas.claimcraft import (
    ChecklistRequest,
    ChecklistResponse,
    DocumentItem,
    DocumentVerifyResponse,
    ExtractedField,
    DiscrepancyItem,
)
from app.modules.claimcraft.service import (
    generate_checklist,
    extract_fields_from_text,
    detect_discrepancies,
    should_flag_for_review,
)
from app.modules.claimcraft.pdf_generator import generate_checklist_pdf

router = APIRouter()


@router.post(
    "/checklist",
    response_model=ChecklistResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Document Checklist",
    description="Generates required documents and readiness status for a target scheme.",
)
def create_checklist(request: ChecklistRequest) -> ChecklistResponse:
    result = generate_checklist(request.scheme_id, request.citizen_context)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme '{request.scheme_id}' not found in document requirements dataset.",
        )
    return ChecklistResponse(
        scheme_id=result["scheme_id"],
        scheme_title=result["scheme_title"],
        required_documents=[DocumentItem(**d) for d in result["required_documents"]],
        readiness_percentage=result["readiness_percentage"],
    )


@router.post(
    "/checklist/pdf",
    summary="Download Checklist PDF",
    description="Generates an in-memory downloadable PDF of the document checklist via ReportLab.",
)
def export_checklist_pdf(request: ChecklistRequest):
    result = generate_checklist(request.scheme_id, request.citizen_context)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme '{request.scheme_id}' not found in document requirements dataset.",
        )
    pdf_bytes = generate_checklist_pdf(result)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="checklist_{request.scheme_id}.pdf"'},
    )


@router.post(
    "/verify-document",
    response_model=DocumentVerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract & Verify Document Fields",
    description=(
        "Accepts a plain text or PDF file upload, extracts structured fields, "
        "detects discrepancies, and flags uncertain results for human review. "
        "Uploaded files are NOT permanently stored."
    ),
)
async def verify_document(file: UploadFile = File(...)) -> DocumentVerifyResponse:
    # Validate file type
    allowed_types = {
        "text/plain",
        "application/pdf",
        "application/octet-stream",  # Fallback for some clients
    }
    content_type = file.content_type or ""
    filename = file.filename or "uploaded_document"

    # Accept by extension as well
    ext = os.path.splitext(filename)[1].lower()
    if content_type not in allowed_types and ext not in (".txt", ".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type}'. Accepted: .txt, .pdf",
        )

    # Read file content
    raw_bytes = await file.read()
    if len(raw_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # Size limit: 5MB
    if len(raw_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File exceeds 5MB size limit.",
        )

    # Extract text from file
    text = ""
    if ext == ".pdf" or content_type == "application/pdf":
        # Use PyMuPDF for PDF extraction if available, otherwise error
        try:
            import fitz  # PyMuPDF

            # Write to a temporary file, then extract text. Do not store permanently.
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(raw_bytes)
                tmp_path = tmp.name

            try:
                doc = fitz.open(tmp_path)
                for page in doc:
                    text += page.get_text()
                doc.close()
            finally:
                # Clean up temporary file immediately
                os.unlink(tmp_path)
        except ImportError:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="PDF extraction requires PyMuPDF (pip install pymupdf). Feature unavailable.",
            )
    else:
        # Plain text
        try:
            text = raw_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = raw_bytes.decode("latin-1", errors="replace")

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract any text from the uploaded file.",
        )

    # Extract fields and detect discrepancies
    extracted = extract_fields_from_text(text)
    discrepancy_list = detect_discrepancies(extracted)
    needs_review, review_reasons = should_flag_for_review(extracted, discrepancy_list)

    return DocumentVerifyResponse(
        filename=filename,
        extracted_fields=[ExtractedField(**f) for f in extracted],
        discrepancies=[DiscrepancyItem(**d) for d in discrepancy_list],
        needs_human_review=needs_review,
        review_reasons=review_reasons,
    )
