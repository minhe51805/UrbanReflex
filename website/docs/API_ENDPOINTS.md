# API Endpoints Documentation

## Overview

This document describes the backend API endpoints for UrbanReflex, implemented according to the FE_INTEGRATION_GUIDE specifications.

All endpoints are designed to:
- ✅ Use correct NGSI-LD contexts (matching verify_full_data_for_road.py)
- ✅ Handle CORS properly through Next.js API routes
- ✅ Return data in frontend-friendly format
- ✅ Include proper error handling
- ✅ Support spatial queries where applicable

---

## Base URL

All API endpoints are relative to: `/api/`

---

## Endpoints

### 1. Roads

#### GET /api/roads
Fetch all road segments with pagination.

**Query Parameters:**
- `limit` (optional, default: 1000) - Number of roads to fetch
- `offset` (optional, default: 0) - Pagination offset
- `attrs` (optional, default: 'id,name,location,roadClass') - Attributes to return

**Response:**
```json
{
  "roads": [...],
  "count": 1234,
  "limit": 1000,
  "offset": 0
}
```

**Example:**
```javascript
const response = await fetch('/api/roads?limit=100&offset=0');
const data = await response.json();
```

---

#### GET /api/roads/[id]
Fetch comprehensive data for a specific road segment.

**Path Parameters:**
- `id` - Road segment ID (e.g., `urn:ngsi-ld:RoadSegment:HCMC-32576911`)

**Response:**
```json
{
  "road": {
    "id": "urn:ngsi-ld:RoadSegment:HCMC-32576911",
    "name": "Nguyễn Huệ",
    "location": {...},
    "roadClass": "primary"
  },
  "weather": {
    "temperature": 28.5,
    "humidity": 75,
    "pressure": 1013,
    ...
  },
  "aqi": [
    {
      "stationId": "us-diplomatic-post",
      "aqi": 89,
      "pm25": 30.1,
      ...
    }
  ],
  "streetlights": {
    "total": 45,
    "on": 40,
    "off": 5
  },
  "reports": [...]
}
```

**Example:**
```javascript
const roadId = 'urn:ngsi-ld:RoadSegment:HCMC-32576911';
const response = await fetch(`/api/roads/${encodeURIComponent(roadId)}`);
const data = await response.json();
```

---

### 2. Weather

#### GET /api/weather
Fetch latest city-wide weather data.

**Response:**
```json
{
  "id": "urn:ngsi-ld:WeatherObserved:HCMC-HCMC-20251127T...",
  "dateObserved": {...},
  "temperature": 28.5,
  "feelsLikeTemperature": 32.1,
  "relativeHumidity": 0.75,
  "atmosphericPressure": 1013,
  "windSpeed": 3.5,
  "windDirection": 180,
  "visibility": 10000,
  "precipitation": 0,
  "dewPoint": 23.8,
  "weatherDescription": "Partly cloudy",
  "source": "OpenWeatherMap"
}
```

**Example:**
```javascript
const response = await fetch('/api/weather');
const weather = await response.json();
```

---

### 3. Air Quality (AQI)

#### GET /api/aqi
Fetch air quality data with optional spatial filtering.

**Query Parameters:**
- `lat` (optional) - Latitude for spatial query
- `lon` (optional) - Longitude for spatial query
- `maxDistance` (optional, default: 5000) - Search radius in meters
- `limit` (optional, default: 100) - Maximum number of results

**Response:**
```json
{
  "stations": [
    {
      "id": "urn:ngsi-ld:AirQualityObserved:...",
      "stationId": "us-diplomatic-post",
      "name": "US Diplomatic Post",
      "dateObserved": {...},
      "location": {...},
      "aqi": 89,
      "pm25": 30.1,
      "pm10": 48.5,
      "no2": 25.3,
      "o3": 45.2,
      "so2": 8.1,
      "co": 0.5,
      "airQualityLevel": "moderate",
      "measurementQuality": "measured"
    }
  ],
  "count": 9
}
```

**Example:**
```javascript
// Get all stations
const response = await fetch('/api/aqi');

// Get stations near a location
const response = await fetch('/api/aqi?lat=10.78&lon=106.7&maxDistance=5000');
```

---

### 4. Streetlights

#### GET /api/streetlights
Fetch streetlight data with optional road filtering.

**Query Parameters:**
- `roadId` (optional) - Filter by road segment ID
- `limit` (optional, default: 1000) - Number of streetlights to fetch
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
{
  "streetlights": [...],
  "count": 45,
  "statistics": {
    "total": 45,
    "on": 40,
    "off": 5
  }
}
```

**Example:**
```javascript
// Get all streetlights
const response = await fetch('/api/streetlights');

// Get streetlights for a specific road
const roadId = 'urn:ngsi-ld:RoadSegment:HCMC-32576911';
const response = await fetch(`/api/streetlights?roadId=${encodeURIComponent(roadId)}`);
```

---

### 5. Citizen Reports

#### GET /api/reports
Fetch citizen reports with optional spatial filtering.

**Query Parameters:**
- `lat` (optional) - Latitude for spatial query
- `lon` (optional) - Longitude for spatial query
- `maxDistance` (optional, default: 1000) - Search radius in meters
- `limit` (optional, default: 50) - Maximum number of results

**Response:**
```json
{
  "reports": [
    {
      "id": "urn:ngsi-ld:CitizenReport:...",
      "title": "Broken streetlight",
      "description": "Streetlight not working for 3 days",
      "category": "streetlight_broken",
      "status": "submitted",
      "priority": "high",
      "reporterName": "Nguyen Van A",
      "reporterContact": "+84 90 123 4567",
      "dateCreated": {...},
      "location": {...},
      "refRoadSegment": "urn:ngsi-ld:RoadSegment:..."
    }
  ],
  "count": 5
}
```

**Example:**
```javascript
// Get all reports
const response = await fetch('/api/reports');

// Get reports near a location
const response = await fetch('/api/reports?lat=10.78&lon=106.7&maxDistance=1000');
```

---

#### POST /api/reports
Create a new citizen report.

**Request Body:**
```json
{
  "id": "urn:ngsi-ld:CitizenReport:HCMC-1732704759000",
  "type": "CitizenReport",
  "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"],
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7008, 10.775]
    }
  },
  "category": {
    "type": "Property",
    "value": "streetlight_broken"
  },
  "status": {
    "type": "Property",
    "value": "submitted"
  },
  "title": {
    "type": "Property",
    "value": "Broken streetlight on Nguyen Hue"
  },
  "description": {
    "type": "Property",
    "value": "Streetlight pole #12 not working for 3 days"
  },
  "priority": {
    "type": "Property",
    "value": "high"
  },
  "reporterName": {
    "type": "Property",
    "value": "Nguyen Van A"
  },
  "reporterContact": {
    "type": "Property",
    "value": "+84 90 123 4567"
  },
  "dateCreated": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2025-11-27T10:00:00Z"
    }
  }
}
```

**Response:**
```json
{
  "success": true
}
```

**Example:**
```javascript
const report = {
  id: `urn:ngsi-ld:CitizenReport:HCMC-${Date.now()}`,
  type: 'CitizenReport',
  '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
  // ... other fields
};

const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(report),
});
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "type": "error",
  "title": "Request Failed",
  "detail": "HTTP 404: Not Found"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created (POST requests)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## CORS Configuration

All API routes are configured to handle CORS automatically through Next.js API routes. No additional CORS configuration is needed on the frontend.

---

## Authentication

Currently, no authentication is required. Token authentication will be added in future updates.

---

## Context Headers

All requests to NGSI-LD broker include proper Link headers according to the entity type:

- **RoadSegment**: core + sosa + transportation contexts
- **WeatherObserved**: core + sosa + weather contexts
- **AirQualityObserved**: core + sosa + environment contexts
- **Streetlight**: streetlighting context only (no core)
- **PointOfInterest**: core + POI contexts
- **CitizenReport**: core context only

This ensures compatibility with Orion-LD 1.5.1 requirements.

---

## Best Practices

1. **Always use keyValues option** - Data is returned in flat format for easier parsing
2. **Handle pagination** - Use limit/offset for large datasets
3. **Cache static data** - Roads, POIs change infrequently
4. **Filter client-side when needed** - Some queries require client-side filtering
5. **Parse DateTime properly** - Use provided helper functions
6. **Handle empty responses** - Check for null/empty arrays

---

## Helper Functions

Use the provided utility functions in `/lib/utils/`:

```javascript
import { parseDateTime, getValue } from '@/lib/utils/format';
import { getLatestEntity, getLatestPerStation } from '@/lib/utils/data-helpers';

// Parse NGSI-LD DateTime
const date = parseDateTime(entity.dateObserved);

// Get value from Property object
const temp = getValue(weather.temperature);

// Get latest entity
const latest = getLatestEntity(weatherEntities);

// Get latest per AQI station
const stations = getLatestPerStation(aqiEntities);
```

---

## Example: Complete Road Data Fetch

```javascript
async function fetchCompleteRoadData(roadId: string) {
  const response = await fetch(`/api/roads/${encodeURIComponent(roadId)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch road data: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    road: data.road,
    weather: data.weather,
    aqiStations: data.aqi,
    streetlights: data.streetlights,
    reports: data.reports,
  };
}
```

---

## Testing

Test endpoints using curl or browser:

```bash
# Get all roads
curl http://localhost:3000/api/roads?limit=10

# Get specific road
curl "http://localhost:3000/api/roads/urn%3Angsi-ld%3ARoadSegment%3AHCMC-32576911"

# Get weather
curl http://localhost:3000/api/weather

# Get AQI near location
curl "http://localhost:3000/api/aqi?lat=10.78&lon=106.7"

# Get streetlights for road
curl "http://localhost:3000/api/streetlights?roadId=urn%3Angsi-ld%3ARoadSegment%3AHCMC-32576911"
```

---

## Migration from Old API

If you're migrating from the old `/api/ngsi-ld` proxy:

**Old way:**
```javascript
const params = new URLSearchParams({
  type: 'RoadSegment',
  options: 'keyValues',
  limit: '100',
});
const response = await fetch(`/api/ngsi-ld?${params}`);
```

**New way:**
```javascript
const response = await fetch('/api/roads?limit=100');
```

The new endpoints provide:
- ✅ Better error handling
- ✅ Consistent response format
- ✅ Automatic data formatting
- ✅ Built-in filtering and aggregation
- ✅ Proper context configuration

---

## Support

For issues or questions, refer to:
- `FE_INTEGRATION_GUIDE (2).md` - Integration guide
- `verify_full_data_for_road.py` - Backend reference implementation
- `/lib/api/road-data.ts` - Client-side API helpers
- `/lib/utils/data-helpers.ts` - Data processing utilities

