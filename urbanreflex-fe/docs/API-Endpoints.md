# API Endpoints - Chi tiết chức năng

## 📋 Tổng quan

UrbanReflex API cung cấp các endpoints để truy cập dữ liệu chất lượng không khí.

**Base URL**: `https://your-domain.com/api/v1`  
**Authentication**: API Key required in `X-API-Key` header

---

## 🗺️ Endpoints Overview

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/locations` | GET | Lấy danh sách monitoring locations | ✅ |
| `/api/v1/locations` | POST | Thêm location mới | ✅ |
| `/api/v1/measurements` | GET | Lấy measurements data | ✅ |
| `/api/v1/measurements` | POST | Submit measurement mới | ✅ |
| `/api/v1/validate-key` | POST | Validate API key | ❌ |

---

## 📍 GET /api/v1/locations

### Mô tả
Lấy danh sách các monitoring locations với thông tin chi tiết.

### Authentication
Required: `X-API-Key` header

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `city` | string | No | - | Filter by city name (case-insensitive) |
| `country` | string | No | - | Filter by country name (case-insensitive) |
| `limit` | integer | No | 100 | Number of results per page (max: 1000) |
| `page` | integer | No | 1 | Page number for pagination |

### Request Example

```bash
curl -X GET "https://your-domain.com/api/v1/locations?city=Hanoi&limit=10" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

### Response Format

```json
{
  "meta": {
    "name": "openaq-api",
    "license": "CC BY 4.0",
    "website": "https://urbanreflex.org",
    "page": 1,
    "limit": 10,
    "found": 5
  },
  "results": [
    {
      "id": 1,
      "name": "Hanoi Central Station",
      "city": "Hanoi",
      "country": "Vietnam",
      "coordinates": {
        "lat": 21.0285,
        "lon": 105.8542
      },
      "parameters": ["pm25", "pm10", "o3", "no2", "so2", "co"],
      "lastUpdated": "2025-11-18T11:39:03.345Z",
      "measurements": 15234
    }
  ]
}
```

### Response Fields

#### Meta Object
- `name`: API name
- `license`: Data license
- `website`: Website URL
- `page`: Current page number
- `limit`: Results per page
- `found`: Total results found

#### Result Object
- `id`: Unique location ID
- `name`: Location name
- `city`: City name
- `country`: Country name
- `coordinates`: Lat/lon coordinates
- `parameters`: Available parameters at this location
- `lastUpdated`: Last data update timestamp (ISO 8601)
- `measurements`: Total number of measurements

### Status Codes

- `200 OK`: Success
- `401 Unauthorized`: Missing or invalid API key
- `500 Internal Server Error`: Server error

### Sample Data

Current implementation returns 5 sample locations:
1. Hanoi Central Station (Vietnam)
2. Ho Chi Minh City Center (Vietnam)
3. Da Nang Beach (Vietnam)
4. Bangkok Downtown (Thailand)
5. Singapore Central (Singapore)

---

## 📍 POST /api/v1/locations

### Mô tả
Thêm monitoring location mới vào hệ thống.

### Authentication
Required: `X-API-Key` header

### Request Body

```json
{
  "name": "Hanoi University",
  "city": "Hanoi",
  "country": "Vietnam",
  "coordinates": {
    "lat": 21.0045,
    "lon": 105.8412
  },
  "parameters": ["pm25", "pm10", "o3"]
}
```

### Required Fields
- `name`: Location name (string)
- `city`: City name (string)
- `country`: Country name (string)
- `coordinates`: Object with `lat` and `lon` (numbers)

### Optional Fields
- `parameters`: Array of available parameters (default: [])

### Request Example

```bash
curl -X POST "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: urx_lq8k9j_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hanoi University",
    "city": "Hanoi",
    "country": "Vietnam",
    "coordinates": {"lat": 21.0045, "lon": 105.8412}
  }'
```

### Response

```json
{
  "message": "Location created successfully",
  "location": {
    "id": 1731934783345,
    "name": "Hanoi University",
    "city": "Hanoi",
    "country": "Vietnam",
    "coordinates": {
      "lat": 21.0045,
      "lon": 105.8412
    },
    "parameters": [],
    "lastUpdated": "2025-11-18T11:39:43.345Z",
    "measurements": 0
  }
}
```

### Status Codes

- `201 Created`: Location created successfully
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Missing or invalid API key
- `500 Internal Server Error`: Server error

---

## 📊 GET /api/v1/measurements

### Mô tả
Lấy air quality measurements từ các monitoring locations.

### Authentication
Required: `X-API-Key` header

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `city` | string | No | - | Filter by city name |
| `country` | string | No | - | Filter by country name |
| `parameter` | string | No | - | Filter by parameter (pm25, pm10, o3, no2, so2, co) |
| `location_id` | integer | No | - | Filter by location ID |
| `date_from` | string | No | - | Start date (ISO 8601 format) |
| `date_to` | string | No | - | End date (ISO 8601 format) |
| `limit` | integer | No | 100 | Number of results per page |
| `page` | integer | No | 1 | Page number |

### Request Example

```bash
curl -X GET "https://your-domain.com/api/v1/measurements?city=Hanoi&parameter=pm25&limit=5" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

### Response Format

```json
{
  "meta": {
    "name": "openaq-api",
    "license": "CC BY 4.0",
    "website": "https://urbanreflex.org",
    "page": 1,
    "limit": 5,
    "found": 150
  },
  "results": [
    {
      "locationId": 1,
      "location": "Hanoi Central Station",
      "city": "Hanoi",
      "country": "Vietnam",
      "parameter": "pm25",
      "value": 35.5,
      "unit": "µg/m³",
      "timestamp": "2025-11-18T11:39:03.345Z",
      "coordinates": {
        "latitude": 21.0285,
        "longitude": 105.8542
      }
    }
  ]
}
```

### Response Fields

#### Result Object
- `locationId`: Location ID
- `location`: Location name
- `city`: City name
- `country`: Country name
- `parameter`: Measured parameter
- `value`: Measurement value
- `unit`: Unit of measurement
- `timestamp`: Measurement timestamp (ISO 8601)
- `coordinates`: Lat/lon coordinates

### Parameters

| Parameter | Description | Unit |
|-----------|-------------|------|
| `pm25` | Particulate Matter < 2.5μm | µg/m³ |
| `pm10` | Particulate Matter < 10μm | µg/m³ |
| `o3` | Ozone | µg/m³ |
| `no2` | Nitrogen Dioxide | µg/m³ |
| `so2` | Sulfur Dioxide | µg/m³ |
| `co` | Carbon Monoxide | mg/m³ |

### Date Filtering

```bash
# Get measurements from last 24 hours
curl -X GET "https://your-domain.com/api/v1/measurements?date_from=2025-11-17T11:00:00Z&date_to=2025-11-18T11:00:00Z" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

### Status Codes

- `200 OK`: Success
- `401 Unauthorized`: Missing or invalid API key
- `500 Internal Server Error`: Server error

---

## 📊 POST /api/v1/measurements

### Mô tả
Submit measurement mới vào hệ thống.

### Authentication
Required: `X-API-Key` header

### Request Body

```json
{
  "locationId": 1,
  "parameter": "pm25",
  "value": 45.2,
  "unit": "µg/m³",
  "timestamp": "2025-11-18T11:39:03.345Z"
}
```

### Required Fields
- `locationId`: Location ID (integer)
- `parameter`: Parameter name (string)
- `value`: Measurement value (number)

### Optional Fields
- `unit`: Unit of measurement (default: based on parameter)
- `timestamp`: Measurement timestamp (default: current time)

### Request Example

```bash
curl -X POST "https://your-domain.com/api/v1/measurements" \
  -H "X-API-Key: urx_lq8k9j_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": 1,
    "parameter": "pm25",
    "value": 45.2
  }'
```

### Response

```json
{
  "message": "Measurement created successfully",
  "measurement": {
    "id": 1731934783345,
    "locationId": 1,
    "parameter": "pm25",
    "value": 45.2,
    "unit": "µg/m³",
    "timestamp": "2025-11-18T11:39:43.345Z"
  }
}
```

### Status Codes

- `201 Created`: Measurement created successfully
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Missing or invalid API key
- `500 Internal Server Error`: Server error

---

## 🔑 POST /api/v1/validate-key

### Mô tả
Validate API key format và tính hợp lệ.

### Authentication
Not required (this endpoint validates the key)

### Request Body

```json
{
  "apiKey": "urx_lq8k9j_abc123def456"
}
```

### Request Example

```bash
curl -X POST "https://your-domain.com/api/v1/validate-key" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "urx_lq8k9j_abc123def456"}'
```

### Response (Valid Key)

```json
{
  "valid": true,
  "message": "API key is valid"
}
```

### Response (Invalid Key)

```json
{
  "valid": false,
  "error": "Invalid API key format"
}
```

### Status Codes

- `200 OK`: Validation complete (check `valid` field)
- `400 Bad Request`: Missing apiKey in request body
- `500 Internal Server Error`: Server error

---

## 🔄 Pagination

### How it Works

```bash
# Page 1 (results 1-100)
curl "https://your-domain.com/api/v1/locations?page=1&limit=100"

# Page 2 (results 101-200)
curl "https://your-domain.com/api/v1/locations?page=2&limit=100"
```

### Response Meta

```json
{
  "meta": {
    "page": 2,
    "limit": 100,
    "found": 250
  }
}
```

### Calculate Total Pages

```javascript
const totalPages = Math.ceil(meta.found / meta.limit);
// Example: Math.ceil(250 / 100) = 3 pages
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required fields: name, city, country, coordinates"
}
```

### 401 Unauthorized

```json
{
  "error": "API key is required. Include it in the X-API-Key header.",
  "message": "Authentication failed"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## 📚 Related Documentation

- [API Authentication](./API-Authentication.md)
- [API Key Management](./API-Key-Management.md)
- [Code Examples](./Code-Examples.md)
- [Testing Guide](./Testing-Guide.md)

 
