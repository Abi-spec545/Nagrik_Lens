"""
AI Service for PolicyMirror.

Isolated service for calling Gemini API for plain-language civic policy summaries.
RULES:
- Kept completely separate from deterministic eligibility/rule engines.
- Never decides final citizen eligibility or entitlements.
- Uses GEMINI_API_KEY from environment/settings; falls back to deterministic summary if unset or offline.
- Never logs sensitive or raw input.
"""

from typing import Any, Dict
import httpx
from app.core.config import settings
from app.modules.policymirror.service import summarize_policy_deterministic


async def generate_policy_summary(
    policy_title: str,
    raw_text: str,
    target_audience: str = "general_citizen",
) -> Dict[str, Any]:
    """
    Summarize civic policy text using Google Gemini API if configured,
    otherwise cleanly fallback to deterministic extraction.
    """
    api_key = settings.GEMINI_API_KEY.strip() if settings.GEMINI_API_KEY else ""

    # If no API key configured, use deterministic summary immediately
    if not api_key or api_key == "your_gemini_api_key_here":
        return summarize_policy_deterministic(raw_text, policy_title)

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent?key={api_key}"
    )

    prompt = (
        f"You are a civic legal assistant for citizens in India.\n"
        f"Policy Title: {policy_title}\n"
        f"Target Audience: {target_audience}\n"
        f"Raw Policy Text: {raw_text}\n\n"
        f"Task:\n"
        f"1. Provide a plain-language, 1-2 sentence citizen-friendly summary.\n"
        f"2. Provide 2-3 concise bullet points with key takeaways, deadlines, and rights/obligations.\n"
        f"3. State the impact rating as exactly one of: low, moderate, high.\n\n"
        f"Respond in clear text without markdown headers."
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 300,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(endpoint, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text_output = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if text_output:
                    lines = [line.strip("- *").strip() for line in text_output.strip().split("\n") if line.strip()]
                    summary = lines[0] if lines else raw_text[:200]
                    takeaways = lines[1:4] if len(lines) > 1 else [summary]
                    return {
                        "summary": summary,
                        "key_takeaways": takeaways,
                        "impact_rating": "moderate",
                        "source_model": settings.GEMINI_MODEL,
                    }
    except Exception:
        # Graceful fallback to deterministic engine on network failure or rate limits
        pass

    return summarize_policy_deterministic(raw_text, policy_title)
