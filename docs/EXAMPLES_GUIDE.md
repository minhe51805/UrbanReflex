# NGSI-LD Examples Guide

Reference guide for the sample NGSI-LD entities in the `examples/` directory.

---

## Overview

The `examples/` directory contains sample NGSI-LD entities demonstrating proper JSON-LD structure and FiWARE Smart Data Model compliance.

---

## Example Files

| File | Entity Type | Description |
|------|-------------|-------------|
| `example_road_segment.json` | `RoadSegment` | Nguyen Hue Street, District 1 |
| `example_weather_observed.json` | `WeatherObserved` | Real-time weather data from OpenWeatherMap |
| `example_air_quality_observed.json` | `AirQualityObserved` | Air quality data from OpenAQ |
| `example_streetlight.json` | `Streetlight` | LED streetlight on Nguyen Hue Street |
| `example_point_of_interest.json` | `PointOfInterest` | Bitexco Financial Tower |
| `example_citizen_report.json` | `CitizenReport` | Broken streetlight report from citizen |

---

## What These Examples Demonstrate

1. **Correct NGSI-LD structure** with `@context`, `id`, `type`
2. **Property types**: `Property`, `GeoProperty`, `Relationship`
3. **FiWARE Smart Data Model compliance** for standard entities
4. **Temporal properties** with `observedAt` timestamps
5. **Unit codes** following UN/CEFACT standards
6. **Relationships** between entities (e.g., `refRoadSegment`, `refStreetlight`)

---

## Entity Relationships

```
RoadSegment (Nguyen Hue)
    ├─ hasStreetlight → Streetlight
    └─ nearbyPOI → PointOfInterest (Bitexco Tower)

Streetlight
    └─ refRoadSegment → RoadSegment

PointOfInterest
    └─ refRoadSegment → RoadSegment

CitizenReport
    ├─ refRoadSegment → RoadSegment
    └─ refStreetlight → Streetlight
```

---

## Important Notes

### Coordinates
- All coordinates use **WGS84** (longitude, latitude)
- GeoJSON format: `[lon, lat]` NOT `[lat, lon]`

### Timestamps
- Follow **ISO 8601** format with UTC timezone
- Example: `2025-11-15T10:30:00Z`

### Entity IDs
- Format: `urn:ngsi-ld:EntityType:HCMC-{suffix}`
- Examples:
  - `urn:ngsi-ld:RoadSegment:HCMC-NguyenHue`
  - `urn:ngsi-ld:WeatherObserved:HCMC-Weather-20251115`

### Unit Codes
Common UN/CEFACT codes used:
- `CEL` - Celsius (°C)
- `MTR` - Meter (m)
- `MTS` - Meter per second (m/s)
- `MMT` - Millimeter (mm)
- `GQ` - Microgram per cubic meter (µg/m³)
- `WTT` - Watt (W)
- `LX` - Lux (lx)
- `C62` - Dimensionless (0-1 range, e.g., humidity)
- `A97` - Hectopascal (hPa)

---

## Using the Examples

### Validate Against Schema

```bash
# Validate single example
python scripts/validate_entities.py examples/example_weather_observed.json

# Validate all examples
python scripts/validate_entities.py examples/
```

### Load into Orion-LD

```bash
# Load single entity
curl -X POST http://localhost:1026/ngsi-ld/v1/entities \
  -H "Content-Type: application/ld+json" \
  -d @examples/example_weather_observed.json

# Load all examples
for file in examples/*.json; do
  curl -X POST http://localhost:1026/ngsi-ld/v1/entities \
    -H "Content-Type: application/ld+json" \
    -d @$file
done
```

### Query Entity

```bash
# Get specific entity
curl http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:RoadSegment:HCMC-NguyenHue

# Query by type
curl http://localhost:1026/ngsi-ld/v1/entities?type=WeatherObserved
```

---

## Example Use Cases

### 1. Understanding NGSI-LD Structure
Start with `example_weather_observed.json` to understand basic NGSI-LD structure.

### 2. Learning Relationships
Check `example_citizen_report.json` to see how entities reference each other.

### 3. GeoProperty Examples
Look at `example_streetlight.json` for Point geometry and `example_road_segment.json` for LineString geometry.

### 4. Temporal Properties
See `example_air_quality_observed.json` for time-series data with `observedAt` timestamps.

---

## Creating Your Own Examples

### Basic Template

```json
{
  "@context": [
    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
  ],
  "id": "urn:ngsi-ld:EntityType:YourID",
  "type": "EntityType",
  "propertyName": {
    "type": "Property",
    "value": "your-value"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7008, 10.7769]
    }
  }
}
```

### Adding Relationships

```json
{
  "refRelatedEntity": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RelatedEntityType:RelatedID"
  }
}
```

---

## Reference

- See `docs/NGSI_LD_GUIDE.md` for complete NGSI-LD format documentation
- See `docs/DATA_MODEL.md` for full entity specifications
- See `schemas/` for FiWARE JSON schemas

