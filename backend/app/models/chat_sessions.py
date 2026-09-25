import time

SESSION_TTL_SECONDS = 60 * 60 * 2  # 2 hours of inactivity

# session_id -> {"messages": [...], "last_active": timestamp}
SESSIONS: dict[str, dict] = {}


def prune_stale_sessions() -> None:
    now = time.time()
    stale_ids = [
        sid
        for sid, data in SESSIONS.items()
        if now - data["last_active"] > SESSION_TTL_SECONDS
    ]
    for sid in stale_ids:
        del SESSIONS[sid]