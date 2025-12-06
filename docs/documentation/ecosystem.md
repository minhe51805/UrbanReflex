---
title: Ecosystem
description: External integrations and services
---

# Ecosystem

UrbanReflex tích hợp với nhiều dịch vụ external để cung cấp dữ liệu thời gian thực.

---

## Overview

```
┌─────────────────────────────────────────────────────┐
│                   UrbanReflex                       │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Backend  │  │ Frontend │  │ Vector Database  │  │
│  │ (FastAPI)│◄─┤ (Next.js)│  │ (Pinecone)       │  │
│  └────┬─────┘  └──────────┘  └────────┬─────────┘  │
│       │                               │            │
└───────┼───────────────────────────────┼────────────┘
        │                               │
        ▼                               ▼
┌───────────────┐  ┌──────────────┐  ┌───────────────┐
│   OpenAQ      │  │  Orion-LD    │  │  Gemini AI    │
│ (Air Quality) │  │ (Context     │  │ (LLM)         │
│               │  │  Broker)     │  │               │
└───────────────┘  └──────────────┘  └───────────────┘
        │
        ▼
┌───────────────┐  ┌──────────────┐
│ OpenWeather   │  │ OpenStreetMap│
│ (Weather)     │  │ (POI Data)   │
└───────────────┘  └──────────────┘
```

---

## OpenAQ

**Air Quality Data Platform**

[OpenAQ](https://openaq.org/) cung cấp dữ liệu chất lượng không khí từ các trạm đo trên toàn thế giới.

### Configuration

```bash
# .env
OPENAQ_API_KEY="your-openaq-api-key"
```

### Usage

```python
from app.external import openaq_client

# Fetch stations
stations = await openaq_client.get_locations(
    country="VN",
    limit=100
)

# Get measurements
measurements = await openaq_client.get_measurements(
    location_id=12345,
    parameter="pm25",
    date_from="2025-12-01",
    date_to="2025-12-05"
)
```

### Data Format

```json
{
  "id": 12345,
  "name": "Ho Chi Minh City - District 1",
  "country": "VN",
  "city": "Ho Chi Minh City",
  "measurements": [
    {
      "parameter": "pm25",
      "value": 25.5,
      "unit": "µg/m³",
      "lastUpdated": "2025-12-04T10:00:00Z"
    }
  ]
}
```

### Resources

- [OpenAQ API Docs](https://docs.openaq.org/)
- [OpenAQ Explorer](https://explore.openaq.org/)

---

## Orion-LD Context Broker

**NGSI-LD Compliant Context Broker**

[Orion-LD](https://github.com/FIWARE/context.Orion-LD) là context broker của FIWARE, hỗ trợ NGSI-LD standard.

### Configuration

```bash
# .env
ORION_LD_URL="http://localhost:1026"
ORION_LD_USERNAME="urbanreflex_admin"
ORION_LD_PASSWORD="your-password"
```

### Docker Setup

```yaml
# docker-compose.yml
services:
  orion:
    image: fiware/orion-ld:1.5.1
    ports:
      - "1026:1026"
    depends_on:
      - mongo
    command: -dbhost mongo -logLevel DEBUG
```

### Usage

```python
from app.external import orion_client

# Create entity
await orion_client.create_entity({
    "id": "urn:ngsi-ld:Streetlight:001",
    "type": "Streetlight",
    "location": {
        "type": "GeoProperty",
        "value": {
            "type": "Point",
            "coordinates": [106.6951, 10.7769]
        }
    },
    "status": {
        "type": "Property",
        "value": "on"
    }
})

# Query entities
entities = await orion_client.get_entities(
    type="Streetlight",
    limit=50
)

# Update entity
await orion_client.update_entity(
    entity_id="urn:ngsi-ld:Streetlight:001",
    attrs={"status": {"type": "Property", "value": "off"}}
)
```

### Resources

- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf)
- [Orion-LD Documentation](https://github.com/FIWARE/context.Orion-LD/tree/develop/doc/manuals-ld)

---

## Pinecone

**Vector Database for AI Search**

[Pinecone](https://www.pinecone.io/) được sử dụng cho semantic search trong RAG chatbot.

### Configuration

```bash
# .env
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="urbanreflex-index"
PINECONE_ENVIRONMENT="gcp-starter"
```

### Usage

```python
from pinecone import Pinecone

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("urbanreflex-index")

# Upsert vectors
index.upsert(vectors=[
    {
        "id": "report_123",
        "values": embedding,  # 384-dim vector
        "metadata": {
            "type": "citizen_report",
            "title": "Broken streetlight",
            "category": "streetlight"
        }
    }
])

# Query
results = index.query(
    vector=query_embedding,
    top_k=5,
    include_metadata=True
)
```

### Resources

- [Pinecone Docs](https://docs.pinecone.io/)
- [Pinecone Python SDK](https://github.com/pinecone-io/pinecone-python-client)

---

## Gemini AI

**Large Language Model by Google**

[Gemini](https://ai.google.dev/) được sử dụng cho chatbot và natural language processing.

### Configuration

```bash
# .env
GEMINI_API_KEY="your-gemini-api-key"
```

### Usage

```python
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

# Generate response
response = model.generate_content(
    f"""Based on the following context, answer the user's question.
    
    Context: {context}
    
    Question: {user_question}
    """
)

print(response.text)
```

### Streaming

```python
# Streaming response
for chunk in model.generate_content(prompt, stream=True):
    print(chunk.text, end="")
```

### Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [Gemini Python SDK](https://github.com/google-gemini/generative-ai-python)

---

## OpenWeatherMap

**Weather Data API**

[OpenWeatherMap](https://openweathermap.org/) cung cấp dữ liệu thời tiết.

### Configuration

```bash
# .env
OWM_API_KEY="your-openweathermap-key"
```

### Usage

```python
import httpx

async def get_weather(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "lat": lat,
                "lon": lon,
                "appid": os.getenv("OWM_API_KEY"),
                "units": "metric"
            }
        )
        return response.json()

# Result
{
    "main": {
        "temp": 28.5,
        "humidity": 75
    },
    "wind": {
        "speed": 5.2
    }
}
```

---

## OpenStreetMap

**Geospatial Data**

[OpenStreetMap](https://www.openstreetmap.org/) cung cấp dữ liệu địa lý và POI.

### Usage via Overpass API

```python
import httpx

async def get_pois(lat: float, lon: float, radius: int = 500):
    query = f"""
    [out:json];
    (
        node["amenity"](around:{radius},{lat},{lon});
        way["highway"](around:{radius},{lat},{lon});
    );
    out body;
    """
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": query}
        )
        return response.json()
```

---

## Community Tools

### Data Processing

- [Pandas](https://pandas.pydata.org/) - Data manipulation
- [GeoPandas](https://geopandas.org/) - Geospatial data
- [Sentence Transformers](https://www.sbert.net/) - Text embeddings

### Monitoring

- [Prometheus](https://prometheus.io/) - Metrics collection
- [Grafana](https://grafana.com/) - Visualization
- [Sentry](https://sentry.io/) - Error tracking

### Development

- [Docker](https://www.docker.com/) - Containerization
- [uv](https://github.com/astral-sh/uv) - Python package manager
- [just](https://github.com/casey/just) - Task runner

---

<div align="center">

**[← Error Handling](./error-handling.md)** | **[Configuration →](./configuration.md)**

</div>
