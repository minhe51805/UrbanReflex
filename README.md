<p align="center">
	<img loading="lazy" src="https://drive.google.com/uc?export=view&id=1GG28YjHys9I1DTv2HnXOtD6zD0zwUgrg" alt="UrbanReflex Logo" height="150">
</p>
<h1 align="center">UrbanReflex v0.2.0</h1>

<div align="center">

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/minhe51805/UrbanReflex/releases/tag/0.2.0)
[![Release](https://img.shields.io/badge/release-Stable-green.svg)](https://github.com/minhe51805/UrbanReflex/releases)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-GPL_3.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production_Ready-green.svg)](https://github.com/minhe51805/UrbanReflex)

A smart city intelligence platform that bridges fragmented urban data sources into a unified NGSI-LD ecosystem, empowering communities and city managers with real-time infrastructure insights and open data access

**Production-Ready Release for Deployment & Testing**

[🚀 Quick Start](#-quick-start) • [✨ What's New](#-whats-new-in-v020) • [📊 Demo Credentials](#-demo-credentials) • [📖 Documentation](#-documentation) • [🐛 Known Issues](#-known-issues)

</div>

---

## 📋 Release Information

- **Version**: `0.2.0`
- **Release Date**: December 7, 2025
- **Status**: Production Ready - Stable Release
- **Target Audience**: Production Deployment, Testing, Demonstration
- **Stability**: Stable - Full Testing Complete
- **Previous Version**: [v0.1.0](https://github.com/minhe51805/UrbanReflex/releases/tag/0.1.0)

---

## 🎯 What's New in v0.2.0

This release focuses on **developer experience improvements**, **automation**, and **production readiness** with major enhancements to setup workflow and code quality tooling.

### 🆕 Major Features

#### ⚡ One-Command Setup with Just Task Runner

- **Just Automation**: 16+ pre-configured recipes for all development tasks
- **Auto-Installation**: `just install` now automatically installs UV package manager + all dependencies
- **Smart Environment Setup**: `just setup-env` creates both backend `.env` and frontend `.env.local` files
- **Zero Configuration**: No manual dependency installation required
- **Cross-Platform**: Works on Windows, macOS, Linux with PowerShell/Bash support

#### 🔧 Enhanced Developer Experience

- **UV Package Manager**: Lightning-fast Python dependency resolution (10x faster than pip)
- **Dual Environment Files**: Separate configuration for backend and frontend
- **Pre-commit Hooks**: Automatic code quality checks with Husky integration
- **Prettier Integration**: Frontend code formatting with consistent style
- **Comprehensive README**: Complete setup guide with troubleshooting section

#### 📦 Updated Dependencies

- **Next.js**: Updated from 16.0.3 → **16.0.7** (latest stable)
- **Prettier**: Added v3.2.5 for frontend formatting
- **Models Package**: Fixed import errors with proper package structure
- **Code Quality Tools**: Black, Flake8, isort, ESLint, Prettier all configured

#### 🐛 Critical Bug Fixes

- **Fixed**: `ModuleNotFoundError` for `src.backend.models` package
- **Fixed**: Just command PowerShell syntax errors on Windows
- **Fixed**: Frontend environment file location (moved to `src/frontend/`)
- **Fixed**: Invalid `restart` recipe removed from justfile
- **Fixed**: `.gitignore` properly tracks models package files

### ✅ All Features from v0.1.0

#### 🌍 Air Quality Monitoring

- ✅ Real-time AQI data integration with OpenAQ API
- ✅ Interactive map with 10,000+ global monitoring stations
- ✅ Location-based air quality search and filtering
- ✅ Historical data charts and trends (12-month data)
- ✅ Health recommendations based on AQI levels
- ✅ Mock data fallback for development/testing
- ✅ **12-language support** (English, Vietnamese, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Hindi)

#### 🏙️ Smart City Infrastructure

- ✅ NGSI-LD compliant data model implementation
- ✅ Orion Context Broker integration for semantic interoperability
- ✅ Road segment data visualization and analysis
- ✅ Streetlight monitoring and status tracking
- ✅ Weather data correlation with air quality
- ✅ Point of Interest (POI) management
- ✅ Geographic clustering for performance optimization

#### 👥 User Management

- ✅ User registration and authentication (JWT with refresh tokens)
- ✅ Role-based access control (Citizen, City Official, Admin)
- ✅ API key generation and management
- ✅ User profile management with preferences
- ✅ Session management and security
- ✅ Password hashing with bcrypt

#### 📝 Citizen Reporting System

- ✅ Submit infrastructure issues (streetlights, roads, waste, traffic)
- ✅ Photo upload with automatic GPS location tagging
- ✅ Report status tracking (Open, In Progress, Resolved, Closed)
- ✅ Priority assignment (Low, Medium, High, Critical)
- ✅ Community voting on reports
- ✅ Admin dashboard for report management
- ✅ Real-time status updates

#### 🤖 AI Features

- ✅ Gemini 2.5 Flash-powered chatbot for air quality queries
- ✅ Natural language processing for user questions
- ✅ Context-aware responses with data citations
- ✅ Vector search for semantic report search (Pinecone)
- ✅ Intelligent report classification with NLP
- ✅ RAG (Retrieval-Augmented Generation) system
- ✅ Sentence embeddings for semantic matching

#### 🎨 User Interface

- ✅ Responsive web application (Mobile-first design)
- ✅ Interactive MapLibre GL map with clustering
- ✅ Real-time data visualization with Chart.js
- ✅ Modern UI with Tailwind CSS and Framer Motion
- ✅ Dark mode support
- ✅ Multi-language switcher component
- ✅ Accessibility features (WCAG 2.1 compliant)

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
✅ Just task runner         # Install: https://just.systems/
✅ Git                       # Version control
✅ 8GB RAM minimum
✅ 10GB free disk space

# Optional (auto-installed by `just install`)
📦 UV package manager        # Auto-installed
📦 Node.js 18+              # Auto-detected
📦 Python 3.10+             # Auto-detected
```

### ⚡ 3-Command Setup

```bash
# 1. Clone this release
git clone -b release/0.2.0 https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Install everything (UV + backend + frontend)
just install
# This automatically:
# - Installs UV package manager (if not present)
# - Installs 175 Python packages with uv sync
# - Installs 632 npm packages

# 3. Setup environment files
just setup-env
# Creates:
# - .env (backend configuration)
# - src/frontend/.env.local (frontend configuration)

# 4. Start development servers
just dev
# Starts:
# - Backend API (http://localhost:8000)
# - Frontend App (http://localhost:3000)
# - MongoDB + Orion-LD (via Docker Compose)
```

### 🔧 Environment Configuration

After running `just setup-env`, edit the created files:

**`.env` (Backend)**

```bash
# Database
MONGODB_URL="mongodb://localhost:27017"
DATABASE_NAME="urbanreflex"

# Authentication
SECRET_KEY="your-secret-key-here"  # Generate with: openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services (Optional - features disabled without these)
GEMINI_API_KEY="your-gemini-key"           # Required for chatbot
PINECONE_API_KEY="your-pinecone-key"       # Required for vector search
PINECONE_INDEX_NAME="urbanreflex-index"

# External APIs (Optional - falls back to mock data)
OPENAQ_API_KEY="your-openaq-key"
OWM_API_KEY="your-openweathermap-key"
```

**`src/frontend/.env.local` (Frontend)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OPENAQ_API_KEY=your-openaq-key
NEXT_PUBLIC_NGSI_LD_URL=http://localhost:1026
```

### ✅ Verify Installation

```bash
# Check backend health
curl http://localhost:8000/health
# Expected: {"service":"UrbanReflex","status":"running","version":"1.0.0"}

# Check frontend
open http://localhost:3000

# Check all services
just info
# Shows all running services and ports
```

---

## 📊 Demo Credentials

### 🔐 Pre-configured Test Accounts

```bash
# Admin Account (Full Access)
Email: admin@urbanreflex.dev
Password: Admin@123456
Role: Administrator
Permissions: Full system access, user management, report management

# City Official Account (Report Management)
Email: official@urbanreflex.dev
Password: Official@123456
Role: City Official
Permissions: Manage citizen reports, view analytics

# Citizen Account (Standard User)
Email: citizen@urbanreflex.dev
Password: Citizen@123456
Role: Citizen
Permissions: Submit reports, view data, use chatbot
```

### 🌐 Service URLs

```
Frontend Application:  http://localhost:3000
Backend API:           http://localhost:8000
API Documentation:     http://localhost:8000/docs
API Redoc:             http://localhost:8000/redoc
MongoDB:               localhost:27017
Orion Context Broker:  http://localhost:1026
```

---

## 🎪 Demo Scenarios

### Scenario 1: Quick Setup Test

```bash
# Test automatic installation
just install    # Should install UV + all dependencies
just setup-env  # Should create .env files
just dev        # Should start all services

# Verify all services running
just info       # Shows all ports and services
just health     # Checks backend health endpoint
```

### Scenario 2: Air Quality Monitoring

```
1. Visit http://localhost:3000
2. View global air quality map
3. Search for "Ho Chi Minh City" or any location
4. Click on a station marker
5. View detailed AQI data and charts
6. Check health recommendations
7. Switch language using language selector
```

### Scenario 3: Citizen Reporting

```
1. Login as citizen@urbanreflex.dev
2. Click "Report Issue" button
3. Fill in issue details:
   - Title: "Broken streetlight on Main Street"
   - Category: Streetlight
   - Priority: Medium
4. Upload photo (optional)
5. Click map to set location
6. Submit report
7. Track report status in dashboard
```

### Scenario 4: Admin Dashboard

```
1. Login as admin@urbanreflex.dev
2. Navigate to Admin Dashboard
3. View all citizen reports
4. Filter by status/priority/category
5. Assign report to city official
6. Update report status
7. Add resolution notes
8. View analytics and statistics
```

### Scenario 5: AI Chatbot

```
1. Click chatbot icon (bottom right)
2. Ask: "What's the air quality in Hanoi today?"
3. Chatbot provides real-time AQI data
4. Ask: "How does this affect my health?"
5. Receive personalized recommendations
6. Ask: "Show me historical trends"
7. Get data visualization links
```

---

## 📖 Documentation

### All Just Commands

```bash
# Installation & Setup
just install          # Install UV + backend deps + frontend deps (one command!)
just setup-env        # Create .env and src/frontend/.env.local from examples
just backend-install  # Install only backend dependencies
just frontend-install # Install only frontend dependencies

# Development
just dev             # Start backend + frontend + databases
just backend-dev     # Start backend only (port 8000)
just frontend-dev    # Start frontend only (port 3000)

# Database Management
just db-start        # Start MongoDB + Orion-LD containers
just db-stop         # Stop database containers
just db-logs         # View database logs

# Code Quality
just format          # Format all code (Black + Prettier)
just lint            # Run linters (Flake8 + ESLint)
just type-check      # Type checking (mypy + tsc)

# Utilities
just info            # Show project info (ports, services)
just health          # Check backend health endpoint
just clean           # Clean build artifacts and caches
just test            # Run all tests (backend + frontend)
```

### Project Structure

```
UrbanReflex/
├── src/
│   ├── backend/              # FastAPI Backend
│   │   ├── app.py            # Main application
│   │   ├── routers/          # API endpoints
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── ai_service/       # AI/ML services
│   │   └── utils/            # Utilities
│   └── frontend/             # Next.js Frontend
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── contexts/         # State management
│       └── lib/              # Utilities
├── scripts/                  # Data fetching/processing
├── docs/                     # Documentation
├── .justfile                 # Task automation
├── pyproject.toml            # Python dependencies
└── docker-compose.yml        # Service orchestration
```

### API Documentation

- **Interactive Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc (Alternative UI)
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### External Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Development Setup](./docs/DEVELOPMENT_SETUP.md)
- [Data Model & Entities](./docs/DATA_MODEL_AND_ENTITIES.md)

---

## 🐛 Known Issues

### ⚠️ Limitations in v0.2.0

1. **Performance**
   - Map clustering limited to 1000 markers for optimal performance
   - Large dataset queries (>10,000 records) may be slow
   - First load time can be 5-10 seconds

2. **Features Not Yet Implemented**
   - Real-time notifications (WebSocket support)
   - Email notifications system
   - SMS alerts
   - Mobile native app
   - Offline mode support
   - Multi-tenancy support

3. **Data Limitations**
   - Mock data used when external APIs unavailable
   - Historical data limited to 30 days in demo
   - Vector search requires Pinecone API key (optional)
   - Some international locations have limited data coverage

4. **Infrastructure**
   - No auto-scaling configured (single-instance deployment)
   - No automated backup/restore functionality
   - Limited monitoring/logging (basic logging only)
   - No CDN integration

5. **Browser Compatibility**
   - Optimized for Chrome/Edge/Firefox (latest versions)
   - Safari may have minor UI rendering issues
   - Internet Explorer not supported

### 🔧 Workarounds

- **Slow map loading**: Reduce zoom level, use location filters
- **Missing external data**: Enable mock data in backend settings
- **API rate limits**: Configure caching in `.env`
- **Docker port conflicts**: Edit `docker-compose.yml` ports section

---

## 🧪 Testing Guidelines

### For Testers

**Functional Testing Checklist:**

```bash
✅ User registration and login flow
✅ Create/Edit/Delete citizen reports
✅ Upload photos to reports (max 5MB)
✅ Search air quality by location name
✅ View historical data charts (12 months)
✅ Test chatbot with various queries
✅ Admin dashboard functionality
✅ API endpoint testing (via /docs)
✅ Mobile responsiveness (iPhone, Android)
✅ Cross-browser compatibility (Chrome, Firefox, Safari)
✅ Language switcher (12 languages)
✅ Role-based access control
```

**Performance Testing:**

```bash
# Load testing
- 100 concurrent users
- 1000+ map markers rendering
- Large file uploads (5MB+)
- Slow network conditions (3G simulation)

# Stress testing
- Continuous chatbot queries
- Rapid report submissions
- Database query optimization
```

**Security Testing:**

```bash
✅ Authentication flows (JWT validation)
✅ Authorization (role-based permissions)
✅ API rate limiting
✅ Input validation (XSS, SQL injection)
✅ CSRF protection
✅ Password strength requirements
```

### Reporting Issues

Found a bug? Please report it:

1. Go to [GitHub Issues](https://github.com/minhe51805/UrbanReflex/issues)
2. Use the **Bug Report** template
3. Include:
   - Version: v0.2.0
   - Just commands used
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/error logs
   - Browser/OS information
   - Output of `just info`

---

## 🔄 Upgrading from v0.1.0

### Migration Steps

```bash
# 1. Backup your data
docker-compose exec mongodb mongodump --out /backup

# 2. Fetch new version
git fetch origin
git checkout release/0.2.0

# 3. Update dependencies
just install  # Reinstalls with new versions

# 4. Update environment files
just setup-env  # Creates new structure
# Manually copy your API keys from old .env to new files

# 5. Restart services
docker-compose down
just dev

# 6. Verify migration
just health
open http://localhost:3000
```

### Breaking Changes from v0.1.0

1. **Environment Files**: Frontend env moved from root to `src/frontend/.env.local`
2. **Just Commands**: New automation recipes replace manual commands
3. **Models Package**: Backend models now properly packaged under `src.backend.models`
4. **Dependencies**: Next.js updated to 16.0.7, may require Node.js 18+

### New Features to Test

- Try `just install` for one-command setup
- Use `just setup-env` for dual environment creation
- Run `just info` to see all service ports
- Test `just health` for backend health checks

---

## 📞 Support & Help

### 🆘 Getting Help

- 📖 **Documentation**: [./docs/](./docs/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/minhe51805/UrbanReflex/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/minhe51805/UrbanReflex/issues)
- 📧 **Email**: support@urbanreflex.dev

### 🔍 Troubleshooting

**Common Issues:**

```bash
# Issue: "just: command not found"
# Solution: Install Just task runner
# Windows: winget install --id Casey.Just
# macOS: brew install just
# Linux: cargo install just

# Issue: "uv: command not found"
# Solution: Run `just install` - it auto-installs UV

# Issue: Backend won't start - "ModuleNotFoundError"
# Solution: Ensure you're in project root, run `just install`

# Issue: Frontend build errors
# Solution: Clear cache and reinstall
rm -rf src/frontend/.next src/frontend/node_modules
just frontend-install

# Issue: Port already in use
# Solution: Change ports in docker-compose.yml or kill process
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -ti:8000 | xargs kill

# Issue: Docker services won't start
# Solution: Reset Docker environment
docker-compose down -v
docker-compose up -d
just db-logs

# Issue: Environment files not found
# Solution: Run setup command
just setup-env
# Then edit .env and src/frontend/.env.local with your API keys
```

**Getting Logs:**

```bash
# Backend logs
just backend-dev  # Terminal output shows logs

# Frontend logs
just frontend-dev  # Terminal output shows logs

# Database logs
just db-logs

# All services
docker-compose logs -f
```

---

## 🤝 Contributing

We welcome contributions! See our [Development Guide](./docs/DEVELOPMENT_SETUP.md) for details.

### Quick Contribution Guide

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/UrbanReflex.git
cd UrbanReflex

# 2. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 3. Install dependencies
just install

# 4. Make changes and test
just format
just lint
just test

# 5. Commit with conventional commits
git commit -m "feat: add new feature"
# Types: feat, fix, docs, style, refactor, test, chore

# 6. Push and create PR
git push origin feature/your-feature-name
# Create PR on GitHub targeting develop branch
```

### Code Quality Standards

All code must pass:

- ✅ `just format` (Black + Prettier formatting)
- ✅ `just lint` (Flake8 + ESLint linting)
- ✅ `just type-check` (mypy + tsc type checking)
- ✅ `just test` (pytest + Jest testing)
- ✅ Pre-commit hooks (Husky automatically runs checks)

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

### Version 0.2.0 (2025-12-07) - Current Release

**Added:**

- Just task runner with 16+ automation recipes
- UV auto-installation in `just install`
- Dual environment setup (`just setup-env`)
- Models package (`src.backend.models`)
- Prettier 3.2.5 for frontend formatting
- Comprehensive troubleshooting documentation

**Changed:**

- Updated Next.js from 16.0.3 to 16.0.7
- Moved frontend environment to `src/frontend/.env.local`
- Simplified setup to 3 commands
- Improved README with accurate just commands

**Fixed:**

- `ModuleNotFoundError` for backend models package
- Just command PowerShell syntax errors
- Invalid `restart` recipe removed
- Gitignore configuration for models

See [v0.1.0 Release Notes](./RELEASE_NOTES_v0.1.0.md) for previous version.

---

## 🏫 Support & Organization

<p align="center">
    <a href="https://hutech.edu.vn/" target="_blank">
        <img loading="lazy" src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png" height="60px" alt="Hutech">
    </a>
    <a href="https://vfossa.vn/" target="_blank">
        <img loading="lazy" src="https://vfossa.vn/uploads/about/logo-6b-new.png" height="60px" alt="VFOSSA">
    </a>
    <a href="https://www.olp.vn/" target="_blank">
        <img loading="lazy" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePWbAslFDMVxeJCgHI6f_LSIuNOrlrEsEhA&s" height="60px" alt="OLP">
    </a>
</p>

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

**Key Points:**

- ✅ Free to use, modify, and distribute
- ✅ Source code must be made available
- ✅ Modifications must use same GPL-3.0 license
- ❌ No warranty provided
- 📖 Full license text: https://www.gnu.org/licenses/gpl-3.0.html

---

<div align="center">

**UrbanReflex v0.2.0 - Production Ready Release**

Built with ❤️ for Vietnam Open Source Software Competition

[🏠 Homepage](https://urbanreflex.dev) • [📚 Documentation](./docs/) • [🐛 Report Bug](https://github.com/minhe51805/UrbanReflex/issues) • [💬 Discussions](https://github.com/minhe51805/UrbanReflex/discussions)

**✨ Production-ready release with enhanced developer experience and automation**

</div>
