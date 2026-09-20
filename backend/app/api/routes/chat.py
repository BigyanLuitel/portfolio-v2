from fastapi import APIRouter

from app.core.agent import run_agent
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest):
    reply = run_agent(payload.message)
    return ChatResponse(reply=reply)