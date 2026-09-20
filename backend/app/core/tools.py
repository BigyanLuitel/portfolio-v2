from app.models.project_data import PROJECTS


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

TOOL_SCHEMAS = [GET_PROJECT_DETAILS_SCHEMA]

TOOL_REGISTRY = {
    "get_project_details": get_project_details
}