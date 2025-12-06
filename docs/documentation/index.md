---
title: UrbanReflex
description: Enterprise-Grade Smart City Platform
---

# UrbanReflex

**Enterprise-Grade Smart City Platform** với AI-powered analytics và NGSI-LD compliance.

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NGSI-LD](https://img.shields.io/badge/NGSI--LD-Compliant-00A3E0)](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf)

</div>

---

## Introduction

UrbanReflex là một nền tảng Smart City toàn diện được thiết kế để thu thập, xử lý và trực quan hóa dữ liệu đô thị theo thời gian thực. Sử dụng kiến trúc NGSI-LD tiêu chuẩn của ETSI, platform cung cấp khả năng tích hợp linh hoạt với các hệ thống IoT và dịch vụ thành phố thông minh.

```python
# Quick Example - Get Air Quality Data
import httpx

async with httpx.AsyncClient() as client:
    response = await client.get(
        "https://api.urbanreflex.dev/v1/aqi/stations",
        headers={"X-API-Key": "your_api_key"}
    )
    stations = response.json()
    print(stations["results"][0]["name"])
```

---

## Features

- ✅ **Zero external dependencies** cho core API
- ✅ **NGSI-LD Compliant** - Tuân thủ tiêu chuẩn ETSI Smart City
- ✅ **Real-time Data** - Air quality, weather, traffic monitoring
- ✅ **AI-Powered** - RAG chatbot với Gemini AI
- ✅ **TypeScript Support** - Type-safe frontend với Next.js
- ✅ **Scalable Architecture** - Docker-ready, microservices design
- ✅ **Comprehensive API** - RESTful + WebSocket support
- ✅ **Developer Friendly** - Extensive documentation & examples

---

## Installation

```bash
# Clone repository
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# Setup environment
cp .env.example .env

# Install dependencies
just setup  # Or: uv sync && cd website && npm install

# Start development servers
just dev    # Backend: 8000, Frontend: 3000
```

---

## Requirements

- **Python** 3.10+
- **Node.js** 18+
- **Docker** & Docker Compose
- **MongoDB** 7.0+

### TypeScript Configuration

Bạn nên enable strict mode trong `tsconfig.json`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Quick Links

| Documentation | Description |
|---------------|-------------|
| [Getting Started](./getting-started.md) | Hướng dẫn cài đặt và setup |
| [Basic Usage](./basic-usage.md) | Các khái niệm cơ bản |
| [API Reference](./api.md) | Chi tiết tất cả API endpoints |
| [Data Models](./data-models.md) | NGSI-LD schemas và entities |
| [AI Services](./ai-services.md) | Chatbot, classification, RAG |
| [Authentication](./authentication.md) | JWT tokens và API keys |
| [Error Handling](./error-handling.md) | Xử lý lỗi và debugging |
| [Ecosystem](./ecosystem.md) | Tích hợp với external services |
| [Configuration](./configuration.md) | Environment variables |

---

## Ecosystem

UrbanReflex tích hợp với nhiều dịch vụ:

- [**OpenAQ**](https://openaq.org/) - Air quality data
- [**Orion-LD**](https://github.com/FIWARE/context.Orion-LD) - Context Broker
- [**Pinecone**](https://www.pinecone.io/) - Vector database
- [**Gemini AI**](https://ai.google.dev/) - LLM for chatbot

---

<div align="center">

**[Getting Started →](./getting-started.md)**

</div>
