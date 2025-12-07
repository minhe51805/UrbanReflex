<!--
============================================================================
UrbanReflex — Smart City Intelligence Platform
Copyright (C) 2025  WAG

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

For more information, visit: https://github.com/minhe51805/UrbanReflex
============================================================================
-->

# NGSI-LD Integration Guide

## Overview

UrbanReflex now integrates with an NGSI-LD Context Broker (Orion-LD) to provide real-time environmental data from Ho Chi Minh City. This integration enables Linked Open Data (LOD) capabilities and standardized data access.

## Architecture

```
Frontend (Next.js) → API Proxy (/api/ngsi-ld) → Orion Context Broker (VPS)
                                                  ↓
                                            NGSI-LD Entities
                                            (AQI, Weather, Roads, etc.)
```

**Base URL:** `http://103.178.233.233:1026/ngsi-ld/v1`

## Available Entity Types

### 1. AirQualityObserved
Real-time air quality data from HCMC stations.

**Fixed Entity IDs (No Timestamps):**
- `urn:ngsi-ld:AirQualityObserved:HCMC-us-diplomatic-post-ho-chi-minh-city`
- `urn:ngsi-ld:AirQualityObserved:HCMC-cmt8`
- `urn:ngsi-ld:AirQualityObserved:HCMC-care-centre`
- And 7 more stations...

**Key Attributes:**
- `pm25`, `pm10`, `no2`, `so2`, `o3`, `co` - Pollutant measurements
- `measurementQuality` - `"measured"` (real data) or `"synthetic"` (fallback)
- `dateObserved` - Last update timestamp
- `location` - GeoJSON Point
- `stationName` - Station identifier
- `source` - Data source (e.g., "OpenAQ")

**Important:** Entity IDs are now **fixed** and updated in-place. No timestamp in ID means you always get the latest data by querying the same ID.

### 2. WeatherObserved
Current weather conditions and forecasts.

**Attributes:**
- `temperature`, `relativeHumidity`, `atmosphericPressure`
- `windSpeed`, `windDirection`
- `precipitation`, `weatherCondition`
- `weatherForecast` - Array of forecast data

### 3. RoadSegment
Road network data from OpenStreetMap.

**Attributes:**
- `location` - LineString geometry
- `name` - Road name
- `category` - Road type
- `totalLaneNumber`, `width`

### 4. Streetlight
Synthetic streetlight data linked to road segments.

**Attributes:**
- `powerState` - `"on"` or `"off"`
- `status` - `"ok"`, `"defectiveLamp"`, etc.
- `refRoadSegment` - Reference to road entity
- `illuminanceLevel`, `powerConsumption`

### 5. PointOfInterest
POIs from OpenStreetMap (schools, hospitals, etc.).

**Attributes:**
- `name`, `category`, `description`
- `address`, `contactPoint`
- `location` - GeoJSON Point

### 6. CitizenReport
User-submitted reports about issues.

**Attributes:**
- `category` - Issue type (streetlight_broken, traffic_issue, etc.)
- `status` - Workflow state (submitted, in_progress, resolved)
- `title`, `description`, `priority`
- `reporterName`, `reporterContact` (optional)
- `location` - GeoJSON Point

## Frontend Integration

### 1. Using the API Client

```typescript
import { fetchEntities, fetchEntityById } from '@/lib/api/ngsi-ld';
import type { AirQualityObserved } from '@/types/ngsi-ld';

// Fetch all AQI stations
const stations = await fetchEntities<AirQualityObserved>('AirQualityObserved', {
  limit: 10,
  options: 'keyValues'
});

// Fetch specific station (always returns latest data)
const station = await fetchEntityById<AirQualityObserved>(
  'urn:ngsi-ld:AirQualityObserved:HCMC-cmt8',
  'AirQualityObserved',
  { keyValues: true }
);
```

### 2. Using the API Proxy

```typescript
// GET request
const response = await fetch('/api/ngsi-ld?type=AirQualityObserved&limit=10&options=keyValues');
const data = await response.json();

// POST request (create entity)
const response = await fetch('/api/ngsi-ld?type=CitizenReport', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(entity)
});
```

### 3. Displaying measurementQuality Badge

Always show users whether data is real or synthetic:

```tsx
{station.measurementQuality === 'measured' ? (
  <span className="bg-green-500 text-white px-2 py-1 rounded">✓ Real Data</span>
) : (
  <span className="bg-amber-500 text-white px-2 py-1 rounded">⚠ Synthetic</span>
)}
```

## Components Using NGSI-LD

### HeroSection
- Fetches AQI data for Vietnam (VN country code)
- Falls back to OpenAQ API for other countries
- Displays `measurementQuality` badge

### WeatherWidget
- Shows latest weather data
- Auto-refreshes every 10 minutes
- Displays temperature, humidity, wind, pressure

### Live Data Dashboard (`/live-data`)
- Complete dashboard showing all entity types
- Real-time updates every 5 minutes
- Grid view of all AQI stations with quality indicators

### CitizenReportForm
- Submits reports to NGSI-LD Context Broker
- Proper NGSI-LD entity format
- Workflow: submitted → in_progress → resolved

## Query Patterns

### Get Latest Data (No Date Filtering Needed!)

```bash
# Old way (deprecated)
GET /entities?type=AirQualityObserved&q=dateObserved>2025-11-20&orderBy=!dateObserved

# New way (recommended)
GET /entities/urn:ngsi-ld:AirQualityObserved:HCMC-cmt8?options=keyValues
```

### Filter by Quality

```bash
GET /entities?type=AirQualityObserved&q=measurementQuality.value=="measured"&options=keyValues
```

### Spatial Queries

```bash
GET /entities?type=PointOfInterest&georel=near;maxDistance==500&geometry=Point&coordinates=[106.7,10.78]
```

## Breaking Changes

### ⚠️ Entity ID Format Changed

**Before:**
```
urn:ngsi-ld:AirQualityObserved:HCMC-cmt8-20251121T223331Z
```

**After:**
```
urn:ngsi-ld:AirQualityObserved:HCMC-cmt8
```

**Impact:**
- Old queries filtering by `dateObserved` no longer needed
- Hardcoded entity IDs must be updated
- Cache keys should not include timestamps

## Best Practices

1. **Always use `options=keyValues`** for simpler JSON responses
2. **Show `measurementQuality` badge** to inform users about data reliability
3. **Query specific entity IDs** instead of filtering by date
4. **Handle errors gracefully** with fallback data
5. **Cache responses** appropriately (5-15 minutes for real-time data)

## Testing

```bash
# Test AQI stations
curl -H "Link: <https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel=\"http://www.w3.org/ns/json-ld#context\"; type=\"application/ld+json\"" \
  "http://103.178.233.233:1026/ngsi-ld/v1/entities?type=AirQualityObserved&limit=5&options=keyValues"

# Test specific station
curl -H "Link: <https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel=\"http://www.w3.org/ns/json-ld#context\"; type=\"application/ld+json\"" \
  "http://103.178.233.233:1026/ngsi-ld/v1/entities/urn:ngsi-ld:AirQualityObserved:HCMC-cmt8?options=keyValues"
```

## Troubleshooting

### Empty Results
- Ensure `Link` header is included with correct context URL
- Check entity type spelling (case-sensitive)
- Verify entity IDs don't include timestamps

### CORS Errors
- Use `/api/ngsi-ld` proxy instead of direct calls
- Proxy handles CORS and Link headers automatically

### Stale Data
- Check `dateObserved` timestamp
- Scheduler runs every 15 minutes
- Verify entity exists with correct ID

## Future Enhancements

- [ ] Real-time subscriptions via NGSI-LD notifications
- [ ] Historical data queries with temporal API
- [ ] GraphQL endpoint for complex queries
- [ ] WebSocket support for live updates

---

**Last Updated:** 2025-11-25  
**Author:** Trương Dương Bảo Minh ([@minhe51805](https://github.com/minhe51805))

