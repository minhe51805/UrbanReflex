---
title: Authentication
description: JWT tokens, API keys, and security best practices
---

# Authentication

UrbanReflex hỗ trợ hai phương thức authentication: JWT tokens cho web applications và API keys cho programmatic access.

---

## JWT Authentication

JSON Web Tokens được sử dụng cho user authentication trong web application.

### Register

```bash
POST /auth/register
```

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass123",
  "full_name": "John Doe"
}
```

**Response:**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "citizen",
  "is_active": true
}
```

### Login

```bash
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Using JWT Token

```bash
curl -H "Authorization: Bearer <access_token>" \
  "http://localhost:8000/v1/users/me"
```

### Token Structure

```json
{
  "sub": "user123",
  "role": "citizen",
  "exp": 1701691200,
  "iat": 1701604800,
  "permissions": ["read", "write"]
}
```

---

## API Key Authentication

API keys được sử dụng cho programmatic access và third-party integrations.

### Create API Key

```bash
POST /users/api-keys
Authorization: Bearer <jwt_token>
```

```json
{
  "name": "My Mobile App",
  "description": "API key for mobile application"
}
```

**Response:**

```json
{
  "id": "key_abc123",
  "name": "My Mobile App",
  "key": "ur_live_1234567890abcdef...",
  "created_at": "2025-12-04T10:00:00Z"
}
```

> ⚠️ **Important:** API key chỉ được hiển thị một lần. Hãy lưu lại ngay!

### Using API Key

```bash
# Header method (recommended)
curl -H "X-API-Key: ur_live_1234567890abcdef..." \
  "http://localhost:8000/v1/aqi/stations"

# Query parameter method
curl "http://localhost:8000/v1/aqi/stations?api_key=ur_live_1234567890abcdef..."
```

### List API Keys

```bash
GET /users/api-keys
Authorization: Bearer <jwt_token>
```

### Revoke API Key

```bash
DELETE /users/api-keys/{key_id}
Authorization: Bearer <jwt_token>
```

---

## Roles & Permissions

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `citizen` | Regular user | Read, create reports |
| `city_official` | Government staff | Read, manage reports, view analytics |
| `admin` | Administrator | Full access |

### Permission Matrix

| Action | citizen | city_official | admin |
|--------|---------|---------------|-------|
| Read public data | ✅ | ✅ | ✅ |
| Create reports | ✅ | ✅ | ✅ |
| Update own reports | ✅ | ✅ | ✅ |
| View all reports | ❌ | ✅ | ✅ |
| Manage reports | ❌ | ✅ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| System configuration | ❌ | ❌ | ✅ |

---

## Security Best Practices

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Expiration

```python
# Default settings
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
API_KEY_NEVER_EXPIRES = True  # But can be revoked
```

### Rate Limiting

| Auth Method | Limit | Window |
|-------------|-------|--------|
| JWT Token | 1000 req | 1 hour |
| API Key (Free) | 1000 req | 1 hour |
| API Key (Pro) | 100000 req | 1 hour |

### CORS Configuration

```python
# app/app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://urbanreflex.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Code Examples

### Python

```python
import httpx

class UrbanReflexClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.urbanreflex.dev/v1"
    
    async def get_stations(self, limit: int = 100):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/aqi/stations",
                headers={"X-API-Key": self.api_key},
                params={"limit": limit}
            )
            response.raise_for_status()
            return response.json()

# Usage
client = UrbanReflexClient("ur_live_1234...")
stations = await client.get_stations()
```

### TypeScript

```typescript
class UrbanReflexClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.urbanreflex.dev/v1";
  }

  async getStations(limit = 100): Promise<StationResponse> {
    const response = await fetch(
      `${this.baseUrl}/aqi/stations?limit=${limit}`,
      {
        headers: {
          "X-API-Key": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

---

## Troubleshooting

### 401 Unauthorized

```json
{
  "detail": "Could not validate credentials"
}
```

**Solutions:**
- Check token expiration
- Verify token format (Bearer prefix)
- Ensure API key is correct

### 403 Forbidden

```json
{
  "detail": "Not enough permissions"
}
```

**Solutions:**
- Check user role
- Verify endpoint permissions
- Contact admin for access

---

<div align="center">

**[← AI Services](./ai-services.md)** | **[Error Handling →](./error-handling.md)**

</div>
