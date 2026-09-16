from fastapi import APIRouter, HTTPException

from app.models.project_data import PROJECTS
from app.schemas.project import Project

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[Project])
def list_projects():
    return PROJECTS


@router.get("/{slug}", response_model=Project)
def get_project(slug: str):
    for project in PROJECTS:
        if project.slug == slug:
            return project
    raise HTTPException(status_code=404, detail=f"Project '{slug}' not found")