---
title: Data Models
description: NGSI-LD schemas and entity definitions
---

# Data Models

Định nghĩa schemas và entity types được sử dụng trong UrbanReflex.

---

## NGSI-LD Overview

UrbanReflex tuân thủ tiêu chuẩn [NGSI-LD](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf) của ETSI cho Smart City data.

### Property Types

| Type | Description |
|------|-------------|
| `Property` | Standard data property |
| `GeoProperty` | Geographical location |
| `Relationship` | Reference to another entity |

---

## Entity Types

### RoadSegment

Đoạn đường trong mạng lưới giao thông.

```json
{
  "id": "urn:ngsi-ld:RoadSegment:001",
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
        [106.6951, 10.7769],
        [106.6955, 10.7773]
      ]
    }
  },
  "roadClass": {
    "type": "Property",
    "value": "primary"
  },
  "laneCount": {
    "type": "Property",
    "value": 4
  },
  "trafficFlow": {
    "type": "Property",
    "value": "heavy",
    "observedAt": "2025-12-04T10:00:00Z"
  }
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `name` | Property | Tên đường |
| `location` | GeoProperty | Tọa độ đường (LineString) |
| `roadClass` | Property | Loại: primary, secondary, residential |
| `laneCount` | Property | Số làn xe |
| `trafficFlow` | Property | light, moderate, heavy |

---

### Streetlight

Đèn đường trong hệ thống chiếu sáng công cộng.

```json
{
  "id": "urn:ngsi-ld:Streetlight:001",
  "type": "Streetlight",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.6951, 10.7769]
    }
  },
  "status": {
    "type": "Property",
    "value": "on",
    "observedAt": "2025-12-04T10:00:00Z"
  },
  "powerConsumption": {
    "type": "Property",
    "value": 25.5,
    "unitCode": "WTT"
  },
  "refRoadSegment": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:RoadSegment:001"
  }
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `location` | GeoProperty | Vị trí (Point) |
| `status` | Property | on, off, fault |
| `powerConsumption` | Property | Công suất tiêu thụ (W) |
| `refRoadSegment` | Relationship | Liên kết đến RoadSegment |

---

### WeatherObserved

Quan trắc thời tiết.

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:001",
  "type": "WeatherObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.6951, 10.7769]
    }
  },
  "temperature": {
    "type": "Property",
    "value": 28.5,
    "unitCode": "CEL"
  },
  "humidity": {
    "type": "Property",
    "value": 75,
    "unitCode": "P1"
  },
  "windSpeed": {
    "type": "Property",
    "value": 5.2,
    "unitCode": "MTS"
  },
  "observedAt": {
    "type": "Property",
    "value": "2025-12-04T10:00:00Z"
  }
}
```

---

### AirQualityObserved

Quan trắc chất lượng không khí.

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:001",
  "type": "AirQualityObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.6951, 10.7769]
    }
  },
  "pm25": {
    "type": "Property",
    "value": 25.5,
    "unitCode": "GQ"
  },
  "pm10": {
    "type": "Property",
    "value": 45.2,
    "unitCode": "GQ"
  },
  "aqi": {
    "type": "Property",
    "value": 80,
    "category": "Moderate"
  }
}
```

---

## User Schemas (MongoDB)

### User Collection

```javascript
{
  _id: ObjectId,
  email: String,           // Unique
  hashed_password: String,
  full_name: String,
  username: String,        // Unique
  role: String,            // "citizen", "admin", "city_official"
  is_active: Boolean,
  created_at: Date,
  api_keys: [
    {
      key_id: String,
      name: String,
      key_hash: String,
      created_at: Date,
      last_used: Date
    }
  ]
}
```

### Citizen Reports Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,        // "streetlight", "road", "waste", etc.
  priority: String,        // "low", "medium", "high", "critical"
  status: String,          // "open", "in_progress", "resolved", "closed"
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  photos: [String],        // URLs to stored images
  votes: Number,
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date,
  assigned_to: ObjectId,
  resolution_notes: String,
  resolved_at: Date
}
```

### Chat History Collection

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  session_id: String,
  messages: [
    {
      role: String,        // "user", "assistant"
      content: String,
      timestamp: Date,
      metadata: Object
    }
  ],
  created_at: Date,
  updated_at: Date
}
```

---

## Pydantic Schemas (Python)

### UserCreate

```python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
```

### UserResponse

```python
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
```

### Token

```python
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
```

---

## TypeScript Types

### User

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: "citizen" | "admin" | "city_official";
  is_active: boolean;
  created_at: string;
}
```

### CitizenReport

```typescript
interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  photos: string[];
  votes: number;
  created_at: string;
}
```

### NGSILDEntity

```typescript
interface NGSILDEntity {
  id: string;
  type: string;
  [key: string]: Property | GeoProperty | Relationship | string;
}

interface Property {
  type: "Property";
  value: string | number | boolean;
  observedAt?: string;
  unitCode?: string;
}

interface GeoProperty {
  type: "GeoProperty";
  value: {
    type: "Point" | "LineString" | "Polygon";
    coordinates: number[] | number[][];
  };
}
```

---

<div align="center">

**[← API Reference](./api.md)** | **[AI Services →](./ai-services.md)**

</div>
