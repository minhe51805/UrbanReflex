# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive justfile for project automation
- Open source standard files (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- Enhanced .gitignore with comprehensive patterns

### Changed

- Renamed urbanreflex-fe folder to website for better clarity
- Updated .gitignore patterns to use website/ instead of urbanreflex-fe/

## [1.0.0] - 2025-12-04

### Added

- **Smart City Platform**: Complete NGSI-LD compliant smart city data platform
- **Air Quality Monitoring**: Real-time air quality data from OpenAQ with 10,000+ global stations
- **Interactive Maps**: MapLibre GL integration with clustering and advanced visualizations
- **AI-Powered Features**:
  - RAG-based chatbot using Google Gemini and Pinecone vector database
  - Automatic citizen report classification using NLP
  - POI-based priority scoring system
- **Admin Dashboard**: Comprehensive management interface for reports and analytics
- **API Framework**: FastAPI-based backend with JWT authentication
- **Data Integration**:
  - Weather data integration with OpenWeatherMap
  - Road network data from OpenStreetMap
  - Streetlight infrastructure management
  - Point of Interest (POI) data integration
- **Frontend**: Modern Next.js 16 + React 19 application with TypeScript
- **Developer Tools**:
  - API key management system
  - Interactive API documentation with Swagger
  - Testing utilities and endpoint validation
- **Infrastructure**:
  - Docker Compose setup with MongoDB and Orion-LD Context Broker
  - Automated data pipelines with APScheduler
  - NGSI-LD entity validation and transformation
- **Documentation**: Comprehensive documentation in multiple formats

### Backend Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: MongoDB integration with Motor async driver
- **AI Services**:
  - Chatbot with web crawling and RAG capabilities
  - Document embedding with FAISS and sentence transformers
  - Citizen report classification and prioritization
- **API Endpoints**:
  - User management and authentication
  - Chatbot interaction endpoints
  - Citizen report processing
  - Admin dashboard APIs

### Frontend Features

- **Pages**:
  - Homepage with air quality overview
  - Interactive map explorer (`/explore`)
  - Location detail pages (`/locations/[id]`)
  - Admin dashboard (`/admin`)
  - API documentation (`/api-docs`)
  - Real-time NGSI-LD data viewer (`/live-data`)
- **Components**:
  - Responsive design with Tailwind CSS
  - Interactive maps with MapLibre GL
  - Data visualizations with Chart.js
  - Real-time updates and animations
- **Data Visualization**:
  - Air quality measurements with color-coded indicators
  - Time series charts for historical data
  - Clustering for large datasets
  - Responsive data tables

### Data Pipeline Features

- **Data Collection Scripts**:
  - OpenAQ air quality data fetcher
  - OpenWeatherMap weather data integration
  - OpenStreetMap road and POI data extraction
  - Synthetic streetlight data generation
- **Data Transformation**:
  - NGSI-LD entity transformation
  - Data validation and schema compliance
  - GeoJSON and NDJSON export capabilities
- **Automation**:
  - Scheduled data updates with APScheduler
  - Automated seeding to Orion-LD Context Broker
  - Export to open data formats

### Technical Specifications

- **Backend**: FastAPI 0.121.2+, Python 3.10+
- **Frontend**: Next.js 16.0, React 19.2, TypeScript 5
- **Database**: MongoDB 4.4 with Orion-LD 1.5.1
- **AI/ML**: Google Gemini AI, Pinecone vector database, FAISS
- **Styling**: Tailwind CSS 3.4
- **Maps**: MapLibre GL 5.12
- **Charts**: Chart.js 4.5
- **Authentication**: JWT with python-jose
- **Validation**: Pydantic models with comprehensive schemas

### Infrastructure

- **Containerization**: Docker Compose setup
- **Services**: MongoDB, Orion-LD Context Broker, Scheduler service
- **Development**: Hot reload for both frontend and backend
- **Production**: Optimized builds and deployment configurations

## [0.1.0] - 2025-11-13

### Added

- Initial project setup
- Basic FastAPI backend structure
- Next.js frontend foundation
- Docker infrastructure setup
- Basic data collection scripts
- Initial documentation

---

## Version History

- **1.0.0** (2025-12-04): Complete smart city platform with AI features
- **0.1.0** (2025-11-13): Initial release

## Migration Guide

### From 0.1.x to 1.0.0

This is a major release with significant changes:

1. **Folder Structure**: `urbanreflex-fe` renamed to `website`
2. **Dependencies**: Updated to latest versions (Next.js 16, React 19)
3. **New Features**: AI chatbot, admin dashboard, comprehensive API
4. **Environment Variables**: New variables for AI services and authentication

#### Breaking Changes

- Environment variable structure updated
- API endpoints reorganized
- Database schema changes for user management

#### Migration Steps

1. Update folder references from `urbanreflex-fe` to `website`
2. Update environment variables (see `.env.example`)
3. Run database migrations if upgrading existing installation
4. Update any custom integrations to use new API structure

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

For questions and support:

- Create an issue on [GitHub Issues](https://github.com/minhe51805/UrbanReflex/issues)
- Check the [Documentation](docs/)
- Join discussions on [GitHub Discussions](https://github.com/minhe51805/UrbanReflex/discussions)
