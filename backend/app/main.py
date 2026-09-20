from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import projects  
from app.api.routes import contact 
from app.api.routes import chat  
app = FastAPI(title=settings.app_name, debug=settings.environment == "development")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
app.include_router(projects.router)
app.include_router(chat.router)
app.include_router(contact.router)