# API Authentication - Chi tiết chức năng

##[object Object]Tổng quan

Hệ thống authentication cho UrbanReflex API sử dụng API Key-based authentication thông qua HTTP headers.

**Method**: API Key in Header  
**Header Name**: `X-API-Key`

---

## 🔐 Authentication Flow

```
Client Request
    ↓
Include X-API-Key header
    ↓
Server validates key format
    ↓
Check key exists (future: database)
    ↓
Return data or 401 error
```

---

## 🎯 Cách sử dụng

### 1. Include API Key trong Header

#### cURL
```bash
curl -X GET "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

#### JavaScript (Fetch)
```javascript
fetch('https://your-domain.com/api/v1/locations', {
  headers: {
    'X-API-Key': 'urx_lq8k9j_abc123def456'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### JavaScript (Axios)
```javascript
const axios = require('axios');

axios.get('https://your-domain.com/api/v1/locations', {
  headers: {
    'X-API-Key': 'urx_lq8k9j_abc123def456'
  }
})
  .then(response => console.log(response.data));
```

#### Python (Requests)
```python
import requests

headers = {
    'X-API-Key': 'urx_lq8k9j_abc123def456'
}

response = requests.get(
    'https://your-domain.com/api/v1/locations',
    headers=headers
)
print(response.json())
```

#### PHP
```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://your-domain.com/api/v1/locations');
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'X-API-Key: urx_lq8k9j_abc123def456'
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>
```

---

## 🔧 Implementation Details

### Server-side Validation Function

**File**: `app/api/v1/*/route.ts`

```typescript
function validateAPIKey(request: NextRequest): { valid: boolean; error?: string } {
  // Get API key from header (case-insensitive)
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');

  // Check if API key is provided
  if (!apiKey) {
    return { 
      valid: false, 
      error: 'API key is required. Include it in the X-API-Key header.' 
    };
  }

  // Validate API key format
  const isValidFormat = /^urx_[a-z0-9]+_[a-z0-9]+$/.test(apiKey);
  
  if (!isValidFormat) {
    return { 
      valid: false, 
      error: 'Invalid API key format' 
    };
  }

  // In production, validate against database here
  // const keyExists = await db.apiKeys.findOne({ key_hash: hash(apiKey) });
  // if (!keyExists) {
  //   return { valid: false, error: 'API key not found' };
  // }
  
  return { valid: true };
}
```

### Usage in Endpoints

```typescript
export async function GET(request: NextRequest) {
  // Validate API key
  const validation = validateAPIKey(request);
  
  if (!validation.valid) {
    return NextResponse.json(
      { 
        error: validation.error,
        message: 'Authentication failed',
      },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'API-Key',
        },
      }
    );
  }

  // API key is valid, proceed with request
  // ... your logic here
}
```

---

## 🔑 API Key Format

### Structure
```
urx_[timestamp]_[random_string]
```

### Components
1. **Prefix**: `urx_`
   - Identifies UrbanReflex keys
   - Easy to search in logs
   - Prevents confusion with other keys

2. **Timestamp**: Base36 encoded
   - Example: `lq8k9j`
   - Ensures uniqueness
   - Allows chronological sorting

3. **Random String**: Alphanumeric
   - Example: `abc123def456ghi789`
   - Provides security
   - Makes key unpredictable

### Example
```
urx_lq8k9j_abc123def456ghi789
```

### Validation Regex
```regex
^urx_[a-z0-9]+_[a-z0-9]+$
```

---

## ⚠️ Error Responses

### 401: Missing API Key

**Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/locations"
```

**Response**:
```json
{
  "error": "API key is required. Include it in the X-API-Key header.",
  "message": "Authentication failed"
}
```

**Status Code**: `401 Unauthorized`

**Headers**:
```
WWW-Authenticate: API-Key
```

---

### 401: Invalid API Key Format

**Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: invalid_key_format"
```

**Response**:
```json
{
  "error": "Invalid API key format",
  "message": "Authentication failed"
}
```

**Status Code**: `401 Unauthorized`

---

### 401: API Key Not Found (Future)

**Request**:
```bash
curl -X GET "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: urx_abc123_notexist"
```

**Response**:
```json
{
  "error": "API key not found or inactive",
  "message": "Authentication failed"
}
```

**Status Code**: `401 Unauthorized`

---

## 🔒 Security Best Practices

### 1. Never Expose API Keys

❌ **DON'T**:
```javascript
// In client-side code
const API_KEY = 'urx_lq8k9j_abc123'; // Visible in browser!

fetch(`/api/data?key=${API_KEY}`); // In URL!
```

✅ **DO**:
```javascript
// In server-side code or environment variables
const API_KEY = process.env.API_KEY;

fetch('/api/data', {
  headers: { 'X-API-Key': API_KEY }
});
```

### 2. Use Environment Variables

**.env.local**:
```env
URBANREFLEX_API_KEY=urx_lq8k9j_abc123def456
```

**Usage**:
```javascript
const apiKey = process.env.URBANREFLEX_API_KEY;
```

### 3. Rotate Keys Regularly

- Create new keys periodically
- Delete old keys after migration
- Update all applications

### 4. Use Different Keys for Different Environments

```
Development:   urx_dev_abc123
Staging:       urx_stg_def456
Production:    urx_prod_ghi789
```

### 5. Monitor Usage

- Track request count
- Alert on unusual activity
- Log all API calls

---

## 📊 Rate Limiting (Future)

### Per-Key Limits

```typescript
interface RateLimit {
  requestsPerHour: number;
  requestsPerDay: number;
  requestsPerMonth: number;
}

const FREE_TIER: RateLimit = {
  requestsPerHour: 1000,
  requestsPerDay: 10000,
  requestsPerMonth: 300000,
};

const PRO_TIER: RateLimit = {
  requestsPerHour: 10000,
  requestsPerDay: 100000,
  requestsPerMonth: 3000000,
};
```

### Rate Limit Headers

**Response Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1731938400
```

### 429: Rate Limit Exceeded

**Response**:
```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your hourly rate limit of 1000 requests",
  "retryAfter": 3600
}
```

**Status Code**: `429 Too Many Requests`

**Headers**:
```
Retry-After: 3600
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1731938400
```

---

## 🗄️ Database Schema (Production)

### API Keys Table

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(50) NOT NULL, -- For display: "urx_lq8k9j_***"
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  request_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  scopes JSONB DEFAULT '[]', -- Permissions
  metadata JSONB DEFAULT '{}',
  
  INDEX idx_key_hash (key_hash),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);
```

### Usage Logs Table

```sql
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_api_key_id (api_key_id),
  INDEX idx_created_at (created_at),
  INDEX idx_endpoint (endpoint)
);
```

---

## 🔐 Key Hashing (Production)

### Hash Function

```typescript
import crypto from 'crypto';

function hashAPIKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex');
}

function getKeyPrefix(key: string): string {
  const parts = key.split('_');
  if (parts.length >= 3) {
    return `${parts[0]}_${parts[1]}_***`;
  }
  return '***';
}
```

### Storage

```typescript
// When creating a key
const apiKey = generateAPIKey(); // urx_lq8k9j_abc123
const keyHash = hashAPIKey(apiKey); // Store this
const keyPrefix = getKeyPrefix(apiKey); // For display

await db.apiKeys.create({
  name: 'Production App',
  key_hash: keyHash,
  key_prefix: keyPrefix,
  user_id: userId,
});

// Return full key ONCE to user
return { apiKey }; // User must save this
```

### Validation

```typescript
// When validating
const providedKey = request.headers.get('X-API-Key');
const keyHash = hashAPIKey(providedKey);

const apiKey = await db.apiKeys.findOne({
  key_hash: keyHash,
  is_active: true,
});

if (!apiKey) {
  return { valid: false, error: 'Invalid API key' };
}

// Update last used
await db.apiKeys.update(apiKey.id, {
  last_used_at: new Date(),
  request_count: apiKey.request_count + 1,
});

return { valid: true, apiKey };
```

---

## 🧪 Testing Authentication

### Test Valid Key

```bash
# Should return 200 OK
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: urx_lq8k9j_abc123def456" \
  -v
```

### Test Missing Key

```bash
# Should return 401 Unauthorized
curl -X GET "http://localhost:3000/api/v1/locations" \
  -v
```

### Test Invalid Format

```bash
# Should return 401 Unauthorized
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: invalid_key" \
  -v
```

### Test Case Insensitive Header

```bash
# Should work (lowercase)
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "x-api-key: urx_lq8k9j_abc123def456" \
  -v
```

---

##[object Object] Documentation

- [API Key Management](./API-Key-Management.md)
- [API Endpoints](./API-Endpoints.md)
- [Security Best Practices](./Security-Best-Practices.md)
- [Rate Limiting](./Rate-Limiting.md)

