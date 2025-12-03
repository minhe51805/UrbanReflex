# Deployment Guide - Chi tiết chức năng

## 📋 Tổng quan

Hướng dẫn đầy đủ để deploy UrbanReflex API lên production với DNS riêng.

---

## 🚀 Pre-Deployment Checklist

### 1. Code Updates

#### Update Base URLs

**File: `app/api-keys/page.tsx`**
```typescript
// Line ~135
// FROM:
{typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1

// TO:
https://urbanreflex.yourdomain.com/api/v1
```

**File: `app/api-docs/page.tsx`**
```typescript
// Line ~115
// FROM:
{typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1

// TO:
https://urbanreflex.yourdomain.com/api/v1
```

#### Update Code Examples

Update all code examples trong documentation với production URL.

### 2. Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/urbanreflex
REDIS_URL=redis://host:6379

# API Security
API_SECRET_KEY=your_super_secret_key_here_min_32_chars
JWT_SECRET=your_jwt_secret_here

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_WINDOW_MS=3600000

# CORS
ALLOWED_ORIGINS=https://urbanreflex.yourdomain.com,https://yourdomain.com

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Domain
NEXT_PUBLIC_API_URL=https://urbanreflex.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://urbanreflex.yourdomain.com
```

---

## 🗄️ Database Setup

### PostgreSQL Schema

```sql
-- Create database
CREATE DATABASE urbanreflex;

-- Connect to database
\c urbanreflex;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  request_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tier VARCHAR(50) DEFAULT 'free',
  scopes JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Indexes for API Keys
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- API Usage Logs table
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Usage Logs
CREATE INDEX idx_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX idx_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX idx_usage_logs_endpoint ON api_usage_logs(endpoint);

-- Locations table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  parameters JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Locations
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);

-- Measurements table
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  parameter VARCHAR(50) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Measurements
CREATE INDEX idx_measurements_location_id ON measurements(location_id);
CREATE INDEX idx_measurements_parameter ON measurements(parameter);
CREATE INDEX idx_measurements_timestamp ON measurements(timestamp);
CREATE INDEX idx_measurements_created_at ON measurements(created_at);

-- Partitioning for measurements (by month)
-- This helps with performance for large datasets
CREATE TABLE measurements_2025_11 PARTITION OF measurements
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- Add more partitions as needed
```

### Migration Script

Create `scripts/migrate.ts`:

```typescript
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );
    
    await client.query(sql);
    console.log('✅ Database migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
```

---

## 🔐 Security Implementation

### 1. API Key Hashing

**File: `lib/crypto.ts`**

```typescript
import crypto from 'crypto';

export function hashAPIKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(key + process.env.API_SECRET_KEY)
    .digest('hex');
}

export function getKeyPrefix(key: string): string {
  const parts = key.split('_');
  if (parts.length >= 3) {
    return `${parts[0]}_${parts[1]}_***`;
  }
  return '***';
}

export function verifyAPIKey(providedKey: string, storedHash: string): boolean {
  const hash = hashAPIKey(providedKey);
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(storedHash)
  );
}
```

### 2. Rate Limiting

**File: `lib/rate-limit.ts`**

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const TIERS: Record<string, RateLimitConfig> = {
  free: { maxRequests: 1000, windowMs: 3600000 }, // 1000/hour
  pro: { maxRequests: 10000, windowMs: 3600000 }, // 10000/hour
  enterprise: { maxRequests: 100000, windowMs: 3600000 }, // 100000/hour
};

export async function checkRateLimit(
  apiKeyId: string,
  tier: string = 'free'
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const config = TIERS[tier] || TIERS.free;
  const key = `ratelimit:${apiKeyId}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in current window
  const count = await redis.zcard(key);

  if (count >= config.maxRequests) {
    const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
    const resetAt = parseInt(oldest[1]) + config.windowMs;
    
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Add current request
  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, Math.ceil(config.windowMs / 1000));

  return {
    allowed: true,
    remaining: config.maxRequests - count - 1,
    resetAt: now + config.windowMs,
  };
}
```

### 3. CORS Configuration

**File: `middleware.ts`**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS headers
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const origin = request.headers.get('origin');
  
  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## 🌐 Deployment Platforms

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Environment Variables**
- Go to Vercel Dashboard
- Project Settings → Environment Variables
- Add all variables from `.env.production`

5. **Configure Custom Domain**
- Project Settings → Domains
- Add: `urbanreflex.yourdomain.com`
- Update DNS records as instructed

### Docker Deployment

**Dockerfile**:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - API_SECRET_KEY=${API_SECRET_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=urbanreflex
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

**Build and run**:

```bash
docker-compose up -d
```

---

## 🔒 SSL/TLS Setup

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d urbanreflex.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

**nginx.conf**:

```nginx
server {
    listen 80;
    server_name urbanreflex.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name urbanreflex.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring

### Setup Sentry

```bash
npm install @sentry/nextjs
```

**sentry.client.config.ts**:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Logging

**lib/logger.ts**:

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## 📚 Related Documentation

- [Security Best Practices](./Security-Best-Practices.md)
- [API Authentication](./API-Authentication.md)
- [Testing Guide](./Testing-Guide.md)

 
