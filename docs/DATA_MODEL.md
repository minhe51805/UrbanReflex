# UrbanReflex Data Model v1.0

Complete data model specification for UrbanReflex project. Defines entities, properties, relationships following NGSI-LD and FiWARE standards. Compliant with OLP 2025 requirements (SOSA/SSN, NGSI-LD, LOD).

---

## 1. OVERVIEW

UrbanReflex data model implements:
- **NGSI-LD** format (ETSI ISG CIM standard)
- **FiWARE Smart Data Models** (https://smartdatamodels.org)
- **SOSA/SSN** ontology (W3C) for sensor observations
- **Linked Open Data** (LOD) principles

**Target:** Ho Chi Minh City urban infrastructure with 3 main domains:
1. Environment & Weather
2. Streetlighting
3. Public Facilities (POI)

---

## 2. ENTITY TYPES

### Core Entities (6 types)

| Entity Type | FiWARE Model | Source | Quantity (Est.) |
|-------------|--------------|--------|-----------------|
| `RoadSegment` | Custom/Transportation | OSM | ~2,000 |
| `WeatherObserved` | dataModel.Weather | OpenWeatherMap | ~100/day |
| `AirQualityObserved` | dataModel.Environment | OpenAQ (10 stations) | ~240/day |
| `Streetlight` | dataModel.Streetlighting | Synthetic (from roads) | ~10,000 |
| `PointOfInterest` | dataModel.PointOfInterest | OSM | ~500 |
| `CitizenReport` | Custom/Open311 | User-generated | Variable |

---

## 3. ENTITY SPECIFICATIONS

### 3.1. RoadSegment (Core Entity)

**Purpose:** Represents a road segment in HCMC. Acts as spatial reference for other entities.

**Type:** `RoadSegment`

**ID Format:** `urn:ngsi-ld:RoadSegment:HCMC-{district}-{roadname}-{segment}`

**Example ID:** `urn:ngsi-ld:RoadSegment:HCMC-Q1-PhamNguLao-001`

**Properties:**

| Property | Type | Required | Description | Source |
|----------|------|----------|-------------|--------|
| `id` | String | YES | Entity ID (URN format) | Generated |
| `type` | String | YES | Must be "RoadSegment" | Fixed |
| `name` | Property | YES | Road name | OSM way[name] |
| `location` | GeoProperty | YES | LineString geometry | OSM way[geometry] |
| `roadType` | Property | NO | primary/secondary/tertiary | OSM way[highway] |
| `length` | Property | NO | Road length in meters | Calculated |
| `district` | Property | NO | District/Ward name | OSM area |
| `surface` | Property | NO | Road surface type | OSM way[surface] |

**Relationships:**

| Relationship | Target Entity | Description |
|--------------|---------------|-------------|
| `hasStreetlight` | Streetlight[] | Lights on this road segment |
| `nearbyPOI` | PointOfInterest[] | POIs within 100m radius |

**SOSA/SSN Mapping:**
- RoadSegment implements `sosa:FeatureOfInterest`
- Is the subject of observations (weather, AQI measured near it)

---

### 3.2. WeatherObserved

**Purpose:** Weather observation at specific location and time.

**Type:** `WeatherObserved` (FiWARE standard)

**ID Format:** `urn:ngsi-ld:WeatherObserved:HCMC-{YYYYMMDD}-{HHMMSS}`

**Example ID:** `urn:ngsi-ld:WeatherObserved:HCMC-20251113-103000`

**Properties:**

| Property | Type | Required | Description | Source | Unit |
|----------|------|----------|-------------|--------|------|
| `id` | String | YES | Entity ID | Generated | - |
| `type` | String | YES | "WeatherObserved" | Fixed | - |
| `dateObserved` | Property | YES | Observation timestamp | OWM | ISO 8601 |
| `location` | GeoProperty | YES | Observation point | OWM | GeoJSON Point |
| `temperature` | Property | YES | Temperature value | OWM | Celsius |
| `relativeHumidity` | Property | NO | Humidity percentage | OWM | Percent (0-100) |
| `atmosphericPressure` | Property | NO | Air pressure | OWM | hPa |
| `windSpeed` | Property | NO | Wind speed | OWM | m/s |
| `windDirection` | Property | NO | Wind direction | OWM | Degrees (0-360) |
| `precipitation` | Property | NO | Rainfall amount | OWM | mm |
| `weatherType` | Property | NO | Description | OWM | String |

**Context:**
```json
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
]
```

**SOSA/SSN Mapping:**
- Implements `sosa:Observation`
- `dateObserved` = `sosa:resultTime`
- `location` = `sosa:hasFeatureOfInterest`
- Properties (temperature, etc.) = `sosa:hasResult`

---

### 3.3. AirQualityObserved

**Purpose:** Air quality observation from monitoring station.

**Type:** `AirQualityObserved` (FiWARE standard)

**ID Format:** `urn:ngsi-ld:AirQualityObserved:HCMC-{stationName}-{YYYYMMDD}-{HHMMSS}`

**Example ID:** `urn:ngsi-ld:AirQualityObserved:HCMC-CMT8-20251113-103000`

**Properties:**

| Property | Type | Required | Description | Source | Unit |
|----------|------|----------|-------------|--------|------|
| `id` | String | YES | Entity ID | Generated | - |
| `type` | String | YES | "AirQualityObserved" | Fixed | - |
| `dateObserved` | Property | YES | Observation timestamp | OpenAQ | ISO 8601 |
| `location` | GeoProperty | YES | Station location | OpenAQ | GeoJSON Point |
| `stationName` | Property | NO | Station name | OpenAQ | String |
| `pm25` | Property | NO | PM2.5 concentration | OpenAQ | µg/m³ |
| `pm10` | Property | NO | PM10 concentration | OpenAQ | µg/m³ |
| `no2` | Property | NO | NO2 concentration | OpenAQ | µg/m³ |
| `o3` | Property | NO | O3 concentration | OpenAQ | µg/m³ |
| `co` | Property | NO | CO concentration | OpenAQ | µg/m³ |
| `airQualityIndex` | Property | NO | Overall AQI | Calculated | 0-500 |

**Note:** Properties depend on what sensors available at each station.

**Context:**
```json
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"
]
```

**SOSA/SSN Mapping:**
- Implements `sosa:Observation`
- Station = `sosa:Sensor`
- Each pollutant property = separate `sosa:ObservableProperty`

---

### 3.4. Streetlight

**Purpose:** Individual streetlight unit (synthetic data generated from road segments).

**Type:** `Streetlight` (FiWARE standard)

**ID Format:** `urn:ngsi-ld:Streetlight:HCMC-{district}-{number}`

**Example ID:** `urn:ngsi-ld:Streetlight:HCMC-Q1-00001`

**Properties:**

| Property | Type | Required | Description | Source | Values |
|----------|------|----------|-------------|--------|--------|
| `id` | String | YES | Entity ID | Generated | - |
| `type` | String | YES | "Streetlight" | Fixed | - |
| `location` | GeoProperty | YES | Light position | Generated | GeoJSON Point |
| `status` | Property | YES | Operational status | Default/CitizenReport | ok, defectiveLamp, brokenLamp |
| `powerState` | Property | NO | Power status | Default | on, off |
| `refRoadSegment` | Relationship | YES | Parent road | Generated | RoadSegment ID |

**Generation Strategy:**
- Create points along RoadSegment LineString
- Spacing: 30-50 meters
- Only for road types: primary, secondary, tertiary, residential

**Context:**
```json
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "https://raw.githubusercontent.com/smart-data-models/dataModel.Streetlighting/master/context.jsonld"
]
```

---

### 3.5. PointOfInterest

**Purpose:** Public facilities (schools, hospitals, parks).

**Type:** `PointOfInterest` (FiWARE standard)

**ID Format:** `urn:ngsi-ld:PointOfInterest:HCMC-{category}-{osmId}`

**Example ID:** `urn:ngsi-ld:PointOfInterest:HCMC-School-12345678`

**Properties:**

| Property | Type | Required | Description | Source | Values |
|----------|------|----------|-------------|--------|--------|
| `id` | String | YES | Entity ID | Generated | - |
| `type` | String | YES | "PointOfInterest" | Fixed | - |
| `name` | Property | YES | POI name | OSM node/way[name] | String |
| `category` | Property | YES | POI category | Mapped from OSM tags | Array of strings |
| `location` | GeoProperty | YES | POI position | OSM geometry | Point/Polygon |
| `address` | Property | NO | Address | OSM addr:* tags | Structured |

**Category Mapping (OSM to FiWARE):**

| OSM Tag | UrbanReflex Category |
|---------|---------------------|
| `amenity=school` | `["school"]` |
| `amenity=hospital` | `["hospital"]` |
| `leisure=park` | `["park"]` |
| `amenity=parking` | `["parking"]` |

**Context:**
```json
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld"
]
```

---

### 3.6. CitizenReport

**Purpose:** Citizen-submitted reports about infrastructure issues.

**Type:** `CitizenReport` (Custom, inspired by Open311 ServiceRequest)

**ID Format:** `urn:ngsi-ld:CitizenReport:HCMC-{timestamp}-{randomId}`

**Example ID:** `urn:ngsi-ld:CitizenReport:HCMC-20251113103045-a3f2`

**Properties:**

| Property | Type | Required | Description | Source |
|----------|------|----------|-------------|--------|
| `id` | String | YES | Entity ID | Generated |
| `type` | String | YES | "CitizenReport" | Fixed |
| `dateCreated` | Property | YES | Report timestamp | User submission |
| `location` | GeoProperty | YES | Issue location | User GPS |
| `category` | Property | YES | Issue type | User selection |
| `description` | Property | YES | Issue description | User input |
| `status` | Property | YES | Processing status | System |
| `refRoadSegment` | Relationship | NO | Nearest road | Calculated |
| `refStreetlight` | Relationship | NO | Related streetlight | Calculated |
| `refPOI` | Relationship | NO | Related POI | Calculated |

**Category Values:**
- `streetlight_broken` - Broken streetlight
- `streetlight_dark` - Dark area
- `drainage_blocked` - Blocked drain
- `pothole` - Road damage
- `other` - Other issues

**Status Values:**
- `submitted` - New report
- `acknowledged` - Received by manager
- `in_progress` - Being processed
- `resolved` - Issue fixed
- `closed` - Report closed

**Context:**
```json
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
]
```

---

## 4. RELATIONSHIPS DIAGRAM

```
RoadSegment (Core Entity)
├── hasStreetlight ──> Streetlight (1-to-many)
├── nearbyPOI ──> PointOfInterest (many-to-many)
├── spatial relation to WeatherObserved (nearest station)
└── spatial relation to AirQualityObserved (nearest station)

CitizenReport
├── refRoadSegment ──> RoadSegment
├── refStreetlight ──> Streetlight (if light issue)
└── refPOI ──> PointOfInterest (if POI issue)

WeatherObserved
└── location near RoadSegment (spatial query)

AirQualityObserved
└── location near RoadSegment (spatial query)

Streetlight
└── refRoadSegment ──> RoadSegment (belongs to)
```

---

## 5. DATA FLOW

### 5.1. Data Collection Phase

```
OpenWeatherMap API ──> fetch_weather_owm.py ──> raw_data/weather/*.json
OpenAQ API ──> fetch_aqi_openaq.py ──> raw_data/aqi/*.json
OSM Overpass API ──> fetch_osm_roads.py ──> raw_data/osm/roads.geojson
OSM Overpass API ──> fetch_osm_pois.py ──> raw_data/osm/pois.geojson
```

### 5.2. Transformation Phase

```
raw_data/ ──> transformers/*.py ──> ngsi_ld_entities/*.jsonld
```

### 5.3. Synthetic Data Generation

```
RoadSegments ──> generate_streetlights.py ──> Streetlight entities
(spacing 30-50m along LineString)
```

### 5.4. Validation & Loading

```
ngsi_ld_entities/*.jsonld ──> validate_entities.py ──> validation report
ngsi_ld_entities/*.jsonld ──> seed_data.py ──> Orion-LD ──> MongoDB
```

---

## 6. SPATIAL QUERIES

### 6.1. Find WeatherObserved near RoadSegment

Query nearest weather observation point to road segment:

```
Distance calculation: Haversine formula
Threshold: < 5km (weather data applies to nearby roads)
```

### 6.2. Find AirQualityObserved near RoadSegment

```
Distance calculation: Haversine formula
Threshold: < 2km (air quality more localized)
```

### 6.3. Find POI near RoadSegment

```
Distance calculation: Haversine formula
Threshold: < 100m (for "nearby" POI)
Priority: schools, hospitals (for incident priority scoring)
```

---

## 7. NGSI-LD API ENDPOINTS

Once seeded to Orion-LD, entities accessible via:

```
GET /ngsi-ld/v1/entities
GET /ngsi-ld/v1/entities?type=RoadSegment
GET /ngsi-ld/v1/entities?type=WeatherObserved
GET /ngsi-ld/v1/entities/{entityId}
POST /ngsi-ld/v1/entities (create new)
PATCH /ngsi-ld/v1/entities/{entityId}/attrs (update)
DELETE /ngsi-ld/v1/entities/{entityId}
```

**Geospatial Queries:**
```
GET /ngsi-ld/v1/entities?georel=near;maxDistance==1000&geometry=Point&coordinates=[106.7,10.77]
```

---

## 8. COMPLIANCE CHECKLIST

### NGSI-LD Compliance
- [OK] All entities have `@context`
- [OK] All entities have `id` (URN format)
- [OK] All entities have `type`
- [OK] All attributes are Property, GeoProperty, or Relationship
- [OK] GeoProperties use GeoJSON format
- [OK] Relationships use `object` pointing to other entity IDs

### FiWARE Compliance
- [OK] Using FiWARE Smart Data Models where available
- [OK] Context URLs from smart-data-models GitHub
- [OK] Entity types match FiWARE catalog

### SOSA/SSN Compliance
- [OK] Weather/AQI observations implement `sosa:Observation`
- [OK] Timestamps map to `sosa:resultTime`
- [OK] Sensor data properties map to `sosa:hasResult`
- [OK] RoadSegment implements `sosa:FeatureOfInterest`

### LOD Principles
- [OK] Entities have URN identifiers (globally unique)
- [OK] Relationships create linked data graph
- [OK] Can traverse: RoadSegment -> Streetlight -> CitizenReport
- [OK] Spatial relationships enable discovery

---

## 9. SUMMARY STATISTICS

| Metric | Value |
|--------|-------|
| Entity Types | 6 |
| Relationship Types | 5 |
| Total Entities (Estimated) | ~12,840 |
| RoadSegments | ~2,000 |
| Streetlights (synthetic) | ~10,000 |
| POIs | ~500 |
| Weather/AQI observations | ~340/day |
| CitizenReports | Variable |

**Storage Estimate:**
- Average entity size: ~2KB
- Total storage: ~25-30 MB (entities only)
- MongoDB with indexes: ~50-100 MB

---

## 10. NEXT STEPS

1. [PENDING] Create example NGSI-LD entities for each type
2. [PENDING] Implement data collection scripts
3. [PENDING] Implement transformers
4. [PENDING] Implement validation
5. [PENDING] Seed to Orion-LD
6. [PENDING] Test queries and relationships

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-13  
**Status:** Ready for implementation

