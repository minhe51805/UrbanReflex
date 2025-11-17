# Infrastructure Setup

This document describes the infrastructure components and setup process for UrbanReflex.

---

## Overview

UrbanReflex uses a containerized architecture with:
- **MongoDB 4.4** - Data storage backend
- **Orion-LD 1.5.1** - NGSI-LD Context Broker
- **Python 3.9+** - Data processing environment

All services are managed via Docker Compose for easy deployment.

---

## Prerequisites

- Docker 20.10+
- Docker Compose 1.29+
- Python 3.9+
- Git

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/UrbanReflex.git
cd UrbanReflex
```

### 2. Configure Environment

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` and set required values:
```bash
OWM_API_KEY=your_openweathermap_key
OPENAQ_API_KEY=your_openaq_key
MONGO_ROOT_USERNAME=your_username
MONGO_ROOT_PASSWORD=your_password
```

### 3. Install Python Dependencies

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start Services

```bash
docker-compose up -d
```

### 5. Verify Installation

```bash
# Check Orion-LD is running
curl http://localhost:1026/version
```

Expected output:
```json
{
  "orionld version": "1.5.1",
  "orion version": "post-v3.10.1",
  "based on orion": "3.10.1"
}
```

---

## Architecture

```
┌─────────────────┐
│   Python Apps   │  Data collection & transformation scripts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Orion-LD      │  NGSI-LD Context Broker (port 1026)
│   v1.5.1        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MongoDB       │  NoSQL database (port 27017)
│   v4.4          │
└─────────────────┘
```

---

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OWM_API_KEY` | OpenWeatherMap API key | Yes | - |
| `OPENAQ_API_KEY` | OpenAQ API key | Yes | - |
| `MONGO_ROOT_USERNAME` | MongoDB username | Yes | - |
| `MONGO_ROOT_PASSWORD` | MongoDB password | Yes | - |
| `MONGO_DATABASE` | Database name | No | `urbandb` |
| `ORION_LD_URL` | Orion-LD endpoint | No | `http://localhost:1026` |

### Getting API Keys

**OpenWeatherMap:**
1. Sign up at [openweathermap.org](https://openweathermap.org/)
2. Navigate to API Keys section
3. Generate new key (free tier available)

**OpenAQ:**
1. Sign up at [openaq.org](https://openaq.org/)
2. Request API access
3. Copy API key from dashboard

---

## Data Model

UrbanReflex implements NGSI-LD data model with the following entity types:

- **RoadSegment** - Road network segments
- **WeatherObserved** - Weather measurements
- **AirQualityObserved** - Air quality data
- **Streetlight** - Public lighting infrastructure
- **PointOfInterest** - Public facilities (schools, hospitals, parks)
- **CitizenReport** - User-submitted reports

See `config/data_model.py` for implementation details.

---

## Docker Services

### MongoDB

```yaml
Image: mongo:6.0
Port: 27017 (localhost)
Volume: mongodata_urbanreflex
Authentication: Required
```

**Access:**
```bash
docker exec -it urbanreflex-mongo mongosh \
  -u your_username -p your_password
```

### Orion-LD

```yaml
Image: fiware/orion-ld:1.5.1
Port: 1026 (public)
Depends on: MongoDB
Healthcheck: Enabled
```

**API Endpoints:**
- `GET /version` - Service version
- `GET /ngsi-ld/v1/entities` - List entities
- `POST /ngsi-ld/v1/entities` - Create entity
- Full NGSI-LD v1 API support

---

## Development

### Project Structure

```
UrbanReflex/
├── config/           # Configuration modules
├── docs/             # Documentation
├── examples/         # NGSI-LD examples
├── schemas/          # FiWARE validation schemas
├── scripts/          # Data collection scripts
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

### Helper Functions

The `config/data_model.py` module provides helpers for creating NGSI-LD entities:

```python
from config.data_model import (
    create_property,
    create_geo_property,
    create_relationship
)

# Create NGSI-LD property
temperature = create_property(
    value=28.5,
    unit_code="CEL",
    observed_at="2025-11-15T08:00:00Z"
)

# Create geo property
location = create_geo_property(
    coordinates=[106.7008, 10.7747],
    geo_type="Point"
)

# Create relationship
ref = create_relationship("urn:ngsi-ld:RoadSegment:HCMC-001")
```

---

## API Usage Examples

### Create Entity

```bash
curl -X POST http://localhost:1026/ngsi-ld/v1/entities \
  -H "Content-Type: application/ld+json" \
  -d @examples/example_weather_observed.json
```

### Query Entities

```bash
# Get all entities
curl http://localhost:1026/ngsi-ld/v1/entities

# Get specific entity type
curl http://localhost:1026/ngsi-ld/v1/entities?type=WeatherObserved

# Get entity by ID
curl http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:WeatherObserved:HCMC-001
```

### Update Entity

```bash
curl -X PATCH http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:WeatherObserved:HCMC-001/attrs \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": {
      "type": "Property",
      "value": 29.5,
      "unitCode": "CEL"
    }
  }'
```

---

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

### Connection errors

```bash
# Verify services are healthy
docker-compose ps

# Check MongoDB connection
docker exec urbanreflex-mongo mongosh --eval "db.version()"

# Check Orion-LD
curl http://localhost:1026/version
```

### Port conflicts

If ports 1026 or 27017 are already in use:

```yaml
# Edit docker-compose.yml
ports:
  - "3026:1026"  # Change external port
```

---

## Production Deployment

For production deployment:

1. **Use strong passwords** - Generate random passwords (16+ characters)
2. **Enable firewall** - Restrict access to necessary ports only
3. **Use SSL/TLS** - Configure HTTPS for Orion-LD API
4. **Regular backups** - Backup MongoDB data regularly
5. **Monitor logs** - Set up log aggregation and monitoring

See VPS deployment guides for detailed production setup.

---

## Standards Compliance

UrbanReflex implements the following standards:

- **NGSI-LD v1.6.1** - ETSI GS CIM 009
- **FiWARE Smart Data Models** - Official schemas
- **SOSA/SSN Ontology** - W3C sensor ontology
- **JSON-LD** - W3C linked data format

---

## Resources

- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/)
- [FiWARE Orion-LD](https://github.com/FIWARE/context.Orion-LD)
- [Smart Data Models](https://smartdatamodels.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

## License

See LICENSE file for details.

## Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.
