# UrbanReflex Backend Application

## Overview

Backend API for **UrbanReflex** Smart City Platform built with FastAPI. Provides RESTful APIs for user management, AI-powered citizen report classification, and RAG-based chatbot assistance.

## Architecture

```
app/
├── routers/              # API endpoints (auth, chatbot, citizen_reports, users)
├── ai_service/          # AI/ML services
│   ├── chatbot/         # RAG system with Gemini AI
│   └── classifier_report/  # NLP classifier for reports
├── models/              # Data models
├── schemas/             # Pydantic validation
├── utils/               # Auth & database helpers
└── config/              # Configuration management
```

## Key Features

- **Authentication** - JWT-based auth with bcrypt password hashing
- **AI Chatbot** - RAG system using Gemini AI, Pinecone vector DB, and web crawling
- **Report Classification** - Vietnamese NLP classifier with POI-based priority scoring
- **NGSI-LD Integration** - Orion-LD context broker for IoT data

## Tech Stack

- **FastAPI** + **Uvicorn** - Async web framework
- **MongoDB** + **Motor** - NoSQL database
- **Google Gemini AI** - LLM for RAG chatbot
- **Pinecone** - Vector database for semantic search
- **PhoBERT** - Vietnamese text embeddings
- **JWT** + **bcrypt** - Authentication & password hashing
- **Orion-LD** - FIWARE NGSI-LD context broker

## Development

```bash
# Install dependencies
uv sync

# Run server (auto-reload at http://0.0.0.0:8000)
python main.py

# API docs
http://localhost:8000/docs
```

## License

GNU General Public License v3.0 - Copyright (C) 2025 WAG

---

**Developed by WAG Team** | [GitHub](https://github.com/minhe51805/UrbanReflex)
