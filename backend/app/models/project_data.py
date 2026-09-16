from app.schemas.project import Project

PROJECTS: list[Project] = [
    Project(
        slug="astroquery",
        title="AstroQuery",
        summary="RAG system for querying CSV and PDF space/satellite data.",
        problem="TODO: what problem was this solving?",
        approach="LangChain + ChromaDB for retrieval, Groq LLaMA 3.3 70B for generation, HuggingFace embeddings.",
        stack=["LangChain", "ChromaDB", "Groq", "HuggingFace"],
        results="0.87 retrieval accuracy on PDF, 0.72 on CSV, 0.81 overall across 80 test sessions.",
    ),
    # TODO: add GadgetHub, TVSBS, RAG Ingestion API, NL-to-SQL agent
]