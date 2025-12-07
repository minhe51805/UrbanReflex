# 🔧 Development Setup Guide

Complete guide to set up UrbanReflex development environment.

## ⚡ Quick Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# One-command setup using justfile
just setup

# Start development
just dev
```

## 📋 Prerequisites

### Required Software

```bash
# 1. Python 3.10+ (Backend)
python --version  # Should be 3.10+

# 2. Node.js 18+ (Frontend)
node --version    # Should be 18+
npm --version     # Should be 9+

# 3. Docker & Docker Compose (Databases)
docker --version
docker-compose --version

# 4. uv (Python package manager) - Optional but recommended
pip install uv
```

### Optional Tools

- **MongoDB Compass** - Database GUI
- **Postman** or **Thunder Client** - API testing
- **Git** - Version control

## 🛠️ Manual Setup

### 1. Backend Setup

```bash
# Install Python dependencies
uv sync  # or pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (required for backend)
docker-compose up -d mongodb

# Run backend
uvicorn app.app:app --reload
# Backend will be available at http://localhost:8000
```

### 2. Frontend Setup

```bash
cd website

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
# Frontend will be available at http://localhost:3000
```

### 3. Database Setup

```bash
# Start all databases
docker-compose up -d mongodb orion redis

# Verify MongoDB is running
docker-compose ps

# Optional: Load sample data
python scripts/seed_data.py
```

## 🔧 Environment Configuration

### Backend Environment (.env)

```bash
# Database
DATABASE_URL="mongodb://localhost:27017/urbanreflex"

# Security
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs (Optional - will use mock data if not provided)
OPENAQ_API_KEY="your-openaq-api-key"
GEMINI_API_KEY="your-gemini-api-key"
PINECONE_API_KEY="your-pinecone-api-key"

# NGSI-LD Context Broker
ORION_BROKER_URL="http://localhost:1026"

# Development
DEBUG=True
LOG_LEVEL="DEBUG"
```

### Frontend Environment (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Optional: External APIs (fallback to backend if not provided)
NEXT_PUBLIC_OPENAQ_API_KEY="your-openaq-api-key"

# Development
NODE_ENV="development"
```

## 🚀 Development Workflow

### Using justfile (Recommended)

```bash
# Development commands
just dev            # Start all services
just backend-dev    # Start only backend
just frontend-dev   # Start only frontend

# Setup commands
just install        # Install all dependencies
just setup-env      # Setup environment files

# Database commands
just db-start       # Start databases
just db-stop        # Stop databases
just db-reset       # Reset all data

# Utility commands
just clean          # Clean build artifacts
just format         # Format code
just lint           # Run linters
just test           # Run tests
```

### Manual Commands

```bash
# Backend development
cd /
uvicorn app.app:app --reload --host 0.0.0.0 --port 8000

# Frontend development
cd website
npm run dev

# Background tasks (optional)
cd /
celery -A app.app worker --loglevel=info

# Database operations
docker-compose up -d mongodb orion redis
docker-compose down
docker-compose logs -f
```

## 🧪 Testing Setup

### Backend Testing

```bash
# Install test dependencies
uv sync --dev

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py -v
```

### Frontend Testing

```bash
cd website

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 2. Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 3. Python Package Issues

```bash
# Clear uv cache
uv cache clean

# Reinstall dependencies
rm -rf .venv
uv sync
```

#### 4. Node.js Issues

```bash
cd website

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Issues

#### Missing API Keys

```bash
# Backend will use mock data if external API keys are not provided
# Check logs for "Using mock data" messages

# Frontend will fallback to backend API calls
# No action needed for development
```

#### Database Connection Errors

```bash
# Ensure Docker is running
docker --version

# Restart all services
docker-compose down
docker-compose up -d

# Check database connectivity
python -c "import motor.motor_asyncio; print('MongoDB driver installed')"
```

## 📁 Project Structure Understanding

```
UrbanReflex/
├── src/                    # 💻 Source Code
│   ├── backend/            # 🐍 FastAPI Backend
│   │   ├── app.py          # Main application
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # Database models
│   │   └── utils/          # Utilities
│   └── frontend/           # 🌐 Next.js Frontend
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       └── lib/            # Utilities
├── docs/                   # 📚 Documentation
├── scripts/                # 🤖 Automation scripts
├── docker-compose.yml      # 🐳 Services
├── justfile                # ⚡ Task automation
└── .env.example            # 🔧 Environment template
```

## 🔄 Development Best Practices

### Code Style

- **Backend**: Black formatter, flake8 linter
- **Frontend**: Prettier formatter, ESLint linter
- **Commits**: Conventional Commits format

### Git Workflow

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# Make changes, commit, and push
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature

# Create pull request targeting 'develop' branch
```

### Testing Before Commit

```bash
# Run all checks
just test
just lint
just format

# Or individually
pytest                    # Backend tests
cd website && npm test    # Frontend tests
black src/backend/               # Format Python code
cd website && npm run lint # Lint frontend code
```

## 🚀 Next Steps

After successful setup:

1. 📖 **Read the code** - Explore `src/backend/` and `src/frontend/` directories
2. 🧪 **Run tests** - Ensure everything works correctly
3. 🌐 **Visit the app** - http://localhost:3000
4. 📊 **Check API docs** - http://localhost:8000/docs
5. 🤝 **Make a contribution** - Fix a bug or add a feature!

## 💡 Tips for New Contributors

- Start with **good first issues** on GitHub
- Join our **Discord/Discussions** for questions
- Check **existing PRs** to avoid duplicate work
- **Test your changes** thoroughly before submitting
- **Document** any new features or APIs

---

<div align="center">

**Ready to develop?** 🚀 Run `just setup` and start building amazing features!

[🏠 Back to Main Documentation](../README.md) • [🧪 Testing Guide](./TESTING.md) • [🚀 Deployment Guide](./DEPLOYMENT.md)

</div>
