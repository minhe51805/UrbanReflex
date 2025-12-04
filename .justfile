# ============================================================================
# UrbanReflex - Just Commands
# Quick commands to run and manage the entire project
# ============================================================================

set shell := ["powershell.exe", "-c"]

# Default recipe - show available commands
default:
    @just --list

# ============================================================================
# FULL PROJECT COMMANDS
# ============================================================================

# Run the entire project (backend + frontend)
dev: backend-dev frontend-dev
    @echo "UrbanReflex is running!"
    @echo "Frontend: http://localhost:3000"
    @echo "Backend: http://localhost:8000"

# Stop all services
stop: backend-stop frontend-stop
    @echo "All services stopped!"

# Full setup from scratch
setup: install setup-env
    @echo "Project setup complete!"

# ============================================================================
# BACKEND COMMANDS (FastAPI)
# ============================================================================

# Run backend in development mode
backend-dev:
    @echo "Starting backend development server..."
    uv run uvicorn app.app:app --reload --host 0.0.0.0 --port 8000

# Stop backend (for Windows)
backend-stop:
    @echo "Stopping backend..."
    @powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'python'} | Stop-Process -Force" || echo "No backend process found"

# Test backend
backend-test:
    @echo "Running backend tests..."
    uv run pytest

# Check backend health
backend-health:
    @echo "Checking backend health..."
    curl http://localhost:8000/health

# ============================================================================
# FRONTEND COMMANDS (Next.js)
# ============================================================================

# Install frontend dependencies
frontend-install:
    @echo "Installing frontend dependencies..."
    cd website; npm install
    @echo "Frontend dependencies installed!"

# Run frontend in development mode
frontend-dev:
    @echo "Starting frontend development server..."
    cd website; npm run dev

# Build frontend for production
frontend-build:
    @echo "Building frontend..."
    cd website; npm run build
    @echo "Frontend built!"

# Run frontend in production mode
frontend-start:
    @echo "Starting frontend production server..."
    cd website; npm start

# Stop frontend (for Windows)
frontend-stop:
    @echo "Stopping frontend..."
    @powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force" || echo "No frontend process found"

# Lint frontend code
frontend-lint:
    @echo "Linting frontend code..."
    cd website; npm run lint

# ============================================================================
# INSTALLATION & SETUP
# ============================================================================

# Install all dependencies
install: frontend-install
    @echo "All dependencies installed!"

# Setup environment files
setup-env:
    @echo "Setting up environment files..."
    @if (-not (Test-Path .env)) { Copy-Item .env.example .env }
    @if (-not (Test-Path .env.local)) { Copy-Item .env.local.example .env.local }
    @echo "Environment files created!"
    @echo "Please edit .env and .env.local with your API keys"

# ============================================================================
# DEVELOPMENT HELPERS
# ============================================================================

# Open project in VS Code
code:
    code .

# Show project info
info:
    @echo "============================================"
    @echo "UrbanReflex - Smart City Platform"
    @echo "============================================"
    @echo "Backend: FastAPI + Python 3.10+"
    @echo "Frontend: Next.js 16 + React 19"
    @echo "Database: MongoDB 4.4 + Orion-LD 1.5.1"
    @echo "============================================"
    @echo "Ports:"
    @echo "  - Frontend: http://localhost:3000"
    @echo "  - Backend: http://localhost:8000"
    @echo "  - Orion-LD: http://localhost:1026"
    @echo "  - MongoDB: localhost:27017"
    @echo "============================================"

# Check all services health
health: backend-health
    @echo "Health check complete!"

# Restart everything
restart: stop dev
    @echo "Everything restarted!"
