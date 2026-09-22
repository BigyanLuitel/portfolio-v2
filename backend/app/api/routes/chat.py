import uuid

from fastapi import APIRouter

from app.core.agent import run_agent, SYSTEM_PROMPT
from app.models.chat_sessions import SESSIONS
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest):
    session_id = payload.session_id or str(uuid.uuid4())

    if session_id not in SESSIONS:
        SESSIONS[session_id] = [{"role": "system", "content": SYSTEM_PROMPT}]

    SESSIONS[session_id].append({"role": "user", "content": payload.message})
    reply = run_agent(SESSIONS[session_id])

    return ChatResponse(reply=reply, session_id=session_id)