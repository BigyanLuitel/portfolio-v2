from fastapi import APIRouter, Request

from app.core.limiter import limiter
from app.core.tools import _send_telegram_message
from app.models.contact_store import SUBMISSIONS
from app.schemas.contact import ContactRequest, ContactResponse

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactResponse)
@limiter.limit("5/minute")
def submit_contact(request: Request, payload: ContactRequest):
    SUBMISSIONS.append(payload)
    _send_telegram_message(
        f"[Contact Form] {payload.name} <{payload.email}>: {payload.message}"
    )
    return ContactResponse(success=True, detail="Message received.")