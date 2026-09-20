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
def notify_bigyan(message: str) -> str:
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    try:
        response = requests.post(
            url,
            json={"chat_id": settings.telegram_chat_id, "text": message},
            timeout=5,
        )
        response.raise_for_status()
        return "Message sent to Bigyan successfully."
    except requests.RequestException as e:
        return f"Failed to send notification: {e}"
    
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

TOOL_SCHEMAS = [GET_PROJECT_DETAILS_SCHEMA, NOTIFY_BIGYAN_SCHEMA]

TOOL_REGISTRY = {
    "get_project_details": get_project_details,
    "notify_bigyan": notify_bigyan
}