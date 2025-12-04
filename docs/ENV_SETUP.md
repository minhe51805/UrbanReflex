# 🔧 Environment Setup Guide

Complete guide to configure environment variables for UrbanReflex development and production.

## 📋 Environment Files Overview

UrbanReflex uses different environment files for different components:

```
UrbanReflex/
├── .env                    # Backend configuration
├── .env.example           # Backend template
├── website/.env.local     # Frontend configuration (dev)
├── website/.env.example   # Frontend template
└── docker-compose.yml     # Container environment variables
```

## 🐍 Backend Environment (.env)

### Required Variables

```bash
# Database Configuration
DATABASE_URL="mongodb://localhost:27017/urbanreflex"
# MongoDB connection string for primary database

# Security Configuration
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
# Secret key for JWT token signing - MUST be changed in production
JWT_ALGORITHM="HS256"
# Algorithm used for JWT token signing
ACCESS_TOKEN_EXPIRE_MINUTES=30
# JWT token expiration time in minutes

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
# Allowed origins for CORS requests
```

### Optional External APIs

```bash
# OpenAQ API (Air Quality Data)
OPENAQ_API_KEY="your-openaq-api-key"
# Get from: https://openaq.org/developers/
# If not provided: Uses mock air quality data

# Gemini AI API (Chatbot & AI Features)
GEMINI_API_KEY="your-gemini-api-key"
# Get from: https://makersuite.google.com/app/apikey
# If not provided: AI features disabled

# Pinecone API (Vector Search)
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_ENVIRONMENT="your-pinecone-environment"
PINECONE_INDEX_NAME="urbanreflex-embeddings"
# Get from: https://www.pinecone.io/
# If not provided: Vector search disabled
```

### NGSI-LD Context Broker

```bash
# Orion Context Broker Configuration
ORION_BROKER_URL="http://localhost:1026"
# URL of NGSI-LD Context Broker for smart city data
ORION_SUBSCRIPTION_URL="http://backend:8000/webhooks/orion"
# Callback URL for Orion subscriptions
```

### Development Settings

```bash
# Development Mode
DEBUG=True
# Enable debug mode with detailed error messages
LOG_LEVEL="DEBUG"
# Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL

# API Configuration
API_V1_PREFIX="/api/v1"
# API version prefix
PROJECT_NAME="UrbanReflex"
# Project name for API documentation
```

### Production Settings

```bash
# Production Mode (override in production)
DEBUG=False
LOG_LEVEL="INFO"

# Security
JWT_SECRET_KEY="extremely-secure-random-key-generated-for-production"
ACCESS_TOKEN_EXPIRE_MINUTES=15
CORS_ORIGINS=["https://yourdomain.com"]

# Database (production MongoDB)
DATABASE_URL="mongodb://username:password@prod-mongodb:27017/urbanreflex"

# SSL/TLS
SSL_CERT_FILE="/path/to/cert.pem"
SSL_KEY_FILE="/path/to/key.pem"
```

## 🌐 Frontend Environment (.env.local)

### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
# Backend API base URL
NEXT_PUBLIC_API_VERSION="v1"
# API version to use

# Application Configuration
NEXT_PUBLIC_APP_NAME="UrbanReflex"
# Application name shown in UI
NEXT_PUBLIC_APP_VERSION="1.0.0"
# Application version
```

### Optional External APIs

```bash
# OpenAQ API (optional - falls back to backend)
NEXT_PUBLIC_OPENAQ_API_KEY="your-openaq-api-key"
# If provided: Direct API calls from frontend
# If not provided: Routes through backend API

# Map Configuration
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
# Get from: https://account.mapbox.com/access-tokens/
# If not provided: Uses OpenStreetMap

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
# Google Analytics measurement ID
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
# PostHog analytics key
```

### Feature Flags

```bash
# Feature Toggles
NEXT_PUBLIC_ENABLE_AI_CHAT=true
# Enable/disable AI chatbot feature
NEXT_PUBLIC_ENABLE_CITIZEN_REPORTS=true
# Enable/disable citizen reporting feature
NEXT_PUBLIC_ENABLE_REAL_TIME_DATA=true
# Enable/disable real-time data updates
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
# Enable/disable push notifications
```

### Development Settings

```bash
# Development Mode
NODE_ENV="development"
# Next.js environment mode
NEXT_PUBLIC_DEBUG=true
# Enable debug mode in frontend

# Development URLs
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:8000/ws"
# WebSocket URL for real-time features
```

### Production Settings

```bash
# Production Mode (override in production)
NODE_ENV="production"
NEXT_PUBLIC_DEBUG=false

# Production URLs
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_WEBSOCKET_URL="wss://api.yourdomain.com/ws"

# CDN Configuration
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"
# CDN URL for static assets
```

## 🐳 Docker Environment

### docker-compose.yml Environment

```yaml
# MongoDB Configuration
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: urbanreflex

  # Orion Context Broker Configuration
  orion:
    environment:
      ORION_MONGO_HOST: mongodb
      ORION_MONGO_DB: orion
      ORION_LOG_LEVEL: DEBUG

  # Redis Configuration
  redis:
    environment:
      REDIS_PASSWORD: redis_password
```

### Production Docker Override

```yaml
# docker-compose.prod.yml
services:
  backend:
    environment:
      DEBUG: "False"
      LOG_LEVEL: "INFO"
      DATABASE_URL: "mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/urbanreflex"
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}

  frontend:
    environment:
      NODE_ENV: "production"
      NEXT_PUBLIC_API_URL: "https://api.yourdomain.com"
```

## 🔧 Environment Setup Steps

### 1. Copy Example Files

```bash
# Backend environment
cp .env.example .env

# Frontend environment
cd website
cp .env.example .env.local
cd ..
```

### 2. Generate Secure Keys

```bash
# Generate JWT secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use OpenSSL
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Configure Database

```bash
# For local development (default)
DATABASE_URL="mongodb://localhost:27017/urbanreflex"

# For Docker development
DATABASE_URL="mongodb://admin:password@localhost:27017/urbanreflex"

# For production
DATABASE_URL="mongodb://username:password@prod-host:27017/urbanreflex?ssl=true"
```

### 4. Set Up External APIs (Optional)

#### OpenAQ API

1. Visit https://openaq.org/developers/
2. Register for free account
3. Get API key
4. Add to both `.env` and `website/.env.local`

#### Gemini AI API

1. Visit https://makersuite.google.com/app/apikey
2. Create Google Cloud project
3. Enable Gemini API
4. Generate API key
5. Add to `.env`

#### Pinecone API

1. Visit https://www.pinecone.io/
2. Create account
3. Create index named `urbanreflex-embeddings`
4. Get API key and environment
5. Add to `.env`

## ✅ Environment Validation

### Backend Validation

```python
# Check backend environment
python -c "
import os
from app.config.config import settings
print(f'Database URL: {settings.database_url}')
print(f'JWT Secret configured: {bool(settings.jwt_secret_key)}')
print(f'Debug mode: {settings.debug}')
print(f'External APIs: OpenAQ={bool(settings.openaq_api_key)}, Gemini={bool(settings.gemini_api_key)}')
"
```

### Frontend Validation

```bash
# Check frontend environment
cd website
npm run env-check

# Or manually check
node -e "
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Debug mode:', process.env.NEXT_PUBLIC_DEBUG);
console.log('Features enabled:', {
  ai_chat: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT,
  reports: process.env.NEXT_PUBLIC_ENABLE_CITIZEN_REPORTS
});
"
```

### Connectivity Test

```bash
# Test backend API
curl http://localhost:8000/health

# Test database connection
python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
async def test():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    await client.admin.command('ping')
    print('✅ MongoDB connection successful')
asyncio.run(test())
"
```

## 🛡️ Security Best Practices

### 1. Secret Management

```bash
# Use environment-specific secrets
# Development: .env (not committed)
# Production: Container secrets, HashiCorp Vault, AWS Secrets Manager

# Never commit secrets to git
echo ".env" >> .gitignore
echo "website/.env.local" >> .gitignore
```

### 2. JWT Configuration

```bash
# Use strong JWT secrets (minimum 256 bits)
JWT_SECRET_KEY=$(openssl rand -base64 32)

# Short expiration for production
ACCESS_TOKEN_EXPIRE_MINUTES=15

# Consider refresh tokens for longer sessions
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 3. CORS Configuration

```bash
# Development (permissive)
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Production (restrictive)
CORS_ORIGINS=["https://yourdomain.com", "https://www.yourdomain.com"]
```

## 🔄 Environment Migration

### Development to Production

```bash
# 1. Create production environment file
cp .env .env.production

# 2. Update production-specific values
sed -i 's/DEBUG=True/DEBUG=False/' .env.production
sed -i 's/LOG_LEVEL="DEBUG"/LOG_LEVEL="INFO"/' .env.production

# 3. Generate new secrets
NEW_JWT_SECRET=$(openssl rand -base64 32)
sed -i "s/JWT_SECRET_KEY=.*/JWT_SECRET_KEY=\"$NEW_JWT_SECRET\"/" .env.production
```

### Environment Templates

```bash
# Create environment templates for different stages
.env.development      # Local development
.env.staging         # Staging environment
.env.production      # Production environment
.env.testing        # Testing environment
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Test connection string
mongosh "mongodb://localhost:27017/urbanreflex"

# Check environment variable
echo $DATABASE_URL
```

#### 2. JWT Token Issues

```bash
# Ensure JWT secret is set and not empty
python -c "import os; print(f'JWT Secret length: {len(os.getenv(\"JWT_SECRET_KEY\", \"\"))}')"

# Regenerate JWT secret
python -c "import secrets; print(f'JWT_SECRET_KEY=\"{secrets.token_urlsafe(32)}\"')" >> .env
```

#### 3. CORS Errors

```bash
# Check CORS origins configuration
grep CORS_ORIGINS .env

# Add frontend URL to CORS origins
echo 'CORS_ORIGINS=["http://localhost:3000"]' >> .env
```

#### 4. API Key Issues

```bash
# Check if API keys are loaded
python -c "
import os
print(f'OpenAQ API Key: {\"✅\" if os.getenv(\"OPENAQ_API_KEY\") else \"❌ Missing\"}')
print(f'Gemini API Key: {\"✅\" if os.getenv(\"GEMINI_API_KEY\") else \"❌ Missing\"}')
"

# Test API key validity
curl -H "X-API-Key: $OPENAQ_API_KEY" "https://api.openaq.org/v2/locations?limit=1"
```

---

<div align="center">

**Environment configured?** 🎉 Run `just dev` to start developing!

[🏠 Back to Main Documentation](../README.md) • [🔧 Development Setup](./DEVELOPMENT_SETUP.md) • [⚡ Commands Reference](./COMMANDS.md)

</div>
