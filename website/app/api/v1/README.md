# API v1 Documentation

## Tổng quan

API v1 cung cấp quyền truy cập vào dữ liệu NGSI-LD từ Context Broker thông qua API key. API hỗ trợ nhiều tính năng mạnh mẽ để lọc và truy vấn dữ liệu.

## Endpoint

```
GET /api/v1/{apiKey}
```

## Authentication

API key được đặt trong URL path:
- Format: `ur_xxxxxxxxxxxxx`
- Phải bắt đầu với `ur_`

## Query Parameters

### Cơ bản

| Parameter | Type | Default | Mô tả |
|-----------|------|---------|-------|
| `type` | string | - | Entity type cụ thể (RoadSegment, WeatherObserved, etc.) |
| `entities` | string | - | Danh sách entity types (comma-separated) |
| `limit` | number | 1000 | Số lượng items mỗi page (max: 1000) |
| `offset` | number | 0 | Offset cho pagination |
| `options` | string | - | Format options (keyValues, etc.) |

### Timeframe (Mới)

| Parameter | Type | Default | Mô tả |
|-----------|------|---------|-------|
| `timeframe` | string | `alltime` | Chế độ lấy dữ liệu: `latest`, `alltime`, `custom` |
| `startDate` | ISO 8601 | - | Ngày bắt đầu (cho `custom`) |
| `endDate` | ISO 8601 | - | Ngày kết thúc (cho `custom`) |

### Response Format

| Parameter | Type | Default | Mô tả |
|-----------|------|---------|-------|
| `unwrapped` | boolean | `false` | Trả về array trực tiếp (backward compatibility) |

## Entity Types

### Static Data (Dữ liệu tĩnh)
- **RoadSegment**: ~5,000 segments
- **Streetlight**: ~17,500 streetlights
- **PointOfInterest**: POIs

### Dynamic Data (Dữ liệu động)
- **WeatherObserved**: 1 station (OWM - OpenWeatherMap)
- **AirQualityObserved**: 10 stations (OpenAQ)
- **CitizenReport**: User reports
- **RoadReport**: Road-specific reports

## Tính năng

### 1. Latest Data (`timeframe=latest`)

Lấy dữ liệu mới nhất cho mỗi entity type:

```bash
GET /api/v1/{apiKey}?timeframe=latest
```

**Behavior:**
- **WeatherObserved**: Lấy 1 record mới nhất
- **AirQualityObserved**: Lấy 1 record mới nhất cho mỗi station (10 stations → 10 records)
- **Other types**: Lấy 1 record mới nhất

**Example:**
```bash
curl "http://localhost:3000/api/v1/ur_xxxxx?timeframe=latest&entities=WeatherObserved,AirQualityObserved"
```

### 2. All Time Data (`timeframe=alltime`)

Lấy tất cả dữ liệu (mặc định):

```bash
GET /api/v1/{apiKey}?timeframe=alltime
```

**Example:**
```bash
curl "http://localhost:3000/api/v1/ur_xxxxx?timeframe=alltime"
```

### 3. Custom Time Range (`timeframe=custom`)

Lấy dữ liệu trong khoảng thời gian cụ thể:

```bash
GET /api/v1/{apiKey}?timeframe=custom&startDate=2025-01-01T00:00:00Z&endDate=2025-12-31T23:59:59Z
```

**Date Format:** ISO 8601 (e.g., `2025-01-01T00:00:00Z`)

**Example:**
```bash
curl "http://localhost:3000/api/v1/ur_xxxxx?timeframe=custom&startDate=2025-11-01T00:00:00Z&endDate=2025-11-30T23:59:59Z"
```

### 4. Entity Selection (`entities`)

Chọn entity types cụ thể để lấy:

```bash
GET /api/v1/{apiKey}?entities=WeatherObserved,AirQualityObserved
```

**Valid Entity Types:**
- `RoadSegment`
- `Streetlight`
- `WeatherObserved`
- `AirQualityObserved`
- `CitizenReport`
- `RoadReport`
- `PointOfInterest`

**Example - Chỉ lấy WeatherObserved:**
```bash
curl "http://localhost:3000/api/v1/ur_xxxxx?entities=WeatherObserved&timeframe=latest"
```

**Example - Chỉ lấy CitizenReport:**
```bash
curl "http://localhost:3000/api/v1/ur_xxxxx?entities=CitizenReport&timeframe=alltime"
```

## Response Format

### Wrapped Format (Mặc định với timeframe/entities)

```json
{
  "success": true,
  "data": [
    // Array of entities
  ],
  "meta": {
    "total": 100,
    "types": ["WeatherObserved", "AirQualityObserved"],
    "timeframe": "latest",
    "startDate": null,
    "endDate": null,
    "timestamp": "2025-12-03T10:00:00.000Z"
  }
}
```

### Unwrapped Format (Backward compatibility)

```json
[
  // Array of entities directly
]
```

Để dùng unwrapped format:
```bash
GET /api/v1/{apiKey}?unwrapped=true
```

## Examples

### 1. Lấy dữ liệu mới nhất của tất cả types
```bash
GET /api/v1/ur_xxxxx?timeframe=latest
```

### 2. Lấy tất cả RoadSegment và Streetlight
```bash
GET /api/v1/ur_xxxxx?entities=RoadSegment,Streetlight&timeframe=alltime
```

### 3. Lấy WeatherObserved mới nhất
```bash
GET /api/v1/ur_xxxxx?entities=WeatherObserved&timeframe=latest
```

### 4. Lấy CitizenReport trong tháng 11/2025
```bash
GET /api/v1/ur_xxxxx?entities=CitizenReport&timeframe=custom&startDate=2025-11-01T00:00:00Z&endDate=2025-11-30T23:59:59Z
```

### 5. Lấy tất cả AirQualityObserved (10 stations)
```bash
GET /api/v1/ur_xxxxx?entities=AirQualityObserved&timeframe=alltime
```

### 6. Lấy dữ liệu mới nhất của OpenAQ và OWM
```bash
GET /api/v1/ur_xxxxx?entities=WeatherObserved,AirQualityObserved&timeframe=latest
```

## Date Fields

Mỗi entity type sử dụng date field khác nhau:
- **WeatherObserved**: `dateObserved`
- **AirQualityObserved**: `dateObserved`
- **CitizenReport**: `dateCreated`
- **RoadReport**: `dateCreated`
- **RoadSegment**: `dateCreated`
- **Streetlight**: `dateCreated`

API tự động detect và sử dụng đúng date field cho mỗi type.

## Error Handling

### Invalid API Key
```json
{
  "error": "Invalid API key format",
  "message": "API key must start with \"ur_\""
}
```

### Invalid Entity Type
```json
{
  "error": "Invalid entity types",
  "message": "Invalid types: InvalidType. Valid types: RoadSegment, WeatherObserved, ..."
}
```

### Invalid Date Format
```json
{
  "error": "Invalid startDate format. Use ISO 8601 format (e.g., 2025-01-01T00:00:00Z)"
}
```

## Best Practices

1. **Sử dụng `timeframe=latest`** khi chỉ cần dữ liệu mới nhất
2. **Sử dụng `entities`** để giảm response size khi chỉ cần một vài types
3. **Sử dụng `timeframe=custom`** với date range cụ thể để giảm data transfer
4. **Kết hợp các parameters** để tối ưu query:
   ```bash
   ?entities=WeatherObserved,AirQualityObserved&timeframe=latest
   ```

## Performance Notes

- **Static data** (RoadSegment, Streetlight): Không thay đổi thường xuyên, có thể cache
- **Dynamic data** (WeatherObserved, AirQualityObserved, Reports): Cập nhật thường xuyên, nên dùng `timeframe=latest` để lấy mới nhất
- **Pagination**: Tự động xử lý với `limit=1000` và `offset`

