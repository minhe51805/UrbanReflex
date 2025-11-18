# FiWARE Schemas Summary

Summary of downloaded FiWARE Smart Data Models JSON Schemas. Explains structure and how to use them for UrbanReflex entities.

---

## 📦 Downloaded Schemas (5 total)

| Schema | Source Repo | Purpose |
|--------|-------------|---------|
| `WeatherObserved_schema.json` | dataModel.Weather | Weather data (temp, humidity, rain, wind) |
| `AirQualityObserved_schema.json` | dataModel.Environment | Air quality (AQI, PM2.5, NO2, O3) |
| `Streetlight_schema.json` | dataModel.Streetlighting | Individual streetlight properties |
| `StreetlightControlCabinet_schema.json` | dataModel.Streetlighting | Control cabinet for streetlight groups |
| `PointOfInterest_schema.json` | dataModel.PointOfInterest | POI (schools, hospitals, parks) |

---

## 🔍 Schema Structure

Each schema follows JSON Schema format:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://smart-data-models.github.io/.../schema.json",
  "title": "...",
  "description": "...",
  "type": "object",
  "properties": {
    "property1": { ... },
    "property2": { ... }
  },
  "required": ["id", "type"]
}
```

---

## 📝 Key Properties by Schema

### 1. WeatherObserved

**Required:**
- `id` - Entity ID
- `type` - Must be "WeatherObserved"

**Common Properties:**
- `dateObserved` - Timestamp of observation
- `temperature` - Temperature value
- `relativeHumidity` - Humidity percentage
- `precipitation` - Rainfall amount (liters/m²)
- `windSpeed` - Wind speed
- `atmosphericPressure` - Pressure value
- `weatherType` - Description (e.g., "sunny", "cloudy")
- `location` - GeoJSON point

**Use for:** Data from OpenWeatherMap API

---

### 2. AirQualityObserved

**Required:**
- `id` - Entity ID
- `type` - Must be "AirQualityObserved"

**Common Properties:**
- `dateObserved` - Timestamp
- `airQualityIndex` - Overall AQI value
- `pm25` - PM2.5 concentration (µg/m³)
- `pm10` - PM10 concentration
- `no2` - NO2 concentration
- `o3` - O3 concentration
- `co` - CO concentration
- `location` - GeoJSON point
- `address` - Location address

**Use for:** Data from OpenAQ API (10 stations in HCMC)

---

### 3. Streetlight

**Required:**
- `id` - Entity ID
- `type` - Must be "Streetlight"

**Common Properties:**
- `location` - GeoJSON point
- `status` - "ok", "defectiveLamp", etc.
- `powerState` - "on", "off", "low"
- `refStreetlightControlCabinet` - Reference to control cabinet
- `dateLastSwitchingOn` - Last turn on time
- `dateLastSwitchingOff` - Last turn off time
- `illuminanceLevel` - Light intensity (0-100)

**Use for:** 
- Synthetic streetlight data (generated from RoadSegments)
- Citizen reports about broken lights

---

### 4. PointOfInterest

**Required:**
- `id` - Entity ID
- `type` - Must be "PointOfInterest"

**Common Properties:**
- `name` - Name of POI
- `category` - Array (e.g., ["school"], ["hospital"])
- `location` - GeoJSON point/polygon
- `address` - Structured address
- `description` - Description text
- `refSeeAlso` - References to other entities

**Categories for UrbanReflex:**
- `school` - Educational facilities
- `hospital` / `healthcareFacility` - Medical facilities
- `park` / `publicArea` - Parks and public spaces
- `parking` - Parking areas

**Use for:** Data from OpenStreetMap (schools, hospitals, parks)

---

### 5. StreetlightControlCabinet

**Required:**
- `id` - Entity ID
- `type` - Must be "StreetlightControlCabinet"

**Common Properties:**
- `location` - GeoJSON point
- `refStreetlight` - Array of controlled streetlights
- `powerState` - Cabinet power status
- `energyConsumed` - Total energy consumption

**Use for:** 
- Grouping streetlights by area (optional)
- Energy consumption calculations

---

## ✅ Validation Usage

### Python Example:

```python
import json
import jsonschema

# Load schema
with open('schemas/WeatherObserved_schema.json') as f:
    schema = json.load(f)

# Load entity to validate
entity = {
    "id": "urn:ngsi-ld:WeatherObserved:HCMC-001",
    "type": "WeatherObserved",
    "temperature": {
        "type": "Property",
        "value": 27.5
    },
    "location": {
        "type": "GeoProperty",
        "value": {
            "type": "Point",
            "coordinates": [106.700806, 10.776889]
        }
    }
}

# Validate
try:
    jsonschema.validate(instance=entity, schema=schema)
    print("Valid!")
except jsonschema.ValidationError as e:
    print(f"Invalid: {e.message}")
```

---

## 🔗 Relationships Between Entities

```
RoadSegment
├── hasWeather → WeatherObserved (nearest station)
├── hasAirQuality → AirQualityObserved (nearest station)
├── hasStreetlight → Streetlight[] (multiple lights on road)
└── nearbyPOI → PointOfInterest[] (schools, hospitals nearby)

CitizenReport
├── refRoadSegment → RoadSegment (where issue occurred)
└── refStreetlight → Streetlight (if reporting light issue)
```

---

## 📚 Additional Resources

- **FiWARE Smart Data Models Catalog:** https://smartdatamodels.org
- **GitHub Repository:** https://github.com/smart-data-models
- **JSON Schema Specification:** https://json-schema.org/

---

## 🎯 Next Steps for UrbanReflex

1. ✅ **Schemas downloaded** - This task done
2. ⏳ **Design UrbanReflex Data Model** - Decide which properties to use
3. ⏳ **Create NGSI-LD examples** - Sample entities using these schemas
4. ⏳ **Write transformers** - Convert raw data to NGSI-LD format
5. ⏳ **Validate entities** - Use these schemas to validate before seeding

---

## ⚠️ Notes

- Not all properties are required - use only what's needed
- Can extend schemas with custom properties
- Focus on properties available from data sources (OWM, OpenAQ, OSM)
- Ensure NGSI-LD format: all properties must have `type` and `value`

