# Security Best Practices - Chi tiết chức năng

## 📋 Tổng quan

Hướng dẫn bảo mật toàn diện cho UrbanReflex API system.

---

## 🔐 API Key Security

### 1. Never Expose API Keys

#### ❌ DON'T DO THIS

```javascript
// In client-side JavaScript
const API_KEY = 'urx_lq8k9j_abc123def456'; // EXPOSED!

// In URL parameters
fetch(`/api/data?api_key=${API_KEY}`); // LOGGED EVERYWHERE!

// In Git repository
// config.js
export const API_KEY = 'urx_lq8k9j_abc123def456'; // COMMITTED TO GIT!

// Hardcoded in frontend
<script>
  const apiKey = 'urx_lq8k9j_abc123def456'; // VISIBLE IN SOURCE!
</script>
```

#### ✅ DO THIS

```javascript
// Use environment variables
const API_KEY = process.env.URBANREFLEX_API_KEY;

// Server-side only
// pages/api/proxy.ts
export default async function handler(req, res) {
  const apiKey = process.env.URBANREFLEX_API_KEY;
  const response = await fetch('https://api.urbanreflex.com/data', {
    headers: { 'X-API-Key': apiKey }
  });
  res.json(await response.json());
}

// Use .env files (add to .gitignore)
// .env.local
URBANREFLEX_API_KEY=urx_lq8k9j_abc123def456

// .gitignore
.env.local
.env.production
```

### 2. Key Storage

#### Development
```bash
# .env.local (not committed)
URBANREFLEX_API_KEY=urx_dev_abc123
```

#### Production
```bash
# Use platform environment variables
# Vercel: Dashboard → Settings → Environment Variables
# Heroku: heroku config:set URBANREFLEX_API_KEY=xxx
# Docker: docker run -e URBANREFLEX_API_KEY=xxx
```

### 3. Key Rotation

```typescript
// Rotate keys regularly
async function rotateAPIKey(oldKeyId: string) {
  // 1. Create new key
  const newKey = await createAPIKey({
    name: 'Production App (Rotated)',
    tier: 'pro'
  });

  // 2. Update applications with new key
  // ... deploy new key to all services

  // 3. Monitor for 24 hours
  await sleep(24 * 60 * 60 * 1000);

  // 4. Deactivate old key
  await deactivateAPIKey(oldKeyId);

  // 5. Delete old key after grace period
  await sleep(7 * 24 * 60 * 60 * 1000);
  await deleteAPIKey(oldKeyId);
}
```

### 4. Key Scopes and Permissions

```typescript
interface APIKey {
  id: string;
  scopes: string[]; // ['read:locations', 'read:measurements', 'write:measurements']
  tier: 'free' | 'pro' | 'enterprise';
}

// Validate scopes
function hasPermission(apiKey: APIKey, requiredScope: string): boolean {
  return apiKey.scopes.includes(requiredScope) || apiKey.scopes.includes('*');
}

// Usage in endpoint
export async function POST(request: NextRequest) {
  const apiKey = await validateAPIKey(request);
  
  if (!hasPermission(apiKey, 'write:measurements')) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  // Process request...
}
```

---

## 🔒 Authentication Security

### 1. Hash API Keys

```typescript
import crypto from 'crypto';

// NEVER store plain text keys
// ❌ DON'T
await db.apiKeys.create({
  key: 'urx_lq8k9j_abc123def456' // PLAIN TEXT!
});

// ✅ DO
function hashAPIKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(key + process.env.API_SECRET_KEY)
    .digest('hex');
}

await db.apiKeys.create({
  key_hash: hashAPIKey('urx_lq8k9j_abc123def456'),
  key_prefix: 'urx_lq8k9j_***' // For display only
});
```

### 2. Timing-Safe Comparison

```typescript
import crypto from 'crypto';

// ❌ DON'T - Vulnerable to timing attacks
function verifyKey(provided: string, stored: string): boolean {
  return provided === stored;
}

// ✅ DO - Timing-safe comparison
function verifyKey(provided: string, stored: string): boolean {
  const providedHash = hashAPIKey(provided);
  return crypto.timingSafeEqual(
    Buffer.from(providedHash),
    Buffer.from(stored)
  );
}
```

### 3. Rate Limiting

```typescript
// Per-key rate limiting
const RATE_LIMITS = {
  free: { requests: 1000, window: 3600 }, // 1000/hour
  pro: { requests: 10000, window: 3600 }, // 10000/hour
  enterprise: { requests: 100000, window: 3600 } // 100000/hour
};

async function checkRateLimit(apiKeyId: string, tier: string) {
  const limit = RATE_LIMITS[tier];
  const key = `ratelimit:${apiKeyId}`;
  
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, limit.window);
  }
  
  if (count > limit.requests) {
    throw new Error('Rate limit exceeded');
  }
  
  return {
    remaining: limit.requests - count,
    resetAt: Date.now() + (limit.window * 1000)
  };
}
```

### 4. IP Whitelisting (Optional)

```typescript
interface APIKey {
  id: string;
  allowed_ips: string[]; // ['192.168.1.1', '10.0.0.0/8']
}

function isIPAllowed(ip: string, allowedIPs: string[]): boolean {
  if (allowedIPs.length === 0) return true; // No restrictions
  
  // Check exact match
  if (allowedIPs.includes(ip)) return true;
  
  // Check CIDR ranges
  for (const range of allowedIPs) {
    if (range.includes('/') && ipInRange(ip, range)) {
      return true;
    }
  }
  
  return false;
}

// In endpoint
const clientIP = request.headers.get('x-forwarded-for') || request.ip;
if (!isIPAllowed(clientIP, apiKey.allowed_ips)) {
  return NextResponse.json(
    { error: 'IP not allowed' },
    { status: 403 }
  );
}
```

---

## 🛡️ Input Validation

### 1. Validate All Inputs

```typescript
import { z } from 'zod';

// Define schemas
const LocationSchema = z.object({
  name: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  country: z.string().min(1).max(255),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180)
  }),
  parameters: z.array(z.string()).optional()
});

// Validate in endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LocationSchema.parse(body);
    
    // Use validated data
    const location = await createLocation(validated);
    return NextResponse.json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### 2. Sanitize Inputs

```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  // Remove HTML tags
  let clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  
  // Trim whitespace
  clean = clean.trim();
  
  // Limit length
  clean = clean.substring(0, 1000);
  
  return clean;
}

// Usage
const name = sanitizeInput(body.name);
const city = sanitizeInput(body.city);
```

### 3. SQL Injection Prevention

```typescript
// ❌ DON'T - Vulnerable to SQL injection
const query = `SELECT * FROM locations WHERE city = '${city}'`;

// ✅ DO - Use parameterized queries
const query = 'SELECT * FROM locations WHERE city = $1';
const result = await db.query(query, [city]);

// ✅ DO - Use ORM
const locations = await prisma.location.findMany({
  where: { city }
});
```

---

##[object Object]HTTPS and Transport Security

### 1. Enforce HTTPS

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Redirect HTTP to HTTPS
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }
  
  return NextResponse.next();
}
```

### 2. Security Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

---

## 📊 Logging and Monitoring

### 1. Log All API Requests

```typescript
async function logAPIRequest(
  apiKeyId: string,
  request: NextRequest,
  response: NextResponse,
  duration: number
) {
  await db.apiUsageLogs.create({
    api_key_id: apiKeyId,
    endpoint: request.nextUrl.pathname,
    method: request.method,
    status_code: response.status,
    response_time_ms: duration,
    ip_address: request.headers.get('x-forwarded-for') || request.ip,
    user_agent: request.headers.get('user-agent'),
    created_at: new Date()
  });
}
```

### 2. Alert on Suspicious Activity

```typescript
async function checkSuspiciousActivity(apiKeyId: string) {
  // Check for unusual patterns
  const recentLogs = await db.apiUsageLogs.findMany({
    where: {
      api_key_id: apiKeyId,
      created_at: { gte: new Date(Date.now() - 3600000) } // Last hour
    }
  });

  // Too many 401 errors
  const unauthorizedCount = recentLogs.filter(l => l.status_code === 401).length;
  if (unauthorizedCount > 10) {
    await sendAlert({
      type: 'suspicious_activity',
      message: `API key ${apiKeyId} has ${unauthorizedCount} unauthorized attempts`,
      severity: 'high'
    });
  }

  // Unusual request volume
  if (recentLogs.length > 5000) {
    await sendAlert({
      type: 'unusual_volume',
      message: `API key ${apiKeyId} has unusual request volume: ${recentLogs.length}`,
      severity: 'medium'
    });
  }
}
```

### 3. Audit Trail

```typescript
interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

async function auditLog(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes: Record<string, any>,
  request: NextRequest
) {
  await db.auditLogs.create({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    changes,
    ip_address: request.headers.get('x-forwarded-for') || request.ip,
    user_agent: request.headers.get('user-agent'),
    created_at: new Date()
  });
}

// Usage
await auditLog(
  userId,
  'api_key_created',
  'api_key',
  newKey.id,
  { name: newKey.name, tier: newKey.tier },
  request
);
```

---

## 🔒 Data Protection

### 1. Encrypt Sensitive Data

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 2. Backup and Recovery

```bash
# Automated daily backups
0 2 * * * pg_dump urbanreflex | gzip > /backups/urbanreflex_$(date +\%Y\%m\%d).sql.gz

# Retention policy (keep 30 days)
find /backups -name "urbanreflex_*.sql.gz" -mtime +30 -delete

# Test restore monthly
pg_restore -d urbanreflex_test /backups/latest.sql.gz
```

---

## 📚 Security Checklist

### Pre-Production
- [ ] All API keys are hashed
- [ ] Environment variables configured
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] CORS configured correctly
- [ ] Logging enabled
- [ ] Monitoring setup

### Post-Production
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Key rotation schedule
- [ ] Backup verification
- [ ] Incident response plan
- [ ] Security training for team

---

## 📚 Related Documentation

- [API Authentication](./API-Authentication.md)
- [Deployment Guide](./Deployment-Guide.md)
- [Testing Guide](./Testing-Guide.md)

