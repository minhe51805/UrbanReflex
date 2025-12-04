# NGSI-LD Format Guide for UrbanReflex

Comprehensive guide to NGSI-LD specification and its application in the UrbanReflex project. Explains JSON-LD format, entities, properties, and relationships.

---

## 📚 What is NGSI-LD?

**NGSI-LD** = Next Generation Service Interface - Linked Data

- API standard published by **ETSI ISG CIM**
- Designed for IoT and Smart Cities applications
- Based on **JSON-LD** (JSON for Linked Data)
- Primary standard used by **FIWARE** ecosystem

**Purpose:**
- Represent data as **Linked Data** (interconnected information)
- Enable **cross-references** between entities (relationships)
- Ensure **interoperability** across different systems

---

## 🏗️ NGSI-LD Entity Structure

Every NGSI-LD entity MUST have:

```json
{
  "@context": "...",        // JSON-LD context (vocabulary definition)
  "id": "urn:...",          // Unique identifier
  "type": "EntityType",     // Entity type (e.g., WeatherObserved)
  "property1": {...},       // Properties (attributes)
  "property2": {...},
  "location": {...}         // GeoProperty (location)
}
```

---

## 📦 3 Types of Attributes

### 1️⃣ **Property** - Standard Attribute

Format:
```json
{
  "type": "Property",
  "value": <any value>,
  "observedAt": "2025-11-13T10:00:00Z"  // optional: timestamp
}
```

**Example:**
```json
{
  "temperature": {
    "type": "Property",
    "value": 27.5,
    "unitCode": "CEL",
    "observedAt": "2025-11-13T10:30:00Z"
  }
}
```

---

### 2️⃣ **GeoProperty** - Geographic Attribute

Format:
```json
{
  "type": "GeoProperty",
  "value": {
    "type": "Point",           // or "LineString", "Polygon"
    "coordinates": [lon, lat]  // [longitude, latitude] - ORDER MATTERS!
  }
}
```

**Example:**
```json
{
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.700806, 10.776889]  // [lon, lat] Ho Chi Minh City
    }
  }
}
```

**⚠️ NOTE:** GeoJSON uses `[longitude, latitude]`, NOT `[lat, lon]`!

---

### 3️⃣ **Relationship** - Link to Another Entity

Format:
```json
{
  "type": "Relationship",
  "object": "urn:ngsi-ld:EntityType:entityId"  // ID of related entity
}
```

**Example:**
```json
{
  "refRoadSegment": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RoadSegment:HCM-Road-001"
  }
}
```

---

## 🆔 Entity ID Format

**Standard format:** `urn:ngsi-ld:EntityType:UniqueID`

**Examples:**
```
urn:ngsi-ld:WeatherObserved:HCMC-Weather-20251113
urn:ngsi-ld:RoadSegment:HCMC-Q1-PhamNguLao
urn:ngsi-ld:Streetlight:HCMC-Light-001
```

**Rules:**
- `EntityType`: PascalCase (e.g., `WeatherObserved`)
- `UniqueID`: custom, recommended to use prefix (e.g., `HCMC-`)

---

## 🌐 @context - JSON-LD Context

`@context` defines the **vocabulary** for the entity.

**2 ways to use:**

### Method 1: URL (recommended)
```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
}
```

### Method 2: Inline object
```json
{
  "@context": {
    "temperature": "https://schema.org/temperature",
    "location": "https://schema.org/location"
  }
}
```

**For UrbanReflex:**
```json
{
  "@context": [
    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
  ]
}
```

---

## 📝 Complete Example: WeatherObserved Entity

```json
{
  "@context": [
    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
  ],
  "id": "urn:ngsi-ld:WeatherObserved:HCMC-Weather-20251113",
  "type": "WeatherObserved",
  "dateObserved": {
    "type": "Property",
    "value": "2025-11-13T10:30:00Z"
  },
  "temperature": {
    "type": "Property",
    "value": 27.5,
    "unitCode": "CEL"
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.75,
    "unitCode": "C62"
  },
  "atmosphericPressure": {
    "type": "Property",
    "value": 1013.2,
    "unitCode": "A97"
  },
  "windSpeed": {
    "type": "Property",
    "value": 3.5,
    "unitCode": "MTS"
  },
  "weatherType": {
    "type": "Property",
    "value": "Scattered clouds"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.700806, 10.776889]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Ho Chi Minh City",
      "addressCountry": "VN"
    }
  }
}
```

---

## 🔗 Relationships - Linking Entities

### Example: CitizenReport references RoadSegment

**CitizenReport entity:**
```json
{
  "id": "urn:ngsi-ld:CitizenReport:HCMC-Report-001",
  "type": "CitizenReport",
  "description": {
    "type": "Property",
    "value": "Broken manhole cover on Pham Ngu Lao Street"
  },
  "category": {
    "type": "Property",
    "value": "infrastructure"
  },
  "refRoadSegment": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RoadSegment:HCMC-Q1-PhamNguLao"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.692, 10.768]
    }
  }
}
```

**RoadSegment entity:**
```json
{
  "id": "urn:ngsi-ld:RoadSegment:HCMC-Q1-PhamNguLao",
  "type": "RoadSegment",
  "name": {
    "type": "Property",
    "value": "Pham Ngu Lao"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "LineString",
      "coordinates": [
        [106.691, 10.767],
        [106.693, 10.769]
      ]
    }
  }
}
```

→ `CitizenReport` **links to** `RoadSegment` via `refRoadSegment`

---

## ✅ Checklist for Valid NGSI-LD Entity

- [ ] Has `@context` in correct format
- [ ] Has `id` following `urn:ngsi-ld:Type:ID` format
- [ ] Has `type` (entity type)
- [ ] All attributes have `"type": "Property"` or `"GeoProperty"` or `"Relationship"`
- [ ] GeoProperty uses GeoJSON format
- [ ] Relationship uses `"object": "urn:..."` pointing to another entity
- [ ] Timestamps use ISO 8601 format

---

## 🎯 Application in UrbanReflex

### Entities to Create:

| Entity Type | ID Prefix | Example |
|-------------|-----------|---------|
| `RoadSegment` | `HCMC-` | `urn:ngsi-ld:RoadSegment:HCMC-32575823` |
| `WeatherObserved` | `HCMC-Weather-` | `urn:ngsi-ld:WeatherObserved:HCMC-Weather-20251113` |
| `AirQualityObserved` | `HCMC-AQI-` | `urn:ngsi-ld:AirQualityObserved:HCMC-AQI-CMT8-20251113` |
| `Streetlight` | `HCMC-Light-` | `urn:ngsi-ld:Streetlight:HCMC-Light-001` |
| `PointOfInterest` | `HCMC-POI-` | `urn:ngsi-ld:PointOfInterest:HCMC-POI-School-001` |
| `CitizenReport` | `HCMC-Report-` | `urn:ngsi-ld:CitizenReport:HCMC-Report-001` |

### Context for UrbanReflex:

```python
NGSI_LD_CONTEXTS = [
    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Streetlighting/master/context.jsonld",
    "https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld"
]
```

---

## 📚 Reference Documentation

- ETSI NGSI-LD Spec: https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf
- NGSI-LD Primer: https://www.etsi.org/deliver/etsi_gr/CIM/001_099/008/01.01.01_60/gr_CIM008v010101p.pdf
- FiWARE Smart Data Models: https://github.com/smart-data-models
- JSON-LD: https://json-ld.org/

---

## 🔑 Key Takeaways

1. ✅ **Every attribute must have `type`**: `Property`, `GeoProperty`, or `Relationship`
2. ✅ **GeoJSON uses [lon, lat]**, NOT [lat, lon]
3. ✅ **ID format**: `urn:ngsi-ld:EntityType:UniqueID`
4. ✅ **@context** defines vocabulary (use URLs from FiWARE)
5. ✅ **Relationships** create **Linked Data** (this is NGSI-LD's strength)
