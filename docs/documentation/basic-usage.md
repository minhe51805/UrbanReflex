---
title: Basic Usage
description: Core concepts and common patterns for UrbanReflex
---

# Basic Usage

Các khái niệm cơ bản và patterns thường dùng khi làm việc với UrbanReflex.

---

## Making API Requests

### Using cURL

```bash
# GET request
curl "http://localhost:8000/v1/aqi/stations" \
  -H "X-API-Key: your_api_key"

# POST request with JSON
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### Using Python

```python
import httpx

async def fetch_stations():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/v1/aqi/stations",
            headers={"X-API-Key": "your_api_key"}
        )
        return response.json()
```

### Using TypeScript

```typescript
const fetchStations = async (): Promise<StationResponse> => {
  const response = await fetch("/api/aqi/stations", {
    headers: {
      "X-API-Key": "your_api_key",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};
```

---

## Authentication Flow

### 1. Register New User

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepass123",
    "full_name": "John Doe"
  }'
```

### 2. Login to Get Token

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### 3. Use Token in Requests

```bash
curl "http://localhost:8000/v1/users/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Working with Responses

### Standard Response Format

```json
{
  "results": [...],
  "meta": {
    "found": 100,
    "limit": 20,
    "offset": 0,
    "page": 1,
    "pages": 5
  }
}
```

### Pagination

```bash
# Get page 2 with 20 items per page
curl "http://localhost:8000/v1/aqi/stations?limit=20&offset=20"
```

### Filtering

```bash
# Filter by country
curl "http://localhost:8000/v1/aqi/stations?country=VN"

# Filter by city
curl "http://localhost:8000/v1/aqi/stations?city=Ho%20Chi%20Minh%20City"

# Filter by parameter
curl "http://localhost:8000/v1/aqi/stations?parameter=pm25"
```

---

## Common Patterns

### Error Handling

```python
import httpx
from fastapi import HTTPException

async def get_user(user_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return serialize_doc(user)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
```

### Async Operations

```python
# ✓ Good - Async I/O
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")
        return response.json()

# ✗ Bad - Blocking I/O
def fetch_data():
    response = requests.get("https://api.example.com")  # Blocking!
    return response.json()
```

### Type Safety (TypeScript)

```typescript
// Define interfaces
interface User {
  id: string;
  email: string;
  full_name: string;
  role: "citizen" | "admin" | "city_official";
}

// Use proper typing
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  return response.json();
};
```

---

## Working with NGSI-LD Entities

### Fetch Entities

```bash
curl "http://localhost:8000/v1/ngsi-ld/entities?type=RoadSegment&limit=10"
```

### Entity Structure

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
      "coordinates": [[106.6951, 10.7769], [106.6955, 10.7773]]
    }
  },
  "trafficFlow": {
    "type": "Property",
    "value": "heavy",
    "observedAt": "2025-12-04T10:00:00Z"
  }
}
```

---

## AI Services Usage

### Chat with AI Assistant

```bash
curl -X POST "http://localhost:8000/v1/ai/chat" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the air quality like in District 1 today?",
    "context": {
      "location": {
        "latitude": 10.7769,
        "longitude": 106.6951
      }
    }
  }'
```

### Classify Citizen Report

```bash
curl -X POST "http://localhost:8000/v1/citizen-reports/classify" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken streetlight",
    "description": "The streetlight at corner of Main St is not working"
  }'
```

---

## Next Steps

- [API Reference](./api.md) - Chi tiết đầy đủ tất cả endpoints
- [Data Models](./data-models.md) - NGSI-LD schemas và entity types
- [Error Handling](./error-handling.md) - Xử lý lỗi chi tiết

---

<div align="center">

**[← Getting Started](./getting-started.md)** | **[API Reference →](./api.md)**

</div>
