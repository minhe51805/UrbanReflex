# API Reference

Complete REST API documentation for UrbanReflex platform. This guide covers all available endpoints, request/response formats, authentication, and examples.

## Table of Contents

- [Overview](#overview)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Common Parameters](#common-parameters)
- [Error Handling](#error-handling)
- [Citizen Reports API](#citizen-reports-api)
- [AI Chatbot API](#ai-chatbot-api)
- [Items API](#items-api)
- [Users API](#users-api)
- [Admin API](#admin-api)
- [NGSI-LD Integration](#ngsi-ld-integration)
- [Rate Limiting](#rate-limiting)
- [Versioning](#versioning)

---

## Overview

UrbanReflex provides a RESTful API built with FastAPI, offering automatic interactive documentation and type-safe request/response handling.

**Key Features**:

- RESTful design principles
- JSON request/response format
- Automatic OpenAPI/Swagger documentation
- Request validation with Pydantic
- CORS support for web applications
- Async request handling
- Comprehensive error messages

**API Capabilities**:

- Manage citizen reports
- AI-powered chatbot interactions
- NGSI-LD entity operations
- User authentication and management
- Administrative functions

---

## Base URLs

### Development

```
http://localhost:8000
```

### Production (Future)

```
https://api.urbanreflex.dev
```

### Documentation URLs

**Interactive API Documentation (Swagger UI)**

```
http://localhost:8000/docs
```

**Alternative Documentation (ReDoc)**

```
http://localhost:8000/redoc
```

**OpenAPI JSON Schema**

```
http://localhost:8000/openapi.json
```

---

## Authentication

### Current Implementation

The current version does not require authentication for most endpoints. This is suitable for development and internal testing.

### Future Authentication (Planned)

**JWT Bearer Token Authentication**

```http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword123"
}
```

**Response**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Using the Token**:

```http
GET /api/v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key Authentication (Future)

For programmatic access:

```http
GET /api/v1/citizen-reports
X-API-Key: your_api_key_here
```

---

## Common Parameters

### Pagination Parameters

Most list endpoints support pagination:

**Query Parameters**:

- `limit` (integer): Number of items to return (default: 100, max: 1000)
- `offset` (integer): Number of items to skip (default: 0)
- `page` (integer): Page number (alternative to offset)

**Example**:

```http
GET /api/v1/citizen-reports?limit=20&offset=40
```

**Response includes metadata**:

```json
{
  "data": [...],
  "meta": {
    "total": 350,
    "limit": 20,
    "offset": 40,
    "page": 3,
    "pages": 18
  }
}
```

### Filtering Parameters

Common filter parameters:

- `type`: Filter by entity type
- `category`: Filter by category
- `status`: Filter by status
- `created_after`: ISO 8601 datetime
- `created_before`: ISO 8601 datetime

**Example**:

```http
GET /api/v1/citizen-reports?category=infrastructure&status=pending
```

### Sorting Parameters

- `sort_by`: Field name to sort by
- `order`: `asc` or `desc` (default: `desc`)

**Example**:

```http
GET /api/v1/citizen-reports?sort_by=created_at&order=desc
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 400,
  "error_type": "ValidationError"
}
```

### HTTP Status Codes

**Success Codes**:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Request succeeded, no response body

**Client Error Codes**:

- `400 Bad Request` - Invalid request format or parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error

**Server Error Codes**:

- `500 Internal Server Error` - Server-side error
- `502 Bad Gateway` - External service error
- `503 Service Unavailable` - Service temporarily unavailable

### Example Error Responses

**Validation Error (422)**:

```json
{
  "detail": [
    {
      "loc": ["body", "description"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Not Found (404)**:

```json
{
  "detail": "CitizenReport with ID 'urn:ngsi-ld:CitizenReport:123' not found"
}
```

**Server Error (500)**:

```json
{
  "detail": "Internal server error occurred",
  "error_type": "DatabaseConnectionError"
}
```

---

## Citizen Reports API

Endpoints for managing citizen-submitted reports about urban issues.

### Classify Citizen Report

Classify and prioritize an existing citizen report using NLP.

**Endpoint**: `POST /api/v1/citizen-reports/classify/{entity_id}`

**Parameters**:

- `entity_id` (path, required): NGSI-LD entity ID of the report

**Description**:

1. Retrieves the CitizenReport entity from Orion-LD
2. Uses NLP classifier to determine category (infrastructure, environment, safety, etc.)
3. Applies POI-based priority adjustment
4. Updates the entity with classification results

**Request**:

```http
POST /api/v1/citizen-reports/classify/urn:ngsi-ld:CitizenReport:001
```

**Response** (200 OK):

```json
{
  "entity_id": "urn:ngsi-ld:CitizenReport:001",
  "category": "infrastructure",
  "priority": "high",
  "confidence": 0.89,
  "poi_proximity": {
    "nearby_pois": [
      {
        "type": "hospital",
        "distance": 250,
        "name": "District 1 Hospital"
      }
    ],
    "priority_boost": 1
  },
  "updated_at": "2025-12-08T10:30:00Z"
}
```

**Error Responses**:

Not Found (404):

```json
{
  "detail": "CitizenReport entity not found in Orion-LD"
}
```

Classification Error (500):

```json
{
  "detail": "Failed to classify report: NLP service unavailable"
}
```

### Get Citizen Report

Retrieve a specific citizen report by ID.

**Endpoint**: `GET /api/v1/citizen-reports/{entity_id}`

**Parameters**:

- `entity_id` (path, required): NGSI-LD entity ID

**Request**:

```http
GET /api/v1/citizen-reports/urn:ngsi-ld:CitizenReport:001
```

**Response** (200 OK):

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "id": "urn:ngsi-ld:CitizenReport:001",
  "type": "CitizenReport",
  "description": {
    "type": "Property",
    "value": "Broken streetlight on Nguyen Hue Street"
  },
  "category": {
    "type": "Property",
    "value": "infrastructure"
  },
  "priority": {
    "type": "Property",
    "value": "high"
  },
  "status": {
    "type": "Property",
    "value": "pending"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [106.7009, 10.7756]
    }
  },
  "reportedBy": {
    "type": "Property",
    "value": "user@example.com"
  },
  "createdAt": "2025-12-08T10:00:00Z",
  "modifiedAt": "2025-12-08T10:30:00Z"
}
```

### List Citizen Reports

Retrieve a list of citizen reports with filtering and pagination.

**Endpoint**: `GET /api/v1/citizen-reports`

**Query Parameters**:

- `limit` (integer): Max items (default: 100)
- `offset` (integer): Skip items (default: 0)
- `category` (string): Filter by category
- `priority` (string): Filter by priority (low, medium, high, critical)
- `status` (string): Filter by status (pending, in_progress, resolved, rejected)

**Request**:

```http
GET /api/v1/citizen-reports?category=infrastructure&priority=high&limit=20
```

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "urn:ngsi-ld:CitizenReport:001",
      "type": "CitizenReport",
      "description": "Broken streetlight",
      "category": "infrastructure",
      "priority": "high",
      "status": "pending",
      "location": {
        "type": "Point",
        "coordinates": [106.7009, 10.7756]
      },
      "createdAt": "2025-12-08T10:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "page": 1,
    "pages": 8
  }
}
```

### Create Citizen Report

Create a new citizen report.

**Endpoint**: `POST /api/v1/citizen-reports`

**Request Body**:

```json
{
  "description": "Pothole on Le Loi Boulevard causing traffic issues",
  "location": {
    "type": "Point",
    "coordinates": [106.7009, 10.7756]
  },
  "category": "infrastructure",
  "reportedBy": "user@example.com",
  "images": ["https://storage.urbanreflex.dev/images/report-001.jpg"]
}
```

**Response** (201 Created):

```json
{
  "id": "urn:ngsi-ld:CitizenReport:002",
  "message": "Report created successfully",
  "entity_url": "http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:CitizenReport:002"
}
```

### Update Citizen Report

Update an existing citizen report.

**Endpoint**: `PATCH /api/v1/citizen-reports/{entity_id}`

**Request Body**:

```json
{
  "status": "in_progress",
  "assignedTo": "maintenance@hcmc.gov.vn",
  "notes": "Maintenance crew dispatched"
}
```

**Response** (200 OK):

```json
{
  "message": "Report updated successfully",
  "entity_id": "urn:ngsi-ld:CitizenReport:001"
}
```

### Delete Citizen Report

Delete a citizen report.

**Endpoint**: `DELETE /api/v1/citizen-reports/{entity_id}`

**Response** (204 No Content)

---

## AI Chatbot API

Endpoints for AI-powered chatbot interactions using Gemini AI.

### Send Chat Message

Send a message to the AI chatbot and receive a streaming response.

**Endpoint**: `POST /ai-service/chatbot/chat`

**Request Body**:

```json
{
  "message": "What is the current air quality in District 1?",
  "conversation_id": "conv_123456",
  "user_id": "user@example.com"
}
```

**Parameters**:

- `message` (string, required): User's message
- `conversation_id` (string, optional): Continue existing conversation
- `user_id` (string, optional): User identifier for context

**Response** (200 OK - Streaming):

Content-Type: `text/event-stream`

```
data: {"type": "start", "conversation_id": "conv_123456"}

data: {"type": "token", "content": "The"}

data: {"type": "token", "content": " current"}

data: {"type": "token", "content": " air"}

data: {"type": "token", "content": " quality"}

data: {"type": "end", "full_response": "The current air quality in District 1 is..."}
```

**Non-Streaming Response**:

For clients that don't support streaming, add `?stream=false`:

```http
POST /ai-service/chatbot/chat?stream=false
```

```json
{
  "conversation_id": "conv_123456",
  "response": "The current air quality in District 1 is moderate with PM2.5 at 35 µg/m³. This is acceptable for most people, though sensitive groups should consider limiting prolonged outdoor activities.",
  "sources": [
    {
      "type": "AirQualityObserved",
      "id": "urn:ngsi-ld:AirQualityObserved:District1-001",
      "timestamp": "2025-12-08T10:00:00Z"
    }
  ],
  "timestamp": "2025-12-08T10:30:45Z"
}
```

### Get Chat History

Retrieve conversation history.

**Endpoint**: `GET /ai-service/chatbot/history/{conversation_id}`

**Response** (200 OK):

```json
{
  "conversation_id": "conv_123456",
  "messages": [
    {
      "role": "user",
      "content": "What is the current air quality?",
      "timestamp": "2025-12-08T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "The current air quality is moderate...",
      "timestamp": "2025-12-08T10:30:05Z"
    }
  ],
  "created_at": "2025-12-08T10:30:00Z",
  "updated_at": "2025-12-08T10:30:05Z"
}
```

### Clear Chat History

Delete a conversation.

**Endpoint**: `DELETE /ai-service/chatbot/history/{conversation_id}`

**Response** (204 No Content)

---

## Items API

Generic CRUD operations for items (placeholder for custom entities).

### List Items

**Endpoint**: `GET /api/v1/items`

**Query Parameters**:

- `skip` (integer): Offset (default: 0)
- `limit` (integer): Max items (default: 100)

**Response** (200 OK):

```json
{
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "description": "Description of item 1",
      "price": 29.99,
      "tax": 2.5
    }
  ],
  "total": 50,
  "skip": 0,
  "limit": 100
}
```

### Get Item

**Endpoint**: `GET /api/v1/items/{item_id}`

**Response** (200 OK):

```json
{
  "id": 1,
  "name": "Item 1",
  "description": "Description of item 1",
  "price": 29.99,
  "tax": 2.5
}
```

### Create Item

**Endpoint**: `POST /api/v1/items`

**Request Body**:

```json
{
  "name": "New Item",
  "description": "Item description",
  "price": 19.99,
  "tax": 1.6
}
```

**Response** (201 Created):

```json
{
  "id": 51,
  "name": "New Item",
  "description": "Item description",
  "price": 19.99,
  "tax": 1.6
}
```

---

## Users API

User management endpoints.

### Get Current User

**Endpoint**: `GET /api/v1/users/me`

**Headers**:

```
Authorization: Bearer <token>
```

**Response** (200 OK):

```json
{
  "id": "user_123",
  "username": "user@example.com",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "citizen",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### List Users (Admin)

**Endpoint**: `GET /api/v1/users`

**Query Parameters**:

- `limit` (integer): Max users (default: 50)
- `offset` (integer): Skip users (default: 0)
- `role` (string): Filter by role

**Response** (200 OK):

```json
{
  "users": [
    {
      "id": "user_123",
      "username": "user@example.com",
      "email": "user@example.com",
      "role": "citizen",
      "active": true
    }
  ],
  "total": 1250,
  "limit": 50,
  "offset": 0
}
```

---

## Admin API

Administrative endpoints (requires admin role).

### System Health

**Endpoint**: `GET /admin/health`

**Response** (200 OK):

```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "orion_ld": "connected",
    "ai_service": "connected"
  },
  "uptime": 86400,
  "version": "1.0.0"
}
```

### System Statistics

**Endpoint**: `GET /admin/stats`

**Response** (200 OK):

```json
{
  "total_reports": 5432,
  "active_users": 1250,
  "reports_today": 45,
  "reports_this_week": 312,
  "reports_by_category": {
    "infrastructure": 2156,
    "environment": 1843,
    "safety": 987,
    "other": 446
  },
  "reports_by_priority": {
    "critical": 123,
    "high": 567,
    "medium": 2341,
    "low": 2401
  }
}
```

---

## NGSI-LD Integration

UrbanReflex integrates with Orion-LD Context Broker for NGSI-LD entity management.

### Orion-LD Base URL

```
http://localhost:1026/ngsi-ld/v1
```

### Direct NGSI-LD Operations

**List All Entities**:

```http
GET http://localhost:1026/ngsi-ld/v1/entities
```

**Get Entity by ID**:

```http
GET http://localhost:1026/ngsi-ld/v1/entities/{entity_id}
```

**Query by Type**:

```http
GET http://localhost:1026/ngsi-ld/v1/entities?type=CitizenReport
```

**Geo-Query (Entities Near Point)**:

```http
GET http://localhost:1026/ngsi-ld/v1/entities?type=CitizenReport&georel=near;maxDistance==1000&geometry=Point&coordinates=[106.7009,10.7756]
```

**Temporal Query**:

```http
GET http://localhost:1026/ngsi-ld/v1/temporal/entities?type=AirQualityObserved&timerel=after&timeAt=2025-12-01T00:00:00Z
```

For more details, see [NGSI-LD API Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf).

---

## Rate Limiting

### Current Implementation

No rate limiting in development version.

### Future Implementation

**Rate Limits (Planned)**:

- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Admin**: 10000 requests/hour

**Rate Limit Headers**:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1702123456
```

**Rate Limit Exceeded Response** (429):

```json
{
  "detail": "Rate limit exceeded. Try again in 3600 seconds.",
  "retry_after": 3600
}
```

---

## Versioning

### Current Version

All endpoints are under `/api/v1/` namespace.

### Version Strategy

- Major versions for breaking changes (`/api/v2/`)
- Backward compatibility maintained for at least 6 months
- Deprecated endpoints marked in documentation
- Version specified in API response headers

**Example**:

```
X-API-Version: 1.0.0
```

### Deprecation Notice Format

```json
{
  "data": {...},
  "deprecation_warning": {
    "message": "This endpoint will be deprecated on 2026-06-01",
    "alternative": "/api/v2/citizen-reports",
    "docs": "https://docs.urbanreflex.dev/api/v2/migration"
  }
}
```

---

## Testing the API

### Using cURL

**Health Check**:

```bash
curl http://localhost:8000/health
```

**Classify Report**:

```bash
curl -X POST http://localhost:8000/api/v1/citizen-reports/classify/urn:ngsi-ld:CitizenReport:001
```

**Send Chat Message**:

```bash
curl -X POST http://localhost:8000/ai-service/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the air quality in District 1?"}'
```

### Using Python

```python
import requests

# Health check
response = requests.get("http://localhost:8000/health")
print(response.json())

# Classify report
response = requests.post(
    "http://localhost:8000/api/v1/citizen-reports/classify/urn:ngsi-ld:CitizenReport:001"
)
print(response.json())

# Chat with AI
response = requests.post(
    "http://localhost:8000/ai-service/chatbot/chat",
    json={"message": "What is the air quality?"}
)
print(response.json())
```

### Using JavaScript (Fetch)

```javascript
// Health check
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Classify report
fetch('http://localhost:8000/api/v1/citizen-reports/classify/urn:ngsi-ld:CitizenReport:001', {
  method: 'POST',
})
  .then(res => res.json())
  .then(data => console.log(data));

// Chat with AI
fetch('http://localhost:8000/ai-service/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'What is the air quality?' }),
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Interactive Documentation

### Swagger UI

Visit http://localhost:8000/docs for interactive API documentation where you can:

- Browse all available endpoints
- View request/response schemas
- Try API calls directly from the browser
- Download OpenAPI specification

### ReDoc

Visit http://localhost:8000/redoc for alternative documentation with:

- Clean, readable format
- Code samples in multiple languages
- Organized by tags
- Search functionality

---

## Additional Resources

- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATA_MODEL_AND_ENTITIES.md](./DATA_MODEL_AND_ENTITIES.md) - Data models
- [OpenAPI Specification](http://localhost:8000/openapi.json) - Machine-readable API spec
