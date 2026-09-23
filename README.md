# Portfolio v2

A portfolio website and AI-powered project assistant built with a FastAPI backend and a Next.js frontend. The project combines portfolio content, project discovery, contact form handling, and a conversational assistant that answers questions about the owner's work using OpenAI and tool-based retrieval.

## Overview

This application is designed to present a personal portfolio while also supporting a chat experience for visitors. The backend exposes structured project data and provides a chat endpoint that uses an LLM plus function calling to answer questions about projects, escalate unsupported questions, or notify the portfolio owner when needed.

## Features

- Portfolio-style frontend powered by Next.js
- FastAPI backend with CORS enabled for local frontend development
- Project catalog API for listing and retrieving portfolio work
- Contact submission endpoint for lead capture
- AI assistant endpoint for conversational Q&A about projects and experience
- Tool-augmented LLM flow for project lookup and escalation handling
- Telegram notifications for important follow-up cases

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic and Pydantic Settings
- OpenAI Python SDK
- In-memory storage for local development

## Project Structure

```text
portfolio-v2/
├── README.md
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── api/
│       │   └── routes/
│       │       ├── chat.py
│       │       ├── contact.py
│       │       └── projects.py
│       ├── core/
│       │   ├── agent.py
│       │   ├── config.py
│       │   ├── llm.py
│       │   └── tools.py
│       ├── models/
│       │   ├── chat_sessions.py
│       │   ├── contact_store.py
│       │   └── project_data.py
│       └── schemas/
│           ├── chat.py
│           ├── contact.py
│           └── project.py
└── frontend/
    ├── app/
    ├── public/
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    └── eslint.config.mjs
```

## Architecture

### Backend Flow

- The FastAPI app boots in [backend/app/main.py](backend/app/main.py)
- Routes are registered for:
  - /health
  - /projects
  - /chat
  - /contact
- The chat assistant uses the logic in [backend/app/core/agent.py](backend/app/core/agent.py) and the tools in [backend/app/core/tools.py](backend/app/core/tools.py)
- Project and contact data are stored in memory in the model layer for local prototyping

### AI Assistant Behavior

The assistant is configured with a system prompt that positions it as the portfolio assistant. It can:

- answer questions based on project metadata
- call the project lookup tool for specific project details
- notify the owner via Telegram when useful
- escalate to a human when the question is out of scope or unsupported

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm
- An OpenAI API key

### Backend Setup

From the project root:

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a .env file in the backend directory with values similar to:

```env
OPENAI_API_KEY=your_openai_api_key
cors_origins=http://localhost:3000
telegram_bot_token=your_telegram_bot_token
telegram_chat_id=your_telegram_chat_id
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run on:

- http://localhost:3000

The backend should run on:

- http://localhost:8000

## API Endpoints

### Health

```http
GET /health
```

Returns:

```json
{ "status": "ok" }
```

### Projects

```http
GET /projects/
GET /projects/{slug}
```

Example:

```bash
curl http://localhost:8000/projects/
curl http://localhost:8000/projects/astroquery
```

### Contact

```http
POST /contact/
```

Body example:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'd like to discuss a project opportunity."
}
```

### Chat

```http
POST /chat/
```

Body example:

```json
{
  "message": "Tell me about the AstroQuery project",
  "session_id": "optional-session-id"
}
```

## Notes

- The current project data and contact submissions are intentionally stored in memory so the app is easy to run locally.
- This is a practical portfolio + AI assistant MVP, not a production storage or persistence layer yet.
- The project data in [backend/app/models/project_data.py](backend/app/models/project_data.py) still includes placeholder sections and is a good place to expand the portfolio with additional case studies.

## Future Improvements

- Persist submissions in a database
- Replace in-memory chat sessions with Redis or persistent storage
- Add richer frontend design and portfolio pages
- Add authentication or admin tools for managing portfolio content
- Expand project data and portfolio case studies

## License

This project is intended for personal portfolio and demonstration use unless otherwise specified by the owner.
