# Data Model and Entities

This document describes the NGSI-LD data model and entity types used in UrbanReflex for managing smart city data in Ho Chi Minh City.

## Table of Contents

- [Overview](#overview)
- [NGSI-LD Basics](#ngsi-ld-basics)
- [Core Entity Types](#core-entity-types)
- [Entity Relationships](#entity-relationships)
- [Spatial Properties](#spatial-properties)
- [Temporal Properties](#temporal-properties)
- [Data Standards](#data-standards)
- [Examples](#examples)

---

## Overview

UrbanReflex uses NGSI-LD as the foundation for its data model. NGSI-LD is a standardized API and information model for context information management, developed by ETSI and adopted by FIWARE.

**Key Benefits**:

- Standardized data representation
- Interoperability with FIWARE ecosystem
- Support for linked data (JSON-LD)
- Built-in spatial and temporal capabilities
- Relationship management between entities

**Data Model Philosophy**:

- Reuse existing FIWARE data models where possible
- Extend with custom properties when needed
- Maintain compatibility with NGSI-LD specification
- Use RoadSegment as the central linking entity

---

## NGSI-LD Basics

### Entity Structure

Every NGSI-LD entity has the following core elements:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:EntityType:uniqueId",
  "type": "EntityType",
  "propertyName": {
    "type": "Property",
    "value": "property value"
  },
  "relationshipName": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RelatedEntity:id"
  },
  "locationName": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  }
}
```

**Core Components**:

- `@context`: JSON-LD context defining namespaces
- `id`: Unique identifier (URN format)
- `type`: Entity type name
- Properties: Attributes with values
- Relationships: Links to other entities
- GeoProperties: Spatial data

### Property Types

**Property**:

- Represents an attribute with a value
- Can include metadata (unit, observedAt, etc.)

```json
"temperature": {
  "type": "Property",
  "value": 28.5,
  "unitCode": "CEL",
  "observedAt": "2025-12-08T10:00:00Z"
}
```

**Relationship**:

- Links to another entity
- Points to entity by ID

```json
"refRoadSegment": {
  "type": "Relationship",
  "object": "urn:ngsi-ld:RoadSegment:HoChiMinh-001"
}
```

**GeoProperty**:

- Geographic data in GeoJSON format
- Supports Point, LineString, Polygon

```json
"location": {
  "type": "GeoProperty",
  "value": {
    "type": "Point",
    "coordinates": [106.7009, 10.7756]
  }
}
```

---

## Core Entity Types

UrbanReflex uses the following main entity types, organized around RoadSegment as the central entity.

### 1. RoadSegment

Represents logical segments of the road network in Ho Chi Minh City.

**Based On**: FIWARE dataModel.Transportation/RoadSegment

**Purpose**: Backbone for linking infrastructure, environmental data, and citizen reports

**Key Properties**:

- `name`: Street name
- `location`: LineString geometry of the road
- `roadClass`: Type of road (primary, secondary, residential)
- `length`: Road segment length in meters
- `width`: Road width in meters
- `laneCount`: Number of lanes
- `surfaceType`: Road surface material
- `maxSpeed`: Speed limit

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001",
  "type": "RoadSegment",
  "name": {
    "type": "Property",
    "value": "Nguyen Hue Boulevard"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "LineString",
      "coordinates": [
        [106.7009, 10.7756],
        [106.7015, 10.7762],
        [106.7021, 10.7768]
      ]
    }
  },
  "roadClass": {
    "type": "Property",
    "value": "primary"
  },
  "length": {
    "type": "Property",
    "value": 450,
    "unitCode": "MTR"
  },
  "width": {
    "type": "Property",
    "value": 24,
    "unitCode": "MTR"
  },
  "laneCount": {
    "type": "Property",
    "value": 4
  },
  "surfaceType": {
    "type": "Property",
    "value": "asphalt"
  },
  "maxSpeed": {
    "type": "Property",
    "value": 40,
    "unitCode": "KMH"
  }
}
```

### 2. Streetlight

Street lighting infrastructure located along road segments.

**Based On**: FIWARE dataModel.Streetlighting/Streetlight

**Purpose**: Monitor and manage public lighting infrastructure

**Key Properties**:

- `location`: Point geometry of lamp position
- `refRoadSegment`: Link to associated road
- `status`: on, off, defective
- `powerState`: Current power consumption
- `lampType`: LED, sodium vapor, etc.
- `luminousFlux`: Light output in lumens
- `installationDate`: When installed

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:Streetlight:HoChiMinh-001",
  "type": "Streetlight",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "refRoadSegment": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001"
  },
  "status": {
    "type": "Property",
    "value": "on",
    "observedAt": "2025-12-08T20:00:00Z"
  },
  "powerState": {
    "type": "Property",
    "value": 45,
    "unitCode": "WTT"
  },
  "lampType": {
    "type": "Property",
    "value": "LED"
  },
  "luminousFlux": {
    "type": "Property",
    "value": 3000,
    "unitCode": "LUM"
  },
  "installationDate": {
    "type": "Property",
    "value": "2023-05-15T00:00:00Z"
  }
}
```

### 3. WeatherObserved

Weather observations for locations in the city.

**Based On**: FIWARE dataModel.Weather/WeatherObserved

**Purpose**: Track weather conditions affecting urban environment

**Key Properties**:

- `location`: Point geometry of observation
- `temperature`: Temperature in Celsius
- `humidity`: Relative humidity percentage
- `pressure`: Atmospheric pressure
- `windSpeed`: Wind speed in km/h
- `precipitation`: Rainfall in mm
- `dateObserved`: Observation timestamp

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:WeatherObserved:HoChiMinh-District1-20251208",
  "type": "WeatherObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "temperature": {
    "type": "Property",
    "value": 32.5,
    "unitCode": "CEL",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "humidity": {
    "type": "Property",
    "value": 75,
    "unitCode": "P1",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "pressure": {
    "type": "Property",
    "value": 1013,
    "unitCode": "HPA",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "windSpeed": {
    "type": "Property",
    "value": 12,
    "unitCode": "KMH",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "precipitation": {
    "type": "Property",
    "value": 0,
    "unitCode": "MMT",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "dateObserved": {
    "type": "Property",
    "value": "2025-12-08T14:00:00Z"
  }
}
```

### 4. AirQualityObserved

Air quality measurements for locations in the city.

**Based On**: FIWARE dataModel.Environment/AirQualityObserved

**Purpose**: Monitor air pollution and environmental health

**Key Properties**:

- `location`: Point geometry of monitoring station
- `pm25`: PM2.5 concentration in µg/m³
- `pm10`: PM10 concentration in µg/m³
- `no2`: Nitrogen dioxide concentration
- `o3`: Ozone concentration
- `co`: Carbon monoxide concentration
- `so2`: Sulfur dioxide concentration
- `aqi`: Air Quality Index
- `dateObserved`: Observation timestamp

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:AirQualityObserved:HoChiMinh-District1-20251208",
  "type": "AirQualityObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "pm25": {
    "type": "Property",
    "value": 35.2,
    "unitCode": "GQ",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "pm10": {
    "type": "Property",
    "value": 58.7,
    "unitCode": "GQ",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "no2": {
    "type": "Property",
    "value": 42.1,
    "unitCode": "GQ",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "o3": {
    "type": "Property",
    "value": 28.5,
    "unitCode": "GQ",
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "aqi": {
    "type": "Property",
    "value": 87,
    "observedAt": "2025-12-08T14:00:00Z"
  },
  "dateObserved": {
    "type": "Property",
    "value": "2025-12-08T14:00:00Z"
  }
}
```

### 5. PointOfInterest

Points of interest such as schools, hospitals, parks, and public facilities.

**Based On**: FIWARE dataModel.PointOfInterest/PointOfInterest

**Purpose**: Map important locations affecting urban planning and citizen reports

**Key Properties**:

- `name`: Name of the POI
- `location`: Point geometry
- `category`: Type (hospital, school, park, etc.)
- `address`: Physical address
- `contactPoint`: Contact information
- `openingHours`: Operating hours

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:PointOfInterest:HoChiMinh-Hospital-District1",
  "type": "PointOfInterest",
  "name": {
    "type": "Property",
    "value": "District 1 General Hospital"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "category": {
    "type": "Property",
    "value": ["hospital", "healthcare"]
  },
  "address": {
    "type": "Property",
    "value": {
      "streetAddress": "123 Nguyen Hue Boulevard",
      "addressLocality": "District 1",
      "addressRegion": "Ho Chi Minh City",
      "postalCode": "700000",
      "addressCountry": "VN"
    }
  },
  "contactPoint": {
    "type": "Property",
    "value": {
      "telephone": "+84-28-1234567",
      "email": "info@district1hospital.vn"
    }
  },
  "openingHours": {
    "type": "Property",
    "value": "Mo-Su 00:00-24:00"
  }
}
```

### 6. CitizenReport

Reports created by citizens about infrastructure or environmental issues.

**Based On**: NGSI-LD core + project-specific fields

**Purpose**: Enable citizen participation in urban monitoring

**Key Properties**:

- `description`: Report description
- `location`: Point geometry of issue
- `category`: Issue category (infrastructure, environment, safety, etc.)
- `priority`: low, medium, high, critical
- `status`: pending, in_progress, resolved, rejected
- `refRoadSegment`: Related road segment
- `reportedBy`: User who created report
- `images`: Attached images
- `assignedTo`: Responsible agency

**Example**:

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:CitizenReport:HoChiMinh-001",
  "type": "CitizenReport",
  "description": {
    "type": "Property",
    "value": "Large pothole on Nguyen Hue Boulevard causing traffic issues and vehicle damage"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "category": {
    "type": "Property",
    "value": "infrastructure"
  },
  "priority": {
    "type": "Property",
    "value": "high"
  },
  "status": {
    "type": "Property",
    "value": "pending"
  },
  "refRoadSegment": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001"
  },
  "reportedBy": {
    "type": "Property",
    "value": "user@example.com"
  },
  "images": {
    "type": "Property",
    "value": [
      "https://storage.urbanreflex.dev/reports/report-001-image1.jpg",
      "https://storage.urbanreflex.dev/reports/report-001-image2.jpg"
    ]
  },
  "assignedTo": {
    "type": "Property",
    "value": "maintenance@hcmc.gov.vn"
  },
  "createdAt": "2025-12-08T10:00:00Z",
  "modifiedAt": "2025-12-08T10:30:00Z"
}
```

---

## Entity Relationships

The data model is organized around RoadSegment as the central linking entity.

### Relationship Diagram

```
                    ┌─────────────────┐
                    │   RoadSegment   │
                    │  (Central Hub)  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Streetlight  │ │CitizenReport │ │PointOfInterest│
    │refRoadSegment│ │refRoadSegment│ │  near road   │
    └──────────────┘ └──────────────┘ └──────────────┘
            │                │                │
            ▼                ▼                ▼
    (Infrastructure)    (Issues)         (Context)

            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │WeatherObserved│ │AirQualityObserved│ (Other data)
    │  observes     │ │   observes   │
    │  road area   │ │  road area   │
    └──────────────┘ └──────────────┘
```

### Relationship Types

**1. Direct References (Relationship type)**

- `Streetlight.refRoadSegment` → `RoadSegment`
- `CitizenReport.refRoadSegment` → `RoadSegment`

**2. Proximity-Based (Spatial queries)**

- `PointOfInterest` near `RoadSegment` (via geo-query)
- `WeatherObserved` affecting `RoadSegment` area
- `AirQualityObserved` measuring `RoadSegment` area

**3. Temporal Associations**

- Multiple observations over time for same location
- Historical data linked by entity ID and timestamp

### Querying Relationships

**Get all Streetlights for a Road**:

```http
GET /ngsi-ld/v1/entities?type=Streetlight&q=refRoadSegment=="urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001"
```

**Get nearby POIs (within 500m of a point)**:

```http
GET /ngsi-ld/v1/entities?type=PointOfInterest&georel=near;maxDistance==500&geometry=Point&coordinates=[106.7009,10.7756]
```

**Get all reports for a road segment**:

```http
GET /ngsi-ld/v1/entities?type=CitizenReport&q=refRoadSegment=="urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001"
```

---

## Spatial Properties

All spatial entities use NGSI-LD compatible GeoJSON geometries.

### Geometry Types

**Point** - Single location (POIs, sensors):

```json
"location": {
  "type": "GeoProperty",
  "value": {
    "type": "Point",
    "coordinates": [106.7009, 10.7756]
  }
}
```

**LineString** - Road segments, routes:

```json
"location": {
  "type": "GeoProperty",
  "value": {
    "type": "LineString",
    "coordinates": [
      [106.7009, 10.7756],
      [106.7015, 10.7762],
      [106.7021, 10.7768]
    ]
  }
}
```

**Polygon** - Areas, districts:

```json
"location": {
  "type": "GeoProperty",
  "value": {
    "type": "Polygon",
    "coordinates": [[
      [106.7000, 10.7750],
      [106.7020, 10.7750],
      [106.7020, 10.7770],
      [106.7000, 10.7770],
      [106.7000, 10.7750]
    ]]
  }
}
```

### Coordinate System

- **Format**: [longitude, latitude]
- **Coordinate Reference System**: WGS84 (EPSG:4326)
- **Precision**: 6 decimal places (approximately 0.1 meter accuracy)

### Spatial Queries

**Near (within distance)**:

```http
GET /ngsi-ld/v1/entities?georel=near;maxDistance==1000&geometry=Point&coordinates=[106.7009,10.7756]
```

**Within area**:

```http
GET /ngsi-ld/v1/entities?georel=within&geometry=Polygon&coordinates=[[[106.7,10.77],[106.71,10.77],[106.71,10.78],[106.7,10.78],[106.7,10.77]]]
```

**Intersects (for roads)**:

```http
GET /ngsi-ld/v1/entities?georel=intersects&geometry=LineString&coordinates=[[106.7,10.77],[106.71,10.78]]
```

---

## Temporal Properties

### Observation Timestamps

Observation entities include temporal attributes:

**dateObserved** - When observation was made:

```json
"dateObserved": {
  "type": "Property",
  "value": "2025-12-08T14:00:00Z"
}
```

**observedAt** - Per-property observation time:

```json
"temperature": {
  "type": "Property",
  "value": 32.5,
  "observedAt": "2025-12-08T14:00:00Z"
}
```

### Entity Lifecycle

**createdAt** - Entity creation time (auto-generated):

```json
"createdAt": "2025-12-08T10:00:00Z"
```

**modifiedAt** - Last update time (auto-updated):

```json
"modifiedAt": "2025-12-08T10:30:00Z"
```

### Temporal Queries

**After timestamp**:

```http
GET /ngsi-ld/v1/temporal/entities?type=AirQualityObserved&timerel=after&timeAt=2025-12-01T00:00:00Z
```

**Before timestamp**:

```http
GET /ngsi-ld/v1/temporal/entities?type=WeatherObserved&timerel=before&timeAt=2025-12-08T23:59:59Z
```

**Between timestamps**:

```http
GET /ngsi-ld/v1/temporal/entities?type=AirQualityObserved&timerel=between&timeAt=2025-12-01T00:00:00Z&endTimeAt=2025-12-08T23:59:59Z
```

---

## Data Standards

### Naming Conventions

**Entity IDs**:

- Format: `urn:ngsi-ld:EntityType:UniqueIdentifier`
- Example: `urn:ngsi-ld:RoadSegment:HoChiMinh-NguyenHue-001`

**Property Names**:

- camelCase: `refRoadSegment`, `dateObserved`
- Descriptive: `temperature`, `humidity`
- Consistent with FIWARE models

**Unit Codes**:

- Use UN/CEFACT codes
- Examples: `CEL` (Celsius), `MTR` (meters), `KMH` (km/h)

### Validation

**JSON Schema Validation**:

- All entities validated against JSON schemas
- Located in `schemas/` directory
- Enforced before insertion to Orion-LD

**Example Schema Usage**:

```bash
# Validate entity before insertion
python scripts/validate_entities.py examples/example_citizen_report.json
```

### Context Files

**JSON-LD Contexts**:

- Define semantic meaning of properties
- Located in `docs/jsonld/`
- Referenced in `@context` field

**Example Context**:

```json
{
  "@context": {
    "location": "https://uri.etsi.org/ngsi-ld/location",
    "refRoadSegment": "https://smartdatamodels.org/refRoadSegment",
    "dateObserved": "https://smartdatamodels.org/dateObserved"
  }
}
```

---

## Examples

### Complete Examples

Full entity examples are available in the `examples/` directory:

- `example_road_segment.json` - Road segment with full properties
- `example_streetlight.json` - Streetlight with monitoring data
- `example_weather_observed.json` - Weather observation
- `example_air_quality_observed.json` - Air quality measurement
- `example_point_of_interest.json` - POI with contact info
- `example_citizen_report.json` - Citizen report with classification

### Open Data Exports

Pre-generated datasets in `open_data/`:

- `RoadSegment.geojson` - All road segments
- `Streetlight.geojson` - All streetlights
- `WeatherObserved.geojson` - Weather observations
- `AirQualityObserved.geojson` - Air quality data
- `PointOfInterest.geojson` - Points of interest
- `CitizenReport.geojson` - Citizen reports

Also available in NDJSON format for bulk import.

### Using the Data Model

**1. View Examples**:

```bash
cat examples/example_citizen_report.json
```

**2. Validate Entity**:

```bash
python scripts/validate_entities.py examples/example_citizen_report.json
```

**3. Insert to Orion-LD**:

```bash
curl -X POST http://localhost:1026/ngsi-ld/v1/entities \
  -H "Content-Type: application/ld+json" \
  -d @examples/example_citizen_report.json
```

**4. Query Entity**:

```bash
curl http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:CitizenReport:001
```

---

## References

- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf)
- [FIWARE Data Models](https://github.com/smart-data-models)
- [GeoJSON Specification](https://datatracker.ietf.org/doc/html/rfc7946)
- [JSON-LD](https://json-ld.org/)
- [Orion-LD Documentation](https://github.com/FIWARE/context.Orion-LD)

For implementation details, see:

- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Setup guide
