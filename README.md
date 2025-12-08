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
✅ Just task runner    # https://just.systems/
✅ Docker Desktop      # https://www.docker.com/
✅ 8GB RAM minimum
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Install Just (if not already installed)
winget install Casey.Just  # Windows
brew install just          # macOS
cargo install just         # Linux

# 3. Install all dependencies (one command!)
just install
# ✅ Auto-installs UV, Python packages, npm packages

# 4. Setup environment files
just setup-env
# Edit .env and src/frontend/.env.local with your API keys (optional)

# 5. Start services (3 terminals)
just dev                # Terminal 1: Databases
just backend-dev        # Terminal 2: Backend
just frontend-dev       # Terminal 3: Frontend
```

**Done!** 🎉 Open http://localhost:3000

### Environment Variables (Optional)

<details>
<summary>Click to expand configuration</summary>

Edit `.env` for backend:

```bash
GEMINI_API_KEY=your-key        # For AI chatbot
PINECONE_API_KEY=your-key      # For vector search
OPENAQ_API_KEY=your-key        # For real air quality data
```

Edit `src/frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> App works without API keys (uses mock data)

</details>

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

## Contributing

### 📖 Contributing Guidelines

<p align="justify">
We are excited that you are interested in contributing to this project! Before submitting your contribution, please make sure to take a moment and read through the following guidelines:
</p>

<p align="justify">
Read through our <a href="./CONTRIBUTING.md">contributing guidelines</a> to learn about our submission process, coding rules, and more.
</p>

### 💁 Want to Help?

<p align="justify">
Want to report a bug, contribute some code, or improve the documentation? Excellent! Read up on our guidelines for <a href="./CONTRIBUTING.md">contributing</a> and then check out one of our issues labeled as <kbd><a href="https://github.com/minhe51805/UrbanReflex/labels/help%20wanted">help wanted</a></kbd> or <kbd><a href="https://github.com/minhe51805/UrbanReflex/labels/good%20first%20issue">good first issue</a></kbd>.
</p>

---

## Support and Organization

<p align="center">
	<a href="https://hutech.edu.vn/" target="_blank">
		<img loading="lazy" src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png" height="80px" alt="HUTECH University">
	</a>
	&nbsp;&nbsp;&nbsp;
	<a href="https://vfossa.vn/" target="_blank">
		<img loading="lazy" src="https://vfossa.vn/uploads/about/logo-6b-new.png" height="80px" alt="VFOSSA">
	</a>
	&nbsp;&nbsp;&nbsp;
	<a href="https://www.olp.vn/" target="_blank">
		<img loading="lazy" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePWbAslFDMVxeJCgHI6f_LSIuNOrlrEsEhA&s" height="80px" alt="Vietnam OLP">
	</a>
</p>

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

**Key Points:**

- ✅ Free to use, modify, and distribute
- ✅ Source code must be made available
- ✅ Modifications must use same GPL-3.0 license
- 📖 Full license: https://www.gnu.org/licenses/gpl-3.0.html

---

<div align="center">

**UrbanReflex v0.2.0** — Smart City Intelligence Platform

[🏠 Homepage](https://github.com/minhe51805/UrbanReflex) • [📚 Documentation](https://minhe51805.github.io/UrbanReflex/) • [🐛 Report Bug](https://github.com/minhe51805/UrbanReflex/issues) • [💬 Discussions](https://t.me/+o1X9iR9j7_czYmE1)

</div>
