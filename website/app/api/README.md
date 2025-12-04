# API Routes Directory

## Tổng quan

Folder `app/api/` chứa tất cả các API routes của ứng dụng UrbanReflex, sử dụng Next.js API Routes. Các routes này hoạt động như proxy/gateway giữa frontend và backend services (NGSI-LD Context Broker, Backend API).

## Cấu trúc

```
app/api/
├── admin/              # Admin API routes
│   ├── reports/       # Report management
│   └── users/         # User management
├── ngsi-ld/           # NGSI-LD Context Broker proxy
├── roads/             # Road segment APIs
├── reports/           # Citizen reports APIs
├── v1/                # Public API v1 (for API keys)
│   ├── [key]/         # Dynamic route với API key
│   └── keyapi/        # API key endpoint
├── keys/              # API key management
├── auth/              # Authentication APIs
├── weather/           # Weather data APIs
├── aqi/               # Air Quality APIs
├── streetlights/      # Streetlight APIs
└── tiles/             # Map tile proxy
```

## Flow chính

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
Fetch all data from NGSI-LD với pagination
  ↓
Return full NGSI-LD format (not keyValues)
```

## API Routes chi tiết

### `/api/ngsi-ld`
- **File**: `app/api/ngsi-ld/route.ts`
- **Methods**: GET, POST, PATCH
- **Chức năng**: Proxy cho NGSI-LD Context Broker
- **Query params**:
  - `type`: Entity type (RoadSegment, WeatherObserved, etc.)
  - `options`: Format (keyValues, etc.)
  - `limit`, `offset`: Pagination
- **Headers**: Tự động thêm Link headers (contexts)

### `/api/admin/reports`
- **File**: `app/api/admin/reports/route.ts`
- **Methods**: GET, POST
- **Chức năng**: Quản lý báo cáo cho admin
- **GET**:
  - Fetch cả `CitizenReport` và `RoadReport`
  - Filter by status, priority, search
  - Return formatted data với statistics
- **POST**: Tạo report mới (delegate to `/api/reports`)

### `/api/admin/reports/[id]`
- **File**: `app/api/admin/reports/[id]/route.ts`
- **Methods**: GET, PATCH, DELETE
- **Chức năng**: CRUD operations cho single report
- **PATCH**: Update status, priority, category

### `/api/admin/users`
- **File**: `app/api/admin/users/route.ts`
- **Methods**: GET
- **Chức năng**: Lấy danh sách users từ backend

### `/api/admin/users/[id]`
- **File**: `app/api/admin/users/[id]/route.ts`
- **Methods**: PUT, DELETE
- **PUT**: Update user info hoặc password
- **DELETE**: Xóa user

### `/api/roads/[id]`
- **File**: `app/api/roads/[id]/route.ts`
- **Methods**: GET
- **Chức năng**: Lấy chi tiết đầy đủ của một đoạn đường
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
  - Spatial query với lat/lon/maxDistance
  - Return reports trong radius
- **POST**: Tạo CitizenReport mới

### `/api/v1/[key]`
- **File**: `app/api/v1/[key]/route.ts`
- **Methods**: GET
- **Chức năng**: Public API với API key authentication
- **Features**:
  - Fetch all entity types nếu không có `type` param
  - Pagination tự động (limit=1000, iterate với offset)
  - Return full NGSI-LD format (không keyValues)
  - Support `all=true` để fetch tất cả types

### `/api/v1/keyapi`
- **File**: `app/api/v1/keyapi/route.ts`
- **Methods**: GET
- **Chức năng**: Lấy API keys của user hiện tại

### `/api/keys`
- **File**: `app/api/keys/route.ts`
- **Methods**: GET, POST
- **Chức năng**: Quản lý API keys (proxy to backend)

## Authentication

### Admin Routes
- Yêu cầu `Authorization: Bearer <token>` header
- Token từ `localStorage.getItem('auth_token')`
- Forward token đến backend API

### Public API v1
- API key trong URL path: `/api/v1/{apiKey}`
- Validate format: `startsWith('ur_')`
- Không cần Bearer token

## Error Handling

Tất cả routes đều có error handling:
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
7. **CORS**: Handle CORS headers nếu cần

## NGSI-LD Integration

Hầu hết APIs đều integrate với NGSI-LD Context Broker:
- **URL**: `http://103.178.233.233:1026/ngsi-ld/v1`
- **Contexts**: Tự động thêm Link headers dựa trên entity type
- **Format**: Support cả full format và keyValues
- **Pagination**: Limit=1000, iterate với offset

## Future Enhancements

- Rate limiting middleware
- Request validation với Zod
- Response caching với Redis
- Webhook support
- GraphQL API option
- API versioning strategy

