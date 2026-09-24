from app.schemas.project import Project

PROJECTS: list[Project] = [
    Project(
        slug="astroquery",
        title="AstroQuery",
        summary="RAG system for querying CSV and PDF space/satellite data.",
        problem="Enabling natural-language querying of satellite orbital CSV databases and mission PDF documents, which are normally hard to search without knowing exact field names or manually reading documents.",
        approach="End-to-end Django RAG system using LangChain, ChromaDB, and Groq LLaMA 3.3 70B, with cosine similarity top-4 retrieval (1,000-char chunks, 200-char overlap) and OpenAI as a secondary component. Includes automated per-query evaluation metrics: retrieval relevance, faithfulness, and completeness.",
        stack=["Django", "LangChain", "ChromaDB", "Groq", "OpenAI"],
        results="0.87 retrieval accuracy on PDF, 0.72 on CSV, 0.81 overall across 80 test sessions.",
    ),
    Project(
        slug="gadgethub",
        title="GadgetHub",
        summary="Full e-commerce platform for electronics, with an AI microservice layer for both customers and staff.",
        problem="Building a complete, production-shaped e-commerce platform (not just a CRUD demo) with a real AI layer — a conversational shopping agent for customers and AI-assisted tools for staff — while handling Nepal-specific concerns like local payment methods and currency.",
        approach="Django + PostgreSQL monolith with a separate FastAPI microservice for AI features: a LangGraph ReAct agent for customer chat (RAG-based product search via ChromaDB, cart management, order placement), plus staff-facing AI tools (description generation, category suggestion). Simulated eSewa/Khalti/Card/COD payments with an order tracking timeline. Found and fixed a real agent safety bug — the chat agent could skip order confirmation — with a structural token-gated preview/confirm flow, not just a prompt tweak.",
        stack=["Django", "PostgreSQL", "FastAPI", "LangGraph", "ChromaDB", "OpenAI"],
        github_url="https://github.com/BigyanLuitel",
    ),
    Project(
        slug="tvsbs",
        title="TVSBS School Management System",
        summary="Full school management system for a real school in Dhankuta, Nepal — admin, teacher, and student portals.",
        problem="Replacing a real school's manual administrative processes (attendance, results, fees, library, reports) with a role-based digital system, built for actual deployment rather than as a purely academic exercise.",
        approach="Django backend with a separate FastAPI AI microservice, and a Next.js/TypeScript frontend using HttpOnly-cookie JWT auth with role-based routing. Covers attendance, exam results with publish/unpublish control, fee invoicing, a library system, generated reports, and AI features including a subject-scoped student assistant and a question paper generator with LaTeX rendering.",
        stack=["Django", "FastAPI", "Next.js", "TypeScript", "PostgreSQL"],
    ),
    Project(
        slug="rag-ingestion-api",
        title="Document Ingestion & Conversational RAG API",
        summary="A RAG backend built from scratch, without LangChain, for a technical assignment.",
        problem="Demonstrating RAG fundamentals directly rather than relying on a framework — building the retrieval pipeline, chunking, and conversational memory by hand.",
        approach="Custom RAG pipeline built without LangChain or RetrievalQAChain, using Qdrant for vector storage, Redis for multi-turn chat memory, and locally-run HuggingFace sentence-transformer embeddings. Implements two manual chunking strategies (fixed-size and semantic/boundary-based) and an LLM-driven interview booking flow that extracts structured details (name, email, date, time) across multiple conversational turns.",
        stack=["FastAPI", "Qdrant", "Redis", "Supabase", "Groq"],
        github_url="https://github.com/BigyanLuitel/palm-mind-intern",
    ),
        Project(
        slug="nl-to-sql-agent",
        title="NL-to-SQL Agent",
        summary="A LangGraph agent that turns natural-language questions into SQL — the technical anchor for a planned Nepal SME analytics platform.",
        problem="SMEs and schools sit on structured data (SQLite/Postgres) but don't have the SQL skills to query it — a natural-language interface removes that barrier.",
        approach="Built as a LangGraph agent with an evaluator node and retry loop for self-correction, plus MemorySaver for conversational state. Currently being extended with an analyst node and FastAPI packaging, with a planned PostgreSQL migration. Piloting direction is an SME analytics platform for Nepal, with the TVSBS school system as a candidate deployment target.",
        stack=["LangGraph", "Groq", "SQLite"],
    ),
]