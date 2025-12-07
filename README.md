# UrbanReflex

**Smart City Platform - Air Quality Monitoring & Urban Infrastructure Management**

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/minhe51805/UrbanReflex/releases/tag/v0.2.0)
[![License](https://img.shields.io/badge/License-GPL_3.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.121+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Running the Project](#running-the-project)
- [Development Workflow](#development-workflow)
- [Code Quality & Standards](#code-quality--standards)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

UrbanReflex is a comprehensive smart city platform that monitors air quality, manages urban infrastructure, and engages citizens in reporting and resolving infrastructure issues. Built with modern async architecture, real-time data processing, and AI-powered intelligence.

**Current Version**: 0.2.0  
**Status**: Active Development (Develop Branch)  
**Branch**: `develop`

---

## Key Features

### 🌍 Air Quality Monitoring

- Real-time AQI (Air Quality Index) data from OpenAQ API
- Interactive map with 10,000+ monitoring stations
- Historical trends with 12-month data
- Health recommendations based on current AQI levels
- **12-language support** (en, vi, es, fr, de, zh, ja, ko, ar, ru, pt, hi)

### 🏙️ Smart City Infrastructure

- NGSI-LD compliant data model for semantic interoperability
- Orion Context Broker integration for real-time data
- Streetlight management with status tracking
- Road segment analysis and traffic patterns
- Weather data integration
- Geographic data visualization with clustering

### 👥 User Management & Authentication

- JWT-based authentication with refresh tokens
- Role-based access control (Citizen, Official, Admin)
- API key management for third-party integrations
- User profile management with preferences
- Session management and security

### 📝 Citizen Reporting System

- Submit infrastructure issues with photos and GPS location
- Real-time status tracking (Open → In Progress → Resolved)
- Priority assignment based on impact
- Community voting and engagement
- Official response tracking
- Report history and analytics

### 🤖 AI & Machine Learning

- Gemini 2.5 Flash-powered chatbot for air quality queries
- NLP-based report classification and priority detection
- Vector search with Pinecone for semantic similarity
- Sentence embeddings for intelligent matching
- RAG (Retrieval-Augmented Generation) for contextual responses
- Async processing for non-blocking operations

### 📊 Admin Dashboard

- Real-time analytics and KPIs
- Report management and filtering
- User statistics
- System health monitoring
- Data export functionality (XLSX)

---

## Tech Stack

### Backend

| Component              | Technology       | Version  | Purpose               |
| ---------------------- | ---------------- | -------- | --------------------- |
| **Framework**          | FastAPI          | 0.121+   | Async web framework   |
| **Runtime**            | Python           | 3.10+    | Programming language  |
| **ASGI Server**        | Uvicorn          | 0.38+    | Production server     |
| **Database (Primary)** | MongoDB          | Latest   | Document database     |
| **Async Driver**       | Motor            | 3.7+     | Async MongoDB driver  |
| **ORM/Validator**      | Pydantic         | Built-in | Data validation       |
| **Authentication**     | python-jose      | 3.5+     | JWT tokens            |
| **Password Hashing**   | passlib + bcrypt | 1.7+     | Secure hashing        |
| **Semantic Web**       | NGSI-LD          | Standard | Smart city data model |

### Frontend

| Component      | Technology     | Version | Purpose              |
| -------------- | -------------- | ------- | -------------------- |
| **Framework**  | Next.js        | 16.0    | React framework      |
| **React**      | React          | 19.2    | UI library           |
| **Language**   | TypeScript     | 5+      | Type-safe JavaScript |
| **Styling**    | Tailwind CSS   | 3.4+    | Utility-first CSS    |
| **Maps**       | Maplibre-GL    | 5.12+   | Interactive maps     |
| **Charts**     | Chart.js       | 4.5+    | Data visualization   |
| **Markdown**   | react-markdown | 10.1+   | Markdown rendering   |
| **Animations** | Framer Motion  | 12.23+  | Motion library       |
| **Icons**      | Lucide React   | 0.553+  | Icon set             |

### AI & Data Processing

| Component                | Technology            | Version | Purpose                 |
| ------------------------ | --------------------- | ------- | ----------------------- |
| **LLM**                  | Gemini 2.5 Flash      | Latest  | AI chatbot              |
| **Embeddings**           | Sentence Transformers | 3.3+    | Vector embeddings       |
| **Vector DB**            | Pinecone              | 5.0+    | Vector search           |
| **Numeric Computing**    | NumPy                 | 1.26+   | Array operations        |
| **Data Processing**      | Pandas                | 2.1+    | Data manipulation       |
| **Embeddings Framework** | embed-anything        | 0.3+    | Multi-format embeddings |

### DevOps & Infrastructure

| Component            | Technology      | Purpose                      |
| -------------------- | --------------- | ---------------------------- |
| **Containerization** | Docker          | Container images             |
| **Orchestration**    | Docker Compose  | Service orchestration        |
| **Package Manager**  | UV              | Python dependency management |
| **Task Runner**      | Just (justfile) | Automation tasks             |

### Code Quality & Development

| Component              | Technology | Purpose                      |
| ---------------------- | ---------- | ---------------------------- |
| **Python Formatter**   | Black      | Code formatting              |
| **Python Linter**      | Flake8     | Code linting                 |
| **Import Sorter**      | isort      | Import organization          |
| **Git Hooks**          | Husky      | Pre-commit automation        |
| **Git Hooks (Python)** | pre-commit | Python hook management       |
| **JS Linter**          | ESLint     | JavaScript linting           |
| **JS Formatter**       | Prettier   | Code formatting              |
| **Biome**              | Biome      | Unified formatter (optional) |

---

## Project Structure

```
UrbanReflex/
├── src/
│   ├── backend/                    # FastAPI Backend
│   │   ├── app.py                 # Main application
│   │   ├── dependencies.py        # Dependency injection
│   │   ├── config/
│   │   │   ├── config.py         # Configuration management
│   │   │   └── data_model.py     # Data models
│   │   ├── routers/              # API endpoints
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── chatbot.py       # Chat API
│   │   │   ├── citizen_reports.py # Reports API
│   │   │   ├── users.py         # Users API
│   │   │   └── ...
│   │   ├── models/               # Database models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── ai_service/           # AI services
│   │   │   ├── chatbot/         # Chatbot logic
│   │   │   └── classifier_report/ # Report classification
│   │   ├── utils/                # Utilities
│   │   ├── internal/             # Admin endpoints
│   │   └── __init__.py
│   │
│   └── frontend/                  # Next.js Frontend
│       ├── app/                  # Routes & pages
│       ├── components/           # React components
│       ├── contexts/             # Context API
│       ├── lib/                  # Utilities
│       ├── types/                # TypeScript types
│       ├── public/               # Static assets
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── eslint.config.mjs
│       └── package.json
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── CODE_STYLE_GUIDE.md
│   ├── PRE_COMMIT_SETUP.md
│   ├── UV_SETUP.md
│   └── ...
│
├── scripts/                       # Automation scripts
├── schemas/                       # JSON schemas
├── open_data/                     # Sample data
├── examples/                      # Example files
│
├── pyproject.toml                 # Python project config
├── uv.lock                        # Dependency lock file
├── docker-compose.yml             # Service orchestration
├── .justfile                      # Task automation
├── .husky/                        # Git hooks (Husky)
├── .pre-commit-config.yaml        # Git hooks (pre-commit)
├── .prettierrc.json               # Prettier config
├── .env.example                   # Environment template
├── README.md                      # This file
├── CHANGELOG.md
├── LICENSE
└── SECURITY.md
```

---

## Prerequisites

### Required

**Python 3.10+**

```bash
python --version  # Check version
```

**Node.js 18+**

```bash
node --version
npm --version
```

**Docker & Docker Compose**

```bash
docker --version
docker-compose --version
```

**UV Package Manager**

```bash
# Install globally
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via pip
pip install uv
```

### Optional but Recommended

- Git for version control
- VS Code with Python/TypeScript extensions
- Postman/Insomnia for API testing

---

## Setup Guide

### Quick Setup (3 Commands)

```bash
# 1. Clone repository
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Install all dependencies (UV + backend + frontend)
just install

# 3. Setup environment files
just setup-env
```

Then edit `.env`, start services, and you're done!

### Detailed Setup Steps

#### Step 1: Clone Repository

```bash
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex
```

#### Step 2: Install All Dependencies (Just)

```bash
# ONE COMMAND installs UV + backend + frontend dependencies
just install
```

This automatically:

1. Installs UV package manager (if not already installed)
2. Installs Python backend dependencies via `uv sync --all-extras`
3. Installs frontend dependencies via `npm install`

#### Step 3: Setup Environment Files (Just)

```bash
# Auto-create .env from example
just setup-env
```

Edit `.env` with your configuration:

```bash
# MongoDB
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_ROOT_USERNAME=urbanreflex_admin
MONGO_ROOT_PASSWORD=WAG_team_2025_secure
MONGO_DATABASE=urbanreflex_db

# Orion-LD
ORION_LD_HOST=localhost
ORION_LD_PORT=1026

# JWT
SECRET_KEY=your_secret_key_min_32_chars

# AI Services (Optional)
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key

# External APIs (Optional)
OPENAQ_API_KEY=your_api_key
OWM_API_KEY=your_api_key
```

#### Step 4: Start Services

```bash
# Start MongoDB & Orion-LD
docker-compose up -d
```

#### Step 5: Verify Setup

```bash
just info     # Show project info
just health   # Check all services
```

---

## Running the Project

### Quick Start with Just (Recommended)

Open 3 terminals and run:

**Terminal 1: Backend**

```bash
just backend-dev
# Access: http://localhost:8000
```

**Terminal 2: Frontend**

```bash
just frontend-dev
# Access: http://localhost:3000
```

**Terminal 3: Database**

```bash
docker-compose up -d
docker-compose ps
```

**Check Services**

```bash
just health     # Check all services
just info       # Show project info
```

### All Just Commands

```bash
# Setup
just install               # Install UV + backend + frontend dependencies
just setup-env            # Create .env files

# Backend Development
just backend-dev          # Start dev server (http://localhost:8000)
just backend-test         # Run tests
just backend-health       # Check health endpoint
just backend-stop         # Stop backend

# Frontend Development
just frontend-dev         # Start dev server (http://localhost:3000)
just frontend-install     # Install npm dependencies
just frontend-build       # Build for production
just frontend-start       # Run production build
just frontend-lint        # Lint code
just frontend-stop        # Stop frontend

# Utilities
just health               # Check all services
just info                 # Show project info
just code                 # Open in VS Code
```

### Manual Startup (Without Just)

**Backend:**

```bash
uv run uvicorn src.backend.app:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd src/frontend && npm run dev
```

### Production Deployment

**Docker:**

```bash
docker build -f Dockerfile.scheduler -t urbanreflex .
docker run -p 8000:8000 urbanreflex
```

**Frontend Only:**

```bash
just frontend-build    # Build
just frontend-start    # Run production
```

---

## Development Workflow

### Code Quality

All checks run automatically via Git hooks. To run manually:

```bash
# Python (Backend)
black src/backend/          # Format
isort src/backend/          # Sort imports
flake8 src/backend/         # Lint

# JavaScript (Frontend)
cd src/frontend
npm run format              # Prettier format
npm run lint                # ESLint

# Run backend tests
just backend-test
```

### Git Workflow

1. **Create branch**

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and commit**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   # Hooks run automatically
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

---

## Code Quality & Standards

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

Examples:
feat(auth): add JWT token refresh
fix(map): resolve clustering lag
docs: update API documentation
chore(deps): upgrade FastAPI
```

**Valid types**: feat, fix, docs, style, refactor, perf, test, chore, ci, build

### Python Standards

**Line Length**: 100 chars (Black)

```bash
black src/backend/          # Format
isort src/backend/          # Sort imports
flake8 src/backend/         # Lint
```

**Type Hints**: Required

```python
def get_user(user_id: int) -> dict:
    """Get user by ID."""
    return {"id": user_id}
```

### TypeScript Standards

**Linting**: ESLint

```bash
npm run lint --prefix src/frontend
```

**Formatting**: Prettier

```bash
npm run format --prefix src/frontend
```

**No `any` types**: Strict mode enforced

```typescript
// Good
interface User {
  id: number;
  name: string;
}

// Bad (error)
const user: any = {};
```

---

## Testing

### Backend Tests

```bash
# Run all tests
uv run pytest tests/

# With coverage
uv run pytest tests/ --cov=src/backend

# Specific file
uv run pytest tests/test_auth.py
```

### Frontend Tests

```bash
# Jest tests
npm test --prefix src/frontend

# Watch mode
npm test -- --watch --prefix src/frontend

# Coverage
npm test -- --coverage --prefix src/frontend
```

### Manual API Testing

```bash
# Interactive docs
curl http://localhost:8000/docs

# Health check
curl http://localhost:8000/health

# API call
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"citizen@urbanreflex.dev","password":"Citizen@123456"}'
```

---

## API Documentation

**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc  
**OpenAPI**: http://localhost:8000/openapi.json

### Demo Credentials

```
Admin:    admin@urbanreflex.dev / Admin@123456
Official: official@urbanreflex.dev / Official@123456
Citizen:  citizen@urbanreflex.dev / Citizen@123456
```

### Key Endpoints

```
POST   /api/auth/login
GET    /api/air-quality/current
GET    /api/air-quality/stations
POST   /api/reports
GET    /api/reports/{id}
POST   /api/chat
GET    /api/users/me
```

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for complete API documentation.

---

## Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
uv sync --all-extras

# Check MongoDB
docker-compose logs mongo
```

### Frontend Build Fails

```bash
# Clear cache
rm -rf src/frontend/.next

# Reinstall
npm install --prefix src/frontend --force
```

### Port Conflicts

```bash
# Find process
lsof -i :8000    # Backend
lsof -i :3000    # Frontend

# Kill it
kill -9 <PID>

# Or use different port
uvicorn src.backend.app:app --port 8001
```

### Git Hooks Not Running

```bash
# Reinstall Husky
npm install --prefix src/frontend

# Reinstall pre-commit
pre-commit install

# Verify
cat .git/hooks/pre-commit
```

---

## Contributing

### Getting Started

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Follow code standards
4. Commit with conventional message
5. Create pull request to `develop`

### Code Review

- All PRs require review
- Tests must pass
- Follow style guidelines
- Update documentation

### Report Issues

[GitHub Issues](https://github.com/minhe51805/UrbanReflex/issues)

Include:

- Clear title
- Detailed description
- Steps to reproduce
- Environment info
- Error logs

---

## Architecture

### Backend Architecture

```
FastAPI Application (Async)
├─ Routers (Auth, Chat, Reports, Users)
├─ AI Service (Gemini, Embeddings, RAG)
└─ Database Layer (MongoDB + Motor)
   ├─ MongoDB (Primary Storage)
   ├─ Orion-LD (NGSI-LD Data)
   ├─ Pinecone (Vector Search)
   └─ Gemini API (AI)
```

### Frontend Architecture

```
Next.js 16 (React 19 + TypeScript)
├─ Pages & Routes
├─ Components (Maps, Charts, Forms)
└─ API Client Layer
   ├─ FastAPI Backend
   ├─ Map Services (Maplibre)
   └─ External APIs
```

---

## Performance

- **Backend**: ~200ms avg response
- **Frontend**: Lighthouse 85+
- **Database**: <50ms indexed queries
- **Map**: 1000+ markers with clustering

---

## Support

- 📖 [Docs](./docs/)
- 💬 [Discussions](https://github.com/minhe51805/UrbanReflex/discussions)
- 🐛 [Issues](https://github.com/minhe51805/UrbanReflex/issues)

---

## License

**GNU General Public License v3.0** - see [LICENSE](LICENSE)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

**v0.2.0** (Current)

- 12-language support
- GPL-3.0 headers
- Husky + pre-commit framework
- Black + Flake8 + isort standards
- UV package manager consolidation

**v0.1.0**

- Initial beta release
- Air quality monitoring
- User authentication
- Citizen reporting

---

## Acknowledgments

Built for Vietnam Open Source Software Competition

**Supported by:**

- [Hutech University](https://hutech.edu.vn/)
- [VFOSSA](https://vfossa.vn/)
- [OpenLP](https://www.olp.vn/)

---

<div align="center">

**[Docs](./docs/) • [Issues](https://github.com/minhe51805/UrbanReflex/issues) • [Discussions](https://github.com/minhe51805/UrbanReflex/discussions)**

_v0.2.0 - Active Development_

</div>
