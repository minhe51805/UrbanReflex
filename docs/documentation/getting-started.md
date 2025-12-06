---
title: Getting Started
description: Installation and setup guide for UrbanReflex
---

# Getting Started

Hướng dẫn cài đặt và thiết lập UrbanReflex từ đầu.

---

## Prerequisites

```bash
# Required tools
Python 3.10+          # Backend (check: python --version)
Node.js 18+           # Frontend (check: node --version)
Docker & Compose      # Containers (check: docker --version)
uv package manager    # Python deps (install: pip install uv)
```

### Recommended Tools

- **MongoDB Compass** - Database GUI
- **Postman/Thunder Client** - API testing
- **VS Code / Cursor** - IDE với Python & TypeScript extensions

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
```

### 3. Install Dependencies

```bash
# Using justfile (recommended)
just setup

# Or manually
uv sync                    # Python dependencies
cd website && npm install  # Frontend dependencies
```

### 4. Start Development Servers

```bash
# Start all services
just dev

# Or separately
just backend-dev   # FastAPI on port 8000
just frontend-dev  # Next.js on port 3000
```

---

## Environment Variables

### Required Variables

```bash
# Database
MONGODB_URL="mongodb://localhost:27017"
DATABASE_NAME="urbanreflex"

# Authentication
SECRET_KEY="your-secret-key-here"  # Generate: openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Orion-LD Context Broker
ORION_LD_URL="http://localhost:1026"
ORION_LD_USERNAME="urbanreflex_admin"
ORION_LD_PASSWORD="your-password"
```

### Optional Variables

```bash
# AI Services (features disabled without these)
GEMINI_API_KEY="your-gemini-key"       # Required for chatbot
PINECONE_API_KEY="your-pinecone-key"   # Required for vector search
PINECONE_INDEX_NAME="urbanreflex-index"

# External APIs (falls back to mock data)
OPENAQ_API_KEY="your-openaq-key"
OWM_API_KEY="your-openweathermap-key"
```

---

## Verify Installation

### Check Backend Health

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### Check Frontend

```bash
open http://localhost:3000
# Should display UrbanReflex homepage
```

### Check Database Containers

```bash
docker ps
# Should show: mongo, orion-ld containers running
```

---

## Project Structure

```
UrbanReflex/
├── app/                    # FastAPI Backend
│   ├── app.py              # Main application
│   ├── routers/            # API endpoints
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   └── ai_service/         # AI/ML services
│
├── website/                # Next.js Frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   └── contexts/           # React Context
│
├── config/                 # Configuration
├── scripts/                # Automation scripts
├── docker-compose.yml      # Service orchestration
└── justfile                # Task runner
```

---

## Available Commands

```bash
# Development
just dev              # Start all services
just backend-dev      # Start FastAPI only
just frontend-dev     # Start Next.js only

# Database
just db-start         # Start MongoDB + Orion-LD
just db-stop          # Stop databases
just db-reset         # Reset all data (WARNING!)

# Code Quality
just format           # Format code
just lint             # Run linters
just test             # Run all tests
```

---

## First API Call

Sau khi setup xong, thử gọi API đầu tiên:

```bash
# Get air quality stations
curl "http://localhost:8000/v1/aqi/stations?limit=5" \
  -H "X-API-Key: your_api_key"
```

Response:

```json
{
  "results": [
    {
      "id": 12345,
      "name": "Ho Chi Minh City - District 1",
      "city": "Ho Chi Minh City",
      "country": "VN",
      "measurements": [...]
    }
  ],
  "meta": {
    "found": 1234,
    "limit": 5
  }
}
```

---

## Next Steps

- [Basic Usage](./basic-usage.md) - Tìm hiểu các khái niệm cơ bản
- [API Reference](./api.md) - Xem đầy đủ API endpoints
- [Authentication](./authentication.md) - Thiết lập authentication

---

<div align="center">

**[← Back to Index](./index.md)** | **[Basic Usage →](./basic-usage.md)**

</div>
