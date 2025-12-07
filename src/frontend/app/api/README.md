# API Routes Directory

## Overview

The `app/api/` folder contains all API routes for the UrbanReflex application, using Next.js API Routes. These routes act as proxy/gateway between frontend and backend services (NGSI-LD Context Broker, Backend API).

## Structure

```
app/api/
├── admin/              # Admin API routes
│   ├── reports/       # Report management
│   └── users/         # User management
├── ngsi-ld/           # NGSI-LD Context Broker proxy
├── roads/             # Road segment APIs
├── reports/           # Citizen reports APIs
├── v1/                # Public API v1 (for API keys)
│   ├── [key]/         # Dynamic route with API key
│   └── keyapi/        # API key endpoint
├── keys/              # API key management
├── auth/              # Authentication APIs
├── weather/           # Weather data APIs
├── aqi/               # Air Quality APIs
├── streetlights/      # Streetlight APIs
└── tiles/             # Map tile proxy
```

## Main Flows

### 1. NGSI-LD Proxy Flow
```
Frontend Request
  ↓
/app/api/ngsi-ld?type=RoadSegment
  ↓
Add Link headers (contexts)
  ↓
Forward to NGSI-LD Broker
  http://103.178.233.233:1026/ngsi-ld/v1/entities
  ↓
Transform response (keyValues format)
  ↓
Return to frontend
```

### 2. Admin API Flow
```
Admin Dashboard Request
  ↓
/app/api/admin/reports
  ↓
Check authentication (Bearer token)
  ↓
Fetch from NGSI-LD (CitizenReport + RoadReport)
  ↓
Transform & aggregate data
  ↓
Apply filters (status, priority, search)
  ↓
Return formatted response
```

### 3. Public API v1 Flow (API Key Based)
```
External Request
  ↓
/app/api/v1/{apiKey}?type=RoadSegment
  ↓
Validate API key format
  ↓
Fetch all data from NGSI-LD with pagination
  ↓
Return full NGSI-LD format (not keyValues)
```

## Detailed API Routes

### `/api/ngsi-ld`
- **File**: `app/api/ngsi-ld/route.ts`
- **Methods**: GET, POST, PATCH
- **Function**: Proxy for NGSI-LD Context Broker
- **Query params**:
  - `type`: Entity type (RoadSegment, WeatherObserved, etc.)
  - `options`: Format (keyValues, etc.)
  - `limit`, `offset`: Pagination
- **Headers**: Automatically add Link headers (contexts)

### `/api/admin/reports`
- **File**: `app/api/admin/reports/route.ts`
- **Methods**: GET, POST
- **Function**: Report management for admin
- **GET**:
  - Fetch both `CitizenReport` and `RoadReport`
  - Filter by status, priority, search
  - Return formatted data with statistics
- **POST**: Create new report (delegate to `/api/reports`)

### `/api/admin/reports/[id]`
- **File**: `app/api/admin/reports/[id]/route.ts`
- **Methods**: GET, PATCH, DELETE
- **Function**: CRUD operations for single report
- **PATCH**: Update status, priority, category

### `/api/admin/users`
- **File**: `app/api/admin/users/route.ts`
- **Methods**: GET
- **Function**: Get list of users from backend

### `/api/admin/users/[id]`
- **File**: `app/api/admin/users/[id]/route.ts`
- **Methods**: PUT, DELETE
- **PUT**: Update user info or password
- **DELETE**: Delete user

### `/api/roads/[id]`
- **File**: `app/api/roads/[id]/route.ts`
- **Methods**: GET
- **Function**: Get full details of a road segment
- **Returns**:
  - Road segment info
  - Weather data (latest)
  - AQI stations (nearby)
  - Streetlights (filtered by refRoadSegment)
  - Reports (CitizenReport + RoadReport, filtered by refRoadSegment)
  - POIs (nearby)

### `/api/reports`
- **File**: `app/api/reports/route.ts`
- **Methods**: GET, POST
- **GET**: 
  - Spatial query with lat/lon/maxDistance
  - Return reports trong radius
- **POST**: Create new CitizenReport

### `/api/v1/[key]`
- **File**: `app/api/v1/[key]/route.ts`
- **Methods**: GET
- **Function**: Public API with API key authentication
- **Features**:
  - Fetch all entity types if no `type` param
  - Automatic pagination (limit=1000, iterate with offset)
  - Return full NGSI-LD format (not keyValues)
  - Support `all=true` to fetch all types

### `/api/v1/keyapi`
- **File**: `app/api/v1/keyapi/route.ts`
- **Methods**: GET
- **Function**: Get API keys of current user

### `/api/keys`
- **File**: `app/api/keys/route.ts`
- **Methods**: GET, POST
- **Function**: Manage API keys (proxy to backend)

## Authentication

### Admin Routes
- Requires `Authorization: Bearer <token>` header
- Token from `localStorage.getItem('auth_token')`
- Forward token to backend API

### Public API v1
- API key trong URL path: `/api/v1/{apiKey}`
- Validate format: `startsWith('ur_')`
- No Bearer token required

## Error Handling

All routes have error handling:
- Try-catch blocks
- Status code checks
- Detailed error logging
- User-friendly error messages
- Fallback responses (empty arrays, null values)

## Best Practices

1. **Always validate inputs**: Check query params, request body
2. **Handle errors gracefully**: Return appropriate status codes
3. **Log important events**: Console.log cho debugging
4. **Use TypeScript**: Type safety cho request/response
5. **Cache when appropriate**: Use Next.js cache options
6. **Rate limiting**: Consider adding rate limiting cho public APIs
7. **CORS**: Handle CORS headers if needed

## NGSI-LD Integration

Most APIs integrate with NGSI-LD Context Broker:
- **URL**: `http://103.178.233.233:1026/ngsi-ld/v1`
- **Contexts**: Automatically add Link headers based on entity type
- **Format**: Support both full format and keyValues
- **Pagination**: Limit=1000, iterate with offset

## Future Enhancements

- Rate limiting middleware
- Request validation with Zod
- Response caching with Redis
- Webhook support
- GraphQL API option
- API versioning strategy

