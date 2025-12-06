---
title: Error Handling
description: Error responses, codes, and debugging guide
---

# Error Handling

Hướng dẫn xử lý lỗi và debugging trong UrbanReflex.

---

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `422` | Unprocessable Entity | Validation error |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

---

## Error Response Format

Tất cả errors đều trả về theo format thống nhất:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "request_id": "req_abc123xyz"
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Permission denied |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |
| `EXTERNAL_SERVICE_ERROR` | External API failed |

---

## Common Errors

### Validation Errors (422)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "loc": ["body", "email"],
        "msg": "value is not a valid email address",
        "type": "value_error.email"
      },
      {
        "loc": ["body", "password"],
        "msg": "ensure this value has at least 8 characters",
        "type": "value_error.any_str.min_length"
      }
    ]
  }
}
```

### Authentication Errors (401)

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Could not validate credentials",
    "details": {
      "reason": "token_expired"
    }
  }
}
```

Possible reasons:
- `token_expired` - JWT token đã hết hạn
- `token_invalid` - Token không hợp lệ
- `api_key_invalid` - API key không đúng
- `api_key_revoked` - API key đã bị thu hồi

### Rate Limit Errors (429)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "reset_at": 1701691200
    }
  }
}
```

---

## Handling Errors

### Python

```python
import httpx
from typing import Optional

class APIError(Exception):
    def __init__(self, code: str, message: str, details: Optional[dict] = None):
        self.code = code
        self.message = message
        self.details = details
        super().__init__(message)

async def api_call(endpoint: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(endpoint)
        
        if response.status_code >= 400:
            error_data = response.json().get("error", {})
            raise APIError(
                code=error_data.get("code", "UNKNOWN_ERROR"),
                message=error_data.get("message", "Unknown error"),
                details=error_data.get("details")
            )
        
        return response.json()

# Usage
try:
    data = await api_call("/v1/users/me")
except APIError as e:
    if e.code == "AUTHENTICATION_ERROR":
        # Redirect to login
        pass
    elif e.code == "RATE_LIMIT_EXCEEDED":
        # Wait and retry
        pass
    else:
        logger.error(f"API Error: {e.message}")
```

### TypeScript

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

class UrbanReflexError extends Error {
  code: string;
  details?: Record<string, any>;

  constructor(error: APIError) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
  }
}

async function apiCall<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);

  if (!response.ok) {
    const { error } = await response.json();
    throw new UrbanReflexError(error);
  }

  return response.json();
}

// Usage
try {
  const user = await apiCall<User>("/v1/users/me");
} catch (e) {
  if (e instanceof UrbanReflexError) {
    switch (e.code) {
      case "AUTHENTICATION_ERROR":
        // Redirect to login
        break;
      case "RATE_LIMIT_EXCEEDED":
        // Show rate limit message
        break;
      default:
        console.error("API Error:", e.message);
    }
  }
}
```

---

## Debugging Tips

### 1. Check Request ID

Mỗi request đều có `request_id`. Sử dụng để trace logs:

```bash
# In server logs
grep "req_abc123xyz" /var/log/urbanreflex/app.log
```

### 2. Enable Debug Mode

```bash
# .env
DEBUG=true
LOG_LEVEL=DEBUG
```

### 3. Validate Input

```python
from pydantic import ValidationError

try:
    user = UserCreate(**data)
except ValidationError as e:
    print(e.json())  # Detailed validation errors
```

### 4. Check API Health

```bash
curl http://localhost:8000/health
# {"status": "healthy", "version": "1.0.0", "timestamp": "..."}
```

### 5. Test Authentication

```bash
# Test JWT token
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/v1/users/me

# Test API key
curl -H "X-API-Key: <api_key>" \
  http://localhost:8000/v1/aqi/stations?limit=1
```

---

## Retry Strategy

### Exponential Backoff

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def call_with_retry(endpoint: str):
    response = await httpx.get(endpoint)
    if response.status_code == 429:
        raise Exception("Rate limited")
    return response.json()
```

### JavaScript

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (e instanceof UrbanReflexError && e.code === "RATE_LIMIT_EXCEEDED") {
        const delay = Math.pow(2, i) * 1000;
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }

  throw lastError!;
}
```

---

## Logging

### Backend Logging

```python
import logging

logger = logging.getLogger("urbanreflex")

# Log API errors
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.warning(
        f"HTTP {exc.status_code}: {exc.detail}",
        extra={"request_id": request.state.request_id}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"message": exc.detail}}
    )
```

### Frontend Logging

```typescript
// Log errors to monitoring service
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason instanceof UrbanReflexError) {
    logError({
      code: event.reason.code,
      message: event.reason.message,
      timestamp: new Date().toISOString(),
    });
  }
});
```

---

<div align="center">

**[← Authentication](./authentication.md)** | **[Ecosystem →](./ecosystem.md)**

</div>
