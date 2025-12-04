# Migration Guide: Old API → New Endpoints

## Overview

This guide helps migrate from the old `/api/ngsi-ld` proxy to the new specialized endpoints.

---

## Why Migrate?

**Old API (`/api/ngsi-ld`):**
- ❌ Generic proxy - requires manual context management
- ❌ Raw NGSI-LD format - needs client-side parsing
- ❌ No built-in filtering or aggregation
- ❌ Inconsistent error handling
- ❌ Requires deep NGSI-LD knowledge

**New Endpoints:**
- ✅ Specialized for each entity type
- ✅ Pre-formatted JSON - ready to use
- ✅ Built-in filtering and aggregation
- ✅ Consistent error handling
- ✅ Simple, intuitive API

---

## Migration Examples

### 1. Fetching Roads

#### Old Way
```typescript
const params = new URLSearchParams({
  type: 'RoadSegment',
  options: 'keyValues',
  limit: '100',
  offset: '0',
  attrs: 'id,name,location',
});

const response = await fetch(`/api/ngsi-ld?${params}`);
const roads = await response.json();

// Manual processing
const formatted = roads.map(road => ({
  id: road.id,
  name: road.name,
  location: road.location,
}));
```

#### New Way
```typescript
const response = await fetch('/api/roads?limit=100&offset=0');
const { roads } = await response.json();
// Already formatted and ready to use!
```

---

### 2. Fetching Weather

#### Old Way
```typescript
const params = new URLSearchParams({
  type: 'WeatherObserved',
  options: 'keyValues',
  limit: '200',
});

const response = await fetch(`/api/ngsi-ld?${params}`);
const weatherData = await response.json();

// Manual filtering for latest
const latest = weatherData.reduce((latest, current) => {
  const currentDate = new Date(current.dateObserved?.['@value'] || 0);
  const latestDate = new Date(latest.dateObserved?.['@value'] || 0);
  return currentDate > latestDate ? current : latest;
});

// Manual value extraction
const temperature = latest.temperature?.value || latest.temperature;
```

#### New Way
```typescript
const response = await fetch('/api/weather');
const weather = await response.json();
// Already the latest, already formatted!
const temperature = weather.temperature;
```

---

### 3. Fetching AQI

#### Old Way
```typescript
const coordinates = `[${lon},${lat}]`;
const params = new URLSearchParams({
  type: 'AirQualityObserved',
  options: 'keyValues',
  georel: `near;maxDistance==5000`,
  geometry: 'Point',
  coordinates,
  limit: '100',
});

const response = await fetch(`/api/ngsi-ld?${params}`);
const aqiData = await response.json();

// Manual grouping by station
const grouped = {};
aqiData.forEach(entity => {
  const stationId = entity.stationId || entity.id;
  const currentDate = new Date(entity.dateObserved?.['@value'] || 0);
  const existing = grouped[stationId];
  
  if (!existing || currentDate > new Date(existing.dateObserved?.['@value'] || 0)) {
    grouped[stationId] = entity;
  }
});

const stations = Object.values(grouped);
```

#### New Way
```typescript
const response = await fetch('/api/aqi?lat=10.78&lon=106.7&maxDistance=5000');
const { stations } = await response.json();
// Already grouped by station and latest for each!
```

---

### 4. Fetching Streetlights

#### Old Way
```typescript
const params = new URLSearchParams({
  type: 'Streetlight',
  options: 'keyValues',
  limit: '1000',
});

const response = await fetch(`/api/ngsi-ld?${params}`);
const allStreetlights = await response.json();

// Manual filtering by road
const filtered = allStreetlights.filter(sl => 
  sl.refRoadSegment === roadId || 
  sl.refRoadSegment?.value === roadId
);

// Manual counting
const onCount = filtered.filter(sl => 
  sl.powerState === 'on' || sl.powerState?.value === 'on'
).length;

const stats = {
  total: filtered.length,
  on: onCount,
  off: filtered.length - onCount,
};
```

#### New Way
```typescript
const response = await fetch(`/api/streetlights?roadId=${roadId}`);
const { streetlights, statistics } = await response.json();
// Already filtered and counted!
```

---

### 5. Creating Reports

#### Old Way
```typescript
const report = {
  id: `urn:ngsi-ld:CitizenReport:HCMC-${Date.now()}`,
  type: 'CitizenReport',
  '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
  location: {
    type: 'GeoProperty',
    value: {
      type: 'Point',
      coordinates: [lon, lat],
    },
  },
  category: {
    type: 'Property',
    value: 'streetlight_broken',
  },
  // ... many more fields
};

const response = await fetch('/api/ngsi-ld?type=CitizenReport&endpoint=/entities', {
  method: 'POST',
  headers: {
    'Link': '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
    'Content-Type': 'application/ld+json',
  },
  body: JSON.stringify(report),
});
```

#### New Way
```typescript
const report = {
  id: `urn:ngsi-ld:CitizenReport:HCMC-${Date.now()}`,
  type: 'CitizenReport',
  '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
  location: {
    type: 'GeoProperty',
    value: {
      type: 'Point',
      coordinates: [lon, lat],
    },
  },
  category: {
    type: 'Property',
    value: 'streetlight_broken',
  },
  // ... other fields
};

const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(report),
});
```

---

### 6. Complete Road Data

#### Old Way (Multiple Requests)
```typescript
// Request 1: Get road
const roadRes = await fetch(`/api/ngsi-ld?...RoadSegment...`);
const road = await roadRes.json();

// Request 2: Get weather
const weatherRes = await fetch(`/api/ngsi-ld?...WeatherObserved...`);
const weatherData = await weatherRes.json();
const weather = weatherData[0]; // Assume first

// Request 3: Get AQI
const aqiRes = await fetch(`/api/ngsi-ld?...AirQualityObserved...`);
const aqiData = await aqiRes.json();

// Request 4: Get streetlights
const slRes = await fetch(`/api/ngsi-ld?...Streetlight...`);
const allSL = await slRes.json();
const streetlights = allSL.filter(sl => sl.refRoadSegment === roadId);

// Request 5: Get reports
const reportRes = await fetch(`/api/ngsi-ld?...CitizenReport...`);
const reports = await reportRes.json();

// Manual aggregation...
```

#### New Way (Single Request)
```typescript
const response = await fetch(`/api/roads/${encodeURIComponent(roadId)}`);
const data = await response.json();

// Everything in one response!
const { road, weather, aqi, streetlights, reports } = data;
```

---

## Checklist for Migration

- [ ] Replace `/api/ngsi-ld` calls with `/api/roads`
- [ ] Replace manual weather filtering with `/api/weather`
- [ ] Replace manual AQI grouping with `/api/aqi`
- [ ] Replace manual streetlight filtering with `/api/streetlights`
- [ ] Replace report creation with `/api/reports` POST
- [ ] Remove manual context header management
- [ ] Remove manual DateTime parsing (use `parseDateTime()`)
- [ ] Remove manual value extraction (use `getValue()`)
- [ ] Test all endpoints
- [ ] Update documentation

---

## Helper Functions for Migration

```typescript
// Old way helpers (can be removed after migration)
function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

// New way (already provided in /lib/utils/format.ts)
import { getValue, parseDateTime } from '@/lib/utils/format';
```

---

## Performance Improvements

**Old Way:**
- Multiple HTTP requests
- Client-side processing
- Manual caching needed

**New Way:**
- Single request for complete data
- Server-side processing
- Built-in aggregation

**Result:** 
- ⚡ Faster page loads
- 📉 Reduced network traffic
- 🎯 Simpler code

---

## Troubleshooting

### Issue: "Cannot read property 'value' of undefined"

**Old way:** Manual value extraction
```typescript
// ❌ Breaks if structure changes
const temp = weather.temperature.value;
```

**New way:** Use helper
```typescript
// ✅ Handles all formats
import { getValue } from '@/lib/utils/format';
const temp = getValue(weather.temperature);
```

### Issue: "Multiple weather records returned"

**Old way:** Manual filtering
```typescript
// ❌ Need to handle all cases
const latest = weatherData.reduce(...);
```

**New way:** Already handled
```typescript
// ✅ Always returns latest
const response = await fetch('/api/weather');
const weather = await response.json(); // Latest only
```

### Issue: "Streetlights not filtered by road"

**Old way:** Manual filtering
```typescript
// ❌ Easy to miss edge cases
const filtered = allSL.filter(sl => sl.refRoadSegment === roadId);
```

**New way:** Automatic
```typescript
// ✅ Always correct
const response = await fetch(`/api/streetlights?roadId=${roadId}`);
const { streetlights } = await response.json(); // Pre-filtered
```

---

## Timeline

- **Phase 1:** Update new components to use new endpoints
- **Phase 2:** Migrate existing components one by one
- **Phase 3:** Remove old `/api/ngsi-ld` calls
- **Phase 4:** Deprecate old API (keep for backward compatibility)

---

## Questions?

Refer to:
- `/docs/API_ENDPOINTS.md` - Complete API reference
- `/lib/api/road-data.ts` - Client-side helpers
- `/lib/utils/data-helpers.ts` - Data processing utilities
- `BACKEND_INTEGRATION_SUMMARY.md` - Implementation details
