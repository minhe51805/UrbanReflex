# System Architecture

UrbanReflex is built with a modern three-tier architecture designed for scalability, maintainability, and developer experience. This document describes the system design, technology stack, and architectural decisions.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Components](#system-components)
- [Technology Stack](#technology-stack)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Deployment Architecture](#deployment-architecture)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Web Browser          Mobile App         API Clients        │
│  (Next.js 16)        (Future)            (SDKs)             │
└────────────┬─────────────────────┬─────────────┬────────────┘
             │                     │             │
             └─────────────────────┼─────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   FastAPI    │  │  AI Service  │  │  Scheduler   │      │
│  │   Backend    │  │  (Gemini)    │  │  (APScheduler)│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MongoDB  │  │ Orion-LD │  │ Pinecone │  │  Redis   │   │
│  │          │  │ (NGSI-LD)│  │ (Vectors)│  │ (Cache)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  OpenAQ API    │  OpenWeatherMap   │  OpenStreetMap        │
│  (Air Quality) │  (Weather Data)   │  (Geospatial Data)    │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

**1. Separation of Concerns**

- Frontend handles presentation and user interaction
- Backend manages business logic and data processing
- Database layer handles data persistence
- External services provide specialized data

**2. API-First Design**

- All functionality exposed through RESTful APIs
- OpenAPI/Swagger documentation
- Versioned endpoints for backward compatibility

**3. Microservices-Ready**

- Loosely coupled components
- Each service can scale independently
- Service-to-service communication via HTTP/REST

**4. NGSI-LD Compliance**

- Standardized data models
- Interoperability with FIWARE ecosystem
- Context information management

---

## System Components

### Frontend Layer (Next.js 16)

**Technology**: Next.js 16 with React 19 and TypeScript

**Architecture**: App Router with server-side rendering

**Structure**:

```
src/frontend/
├── app/                  # Next.js App Router
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── air-quality/
│   │   ├── weather/
│   │   ├── reports/
│   │   └── analytics/
│   ├── api/             # API route proxies
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── ui/              # Base UI components (Shadcn/ui)
│   ├── charts/          # Data visualization
│   ├── maps/            # Leaflet map components
│   └── forms/           # Form components
├── lib/                 # Utilities
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
```

**Key Features**:

- Server-side rendering for SEO and performance
- Real-time updates via Server-Sent Events (SSE)
- Interactive maps using Leaflet
- Data visualization with Chart.js
- Responsive design with Tailwind CSS

**State Management**:

- React Context for global state
- URL state for filters and pagination
- Local state for component-specific data

**Routing**:

- File-based routing via App Router
- Dynamic routes for entity details
- Route groups for protected areas
- Middleware for authentication

### Backend Layer (FastAPI)

**Technology**: FastAPI 0.121 with Python 3.10+

**Architecture**: Layered architecture with dependency injection

**Structure**:

```
src/backend/
├── app.py                      # Application entry point
├── dependencies.py             # Dependency injection
├── routers/                    # API route handlers
│   ├── air_quality.py          # /api/air-quality
│   ├── weather.py              # /api/weather
│   ├── citizen_reports.py      # /api/reports
│   ├── points_of_interest.py   # /api/pois
│   └── chatbot.py              # /api/chat
├── models/                     # Pydantic data models
│   ├── air_quality.py
│   ├── weather.py
│   ├── citizen_report.py
│   └── point_of_interest.py
├── schemas/                    # Request/Response schemas
│   ├── requests.py
│   └── responses.py
├── ai_service/                 # AI chatbot service
│   ├── chatbot.py              # Gemini integration
│   └── vector_store.py         # Pinecone vector DB
├── utils/                      # Utility functions
│   ├── ngsi_ld.py              # NGSI-LD helpers
│   └── validation.py           # Data validation
└── config/                     # Configuration
    └── settings.py             # Environment settings
```

**Key Features**:

- Async request handling
- Automatic API documentation (Swagger/ReDoc)
- Request validation with Pydantic
- CORS middleware for cross-origin requests
- Error handling middleware
- Logging and monitoring

**API Design**:

- RESTful endpoints
- JSON responses
- Pagination for list endpoints
- Filtering and sorting
- Versioned API (v1)

**Data Validation**:

- Pydantic models for request/response validation
- JSON Schema validation for NGSI-LD entities
- Custom validators for business logic

### AI Service (Gemini AI)

**Technology**: Google Gemini Pro with Pinecone vector database

**Purpose**: Intelligent chatbot for urban data queries

**Architecture**:

```
AI Service
├── Gemini Pro API          # LLM for text generation
├── Pinecone Vector DB      # Semantic search
└── RAG Pipeline            # Retrieval-Augmented Generation
```

**Features**:

- Natural language queries about city data
- Context-aware responses
- Vector similarity search for relevant data
- Streaming responses for real-time chat

**Workflow**:

1. User sends natural language query
2. Query embedded into vector
3. Semantic search in Pinecone for relevant context
4. Context + query sent to Gemini Pro
5. AI generates response with citations
6. Stream response back to user

### Scheduler Service

**Technology**: APScheduler

**Purpose**: Automated data collection and processing

**Scheduled Tasks**:

- Fetch air quality data from OpenAQ (every 30 minutes)
- Fetch weather data from OpenWeatherMap (every 15 minutes)
- Update OSM road network (daily)
- Generate analytics reports (weekly)
- Clean old data (monthly)

**Configuration**:

```python
# scripts/run_scheduler.py
scheduler = AsyncIOScheduler()

# Air quality updates
scheduler.add_job(
    fetch_aqi_data,
    'interval',
    minutes=30,
    id='fetch_aqi'
)

# Weather updates
scheduler.add_job(
    fetch_weather_data,
    'interval',
    minutes=15,
    id='fetch_weather'
)
```

---

## Technology Stack

### Frontend Technologies

**Core Framework**

- Next.js 16.0.7 - React framework with SSR
- React 19.0.0 - UI library
- TypeScript 5.7.2 - Type safety

**UI and Styling**

- Tailwind CSS 3.4.1 - Utility-first CSS
- Shadcn/ui - Component library
- Radix UI - Headless UI components

**Data Visualization**

- Leaflet 1.9.4 - Interactive maps
- React Leaflet - React wrapper for Leaflet
- Chart.js 4.x - Charts and graphs
- Recharts - Declarative charts

**State and Data**

- React Context - Global state
- TanStack Query - Server state management
- Axios - HTTP client

**Development Tools**

- ESLint - Code linting
- Prettier - Code formatting
- Husky - Git hooks

### Backend Technologies

**Core Framework**

- FastAPI 0.121.0 - Web framework
- Uvicorn - ASGI server
- Python 3.10+ - Programming language

**Data and Validation**

- Pydantic 2.10.3 - Data validation
- Motor 3.6.0 - Async MongoDB driver
- httpx 0.28.1 - Async HTTP client

**AI and ML**

- google-generativeai - Gemini Pro SDK
- pinecone-client - Vector database
- numpy - Numerical computing

**Task Scheduling**

- APScheduler 3.10.4 - Background jobs
- asyncio - Async programming

**Development Tools**

- Black - Code formatter
- Flake8 - Linter
- isort - Import sorter
- pytest - Testing framework

### Database Technologies

**MongoDB 4.4**

- Document database for application data
- Geospatial indexes for location queries
- Aggregation pipeline for analytics

**Orion-LD 1.5.1**

- NGSI-LD context broker
- FIWARE component
- Real-time context management
- Temporal and spatial queries

**Pinecone**

- Vector database for semantic search
- Used by AI chatbot
- Similarity search on embeddings

**Redis (Future)**

- Caching layer
- Session storage
- Rate limiting

---

## Data Flow

### User Request Flow

```
1. User Action
   └──> Browser sends HTTP request

2. Next.js Frontend
   ├──> Client-side routing
   ├──> Server component rendering
   └──> API call to backend

3. FastAPI Backend
   ├──> Route handler receives request
   ├──> Validate request (Pydantic)
   ├──> Business logic processing
   └──> Database query

4. Database Layer
   ├──> MongoDB for application data
   └──> Orion-LD for NGSI-LD entities

5. Response
   ├──> Format response (JSON)
   ├──> Send to frontend
   └──> Render in browser
```

### Real-Time Data Collection Flow

```
1. Scheduler triggers job
   └──> Run at specified interval

2. Data Fetcher Script
   ├──> Call external API (OpenAQ, OpenWeatherMap)
   ├──> Parse response
   └──> Transform to NGSI-LD format

3. Data Validation
   ├──> Validate against JSON Schema
   └──> Check data quality

4. Data Storage
   ├──> Store in MongoDB (raw data)
   ├──> Send to Orion-LD (NGSI-LD entities)
   └──> Update vector embeddings (AI features)

5. Notification (Future)
   └──> Notify frontend of updates via WebSocket
```

### AI Chatbot Flow

```
1. User sends message
   └──> POST /api/chat

2. Backend processes query
   ├──> Extract intent
   └──> Generate embedding vector

3. Vector Search
   ├──> Query Pinecone for similar context
   └──> Retrieve top 5 relevant documents

4. RAG Pipeline
   ├──> Combine query + context
   ├──> Send to Gemini Pro
   └──> Generate response

5. Stream Response
   ├──> Stream tokens to frontend
   └──> Display in chat interface
```

---

## Security Architecture

### Authentication and Authorization

**JWT-Based Authentication** (Future Implementation)

```
1. User login
   ├──> Username + password
   └──> POST /auth/login

2. Backend validation
   ├──> Check credentials
   ├──> Generate JWT token
   └──> Return token

3. Subsequent requests
   ├──> Include token in Authorization header
   ├──> Backend validates token
   └──> Allow or deny access
```

**API Key Authentication** (For external integrations)

- API keys stored in environment variables
- Never exposed to frontend
- Rotated regularly

### Data Security

**Encryption**

- HTTPS/TLS for data in transit
- Environment variables for sensitive data
- MongoDB encryption at rest (production)

**Input Validation**

- Pydantic models validate all inputs
- SQL injection prevention (NoSQL used)
- XSS protection via React escaping
- CSRF tokens (future)

**CORS Configuration**

```python
# Backend CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting (Future)

```python
# Planned implementation with Redis
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    # Check rate limit in Redis
    # Block if exceeded
    response = await call_next(request)
    return response
```

---

## Scalability Considerations

### Horizontal Scaling

**Frontend**

- Stateless Next.js app
- Deploy multiple instances behind load balancer
- CDN for static assets
- Edge rendering with Vercel

**Backend**

- Stateless FastAPI servers
- Load balancer distributes requests
- Async processing for heavy operations
- Background jobs via scheduler

**Database**

- MongoDB replica set for high availability
- Sharding for large datasets
- Read replicas for read-heavy workloads
- Orion-LD federation (future)

### Caching Strategy

**Browser Cache**

- Static assets cached by browser
- Service worker for offline support

**CDN Cache**

- Static files served from CDN
- Edge caching for API responses

**Application Cache** (Future with Redis)

- Frequently accessed data cached
- Cache invalidation on updates
- TTL for time-sensitive data

### Performance Optimizations

**Frontend**

- Code splitting with Next.js
- Image optimization
- Lazy loading components
- Prefetching routes

**Backend**

- Connection pooling for databases
- Async/await for I/O operations
- Batch operations for bulk updates
- Database indexes for common queries

---

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Frontend: npm run dev (localhost:3000)
├── Backend: uvicorn --reload (localhost:8000)
└── Databases: Docker Compose
    ├── MongoDB (localhost:27017)
    └── Orion-LD (localhost:1026)
```

### Production Environment (Future)

```
Cloud Infrastructure
├── Frontend (Vercel/Netlify)
│   ├── Next.js app
│   ├── CDN distribution
│   └── Edge functions
├── Backend (AWS/GCP/Azure)
│   ├── Load Balancer
│   ├── FastAPI instances (auto-scaling)
│   └── Scheduler service
├── Databases
│   ├── MongoDB Atlas (managed)
│   ├── Orion-LD (Kubernetes)
│   └── Pinecone (managed)
└── Monitoring
    ├── Logging (CloudWatch/Stackdriver)
    ├── Metrics (Prometheus/Grafana)
    └── Error tracking (Sentry)
```

### CI/CD Pipeline

```
Git Push
  └──> GitHub Actions
       ├──> Run tests
       ├──> Lint code
       ├──> Build Docker images
       ├──> Push to registry
       └──> Deploy to environment
            ├── Dev (on push to dev branch)
            ├── Staging (on push to main branch)
            └── Production (on tagged release)
```

### Docker Compose Setup

Current development setup:

```yaml
services:
  mongo:
    image: mongo:4.4
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  orion-ld:
    image: fiware/orion-ld:1.5.1
    depends_on:
      - mongo
    ports:
      - '1026:1026'

  scheduler:
    build:
      context: .
      dockerfile: Dockerfile.scheduler
    depends_on:
      - mongo
      - orion-ld
```

---

## Architectural Decisions

### Why Next.js 16?

- Server-side rendering for SEO
- App Router for modern routing
- React Server Components
- Built-in optimization
- TypeScript support
- Large ecosystem

### Why FastAPI?

- High performance (async/await)
- Automatic API documentation
- Type hints with Pydantic
- Easy to learn and use
- Modern Python features
- Active community

### Why MongoDB?

- Flexible schema for evolving data models
- Geospatial queries for location data
- JSON-like documents match frontend
- Horizontal scaling support
- Rich aggregation framework

### Why Orion-LD?

- NGSI-LD standard compliance
- Interoperability with FIWARE
- Built for IoT and smart cities
- Temporal and spatial queries
- Context information management

### Why Microservices-Ready?

- Independent scaling of components
- Technology flexibility
- Easier testing and debugging
- Team autonomy
- Fault isolation

---

## Future Enhancements

**1. WebSocket Support**

- Real-time updates for dashboards
- Live notifications
- Collaborative features

**2. Redis Caching**

- Reduce database load
- Faster response times
- Session management

**3. Authentication System**

- User registration and login
- Role-based access control
- OAuth2 integration

**4. Mobile App**

- React Native application
- Offline-first architecture
- Push notifications

**5. Analytics Platform**

- Data warehouse integration
- Machine learning models
- Predictive analytics

**6. Multi-Tenancy**

- Support multiple cities
- Tenant isolation
- Shared infrastructure

For more details on specific components, see:

- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [DATA_MODEL_AND_ENTITIES.md](./DATA_MODEL_AND_ENTITIES.md) - Data models
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Setup guide
