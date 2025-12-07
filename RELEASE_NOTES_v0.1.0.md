# UrbanReflex v0.1.0 - Initial Beta Release

**Release Date**: December 4, 2025 | **Status**: Beta Testing | **License**: Apache 2.0

## 🎯 Overview

First public beta of UrbanReflex - a smart city platform for air quality monitoring and urban infrastructure management. Ready for testing and demonstration at Vietnam Open Source Software Competition.

## ✨ Key Features

- **Air Quality Monitoring**: Real-time AQI data, interactive map with 10,000+ stations, historical trends, health recommendations
- **Smart City Infrastructure**: NGSI-LD compliance, Orion Context Broker, road/streetlight monitoring, POI management
- **Citizen Reporting**: Submit issues with photos, status tracking, priority assignment, admin dashboard
- **AI Services**: Gemini chatbot, NLP queries, vector search (Pinecone), intelligent classification
- **User Management**: JWT auth, role-based access (Citizen/Admin/Official), API key support
- **Modern UI**: Responsive design, MapLibre GL, Chart.js visualization, dark mode, Tailwind CSS

## 🚀 Quick Start

```bash
# Clone and start
git clone -b v0.1.0 https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex
docker-compose up -d

# Access
Frontend: http://localhost:3000
API: http://localhost:8000
Docs: http://localhost:8000/docs
```

**Demo Accounts**: `admin@urbanreflex.dev` / `Admin@123456` | `citizen@urbanreflex.dev` / `Citizen@123456`

## 🐛 Known Limitations

- Map limited to 1000 markers, first load 5-10s
- No real-time notifications, email/SMS, mobile app, or offline mode
- Mock data fallback, 30-day historical limit
- Single-instance only, no auto-scaling or backups
- Optimized for Chrome/Edge/Firefox (Safari issues, no IE11)

## 🔧 Tech Stack

**Backend**: FastAPI, MongoDB, Orion (NGSI-LD), Redis, Gemini AI, Pinecone | **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, MapLibre GL | **Infra**: Docker Compose

## 🙏 Credits

**HUTECH University** | **VFOSSA** | **Vietnam OLP** | FastAPI, Next.js, MongoDB, OpenAQ, Gemini AI, FIWARE Orion

## ⚠️ Notice

Beta release for testing only. Not production-ready. APIs may change. Wait for v1.0.0 stable.

## 📞 Support

[Docs](./docs/) | [Issues](https://github.com/minhe51805/UrbanReflex/issues) | [Discussions](https://github.com/minhe51805/UrbanReflex/discussions) | support@urbanreflex.dev

---

**Built with ❤️ for Vietnam Open Source Software Competition**
