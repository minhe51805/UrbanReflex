# Testing Guide - Chi tiết chức năng

## [object Object]ổng quan

Hướng dẫn đầy đủ để test UrbanReflex API system.

---

## 🚀 Quick Start Testing

### Bước 1: Tạo API Key

1. Mở browser: `http://localhost:3000/api-keys`
2. Click **"+ Create New Key"**
3. Nhập tên: "Test Key"
4. Click **"Create Key"**
5. Copy API key (format: `urx_xxxxx_xxxxx`)

### Bước 2: Test với cURL

```bash
# Set API key as environment variable
export API_KEY="urx_your_api_key_here"

# Test locations endpoint
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: $API_KEY"

# Test measurements endpoint
curl -X GET "http://localhost:3000/api/v1/measurements?parameter=pm25&limit=5" \
  -H "X-API-Key: $API_KEY"
```

---

## 🧪 Unit Tests

### Test API Key Generation

```typescript
// __tests__/api-key-generation.test.ts
describe('API Key Generation', () => {
  test('should generate key with correct format', () => {
    const key = generateAPIKey();
    expect(key).toMatch(/^urx_[a-z0-9]+_[a-z0-9]+$/);
  });

  test('should generate unique keys', () => {
    const key1 = generateAPIKey();
    const key2 = generateAPIKey();
    expect(key1).not.toBe(key2);
  });

  test('should have three parts separated by underscore', () => {
    const key = generateAPIKey();
    const parts = key.split('_');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe('urx');
  });
});
```

### Test API Key Validation

```typescript
// __tests__/api-key-validation.test.ts
describe('API Key Validation', () => {
  test('should validate correct format', () => {
    const result = validateAPIKey('urx_lq8k9j_abc123def456');
    expect(result.valid).toBe(true);
  });

  test('should reject invalid format', () => {
    const result = validateAPIKey('invalid_key');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should reject empty key', () => {
    const result = validateAPIKey('');
    expect(result.valid).toBe(false);
  });

  test('should reject key without prefix', () => {
    const result = validateAPIKey('abc123_def456');
    expect(result.valid).toBe(false);
  });
});
```

### Test Key Masking

```typescript
// __tests__/key-masking.test.ts
describe('Key Masking', () => {
  test('should mask key correctly', () => {
    const key = 'urx_lq8k9j_abc123def456';
    const masked = maskKey(key);
    expect(masked).toBe('urx_lq8k9j_********************');
  });

  test('should preserve prefix and timestamp', () => {
    const key = 'urx_lq8k9j_abc123def456';
    const masked = maskKey(key);
    expect(masked.startsWith('urx_lq8k9j_')).toBe(true);
  });
});
```

---

## 🌐 Integration Tests

### Test Locations Endpoint

```typescript
// __tests__/api/locations.test.ts
describe('GET /api/v1/locations', () => {
  const apiKey = 'urx_test_key123';

  test('should return 401 without API key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/locations');
    expect(response.status).toBe(401);
  });

  test('should return 401 with invalid API key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/locations', {
      headers: { 'X-API-Key': 'invalid_key' }
    });
    expect(response.status).toBe(401);
  });

  test('should return locations with valid API key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/locations', {
      headers: { 'X-API-Key': apiKey }
    });
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('meta');
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  test('should filter by city', async () => {
    const response = await fetch('http://localhost:3000/api/v1/locations?city=Hanoi', {
      headers: { 'X-API-Key': apiKey }
    });
    const data = await response.json();
    
    data.results.forEach(location => {
      expect(location.city.toLowerCase()).toContain('hanoi');
    });
  });

  test('should respect limit parameter', async () => {
    const response = await fetch('http://localhost:3000/api/v1/locations?limit=5', {
      headers: { 'X-API-Key': apiKey }
    });
    const data = await response.json();
    
    expect(data.results.length).toBeLessThanOrEqual(5);
  });
});
```

### Test Measurements Endpoint

```typescript
// __tests__/api/measurements.test.ts
describe('GET /api/v1/measurements', () => {
  const apiKey = 'urx_test_key123';

  test('should return measurements with valid API key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/measurements', {
      headers: { 'X-API-Key': apiKey }
    });
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.results[0]).toHaveProperty('parameter');
    expect(data.results[0]).toHaveProperty('value');
    expect(data.results[0]).toHaveProperty('unit');
  });

  test('should filter by parameter', async () => {
    const response = await fetch('http://localhost:3000/api/v1/measurements?parameter=pm25', {
      headers: { 'X-API-Key': apiKey }
    });
    const data = await response.json();
    
    data.results.forEach(measurement => {
      expect(measurement.parameter).toBe('pm25');
    });
  });

  test('should filter by city', async () => {
    const response = await fetch('http://localhost:3000/api/v1/measurements?city=Hanoi', {
      headers: { 'X-API-Key': apiKey }
    });
    const data = await response.json();
    
    data.results.forEach(measurement => {
      expect(measurement.city.toLowerCase()).toContain('hanoi');
    });
  });
});
```

---

## 🔧 Manual Testing Checklist

### API Key Management Page

#### Create API Key
- [ ] Click "Create New Key" button
- [ ] Modal opens
- [ ] Enter key name
- [ ] Click "Create Key"
- [ ] Success alert appears with full key
- [ ] Key appears in list
- [ ] Alert auto-hides after 30 seconds

#### View API Keys
- [ ] All keys display correctly
- [ ] Name shows correctly
- [ ] Status badge shows (Active/Inactive)
- [ ] Created date displays
- [ ] Last used shows "Never" for new keys
- [ ] Request count shows 0 for new keys

#### Toggle Visibility
- [ ] Click eye icon
- [ ] Key becomes visible
- [ ] Click eye-off icon
- [ ] Key becomes masked
- [ ] Format: `urx_xxxxx_********************`

#### Copy to Clipboard
- [ ] Click copy icon
- [ ] Icon changes to checkmark
- [ ] Key copied to clipboard (test with paste)
- [ ] Icon reverts after 2 seconds

#### Delete API Key
- [ ] Click trash icon
- [ ] Confirmation dialog appears
- [ ] Click Cancel - nothing happens
- [ ] Click OK - key is deleted
- [ ] Key removed from list
- [ ] LocalStorage updated

#### Empty State
- [ ] Delete all keys
- [ ] Empty state displays
- [ ] Shows key icon
- [ ] Shows "No API Keys Yet" message
- [ ] Shows CTA button

### API Endpoints

#### Locations Endpoint
```bash
# Test without API key
curl -X GET "http://localhost:3000/api/v1/locations"
# Expected: 401 Unauthorized

# Test with invalid API key
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: invalid"
# Expected: 401 Unauthorized

# Test with valid API key
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: urx_your_key"
# Expected: 200 OK with data

# Test city filter
curl -X GET "http://localhost:3000/api/v1/locations?city=Hanoi" \
  -H "X-API-Key: urx_your_key"
# Expected: Only Hanoi locations

# Test limit
curl -X GET "http://localhost:3000/api/v1/locations?limit=2" \
  -H "X-API-Key: urx_your_key"
# Expected: Max 2 results

# Test pagination
curl -X GET "http://localhost:3000/api/v1/locations?page=2&limit=2" \
  -H "X-API-Key: urx_your_key"
# Expected: Next 2 results
```

#### Measurements Endpoint
```bash
# Test basic request
curl -X GET "http://localhost:3000/api/v1/measurements" \
  -H "X-API-Key: urx_your_key"
# Expected: 200 OK with measurements

# Test parameter filter
curl -X GET "http://localhost:3000/api/v1/measurements?parameter=pm25" \
  -H "X-API-Key: urx_your_key"
# Expected: Only PM2.5 measurements

# Test multiple filters
curl -X GET "http://localhost:3000/api/v1/measurements?city=Hanoi&parameter=pm25&limit=5" \
  -H "X-API-Key: urx_your_key"
# Expected: 5 PM2.5 measurements from Hanoi
```

---

## 🎯 Postman Testing

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste this JSON:

```json
{
  "info": {
    "name": "UrbanReflex API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "api_key",
      "value": "urx_your_api_key_here"
    }
  ],
  "item": [
    {
      "name": "Get Locations",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/locations",
          "host": ["{{base_url}}"],
          "path": ["locations"]
        }
      }
    },
    {
      "name": "Get Locations - Filter by City",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/locations?city=Hanoi",
          "host": ["{{base_url}}"],
          "path": ["locations"],
          "query": [
            {
              "key": "city",
              "value": "Hanoi"
            }
          ]
        }
      }
    },
    {
      "name": "Get Measurements",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/measurements?parameter=pm25&limit=10",
          "host": ["{{base_url}}"],
          "path": ["measurements"],
          "query": [
            {
              "key": "parameter",
              "value": "pm25"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    }
  ]
}
```

### Test Scripts

Add to Postman tests:

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has meta and results", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('meta');
    pm.expect(jsonData).to.have.property('results');
});

// Test results is array
pm.test("Results is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results).to.be.an('array');
});

// Test response time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

## [object Object] Testing

### Test Error Responses

```bash
# 401: Missing API key
curl -X GET "http://localhost:3000/api/v1/locations" -v
# Check: Status 401, error message in response

# 401: Invalid API key format
curl -X GET "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: invalid_format" -v
# Check: Status 401, "Invalid API key format"

# 400: Missing required fields (POST)
curl -X POST "http://localhost:3000/api/v1/locations" \
  -H "X-API-Key: urx_your_key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}' -v
# Check: Status 400, missing fields error
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install httpd

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 \
  -H "X-API-Key: urx_your_key" \
  http://localhost:3000/api/v1/locations

# Expected metrics:
# - Requests per second: > 100
# - Time per request: < 100ms
# - Failed requests: 0
```

---

## [object Object]d Documentation

- [API Endpoints](./API-Endpoints.md)
- [API Authentication](./API-Authentication.md)
- [Code Examples](./Code-Examples.md)
- [Deployment Guide](./Deployment-Guide.md)

