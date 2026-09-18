from fastapi import APIRouter
from app.schemas.contact import ContactRequest, ContactResponse
from app.models.contact_store import SUBMISSIONS

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse)
def submit_contact(payload: ContactRequest):
    """
    Submit a contact form request.
    """
    SUBMISSIONS.append(payload)
    print(f"New contact submission: {payload}")
    return ContactResponse(success=True, detail="Contact form submitted successfully.")