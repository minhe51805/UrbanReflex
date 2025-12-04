# ⚡ Commands Cheatsheet

Quick reference for all development commands in UrbanReflex.

## 🛠️ justfile Commands

### 🚀 Development

```bash
just dev            # Start all services (backend + frontend + databases)
just backend-dev    # Start only FastAPI backend (port 8000)
just frontend-dev   # Start only Next.js frontend (port 3000)
```

### 📦 Setup & Installation

```bash
just setup          # Complete development environment setup
just install        # Install all dependencies (backend + frontend)
just setup-env      # Create .env files from examples
```

### 🗄️ Database Management

```bash
just db-start       # Start MongoDB + Orion Context Broker + Redis
just db-stop        # Stop all databases
just db-restart     # Restart all databases
just db-reset       # Reset all database data (⚠️ destructive)
just db-logs        # Show database logs
```

### 🧹 Cleanup & Maintenance

```bash
just clean          # Clean build artifacts and cache
just format         # Format code (Black + Prettier)
just lint           # Run linters (flake8 + ESLint)
```

### 🧪 Testing

```bash
just test           # Run all tests (backend + frontend)
just test-backend   # Run only backend tests (pytest)
just test-frontend  # Run only frontend tests (Jest)
just test-coverage  # Run tests with coverage report
```

## 🐍 Backend Commands (FastAPI)

### Development Server

```bash
# Start development server
uvicorn app.app:app --reload --host 0.0.0.0 --port 8000

# Start with debug logging
uvicorn app.app:app --reload --log-level debug

# Start on different port
uvicorn app.app:app --reload --port 8001
```

### Database Operations

```bash
# Run database migrations (if using Alembic)
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description"

# Reset database
python scripts/reset_database.py
```

### Python Package Management

```bash
# Install dependencies (recommended)
uv sync

# Install with pip (alternative)
pip install -r requirements.txt

# Add new dependency
uv add package-name

# Add development dependency
uv add --dev package-name

# Update dependencies
uv sync --upgrade
```

### Code Quality

```bash
# Format code
black app/
black scripts/

# Lint code
flake8 app/
flake8 scripts/

# Type checking
mypy app/

# Import sorting
isort app/
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run specific test function
pytest tests/test_auth.py::test_login_success -v

# Run tests with output
pytest -s

# Run tests in parallel
pytest -n auto
```

## 🌐 Frontend Commands (Next.js)

### Development Server

```bash
cd website

# Start development server
npm run dev

# Start on different port
npm run dev -- --port 3001

# Start with turbo mode
npm run dev --turbo
```

### Package Management

```bash
cd website

# Install dependencies
npm install

# Add new dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

### Build & Production

```bash
cd website

# Build for production
npm run build

# Start production server
npm start

# Export static site
npm run export

# Analyze bundle size
npm run analyze
```

### Code Quality

```bash
cd website

# Format code
npm run format
# or
npx prettier --write .

# Lint code
npm run lint
# or
npx eslint . --fix

# Type checking
npm run type-check
# or
npx tsc --noEmit
```

### Testing

```bash
cd website

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker Commands

### Container Management

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mongodb

# Stop all services
docker-compose down

# Restart service
docker-compose restart mongodb

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f mongodb
```

### Image Management

```bash
# Build images
docker-compose build

# Pull latest images
docker-compose pull

# Remove unused images
docker image prune

# Remove all containers and images
docker-compose down -v --rmi all
```

### Database Access

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Connect to Redis
docker-compose exec redis redis-cli

# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup
```

## 🔧 Environment Management

### Environment Files

```bash
# Copy example files
cp .env.example .env
cp website/.env.example website/.env.local

# View environment variables
cat .env
printenv | grep URBANREFLEX
```

### Python Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Deactivate
deactivate
```

## 🚀 Deployment Commands

### Production Build

```bash
# Build backend image
docker build -t urbanreflex-backend .

# Build frontend image
docker build -t urbanreflex-frontend ./website

# Build all images
docker-compose -f docker-compose.prod.yml build
```

### Production Deployment

```bash
# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Deploy to Kubernetes
kubectl apply -f k8s/

# Deploy to Vercel (frontend only)
cd website && vercel deploy --prod
```

## 🧰 Utility Commands

### Data Operations

```bash
# Seed database with sample data
python scripts/seed_data.py

# Export data
python scripts/export_data.py --format json

# Import data
python scripts/import_data.py --file data.json

# Validate NGSI-LD entities
python scripts/validate_entities.py
```

### API Testing

```bash
# Test API endpoints
curl http://localhost:8000/health

# Get API documentation
curl http://localhost:8000/openapi.json

# Test with authentication
curl -H "Authorization: Bearer <token>" http://localhost:8000/users/me
```

### Monitoring

```bash
# View system resources
docker stats

# Monitor logs
tail -f app.log

# Check port usage
netstat -tulpn | grep :8000
lsof -i :8000
```

## 📊 Performance & Debugging

### Profiling

```bash
# Profile Python code
python -m cProfile -o profile.stats app/main.py

# Analyze profile
python -c "import pstats; pstats.Stats('profile.stats').sort_stats('cumulative').print_stats()"

# Profile memory usage
mprof run python app/main.py
mprof plot
```

### Database Performance

```bash
# MongoDB performance
docker-compose exec mongodb mongostat

# Redis performance
docker-compose exec redis redis-cli info stats

# Connection monitoring
docker-compose exec mongodb mongotop
```

## 🔍 Debugging

### Log Management

```bash
# Follow application logs
tail -f logs/app.log

# Search logs
grep "ERROR" logs/app.log

# Rotate logs
logrotate -f logrotate.conf
```

### Network Debugging

```bash
# Check service connectivity
docker-compose exec backend ping mongodb

# Port forwarding
kubectl port-forward svc/mongodb 27017:27017

# Network inspection
docker network ls
docker network inspect urbanreflex_default
```

## 🎯 Quick Reference

### Most Used Commands

```bash
# Daily development workflow
just setup      # First time only
just dev        # Start everything
just test       # Before committing
just clean      # When things get messy

# Commit workflow
git add .
git commit -m "feat: your feature"
git push origin feature-branch
```

### Emergency Commands

```bash
# Reset everything
just clean
docker-compose down -v
just setup
just dev

# Free up disk space
docker system prune -a
docker volume prune
```

---

<div align="center">

**Need more help?** Check our [Development Setup Guide](./DEVELOPMENT_SETUP.md) or [Troubleshooting Guide](./TROUBLESHOOTING.md)

[🏠 Back to Main Documentation](../README.md)

</div>
