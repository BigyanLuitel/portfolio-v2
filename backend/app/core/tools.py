from app.models.project_data import PROJECTS
import requests
from app.core.config import settings

def get_project_details(slug: str) -> str:
    for project in PROJECTS:
        if project.slug == slug:
            return (
                f"{project.title}\n"
                f"Summary: {project.summary}\n"
                f"Problem: {project.problem}\n"
                f"Approach: {project.approach}\n"
                f"Stack: {', '.join(project.stack)}\n"
                f"Results: {project.results or 'N/A'}"
            )    
    return "Project not found."

GET_PROJECT_DETAILS_SCHEMA = {
    "type": "function",
    "function":{
        "name": "get_project_details",
        "description": "Get detailed information about a project based on its slug.",
        "parameters": {
            "type": "object",
            "properties": {
                "slug": {
                    "type": "string",
                    "description": "The slug of the project to retrieve details for."
                }
            },
            "required": ["slug"]
        }
    }
}
def _send_telegram_message(text: str) -> str:
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    try:
        response = requests.post(
            url,
            json={"chat_id": settings.telegram_chat_id, "text": text},
            timeout=5,
        )
        response.raise_for_status()
        return "Sent."
    except requests.RequestException as e:
        return f"Failed to send: {e}"
    
def notify_bigyan(message: str) -> str:
    result = _send_telegram_message(f"[Lead] {message}")
    if result == "Sent.":
        return "Message sent to Bigyan successfully."
    return result
def escalate_to_human(reason: str) -> str:
    result = _send_telegram_message(f"[Escalation] {reason}")
    if result == "Sent.":
        return "This has been flagged for Bigyan to follow up on personally."
    return "I couldn't reach Bigyan right now, but please try contacting him directly via the contact form."
ESCALATE_TO_HUMAN_SCHEMA = {
    "type": "function",
    "function": {
        "name": "escalate_to_human",
        "description": "Use this when you genuinely cannot answer the visitor's question — it's out of scope, ambiguous, or not covered by any available project/experience data. Do NOT use this for questions you can actually answer, and do not use it just because a visitor wants to be contacted (use notify_bigyan for that instead).",
        "parameters": {
            "type": "object",
            "properties": {
                "reason": {
                    "type": "string",
                    "description": "A brief explanation of what the visitor asked and why it couldn't be answered.",
                }
            },
            "required": ["reason"],
        },
    },
}
NOTIFY_BIGYAN_SCHEMA = {
    "type": "function",
    "function": {
        "name": "notify_bigyan",
        "description": "Send a notification to Bigyan when a visitor asks something the assistant can't answer, or leaves contact info wanting to connect. Use this sparingly — only when genuinely useful to Bigyan, not for every message.",
        "parameters": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "A concise summary of what the visitor asked or wants, including their contact info if given.",
                }
            },
            "required": ["message"],
        },
    },
}

TOOL_SCHEMAS = [GET_PROJECT_DETAILS_SCHEMA, NOTIFY_BIGYAN_SCHEMA, ESCALATE_TO_HUMAN_SCHEMA]

TOOL_REGISTRY = {
    "get_project_details": get_project_details,
    "notify_bigyan": notify_bigyan,
    "escalate_to_human": escalate_to_human
}