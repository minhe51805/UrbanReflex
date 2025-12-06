---
title: Configuration
description: Environment variables and settings
---

# Configuration

Hướng dẫn cấu hình UrbanReflex cho các môi trường khác nhau.

---

## Environment Variables

### Required Variables

```bash
# ========================================
# DATABASE
# ========================================
MONGODB_URL="mongodb://localhost:27017"
DATABASE_NAME="urbanreflex"

# ========================================
# AUTHENTICATION
# ========================================
# Generate with: openssl rand -hex 32
SECRET_KEY="your-super-secret-key-here"
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM="HS256"

# ========================================
# ORION-LD CONTEXT BROKER
# ========================================
ORION_LD_URL="http://localhost:1026"
ORION_LD_USERNAME="urbanreflex_admin"
ORION_LD_PASSWORD="your-orion-password"
```

### Optional Variables

```bash
# ========================================
# AI SERVICES
# ========================================
# Required for chatbot functionality
GEMINI_API_KEY="your-gemini-api-key"

# Required for vector search
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="urbanreflex-index"
PINECONE_ENVIRONMENT="gcp-starter"

# ========================================
# EXTERNAL APIS
# ========================================
# Falls back to mock data if not provided
OPENAQ_API_KEY="your-openaq-api-key"
OWM_API_KEY="your-openweathermap-key"

# ========================================
# DEVELOPMENT
# ========================================
DEBUG=true
LOG_LEVEL="DEBUG"  # DEBUG, INFO, WARNING, ERROR

# ========================================
# CORS
# ========================================
ALLOWED_ORIGINS="http://localhost:3000,https://urbanreflex.dev"
```

---

## Configuration Files

### .env.example

```bash
# Copy this file to .env and fill in your values
cp .env.example .env
```

### config/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "urbanreflex"
    
    # Auth
    secret_key: str
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    # Orion-LD
    orion_ld_url: str = "http://localhost:1026"
    
    # AI Services
    gemini_api_key: str | None = None
    pinecone_api_key: str | None = None
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Docker Configuration

### docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017
      - DATABASE_NAME=urbanreflex
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - mongo
      - orion

  frontend:
    build: ./website
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  orion:
    image: fiware/orion-ld:1.5.1
    ports:
      - "1026:1026"
    depends_on:
      - mongo
    command: -dbhost mongo -logLevel DEBUG

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### Production Docker

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  backend:
    image: urbanreflex/backend:latest
    environment:
      - MONGODB_URL=${MONGODB_URL}
      - SECRET_KEY=${SECRET_KEY}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  frontend:
    image: urbanreflex/frontend:latest
    deploy:
      replicas: 2
```

---

## Development vs Production

### Development

```bash
# Start development servers
just dev

# Or separately
just backend-dev   # Hot reload enabled
just frontend-dev  # Next.js dev mode
```

Settings:
- `DEBUG=true`
- `LOG_LEVEL=DEBUG`
- Hot reload enabled
- CORS allows localhost

### Production

```bash
# Build and start production
docker-compose -f docker-compose.prod.yml up -d
```

Settings:
- `DEBUG=false`
- `LOG_LEVEL=WARNING`
- SSL enabled
- Rate limiting stricter
- CORS restricted

---

## Logging Configuration

### Backend (Python)

```python
# config/logging.py
import logging

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "json": {
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default"
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "logs/app.log",
            "formatter": "json"
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"]
    }
}
```

### Frontend (Next.js)

```typescript
// next.config.ts
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

---

## Security Configuration

### CORS

```python
# app/app.py
from fastapi.middleware.cors import CORSMiddleware

origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/endpoint")
@limiter.limit("100/minute")
async def endpoint():
    pass
```

---

## Database Indexes

### MongoDB

```python
# scripts/create_indexes.py
from motor.motor_asyncio import AsyncIOMotorClient

async def create_indexes():
    db = client.urbanreflex
    
    # Users collection
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    
    # Reports collection
    await db.citizen_reports.create_index([
        ("location", "2dsphere")
    ])
    await db.citizen_reports.create_index("status")
    await db.citizen_reports.create_index("created_at")
```

---

## Justfile Commands

```just
# justfile

# Development
dev:
    @echo "Starting development servers..."
    docker-compose up -d mongo orion redis
    uv run uvicorn app.app:app --reload &
    cd website && npm run dev

backend-dev:
    uv run uvicorn app.app:app --reload --port 8000

frontend-dev:
    cd website && npm run dev

# Database
db-start:
    docker-compose up -d mongo orion redis

db-stop:
    docker-compose down

db-reset:
    docker-compose down -v
    docker-compose up -d mongo orion redis

# Code quality
format:
    uv run black app/
    cd website && npm run format

lint:
    uv run flake8 app/
    cd website && npm run lint

test:
    uv run pytest
    cd website && npm test
```

---

<div align="center">

**[← Ecosystem](./ecosystem.md)** | **[License →](./license.md)**

</div>
