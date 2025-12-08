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

# Start all services (backend + frontend + databases)
dev:
    @echo "Starting all services with docker-compose"
    docker-compose up -d
    @echo ""
    @echo "Services requested from docker-compose.yml:"
    @echo "  - mongo"
    @echo "  - orion-ld"
    @echo "  - scheduler"
    @echo ""
    @echo "Use 'docker-compose ps' to check status. Ctrl+C does nothing here."

# ============================================================================
# DATABASE COMMANDS
# ============================================================================

# Start databases (MongoDB + Orion-LD)
db-start:
    @echo "Starting databases..."
    docker-compose up -d mongo orion-ld
    @echo "Databases started!"
    @echo "MongoDB: localhost:27017"
    @echo "Orion-LD: http://localhost:1026"

# Stop databases
db-stop:
    @echo "Stopping databases..."
    docker-compose stop mongo orion-ld
    @echo "Databases stopped!"

# Restart databases
db-restart:
    @echo "Restarting databases..."
    docker-compose restart mongo orion-ld
    @echo "Databases restarted!"

# View database logs
db-logs:
    @echo "Viewing database logs (Ctrl+C to exit)..."
    docker-compose logs -f mongo orion-ld

# Clean database data (WARNING: removes all data!)
db-clean:
    @echo "WARNING: This will delete all database data!"
    @powershell -Command "$confirmation = Read-Host 'Type YES to confirm'; if ($confirmation -eq 'YES') { docker-compose down -v; Write-Host 'Database data cleaned!' } else { Write-Host 'Cancelled.' }"

# ============================================================================
# BACKEND COMMANDS (FastAPI)
# ============================================================================

# Install backend dependencies only
backend-install:
    @echo "Installing backend dependencies..."
    @powershell -Command "& $env:USERPROFILE\.local\bin\uv.exe sync --all-extras"

# Run backend in development mode
backend-dev:
    @echo "Starting backend development server..."
    uv run uvicorn src.backend.app:app --reload --host 0.0.0.0 --port 8000

# Stop backend (for Windows)
backend-stop:
    @echo "Stopping backend..."
    @powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'python'} | Stop-Process -Force" 2>$null || echo "No backend process found"

# Test backend
backend-test:
    @echo "Running backend tests..."
    uv run pytest

# Check backend health
health:
    @echo "Checking backend health..."
    curl http://localhost:8000/health

# ============================================================================
# FRONTEND COMMANDS (Next.js)
# ============================================================================

# Install frontend dependencies
frontend-install:
    @echo "Installing frontend dependencies..."
    cd src/frontend; npm install
    @echo "Frontend dependencies installed!"

# Run frontend in development mode
frontend-dev:
    @echo "Starting frontend development server..."
    cd src/frontend; npm run dev

# Build frontend for production
frontend-build:
    @echo "Building frontend..."
    cd src/frontend; npm run build
    @echo "Frontend built!"

# Run frontend in production mode
frontend-start:
    @echo "Starting frontend production server..."
    cd src/frontend; npm start

# Stop frontend (for Windows)
frontend-stop:
    @echo "Stopping frontend..."
    @powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force" 2>$null || echo "No frontend process found"

# Lint frontend code
frontend-lint:
    @echo "Linting frontend code..."
    cd src/frontend; npm run lint

# Format frontend code
frontend-format:
    @echo "Formatting frontend code..."
    cd src/frontend; npm run format

# Type check frontend
frontend-typecheck:
    @echo "Type checking frontend..."
    cd src/frontend; npm run type-check

# ============================================================================
# INSTALLATION & SETUP
# ============================================================================

# Install all dependencies (UV + backend + frontend)
install:
    @echo "Installing all dependencies..."
    @echo "1. Installing UV package manager..."
    @powershell -Command "irm https://astral.sh/uv/install.ps1 | iex"
    @echo ""
    @echo "2. Installing Python backend dependencies..."
    @powershell -Command "& $env:USERPROFILE\.local\bin\uv.exe sync --all-extras"
    @echo ""
    @echo "3. Installing frontend dependencies..."
    cd src/frontend; npm install
    @echo ""
    @echo "All dependencies installed!"
    @echo ""
    @echo "Next steps:"
    @echo "  1. Run 'just setup-env' to create environment files"
    @echo "  2. Edit .env and src/frontend/.env.local with your API keys (optional)"
    @echo "  3. Run 'just dev' to start all services"

# Setup environment files
setup-env:
    @echo "Setting up environment files..."
    @powershell -Command "if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host '.env created from .env.example' }"
    @powershell -Command "if (-not (Test-Path src/frontend/.env.local)) { Copy-Item src/frontend/.env.local.example src/frontend/.env.local; Write-Host 'src/frontend/.env.local created from .env.local.example' }"
    @echo "Environment files created!"
    @echo "Please edit .env and src/frontend/.env.local with your configuration"

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
    @echo "Services:"
    @echo "  Frontend:  http://localhost:3000"
    @echo "  Backend:   http://localhost:8000"
    @echo "  API Docs:  http://localhost:8000/docs"
    @echo "  Orion-LD:  http://localhost:1026"
    @echo "  MongoDB:   localhost:27017"
    @echo "============================================"
    @echo ""
    @echo "Quick Start:"
    @echo "  1. just install      # Install all dependencies"
    @echo "  2. just setup-env    # Setup environment files"
    @echo "  3. just dev          # Start databases"
    @echo "  4. just backend-dev  # Start backend (new terminal)"
    @echo "  5. just frontend-dev # Start frontend (new terminal)"
    @echo "============================================"

# Clean build artifacts
clean:
    @echo "Cleaning build artifacts..."
    @powershell -Command "if (Test-Path src/frontend/.next) { Remove-Item -Recurse -Force src/frontend/.next }"
    @powershell -Command "if (Test-Path src/frontend/node_modules) { Remove-Item -Recurse -Force src/frontend/node_modules }"
    @powershell -Command "Get-ChildItem -Recurse -Filter '__pycache__' | Remove-Item -Recurse -Force"
    @powershell -Command "Get-ChildItem -Recurse -Filter '*.pyc' | Remove-Item -Force"
    @echo "Cleaned!"

# Format all code (backend + frontend)
format:
    @echo "Formatting backend code..."
    uv run black src/backend
    uv run isort src/backend
    @echo "Formatting frontend code..."
    cd src/frontend; npm run format
    @echo "All code formatted!"

# Lint all code
lint:
    @echo "Linting backend..."
    uv run flake8 src/backend
    @echo "Linting frontend..."
    cd src/frontend; npm run lint
    @echo "Linting complete!"

# Run all tests
test:
    @echo "Running backend tests..."
    uv run pytest
    @echo "Backend tests complete!"

# Stop all services
stop-all:
    @echo "Stopping all services..."
    just backend-stop
    just frontend-stop
    docker-compose stop
    @echo "All services stopped!"