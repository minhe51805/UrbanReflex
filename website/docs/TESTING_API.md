# API Testing Guide

## Overview

This guide provides instructions for testing the new API endpoints.

---

## Quick Start

### Option 1: Browser Console

1. Start the development server:
```bash
npm run dev
```

2. Open browser at `http://localhost:3000`

3. Open browser console (F12)

4. Run tests:
```javascript
// Import test functions (if using module)
import * as testAPI from '/lib/api/test-endpoints';

// Or use window.testAPI (if available)
window.testAPI.runAllTests();
```

---

### Option 2: Using cURL

#### Test Roads
```bash
# Get all roads
curl http://localhost:3000/api/roads?limit=10

# Get specific road
curl "http://localhost:3000/api/roads/urn%3Angsi-ld%3ARoadSegment%3AHCMC-32576911"
```

#### Test Weather
```bash
curl http://localhost:3000/api/weather
```

#### Test AQI
```bash
# All stations
curl http://localhost:3000/api/aqi

# Near location
curl "http://localhost:3000/api/aqi?lat=10.78&lon=106.7&maxDistance=5000"
```

#### Test Streetlights
```bash
# All streetlights
curl http://localhost:3000/api/streetlights?limit=100

# For specific road
curl "http://localhost:3000/api/streetlights?roadId=urn%3Angsi-ld%3ARoadSegment%3AHCMC-32576911"
```

#### Test Reports
```bash
# Get reports
curl http://localhost:3000/api/reports

# Create report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "id": "urn:ngsi-ld:CitizenReport:HCMC-TEST-1234567890",
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
      "value": "test"
    },
    "status": {
      "type": "Property",
      "value": "submitted"
    },
    "title": {
      "type": "Property",
      "value": "Test Report"
    },
    "description": {
      "type": "Property",
      "value": "This is a test"
    },
    "priority": {
      "type": "Property",
      "value": "low"
    },
    "dateCreated": {
      "type": "Property",
      "value": {
        "@type": "DateTime",
        "@value": "2025-11-27T10:00:00Z"
      }
    }
  }'
```

---

### Option 3: Using Postman

Import this collection:

```json
{
  "info": {
    "name": "UrbanReflex API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Roads",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/roads?limit=10"
      }
    },
    {
      "name": "Get Road Detail",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/roads/urn:ngsi-ld:RoadSegment:HCMC-32576911"
      }
    },
    {
      "name": "Get Weather",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/weather"
      }
    },
    {
      "name": "Get AQI",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/aqi?lat=10.78&lon=106.7"
      }
    },
    {
      "name": "Get Streetlights",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/streetlights?limit=100"
      }
    },
    {
      "name": "Get Reports",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/reports"
      }
    }
  ]
}
```

---

## Expected Results

### GET /api/roads
```json
{
  "roads": [
    {
      "id": "urn:ngsi-ld:RoadSegment:HCMC-32576911",
      "name": "Nguyễn Huệ",
      "location": {
        "type": "LineString",
        "coordinates": [[106.7, 10.78], ...]
      },
      "roadClass": "primary"
    }
  ],
  "count": 10,
  "limit": 10,
  "offset": 0
}
```

### GET /api/roads/[id]
```json
{
  "road": {
    "id": "...",
    "name": "Nguyễn Huệ",
    "location": {...},
    "roadClass": "primary"
  },
  "weather": {
    "temperature": 28.5,
    "humidity": 0.75,
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

### GET /api/weather
```json
{
  "id": "urn:ngsi-ld:WeatherObserved:HCMC-HCMC-20251127T...",
  "temperature": 28.5,
  "relativeHumidity": 0.75,
  "atmosphericPressure": 1013,
  "windSpeed": 3.5,
  "windDirection": 180,
  "visibility": 10000,
  "precipitation": 0,
  "dewPoint": 23.8,
  "weatherDescription": "Partly cloudy"
}
```

### GET /api/aqi
```json
{
  "stations": [
    {
      "id": "...",
      "stationId": "us-diplomatic-post",
      "name": "US Diplomatic Post",
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

---

## Troubleshooting

### Issue: 404 Not Found

**Check:**
- Is the dev server running? (`npm run dev`)
- Is the URL correct? (check for typos)
- Is the entity ID properly URL-encoded?

### Issue: 500 Internal Server Error

**Check:**
- Is Orion-LD server accessible? (http://103.178.233.233:1026)
- Check server logs in terminal
- Check browser console for errors

### Issue: Empty Response

**Check:**
- Are there entities in the database?
- Is the spatial query correct? (coordinates in [lon, lat] format)
- Is the maxDistance reasonable?

### Issue: CORS Error

**Solution:**
- Use the API routes (`/api/*`) instead of direct Orion-LD calls
- API routes automatically handle CORS

---

## Performance Testing

### Load Test with Apache Bench

```bash
# Test roads endpoint
ab -n 100 -c 10 http://localhost:3000/api/roads?limit=10

# Test weather endpoint
ab -n 100 -c 10 http://localhost:3000/api/weather

# Test AQI endpoint
ab -n 100 -c 10 "http://localhost:3000/api/aqi?lat=10.78&lon=106.7"
```

### Expected Performance

- **Roads (limit=10)**: < 500ms
- **Weather**: < 300ms
- **AQI (spatial)**: < 800ms
- **Road Detail**: < 1500ms (multiple queries)
- **Streetlights**: < 1000ms (large dataset)

---

## Automated Testing

### Jest Tests (TODO)

Create test files in `__tests__/api/`:

```typescript
// __tests__/api/roads.test.ts
import { testFetchRoads } from '@/lib/api/test-endpoints';

describe('Roads API', () => {
  it('should fetch roads', async () => {
    const data = await testFetchRoads();
    expect(data.roads).toBeDefined();
    expect(data.count).toBeGreaterThan(0);
  });
});
```

Run tests:
```bash
npm test
```

---

## Monitoring

### Check Logs

Server logs will show:
```
📤 POST to NGSI-LD: { url: '...', type: '...', entityId: '...' }
✅ Success
❌ Error: ...
```

### Health Check

Create a simple health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

Test:
```bash
curl http://localhost:3000/api/health
```

---

## Next Steps

1. ✅ Test all endpoints manually
2. ✅ Verify response formats
3. ✅ Check error handling
4. ✅ Test with real data
5. ⏳ Write automated tests
6. ⏳ Setup monitoring
7. ⏳ Performance optimization

---

## Resources

- `/docs/API_ENDPOINTS.md` - API documentation
- `/lib/api/test-endpoints.ts` - Test functions
- `BACKEND_INTEGRATION_SUMMARY.md` - Implementation details
- `FE_INTEGRATION_GUIDE (2).md` - Integration guide
