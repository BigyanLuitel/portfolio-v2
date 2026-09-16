from pydantic import BaseModel


class Project(BaseModel):
    slug: str
    title: str
    summary: str
    problem: str
    approach: str
    stack: list[str]
    results: str | None = None
    github_url: str | None = None
    live_url: str | None = None