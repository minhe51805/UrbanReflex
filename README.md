# UrbanReflex

**Smart City Platform - Air Quality Monitoring & Urban Infrastructure Management**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/minhe51805/UrbanReflex/releases)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)

## Quick Start

### Prerequisites

```bash
Python 3.10+          # Backend
Node.js 18+           # Frontend
Docker & Docker Compose
uv package manager    # Python dependencies
```

### Setup (5 minutes)

```bash
# 1. Clone and setup
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Environment setup
cp .env.example .env
# Edit .env with your API keys

# 3. Install dependencies
npm install --prefix src/frontend

# 4. Start services (2 terminal windows)
# Terminal 1: Backend
just backend-dev          # http://localhost:8000

# Terminal 2: Frontend
just frontend-dev         # http://localhost:3000
```

### Database Setup (Docker)

```bash
docker-compose up -d    # Starts MongoDB + Orion-LD
docker-compose ps       # Verify services
```

## Features

### 🌍 Air Quality Monitoring

- Real-time AQI data from OpenAQ API
- Interactive map with 10,000+ stations
- Historical trends and health recommendations

### 🏙️ Smart City Infrastructure

- NGSI-LD compliant data model
- Orion Context Broker integration
- Road, streetlight, and weather data

### 👥 User Management

- JWT authentication
- Role-based access (Citizen, Admin, Official)
- API key management

### 📝 Citizen Reporting

- Submit infrastructure issues with photos
- Status tracking (Open → In Progress → Resolved)
- Priority assignment and voting

### 🤖 AI Services

- Gemini-powered chatbot for air quality queries
- NLP report classification
- Vector search with Pinecone

## Project Structure

```
UrbanReflex/
├── src/
│   ├── backend/                # FastAPI app
│   │   ├── routers/           # API endpoints
│   │   ├── ai_service/        # AI/ML services
│   │   ├── config/            # Configuration
│   │   └── ...
│   └── frontend/              # Next.js app
│       ├── app/               # Pages & routes
│       ├── components/        # React components
│       └── ...
├── docs/                       # Documentation
├── scripts/                    # Automation scripts
├── docker-compose.yml          # Service orchestration
└── .justfile                   # Task commands
```

## Development

### Available Commands

```bash
just backend-dev       # Start backend (port 8000)
just frontend-dev      # Start frontend (port 3000)
just backend-test      # Run backend tests
just lint             # Lint code
just format           # Format code
```

### Code Standards

**Backend (Python):**

- Follow PEP 8 (enforced by `black`)
- Use type hints for all functions
- Async/await for all I/O operations

**Frontend (TypeScript):**

- ESLint enforced style
- No `any` types - strict TypeScript
- Functional components with hooks

## Testing

```bash
# Backend tests
pytest tests/

# Frontend tests
npm test --prefix src/frontend

# All quality checks
just lint && just format && just type-check
```

## API Documentation

Once backend is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Demo Credentials

```
Admin:    admin@urbanreflex.dev / Admin@123456
Official: official@urbanreflex.dev / Official@123456
Citizen:  citizen@urbanreflex.dev / Citizen@123456
```

## Environment Variables

**Required:**

```bash
MONGO_ROOT_USERNAME=urbanreflex_admin
MONGO_ROOT_PASSWORD=your_password
MONGO_DATABASE=urbanreflex_db
SECRET_KEY=your_secret_key
```

**Optional (for features):**

```bash
GEMINI_API_KEY=            # Chatbot
PINECONE_API_KEY=          # Vector search
OPENAQ_API_KEY=            # Air quality (fallback to mock)
OWM_API_KEY=               # Weather (fallback to mock)
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow [Conventional Commits](https://www.conventionalcommits.org/)
3. Submit PR to `develop` branch

**Commit format:**

```
feat: add user profile endpoint
fix: resolve auth token expiry issue
docs: update setup guide
```

## Troubleshooting

**Backend won't start?**

```bash
# Check Python environment
python --version  # Should be 3.10+

# Reinstall dependencies
uv sync

# Check MongoDB
docker-compose logs mongo
```

**Frontend build fails?**

```bash
# Clear cache
rm -rf src/frontend/.next

# Reinstall deps
npm install --prefix src/frontend
```

**Port conflicts?**

```bash
# Change ports in .justfile (backend) or package.json (frontend)
# Or kill existing processes:
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
```

## Architecture

```
┌─────────────────────────────────┐
│   Frontend (Next.js + React)    │
└────────────┬────────────────────┘
             │ HTTP/REST + JWT
┌────────────▼────────────────────┐
│   Backend (FastAPI + Async)     │
│   ├─ Auth & User Management     │
│   ├─ AI Services (RAG, NLP)     │
│   └─ Data Processing            │
└─┬──────────┬──────────┬─────────┘
  │          │          │
┌─▼──┐  ┌────▼─┐  ┌────▼──┐
│ MongoDB │Orion-LD│Pinecone│
└────┘  └──────┘  └───────┘
```

## Tech Stack

| Layer             | Technology                                     |
| ----------------- | ---------------------------------------------- |
| **Frontend**      | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend**       | FastAPI, Python 3.10+, async/await             |
| **Database**      | MongoDB (primary), Orion-LD (NGSI-LD)          |
| **Vector Search** | Pinecone                                       |
| **AI**            | Gemini 2.5 Flash, Sentence Transformers        |
| **DevOps**        | Docker, Docker Compose                         |

## Performance

- **Backend**: ~200ms avg response time
- **Frontend**: Lighthouse score 85+
- **Database**: <50ms for indexed queries
- **Map**: Handles 1000+ markers with clustering

## Support

- 📖 [Documentation](./docs/)
- 💬 [Discussions](https://github.com/minhe51805/UrbanReflex/discussions)
- 🐛 [Report Issues](https://github.com/minhe51805/UrbanReflex/issues)

## License

Licensed under Apache License 2.0 - see [LICENSE](LICENSE) file

## Acknowledgments

Built with ❤️ for Vietnam Open Source Software Competition

Supported by:

- [Hutech University](https://hutech.edu.vn/)
- [VFOSSA](https://vfossa.vn/)
- [OpenLP](https://www.olp.vn/)

---

<div align="center">

**[Website](https://urbanreflex.dev) • [Docs](./docs/) • [Issues](https://github.com/minhe51805/UrbanReflex/issues) • [Discussions](https://github.com/minhe51805/UrbanReflex/discussions)**

</div>
