# Development Setup Guide

Complete guide to set up UrbanReflex development environment for local development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Manual Setup](#manual-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

**Python 3.10 or higher**

```bash
python --version
# Expected: Python 3.10.x or higher
```

**Node.js 18 or higher**

```bash
node --version
# Expected: v18.x.x or higher

npm --version
# Expected: 9.x.x or higher
```

**Docker and Docker Compose**

```bash
docker --version
# Expected: Docker version 20.x.x or higher

docker-compose --version
# Expected: docker-compose version 1.29.x or higher
```

**Just (Task Runner)**

```bash
# Windows
winget install Casey.Just

# macOS
brew install just

# Linux
cargo install just

# Verify installation
just --version
```

**UV (Python Package Manager) - Recommended**

UV is 10x faster than pip and automatically installs during setup.

```bash
# Manual installation (optional)
# Windows
irm https://astral.sh/uv/install.ps1 | iex

# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Optional Tools

- **MongoDB Compass** - GUI for MongoDB database management
- **Postman** or **Thunder Client** - API testing tools
- **VS Code** - Recommended code editor with extensions:
  - Python
  - ESLint
  - Prettier
  - Docker

---

## Quick Setup

Recommended for most developers. Uses Just task runner for automation.

```bash
# 1. Clone repository
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Install all dependencies (UV + Python packages + npm packages)
just install

# 3. Setup environment files
just setup-env

# 4. Edit environment variables (optional but recommended)
# Edit .env for backend configuration
# Edit src/frontend/.env.local for frontend configuration

# 5. Start all services with Docker Compose
just dev

# 6. (Optional) Run backend/frontend locally for development
# Terminal 2: just backend-dev
# Terminal 3: just frontend-dev
```

Services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Orion-LD Context Broker: http://localhost:1026
- MongoDB: localhost:27017

---

## Manual Setup

Step-by-step manual installation if you prefer not to use Just.

### 1. Clone Repository

```bash
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex
```

### 2. Install UV Package Manager

```bash
# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify installation
uv --version
```

### 3. Setup Environment Files

```bash
# Copy environment templates
cp .env.example .env
cp src/frontend/.env.local.example src/frontend/.env.local
```

---

## Backend Setup

### Install Python Dependencies

```bash
# Using UV (recommended)
uv sync --all-extras

# Or using pip
pip install -e .
```

This installs:

- FastAPI 0.121.0 - Web framework
- Uvicorn - ASGI server
- Pydantic 2.10.3 - Data validation
- MongoDB Motor - Async MongoDB driver
- Gemini AI SDK - For AI chatbot
- Pinecone Client - Vector database
- And all other dependencies from pyproject.toml

### Configure Backend Environment

Edit `.env` file in project root:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=urbanreflex

ORION_LD_URL=http://localhost:1026

# AI Services (Optional - for chatbot features)
GEMINI_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment

# External Data Sources (Optional - for real-time data)
OPENAQ_API_KEY=your_openaq_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Security
SECRET_KEY=your_secret_key_here_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (adjust for production)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Run Backend Server

```bash
# Development mode with auto-reload
uv run uvicorn src.backend.app:app --reload --host 0.0.0.0 --port 8000

# Or using Just
just backend-dev
```

Backend will start at:

- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### Backend Project Structure

```
src/backend/
├── app.py                 # FastAPI application entry point
├── dependencies.py        # Dependency injection
├── ai_service/           # AI chatbot service
│   ├── chatbot.py        # Gemini AI integration
│   └── vector_store.py   # Pinecone vector database
├── config/               # Configuration management
│   └── settings.py       # Environment settings
├── models/               # Pydantic models
│   ├── air_quality.py
│   ├── citizen_report.py
│   ├── point_of_interest.py
│   └── weather.py
├── routers/              # API route handlers
│   ├── air_quality.py
│   ├── chatbot.py
│   ├── citizen_reports.py
│   ├── points_of_interest.py
│   └── weather.py
├── schemas/              # Request/Response schemas
└── utils/                # Utility functions
    ├── ngsi_ld.py        # NGSI-LD helper functions
    └── validation.py     # Data validation
```

---

## Frontend Setup

### Install Node.js Dependencies

```bash
cd src/frontend

# Install all npm packages
npm install
```

This installs:

- Next.js 16.0.7 - React framework
- React 19.0.0 - UI library
- TypeScript 5.7.2 - Type safety
- Tailwind CSS 3.4.1 - Styling
- Shadcn/ui - UI components
- Leaflet - Maps
- Chart.js - Data visualization

### Configure Frontend Environment

Edit `src/frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Map Configuration (Optional)
NEXT_PUBLIC_MAP_CENTER_LAT=10.7769
NEXT_PUBLIC_MAP_CENTER_LNG=106.6951
NEXT_PUBLIC_MAP_ZOOM=12

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_REPORTS=true
```

### Run Frontend Development Server

```bash
# From src/frontend directory
npm run dev

# Or from project root using Just
just frontend-dev
```

Frontend will start at http://localhost:3000

### Frontend Project Structure

```
src/frontend/
├── app/                  # Next.js 16 App Router
│   ├── (dashboard)/     # Dashboard routes
│   ├── api/            # API route handlers
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── charts/         # Chart components
│   ├── maps/           # Map components
│   └── forms/          # Form components
├── contexts/           # React contexts
│   └── ChatContext.tsx # Chat state management
├── lib/                # Utility libraries
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
├── types/              # TypeScript types
│   ├── air-quality.ts
│   ├── citizen-report.ts
│   └── weather.ts
└── public/             # Static assets
    ├── images/
    └── icons/
```

---

## Database Setup

### Start Databases with Docker Compose

```bash
# Start MongoDB + Orion-LD
docker-compose up -d mongo orion-ld

# Or start all services (includes scheduler)
docker-compose up -d

# Or using Just
just db-start
```

### Verify Databases are Running

```bash
# Check container status
docker-compose ps

# Expected output:
# NAME                SERVICE   STATUS    PORTS
# mongo              mongo     running   0.0.0.0:27017->27017/tcp
# orion-ld           orion-ld  running   0.0.0.0:1026->1026/tcp
```

### Access Databases

**MongoDB**

```bash
# Using MongoDB Compass
mongodb://localhost:27017

# Using mongo shell
docker exec -it mongo mongosh

# List databases
show dbs

# Use UrbanReflex database
use urbanreflex

# Show collections
show collections
```

**Orion-LD Context Broker**

```bash
# Check version
curl http://localhost:1026/version

# List all entities
curl http://localhost:1026/ngsi-ld/v1/entities

# Query entities by type
curl http://localhost:1026/ngsi-ld/v1/entities?type=Streetlight
```

### Load Sample Data (Optional)

```bash
# Seed database with example entities
python scripts/seed_data.py

# This creates:
# - 100+ RoadSegment entities
# - 200+ Streetlight entities
# - Sample weather observations
# - Sample air quality data
# - Points of interest
```

### Database Configuration

**MongoDB** - Stores:

- User accounts and authentication
- Citizen reports
- Cached data
- Application metadata

**Orion-LD Context Broker** - Stores:

- NGSI-LD entities (RoadSegment, Streetlight, etc.)
- Spatial data
- Temporal observations
- Entity relationships

---

## Environment Configuration

### Backend Environment Variables

Full list of available environment variables in `.env`:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=urbanreflex
ORION_LD_URL=http://localhost:1026

# AI Services
GEMINI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=urbanreflex-vectors

# Data Sources
OPENAQ_API_KEY=
OPENWEATHER_API_KEY=

# Security
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Logging
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Full list in `src/frontend/.env.local`:

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Map
NEXT_PUBLIC_MAP_CENTER_LAT=10.7769
NEXT_PUBLIC_MAP_CENTER_LNG=106.6951
NEXT_PUBLIC_MAP_ZOOM=12

# Features
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_REPORTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Verification

### 1. Check Backend Health

```bash
# Health check endpoint
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "database": "connected"}
```

### 2. Access API Documentation

Open in browser:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Check Frontend

Open in browser:

- http://localhost:3000

You should see the UrbanReflex dashboard.

### 4. Verify Database Connectivity

```bash
# Check MongoDB connection
docker exec -it mongo mongosh --eval "db.adminCommand('ping')"

# Check Orion-LD
curl http://localhost:1026/version
```

### 5. Run Tests

```bash
# Backend tests
uv run pytest

# Or using Just
just test

# Frontend tests
cd src/frontend
npm run test
```

---

## Troubleshooting

### UV Installation Fails on Windows

**Problem**: PowerShell path errors with spaces

**Solution**:

```bash
# Option 1: Restart terminal after UV installation
just install

# Option 2: Install backend separately
just backend-install

# Option 3: Manual installation
irm https://astral.sh/uv/install.ps1 | iex
# Restart PowerShell
uv sync --all-extras
```

### Port Already in Use

**Problem**: Port 3000, 8000, or 27017 already taken

**Solution**:

```bash
# Find process using port (Windows)
netstat -ano | findstr :8000

# Kill process by PID
taskkill /PID <process_id> /F

# Or change port in configuration
# Backend: uvicorn src.backend.app:app --port 8001
# Frontend: npm run dev -- -p 3001
```

### MongoDB Connection Failed

**Problem**: Cannot connect to MongoDB

**Solution**:

```bash
# Check if MongoDB container is running
docker-compose ps

# Restart MongoDB
just db-restart

# Check MongoDB logs
just db-logs

# Verify MongoDB is accessible
docker exec -it mongo mongosh --eval "db.adminCommand('ping')"
```

### Orion-LD Not Responding

**Problem**: Orion-LD returns 404 or connection refused

**Solution**:

```bash
# Check Orion-LD logs
docker-compose logs orion-ld

# Restart Orion-LD
docker-compose restart orion-ld

# Verify Orion-LD is running
curl http://localhost:1026/version

# If still failing, check if MongoDB is running (Orion-LD depends on it)
```

### Frontend Build Errors

**Problem**: npm install or build fails

**Solution**:

```bash
# Clear npm cache
cd src/frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (must be 18+)
node --version

# Update to latest LTS if needed
```

### Python Import Errors

**Problem**: ModuleNotFoundError when running backend

**Solution**:

```bash
# Reinstall dependencies
uv sync --all-extras

# Verify installation
uv pip list

# Check if you're in the right directory
pwd  # Should be in project root

# Try running with python -m
python -m uvicorn src.backend.app:app --reload
```

### Permission Denied (Docker)

**Problem**: Docker commands fail with permission errors

**Solution**:

```bash
# Windows: Run PowerShell as Administrator

# Linux/macOS: Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in

# Or use sudo
sudo docker-compose up -d
```

### API Keys Not Working

**Problem**: External services (Gemini, OpenAQ) return 401 errors

**Solution**:

1. Verify API keys are correctly copied in `.env`
2. Check for extra spaces or quotes
3. Restart backend server after changing `.env`
4. Test API keys directly:
   ```bash
   # Test Gemini API
   curl -H "x-goog-api-key: YOUR_KEY" https://generativelanguage.googleapis.com/v1/models
   ```

---

## Next Steps

After successful setup:

1. **Explore the codebase**
   - Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
   - Check [API_REFERENCE.md](./API_REFERENCE.md) for API documentation
   - Review [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md) before contributing

2. **Load sample data**

   ```bash
   python scripts/seed_data.py
   ```

3. **Start developing**
   - Backend: Modify routes in `src/backend/routers/`
   - Frontend: Add components in `src/frontend/components/`
   - See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines

4. **Run tests**

   ```bash
   just test
   ```

5. **Format and lint code**
   ```bash
   just format
   just lint
   ```

For more information, see [USER_GUIDE.md](./USER_GUIDE.md) and [COMMANDS.md](./COMMANDS.md).
