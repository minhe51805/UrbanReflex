---
title: API Reference
description: Complete REST API documentation for UrbanReflex
---

# API Reference

Complete REST API documentation cho UrbanReflex platform.

---

## Base URL

```
Production:  https://api.urbanreflex.dev/v1
Development: http://localhost:8000/v1
```

---

## Authentication

UrbanReflex sử dụng JWT tokens cho web authentication và API keys cho programmatic access.

### JWT Authentication

```bash
# Login to get JWT token
curl -X POST "/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in requests
curl -H "Authorization: Bearer <jwt_token>" "/users/me"
```

### API Key Authentication

```bash
# Use API key in header
curl -H "X-API-Key: <your_api_key>" "/aqi/stations"

# Or as query parameter
curl "/aqi/stations?api_key=<your_api_key>"
```

---

## Air Quality Endpoints

### GET /aqi/stations

Lấy danh sách các trạm đo chất lượng không khí.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 100 | Số lượng trạm (max: 1000) |
| `offset` | integer | 0 | Pagination offset |
| `country` | string | - | Filter theo country code (ISO 3166-1) |
| `city` | string | - | Filter theo tên thành phố |
| `parameter` | string | - | Pollutant: pm25, pm10, o3, no2, so2, co |

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
    "offset": 0
  }
}
```

### GET /aqi/stations/{station_id}

Lấy chi tiết một trạm cụ thể.

```bash
curl "/aqi/stations/12345"
```

### GET /aqi/stations/{station_id}/measurements

Lấy dữ liệu lịch sử của trạm.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parameter` | string | Yes | pm25, pm10, o3, no2, so2, co |
| `date_from` | string | Yes | Start date (ISO 8601) |
| `date_to` | string | Yes | End date (ISO 8601) |
| `limit` | integer | No | Max records (default: 1000) |

---

## Smart City Endpoints (NGSI-LD)

### GET /ngsi-ld/entities

Lấy danh sách NGSI-LD entities.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Entity type: RoadSegment, Streetlight, WeatherObserved |
| `limit` | integer | Max entities (default: 50, max: 100) |
| `georel` | string | Geographical relationship |
| `geometry` | string | Geometry type: Point, Polygon |
| `coordinates` | string | Geometry coordinates |

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
        "coordinates": [[106.6951, 10.7769], [106.6955, 10.7773]]
      }
    }
  }
]
```

### GET /ngsi-ld/entities/{entity_id}

Lấy entity theo ID.

```bash
curl "/ngsi-ld/entities/urn:ngsi-ld:Streetlight:001"
```

---

## User Management

### GET /users/me

Lấy thông tin user hiện tại.

**Headers:** `Authorization: Bearer <jwt_token>`

```json
{
  "id": "user123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "citizen",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### POST /users/api-keys

Tạo API key mới.

**Body:**

```json
{
  "name": "My API Key",
  "description": "For my mobile app"
}
```

---

## Citizen Reports

### POST /citizen-reports

Tạo báo cáo mới.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Body:**

```
title: Broken streetlight on Main Street
description: The streetlight has been out for 3 days
category: streetlight
priority: medium
location[latitude]: 10.7769
location[longitude]: 106.6951
photos: [file1.jpg, file2.jpg]
```

### GET /citizen-reports

Lấy danh sách reports.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Max reports (default: 20) |
| `offset` | integer | Pagination offset |
| `status` | string | open, in_progress, resolved, closed |
| `category` | string | Filter by category |

---

## AI Services

### POST /ai/chat

Chat với AI assistant.

**Body:**

```json
{
  "message": "What's the air quality like today?",
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
  "response": "The current air quality is moderate...",
  "sources": [...],
  "suggestions": [...]
}
```

### POST /ai/search

Natural language search.

```json
{
  "query": "Find broken streetlights in District 1",
  "filters": {
    "date_range": "2025-12-01/2025-12-31"
  }
}
```

---

## Rate Limiting

| Plan | Requests/Hour | Burst |
|------|---------------|-------|
| Free | 1,000 | 100 |
| Developer | 10,000 | 500 |
| Pro | 100,000 | 2,000 |
| Enterprise | Unlimited | 10,000 |

**Response Headers:**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1701691200
```

---

## Webhooks

### POST /webhooks

Subscribe to events.

```json
{
  "url": "https://yourapp.com/webhooks/urbanreflex",
  "events": ["report.created", "aqi.alert"],
  "secret": "your_webhook_secret"
}
```

---

<div align="center">

**[← Basic Usage](./basic-usage.md)** | **[Data Models →](./data-models.md)**

</div>
