# 📋 API Reference

Complete REST API documentation for UrbanReflex platform.

## 🚀 Base URL

```
Production:  https://api.urbanreflex.dev/v1
Development: http://localhost:8000/v1
```

## 🔐 Authentication

UrbanReflex uses JWT tokens for authentication and API keys for programmatic access.

### JWT Authentication (Web App)

```bash
# Login to get JWT token
curl -X POST "/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer <jwt_token>" "/users/me"
```

### API Key Authentication (API Access)

```bash
# Use API key in header
curl -H "X-API-Key: <your_api_key>" "/aqi/stations"

# Or as query parameter
curl "/aqi/stations?api_key=<your_api_key>"
```

## 📊 Air Quality Endpoints

### Get AQI Stations

```http
GET /aqi/stations
```

**Parameters:**

- `limit` (integer, optional): Number of stations to return (default: 100, max: 1000)
- `offset` (integer, optional): Pagination offset (default: 0)
- `country` (string, optional): Filter by country code (ISO 3166-1 alpha-2)
- `city` (string, optional): Filter by city name
- `parameter` (string, optional): Filter by pollutant (pm25, pm10, o3, no2, so2, co)

**Response:**

```json
{
  "results": [
    {
      "id": 12345,
      "name": "Ho Chi Minh City - District 1",
      "city": "Ho Chi Minh City",
      "country": "VN",
      "coordinates": {
        "latitude": 10.7769,
        "longitude": 106.6951
      },
      "measurements": [
        {
          "parameter": "pm25",
          "value": 25.5,
          "unit": "µg/m³",
          "last_updated": "2025-12-04T10:00:00Z"
        }
      ]
    }
  ],
  "meta": {
    "found": 1234,
    "limit": 100,
    "offset": 0,
    "page": 1,
    "pages": 13
  }
}
```

### Get Station Details

```http
GET /aqi/stations/{station_id}
```

**Parameters:**

- `station_id` (integer): Station ID

**Response:**

```json
{
  "id": 12345,
  "name": "Ho Chi Minh City - District 1",
  "city": "Ho Chi Minh City",
  "country": "VN",
  "coordinates": {
    "latitude": 10.7769,
    "longitude": 106.6951
  },
  "measurements": [
    {
      "parameter": "pm25",
      "value": 25.5,
      "unit": "µg/m³",
      "last_updated": "2025-12-04T10:00:00Z",
      "aqi": {
        "value": 80,
        "category": "Moderate",
        "color": "#FFDE33"
      }
    }
  ],
  "historical_data": {
    "available_from": "2024-01-01T00:00:00Z",
    "last_updated": "2025-12-04T10:00:00Z"
  }
}
```

### Get Historical Data

```http
GET /aqi/stations/{station_id}/measurements
```

**Parameters:**

- `station_id` (integer): Station ID
- `parameter` (string): Pollutant parameter (pm25, pm10, o3, no2, so2, co)
- `date_from` (string): Start date (ISO 8601 format)
- `date_to` (string): End date (ISO 8601 format)
- `limit` (integer, optional): Max records (default: 1000)

**Response:**

```json
{
  "results": [
    {
      "parameter": "pm25",
      "value": 25.5,
      "unit": "µg/m³",
      "date": {
        "utc": "2025-12-04T10:00:00Z",
        "local": "2025-12-04T17:00:00+07:00"
      }
    }
  ],
  "meta": {
    "station_id": 12345,
    "parameter": "pm25",
    "found": 144,
    "limit": 1000
  }
}
```

## 🏙️ Smart City Endpoints

### Get NGSI-LD Entities

```http
GET /ngsi-ld/entities
```

**Parameters:**

- `type` (string, optional): Entity type (RoadSegment, Streetlight, WeatherObserved, etc.)
- `limit` (integer, optional): Number of entities (default: 50, max: 100)
- `georel` (string, optional): Geographical relationship (near, within, etc.)
- `geometry` (string, optional): Geometry type (Point, Polygon)
- `coordinates` (string, optional): Geometry coordinates

**Response:**

```json
[
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
    "trafficFlow": {
      "type": "Property",
      "value": "heavy",
      "observedAt": "2025-12-04T10:00:00Z"
    }
  }
]
```

### Get Entity by ID

```http
GET /ngsi-ld/entities/{entity_id}
```

**Parameters:**

- `entity_id` (string): NGSI-LD entity ID

**Response:**

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
    "unitCode": "WTT",
    "observedAt": "2025-12-04T10:00:00Z"
  }
}
```

## 👥 User Management

### Get Current User

```http
GET /users/me
```

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Response:**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "citizen",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "api_keys": [
    {
      "id": "key123",
      "name": "Development Key",
      "created_at": "2025-01-01T00:00:00Z",
      "last_used": "2025-12-04T09:30:00Z"
    }
  ]
}
```

### Create API Key

```http
POST /users/api-keys
```

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Body:**

```json
{
  "name": "My API Key",
  "description": "For my mobile app"
}
```

**Response:**

```json
{
  "id": "key456",
  "name": "My API Key",
  "key": "ur_live_1234567890abcdef...",
  "created_at": "2025-12-04T10:00:00Z"
}
```

## 📝 Citizen Reports

### Create Report

```http
POST /citizen-reports
```

**Headers:**

- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Body:**

```
title: Broken streetlight on Main Street
description: The streetlight at the corner of Main St and 1st Ave has been out for 3 days
category: streetlight
priority: medium
location[latitude]: 10.7769
location[longitude]: 106.6951
photos: [file1.jpg, file2.jpg]
```

**Response:**

```json
{
  "id": "report123",
  "title": "Broken streetlight on Main Street",
  "description": "The streetlight at the corner of Main St and 1st Ave has been out for 3 days",
  "category": "streetlight",
  "priority": "medium",
  "status": "open",
  "location": {
    "type": "Point",
    "coordinates": [106.6951, 10.7769]
  },
  "photos": [
    "https://storage.urbanreflex.dev/reports/report123_photo1.jpg",
    "https://storage.urbanreflex.dev/reports/report123_photo2.jpg"
  ],
  "created_at": "2025-12-04T10:00:00Z",
  "created_by": "user123"
}
```

### Get Reports

```http
GET /citizen-reports
```

**Parameters:**

- `limit` (integer, optional): Number of reports (default: 20, max: 100)
- `offset` (integer, optional): Pagination offset
- `status` (string, optional): Filter by status (open, in_progress, resolved, closed)
- `category` (string, optional): Filter by category
- `created_by` (string, optional): Filter by creator (requires admin role)

**Response:**

```json
{
  "results": [
    {
      "id": "report123",
      "title": "Broken streetlight on Main Street",
      "category": "streetlight",
      "priority": "medium",
      "status": "open",
      "location": {
        "type": "Point",
        "coordinates": [106.6951, 10.7769]
      },
      "created_at": "2025-12-04T10:00:00Z",
      "votes": 5,
      "comments_count": 2
    }
  ],
  "meta": {
    "found": 45,
    "limit": 20,
    "offset": 0
  }
}
```

## 🤖 AI Services

### Chat with AI Assistant

```http
POST /ai/chat
```

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Body:**

```json
{
  "message": "What's the air quality like in Ho Chi Minh City today?",
  "context": {
    "location": {
      "latitude": 10.7769,
      "longitude": 106.6951
    }
  }
}
```

**Response:**

```json
{
  "response": "Based on the latest data, Ho Chi Minh City currently has moderate air quality with a PM2.5 level of 25.5 µg/m³. This corresponds to an AQI of 80, which is considered acceptable for most people. However, sensitive individuals may experience minor breathing discomfort.",
  "sources": [
    {
      "type": "aqi_station",
      "id": 12345,
      "data": { "pm25": 25.5, "aqi": 80 }
    }
  ],
  "suggestions": [
    "Check hourly forecasts",
    "View nearby stations",
    "Set up air quality alerts"
  ]
}
```

### Search with Natural Language

```http
POST /ai/search
```

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Body:**

```json
{
  "query": "Find all broken streetlights reported in District 1 this month",
  "filters": {
    "date_range": "2025-12-01/2025-12-31"
  }
}
```

**Response:**

```json
{
  "results": [
    {
      "type": "citizen_report",
      "relevance_score": 0.95,
      "data": {
        "id": "report123",
        "title": "Broken streetlight on Main Street",
        "category": "streetlight",
        "status": "open",
        "location": { "type": "Point", "coordinates": [106.6951, 10.7769] }
      }
    }
  ],
  "interpretation": {
    "intent": "search_reports",
    "entities": {
      "category": "streetlight",
      "status": "broken",
      "location": "District 1",
      "time_period": "this month"
    }
  },
  "total_results": 12
}
```

## 📊 Analytics & Statistics

### Get System Statistics

```http
GET /analytics/stats
```

**Headers:**

- `Authorization: Bearer <jwt_token>`
- Requires `admin` role

**Response:**

```json
{
  "overview": {
    "total_users": 15234,
    "active_users_today": 1523,
    "api_calls_today": 45234,
    "citizen_reports_total": 3421
  },
  "air_quality": {
    "stations_online": 892,
    "stations_total": 950,
    "latest_measurements": 45234,
    "data_freshness": "2 minutes ago"
  },
  "reports": {
    "open": 156,
    "in_progress": 89,
    "resolved_today": 23,
    "avg_resolution_time": "4.2 days"
  }
}
```

## 🚨 Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "request_id": "req_123456"
  }
}
```

## 🔄 Rate Limiting

### Limits by Plan

| Plan       | Requests/Hour | Burst  |
| ---------- | ------------- | ------ |
| Free       | 1,000         | 100    |
| Developer  | 10,000        | 500    |
| Pro        | 100,000       | 2,000  |
| Enterprise | Unlimited     | 10,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1701691200
```

## 📡 Webhooks

### Subscribe to Events

```http
POST /webhooks
```

**Body:**

```json
{
  "url": "https://yourapp.com/webhooks/urbanreflex",
  "events": ["report.created", "aqi.alert", "measurement.updated"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload Example

```json
{
  "event": "report.created",
  "timestamp": "2025-12-04T10:00:00Z",
  "data": {
    "report": {
      "id": "report123",
      "title": "Broken streetlight",
      "category": "streetlight",
      "location": { "type": "Point", "coordinates": [106.6951, 10.7769] }
    }
  }
}
```

## 🔍 Testing

### Postman Collection

Download our [Postman Collection](https://github.com/minhe51805/UrbanReflex/blob/main/docs/postman/UrbanReflex.postman_collection.json) for easy API testing.

### cURL Examples

```bash
# Get all air quality stations
curl "https://api.urbanreflex.dev/v1/aqi/stations?limit=10" \
  -H "X-API-Key: your_api_key"

# Create a citizen report
curl -X POST "https://api.urbanreflex.dev/v1/citizen-reports" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "category": "road",
    "priority": "high",
    "location": {"latitude": 10.7769, "longitude": 106.6951}
  }'
```

---

<div align="center">

**Need help?** Check our [FAQ](./FAQ.md) or [join our community](https://github.com/minhe51805/UrbanReflex/discussions)

[🏠 Back to Main Documentation](../README.md) • [📚 Documentation Index](./INDEX.md)

</div>
