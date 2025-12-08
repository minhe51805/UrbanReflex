<p align="center">
	<img loading="lazy" src="https://drive.google.com/uc?export=view&id=1GG28YjHys9I1DTv2HnXOtD6zD0zwUgrg" alt="UrbanReflex Logo" height="150">
</p>

<h1 align="center">UrbanReflex</h1>

<p align="center">
	A smart city intelligence platform that bridges fragmented urban data sources into a unified NGSI-LD ecosystem, empowering communities and city managers with real-time infrastructure insights and open data access
</p>

<p align="center">
  <a href="https://urbanreflex.org" rel="dofollow" target="blank"><strong>Explore the platform »</strong></a>
	<br/>
	<br/>
	<a href="https://github.com/minhe51805/UrbanReflex/issues/new?template=bug_report.yml">🐛 Report Bug</a>
	|
	<a href="https://github.com/minhe51805/UrbanReflex/issues/new?template=feature_request.yml">✨ Request Feature</a>
	|
	<a href="https://t.me/+o1X9iR9j7_czYmE1">💬 Join Discussion</a>
	|
	<a href="./docs/">📚 Documentation</a>
</p>

<p align="center">
	<a href="https://github.com/minhe51805/UrbanReflex/releases" target="blank">
		<img loading="lazy" src="https://img.shields.io/badge/version-0.2.0-blue.svg" alt="UrbanReflex version"/>
	</a>
	<a href="https://github.com/minhe51805/UrbanReflex/releases" target="blank">
		<img loading="lazy" src="https://img.shields.io/badge/release-Stable-green.svg" alt="Release Status"/>
	</a>
	<a href="https://github.com/minhe51805/UrbanReflex/issues" target="blank">
		<img loading="lazy" src="https://img.shields.io/github/issues/minhe51805/UrbanReflex?label=Issues" alt="UrbanReflex issues"/>
	</a>
	<a href="https://github.com/minhe51805/UrbanReflex/blob/main/LICENSE" target="blank">
		<img loading="lazy" src="https://img.shields.io/github/license/minhe51805/UrbanReflex?label=License" alt="UrbanReflex license"/>
	</a>
	<a href="https://fastapi.tiangolo.com/" target="blank">
		<img loading="lazy" src="https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi&logoColor=white" alt="FastAPI"/>
	</a>
	<a href="https://nextjs.org/" target="blank">
		<img loading="lazy" src="https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js&logoColor=white" alt="Next.js"/>
	</a>
	<a href="https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf" target="blank">
		<img loading="lazy" src="https://img.shields.io/badge/NGSI--LD-Compliant-00A3E0" alt="NGSI-LD"/>
	</a>
</p>

<img loading="lazy" src="https://lh3.googleusercontent.com/d/13S8-5iyJ0gnvT_wIFRnAVPxeNz8_7E5Q" alt="UrbanReflex Banner" width="100%">

---

## ✨ Highlights

- 🌍 **Real-time air quality and environmental monitoring** (NGSI-LD aligned)
- 📝 **Citizen-Powered Infrastructure Reporting** with photo uploads & geolocation
- 🤖 **Automated classification and prioritization** for city operations & RAG system
- 🏛️ **NGSI-LD Compliant Smart City Data Models** (ETSI standard)
- 📂 **Open Data Access** via public API & standard exports: **GeoJSON, NDJSON, CSV**
- ⚡ **One-Command Setup** with Just task runner & UV package manager
- 🔐 **Access control** for citizens, city staff, and admins

---

## 📋 Table of Contents

<details>
<summary>Expand contents</summary>

- [What is UrbanReflex?](#what-is-urbanreflex)
- [What's New in v0.2.0](#-whats-new-in-v020)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Demo Credentials](#-demo-credentials)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Just Commands Reference](#-just-commands-reference)
- [Documentation](#-documentation)
- [Project Status](#-project-status)
- [Contributing](#-contributing)
- [Support and Organization](#-support-and-organization)
- [License](#-license)

</details>

---

## What is UrbanReflex?

<p align="justify">
UrbanReflex is an open-source smart city platform designed to address critical urban challenges through integrated data-driven solutions, combining real-time environmental monitoring with citizen engagement tools for transparent, efficient urban governance.
</p>

<blockquote>
	<p align="justify">
Built on NGSI-LD standards, the platform unifies infrastructure data, air quality monitoring, and citizen reports into actionable intelligence. Through open data access, AI-powered analytics, and real-time insights, it enables communities and city managers to make informed decisions that drive sustainable urban development and transparent governance.
	</p>
</blockquote>

---

## 🆕 What's New in v0.2.0

This release focuses on **developer experience improvements**, **automation**, and **production readiness**.

### ⚡ One-Command Setup

- **Just Task Runner**: 16+ pre-configured recipes for all development tasks
- **UV Auto-Installation**: `just install` automatically installs UV + all dependencies
- **Dual Environment Setup**: Separate configuration for backend (`.env`) and frontend (`.env.local`)
- **Zero Configuration**: No manual dependency installation required

### 🌐 Multi-Language Support

- **12 Languages**: English, Vietnamese, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Hindi
- **Google Translate Integration**: Real-time UI translation without page reload
- **Language Persistence**: Selected preference stored in browser

### 🔧 Developer Experience

- **Updated Dependencies**: Next.js 16.0.7, Prettier 3.2.5
- **Code Quality Tools**: Black, Flake8, isort, ESLint, Prettier pre-configured
- **Pre-commit Hooks**: Automatic code quality checks with Husky
- **Comprehensive Documentation**: Complete setup guide with troubleshooting

### 🐛 Bug Fixes

- Fixed `ModuleNotFoundError` for backend models package
- Fixed Just command PowerShell syntax errors on Windows
- Fixed frontend environment file location

See [CHANGELOG.md](./CHANGELOG.md) for full release notes.

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
# ✅ Creates .env and src/frontend/.env.local from examples

# 5. Start all services (one command!)
just dev
# ✅ Starts MongoDB, Orion-LD, and Scheduler with Docker Compose
```

**Done!** 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Orion-LD**: http://localhost:1026

> **Note**: To run backend/frontend locally (without Docker), use separate terminals:
>
> ```bash
> just backend-dev    # Terminal 2: Backend dev server
> just frontend-dev   # Terminal 3: Frontend dev server
> ```

### Troubleshooting

<details>
<summary>❌ UV installation error on Windows</summary>

If `just install` fails with UV path errors:

```powershell
# Option 1: Restart terminal and try again
just install

# Option 2: Install backend separately
just backend-install

# Option 3: Manual UV installation
irm https://astral.sh/uv/install.ps1 | iex
# Restart terminal, then: uv sync --all-extras
```

</details>

<details>
<summary>❌ Database connection error</summary>

Make sure databases are running:

```bash
just db-start
just db-logs  # Check for errors
```

</details>

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

## 🛠️ Technology Stack

### Backend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| **FastAPI**      | High-performance async API framework    |
| **Python 3.10+** | Backend runtime                         |
| **MongoDB**      | Document database for users and reports |
| **Orion-LD**     | NGSI-LD compliant context broker        |
| **Redis**        | In-memory caching and sessions          |
| **Gemini AI**    | Natural language understanding          |
| **Pinecone**     | Vector search for semantic similarity   |

### Frontend

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| **Next.js 16**    | React framework with App Router |
| **TypeScript**    | Type-safe development           |
| **Tailwind CSS**  | Utility-first styling           |
| **MapLibre GL**   | Interactive WebGL mapping       |
| **Chart.js**      | Data visualization              |
| **Framer Motion** | Smooth UI animations            |

### Infrastructure

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| **Docker Compose** | Multi-service orchestration |
| **Just**           | Task automation             |
| **UV**             | Fast Python package manager |
| **Husky**          | Git hooks for code quality  |

---

## 📊 System Architecture

<img loading="lazy" src="https://media.discordapp.net/attachments/1048439092154740836/1447263130039357480/Gemini_Generated_Image_vht8b3vht8b3vht8.png?ex=6936fc53&is=6935aad3&hm=727d081965f355ce91da79f44b8067d930f44e06ec2cb5850f763d219f9435d1&=&format=webp&quality=lossless" alt="UrbanReflex Banner" width="100%">

---

## 📦 Project Structure

```
UrbanReflex/
├── src/
│   ├── backend/              # FastAPI Backend
│   │   ├── app.py            # Main application entry
│   │   ├── routers/          # API endpoint definitions
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── ai_service/       # Gemini AI & Pinecone integration
│   │   └── utils/            # Utility functions
│   └── frontend/             # Next.js 16 Frontend
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── contexts/         # State management
│       ├── lib/              # API clients & utilities
│       └── types/            # TypeScript definitions
├── scripts/                  # Data fetching & processing scripts
├── docs/                     # Project documentation
├── open_data/                # Open datasets (GeoJSON, NDJSON)
├── schemas/                  # JSON schemas for data validation
├── .justfile                 # Just task automation recipes
├── pyproject.toml            # Python dependencies (PEP 518)
├── docker-compose.yml        # Container orchestration
└── LICENSE                   # GPL-3.0 license
```

---

## 📜 Just Commands Reference

### Installation & Setup

```bash
just install          # Install UV + backend deps + frontend deps (one command!)
just setup-env        # Create .env and src/frontend/.env.local from examples
```

### Development

```bash
just dev              # Start databases + show instructions for backend/frontend
just backend-install  # Install backend dependencies only
just backend-dev      # Start backend API (port 8000)
just frontend-install # Install frontend dependencies only
just frontend-dev     # Start frontend app (port 3000)
```

### Database Management

```bash
just db-start         # Start MongoDB + Orion-LD
just db-stop          # Stop databases
just db-restart       # Restart databases
just db-logs          # View database logs
just db-clean         # Remove all database data (with confirmation)
```

### Code Quality

```bash
just format           # Format all code (Black + Prettier)
just lint             # Run linters (Flake8 + ESLint)
just test             # Run backend tests
```

### Utilities

```bash
just info             # Show project info, ports, and quick start guide
just health           # Check backend health endpoint
just clean            # Clean build artifacts and cache
just stop-all         # Stop all running services
just code             # Open project in VS Code
```

---

## 📖 Documentation

| Document                                         | Description                     |
| ------------------------------------------------ | ------------------------------- |
| [API Reference](./docs/API_REFERENCE.md)         | Complete REST API documentation |
| [Architecture](./docs/ARCHITECTURE.md)           | System design and components    |
| [Development Setup](./docs/DEVELOPMENT_SETUP.md) | Local development guide         |
| [Data Model](./docs/DATA_MODEL_AND_ENTITIES.md)  | NGSI-LD entity definitions      |
| [User Guide](./docs/USER_GUIDE.md)               | End-user manual                 |
| [Code Style Guide](./docs/CODE_STYLE_GUIDE.md)   | Coding conventions              |

---

## 🌟 Use Cases

### For Citizens

- Click any road segment on the map to view complete infrastructure information: weather conditions, air quality, streetlights, and nearby public facilities
- Report infrastructure issues (broken streetlights, potholes, waste dumping, flooding) with automatic GPS location and photo documentation
- Track real-time resolution status of submitted reports with automatic updates and notifications
- Explore open data to gain deeper insights about your neighborhood and make informed decisions

### For City Officials

- Real-time dashboard displaying all citizen reports on an interactive map with powerful filtering capabilities
- AI-powered automatic issue classification and priority adjustment based on proximity to schools, hospitals, and sensitive areas
- Data-driven task management and maintenance assignment, optimizing resource allocation and response times
- Export open data in multiple formats (NDJSON, CSV, GeoJSON) for deep analysis and urban planning

### For Developers

- Access complete NGSI-LD entities (RoadSegment, WeatherObserved, AirQualityObserved, Streetlight, PointOfInterest, CitizenReport) via standard REST API
- Build custom applications leveraging Linked Open Data (LOD) relationships between entities
- Integrate with other smart city systems through FiWARE Smart Data Models and SOSA/SSN ontology compliance
- Contribute to open-source smart city platform with comprehensive, ready-to-use open datasets

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

## 📈 Project Stats

<div align="center">

| Metric               | Badge                                                                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌟 **Stars**         | ![GitHub stars](https://img.shields.io/github/stars/minhe51805/UrbanReflex?style=social)                                                                                                                    |
| 🍴 **Forks**         | ![GitHub forks](https://img.shields.io/github/forks/minhe51805/UrbanReflex?style=social)                                                                                                                    |
| 👁️ **Watchers**      | ![GitHub watchers](https://img.shields.io/github/watchers/minhe51805/UrbanReflex?style=social)                                                                                                              |
| 👥 **Contributors**  | ![GitHub contributors](https://img.shields.io/github/contributors/minhe51805/UrbanReflex)                                                                                                                   |
| 📝 **Commits**       | ![GitHub commit activity](https://img.shields.io/github/commit-activity/t/minhe51805/UrbanReflex)                                                                                                           |
| 🐛 **Issues**        | ![GitHub issues](https://img.shields.io/github/issues/minhe51805/UrbanReflex) ![GitHub closed issues](https://img.shields.io/github/issues-closed/minhe51805/UrbanReflex?color=success)                     |
| 🎯 **Pull Requests** | ![GitHub pull requests](https://img.shields.io/github/issues-pr/minhe51805/UrbanReflex) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/minhe51805/UrbanReflex?color=success) |
| 📅 **Last Commit**   | ![GitHub last commit](https://img.shields.io/github/last-commit/minhe51805/UrbanReflex)                                                                                                                     |
| 📦 **Code Size**     | ![GitHub code size](https://img.shields.io/github/languages/code-size/minhe51805/UrbanReflex)                                                                                                               |
| 📜 **License**       | ![GitHub license](https://img.shields.io/github/license/minhe51805/UrbanReflex)                                                                                                                             |

</div>

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
