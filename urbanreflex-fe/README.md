# UrbanReflex

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<!-- Quick Start Badge -->
<div>
  <a href="#getting-started">
    <img alt="Quick Start Guide" src="https://img.shields.io/badge/Quick_Start-Get_Up_Running-blue?style=for-the-badge">
  </a>
</div>

## Introduction

<p align="justify">
  ⭐ UrbanReflex is a modern air quality monitoring platform inspired by OpenAQ. Built with Next.js 16 and TypeScript, it showcases best practices in cloud-native application development with interactive data visualization, real-time air quality monitoring, and comprehensive API management.
</p>

> [!WARNING]
>
> **Disclaimer**: This is a demo project for learning purposes. Some features may not be production-ready.

## Project Goals

- [x] Developed a cloud-native application using Next.js 16 with App Router
- [x] Implemented interactive air quality data visualization
- [x] Built comprehensive API management system 
  - [x] API Key generation and management
  - [x] RESTful API endpoints with OpenAPI documentation
  - [x] API authentication and validation
- [x] Created comprehensive admin dashboard
  - [x] Report management system
  - [x] Real-time statistics and monitoring
  - [x] User issue tracking
- [x] Implemented modern UI/UX
  - [x] Interactive map with real-time data
  - [x] Responsive design with Tailwind CSS
  - [x] Smooth animations with Framer Motion
- [x] Integrated authentication system
  - [x] Role-based access control
  - [x] Protected routes and components
- [x] Established comprehensive documentation
  - [x] API documentation with code examples
  - [x] Architecture documentation
  - [x] Deployment and testing guides
  - [x] Security best practices

## Project Architecture

The application follows a modern Next.js architecture with:

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **API Layer**: Next.js API Routes with RESTful design
- **Data Visualization**: MapLibre GL, Chart.js
- **Authentication**: Custom auth with role-based access
- **Documentation**: Comprehensive markdown docs with diagrams

For detailed architecture information, see [System Architecture](./docs/ARCHITECTURE.md).

## Features

### 🏠 Interactive Homepage
- Hero section with featured locations
- Real-time air quality data display
- Interactive map visualization
- Code examples for developers

### 🗺️ Map Explorer
- Interactive global air quality map
- Advanced filtering by location, parameters
- Real-time data updates
- Location detailed information modal

### 📊 Location Details
- Historical data visualization with charts
- Parameter-specific measurements
- AQI calculations and health recommendations
- Export data functionality

### 🔑 API Key Management
- Generate and manage API keys
- Toggle visibility and copy keys
- Track API usage statistics
- Secure key storage

### 👨‍💼 Admin Dashboard
- Report management system
- Real-time platform statistics
- User issue tracking
- Status and priority management

### 📚 Developer Portal
- Comprehensive API documentation
- Interactive code examples (cURL, JavaScript, Python, TypeScript)
- OpenAPI specification
- Testing guides

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Optional: [Docker](https://www.docker.com/) for containerized deployment

> [!NOTE]
>
> - 🔑 You'll need an [OpenAQ API key](https://docs.openaq.org/) for production data
> - 🌐 For local development, the app uses mock data from localStorage

### Installation

Follow these steps to get UrbanReflex running locally:

```sh
# 1. Clone the repository
git clone https://github.com/minhe51805/UrbanReflex.git

# 2. Navigate to the project directory
cd urbanreflex-fe

# 3. Install dependencies
npm install
# or
pnpm install

# 4. Create environment file
cp .env.example .env.local

# 5. Configure environment variables
# Edit .env.local and add your API keys

# 6. Run the development server
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAQ API Configuration
NEXT_PUBLIC_OPENAQ_API_KEY=your_openaq_api_key_here

# Application Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder. All documentation files provide detailed information about features, implementation, and best practices.

### Core Documentation
- **[Documentation Overview](./docs/README.md)** - Main documentation index with quick start guides
- **[Documentation Index](./docs/INDEX.md)** - Detailed table of contents for all docs
- **[Documentation Summary](./docs/DOCUMENTATION-SUMMARY.md)** - Complete summary of all documentation
- **[System Architecture](./docs/ARCHITECTURE.md)** - System architecture with diagrams and data flows
- **[Development Checklist](./docs/CHECKLIST.md)** - Complete checklists for development, testing, and deployment

### API Documentation
- **[API Endpoints](./docs/API-Endpoints.md)** - Complete API reference with all endpoints
- **[API Authentication](./docs/API-Authentication.md)** - Authentication system and API key usage
- **[API Key Management](./docs/API-Key-Management.md)** - API key management features and UI
- **[Code Examples](./docs/Code-Examples.md)** - Ready-to-use code examples (cURL, JavaScript, TypeScript, Python)

### Development Guides
- **[Testing Guide](./docs/Testing-Guide.md)** - Comprehensive testing guide (unit, integration, manual)
- **[Security Best Practices](./docs/Security-Best-Practices.md)** - Security guidelines and best practices

### Deployment & Admin
- **[Deployment Guide](./docs/Deployment-Guide.md)** - Step-by-step deployment instructions
- **[Admin Dashboard](./docs/ADMIN-DASHBOARD.md)** - Admin dashboard features and usage

### Quick Links
- 🚀 **New to the project?** Start with [Documentation Overview](./docs/README.md)
- 💻 **Want to integrate?** Check [Code Examples](./docs/Code-Examples.md)
- 🔐 **Security concerns?** Read [Security Best Practices](./docs/Security-Best-Practices.md)
- 🚢 **Ready to deploy?** Follow [Deployment Guide](./docs/Deployment-Guide.md)

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy UrbanReflex is using [Vercel](https://vercel.com/):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/urbanreflex)

1. Click the button above or run:
```sh
npx vercel
```

2. Configure environment variables in Vercel dashboard

3. Deploy!

For detailed deployment instructions, see [Deployment Guide](./docs/Deployment-Guide.md).

### Deploy with Docker

```sh
# Build the image
docker build -t urbanreflex .

# Run the container
docker run -p 3000:3000 urbanreflex
```

## Contribution

Thanks to all contributors! Your help is greatly appreciated!

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](./.github/CONTRIBUTING.md) for more details.

## Support

- ⭐ If you like this project, please give it a star on GitHub
- 🐛 If you find a bug, please [create an issue](https://github.com/yourusername/urbanreflex/issues/new)
- 💡 For feature requests, please [open a discussion](https://github.com/yourusername/urbanreflex/discussions)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
