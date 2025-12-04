# UrbanReflex

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.121-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![NGSI-LD](https://img.shields.io/badge/NGSI--LD-Compliant-00A3E0)](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

**Enterprise-Grade Smart City Platform - Developer Handbook**

[Quick Start](#quick-start) • [Architecture](#architecture) • [Development](#development-workflow) • [Code Review](#code-review-guidelines) • [Testing](#testing) • [Contributing](#contributing)

</div>

---

## Table of Contents

- [For Developers](#for-developers)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Code Review Guidelines](#code-review-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Contributing](#contributing)
- [Team Collaboration](#team-collaboration)

---

## For Developers

This README is **specifically written for developers, code reviewers, and team members** working on UrbanReflex. It focuses on:

- **Technical architecture** and design decisions
- **Development workflow** and best practices
- **Code review process** and quality standards
- **Team collaboration** guidelines
- **Debugging** and troubleshooting tips

> **Note**: For end-user documentation, see [User Guide](./docs/USER_GUIDE.md)

---

## Quick Start

### Prerequisites

```bash
# Required tools
Python 3.10+          # Backend (check with: python --version)
Node.js 18+            # Frontend (check with: node --version)
Docker & Docker Compose # Containers (check with: docker --version)
uv package manager     # Python deps (install: pip install uv)

# Recommended development tools
MongoDB Compass        # Database GUI
Postman/Thunder Client # API testing
VS Code / Cursor      # IDE with Python & TypeScript extensions
```

### First-Time Setup

```bash
# 1. Clone and navigate
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# 3. Install dependencies
just setup  # Or manually: uv sync && cd website && npm install && cd ..

# 4. Start services
just dev   # Starts backend (8000), frontend (3000), and databases
```

### Environment Variables

**Required:**
```bash
# Database
MONGODB_URL="mongodb://localhost:27017"
DATABASE_NAME="urbanreflex"

# Authentication
SECRET_KEY="your-secret-key-here"  # Generate with: openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Orion-LD Context Broker
ORION_LD_URL="http://localhost:1026"
ORION_LD_USERNAME="urbanreflex_admin"
ORION_LD_PASSWORD="your-password"
```

**Optional (features disabled without these):**
```bash
# AI Services
GEMINI_API_KEY="your-gemini-key"           # Required for chatbot
PINECONE_API_KEY="your-pinecone-key"       # Required for vector search
PINECONE_INDEX_NAME="urbanreflex-index"

# External APIs
OPENAQ_API_KEY="your-openaq-key"           # Falls back to mock data
OWM_API_KEY="your-openweathermap-key"      # Falls back to mock data
```

### Verify Installation

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
open http://localhost:3000

# Check databases
docker ps  # Should show mongo and orion-ld containers
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Next.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Pages  │  │Components│  │  Context  │  │   API    │  │
│  │  (App    │  │  (React) │  │  (State)  │  │  Routes  │  │
│  │  Router) │  │          │  │           │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST + JWT
┌────────────────────────▼────────────────────────────────────┐
│                  Backend Layer (FastAPI)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Routers  │  │  Auth    │  │   AI     │  │  Utils   │  │
│  │  (API    │  │(JWT/BCrypt)│ │ Services │  │          │  │
│  │ Endpoints)│  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────┬──────────────┬──────────────┬─────────────────────┘
         │              │              │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ MongoDB │    │  Orion  │    │ Pinecone│
    │ (Users, │    │  Context│    │ (Vector │
    │  Chat)  │    │ Broker  │    │  Search)│
    └─────────┘    └─────────┘    └─────────┘
```

### Project Structure

```
UrbanReflex/
├── app/                          # FastAPI Backend
│   ├── app.py                    # Main FastAPI app + CORS config
│   ├── dependencies.py           # Dependency injection (get_db, auth)
│   ├── routers/                  # API endpoints
│   │   ├── auth.py               # POST /auth/register, /auth/login
│   │   ├── chatbot.py           # POST /ai-service/chatbot/chat
│   │   ├── citizen_reports.py   # POST /api/v1/citizen-reports/classify
│   │   ├── users.py             # GET /api/v1/users/*
│   │   └── items.py              # Example router
│   ├── models/                   # Database models (Pydantic)
│   │   └── chat_history.py       # ChatSession, ChatMessage
│   ├── schemas/                  # Request/Response schemas
│   │   └── user.py               # User, UserCreate, Token
│   ├── utils/                    # Shared utilities
│   │   ├── auth.py               # JWT, password hashing
│   │   └── db.py                 # MongoDB serialization
│   ├── ai_service/               # AI/ML services
│   │   ├── chatbot/
│   │   │   ├── rag.py            # RAG system (Gemini + Pinecone)
│   │   │   ├── embedding.py     # Vector embeddings manager
│   │   │   ├── crawler.py       # Web crawler for indexing
│   │   │   └── pinecone_adapter.py
│   │   └── classifier_report/
│   │       ├── nlp_classifier.py # Report classification
│   │       └── prioritizer.py    # POI-based priority
│   └── internal/                 # Internal/admin routes
│       └── admin.py              # Admin-only endpoints
│
├── website/                      # Next.js Frontend
│   ├── app/                      # App Router (Next.js 16)
│   │   ├── layout.tsx            # Root layout + providers
│   │   ├── page.tsx              # Homepage
│   │   ├── api/                  # API routes (server-side)
│   │   └── [pages]/              # Dynamic routes
│   ├── components/               # React components
│   │   ├── layout/               # Header, Footer
│   │   ├── ui/                   # Reusable UI components
│   │   ├── home/                 # Homepage sections
│   │   └── explore/              # Map/explore components
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Auth state management
│   └── types/                    # TypeScript definitions
│       ├── ngsi-ld.ts            # NGSI-LD entity types
│       └── orion.ts              # Orion API types
│
├── config/                       # Configuration
│   ├── config.py                 # App config (env vars)
│   └── data_model.py             # Data model definitions
│
├── scripts/                      # Automation scripts
│   ├── fetch_*.py                # Data fetching (OpenAQ, OSM, OWM)
│   ├── transform_*.py           # Data transformation to NGSI-LD
│   ├── seed_data.py              # Seed Orion-LD with entities
│   ├── validate_entities.py     # Validate NGSI-LD entities
│   └── run_scheduler.py          # APScheduler for periodic tasks
│
├── docker-compose.yml            # Service orchestration
├── pyproject.toml                # Python dependencies (uv)
├── requirements.txt              # Additional Python deps
└── justfile                      # Task runner commands
```

### Key Design Decisions

#### Backend Architecture

- **FastAPI**: Chosen for async support, automatic OpenAPI docs, and type safety
- **Motor**: Async MongoDB driver (vs sync pymongo) for better performance
- **Pydantic v2**: Data validation and serialization with better performance than v1
- **Dependency Injection**: Centralized in `dependencies.py` for testability

#### Frontend Architecture

- **Next.js App Router**: Modern routing with Server Components support
- **TypeScript**: Strict type checking for better DX and fewer bugs
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Context API**: Lightweight state management (no Redux needed)

#### Data Layer

- **MongoDB**: Primary database for user data, chat history (flexible schema)
- **Orion Context Broker**: NGSI-LD compliant for smart city entities (standardized)
- **Pinecone**: Managed vector database (vs self-hosted FAISS) for scalability

#### AI Services

- **Gemini 2.5 Flash**: Fast, cost-effective LLM for RAG responses
- **Sentence Transformers**: Multilingual embeddings (Vietnamese support)
- **Pinecone**: Vector search with cosine similarity

---

## Development Workflow

### Branch Strategy

```bash
main        # Production releases (protected, requires PR)
develop     # Development integration (default branch)
feature/*   # Feature branches (e.g., feature/add-user-profile)
hotfix/*    # Critical production fixes
bugfix/*    # Bug fixes
refactor/*  # Code refactoring
```

**Naming Convention:**
- `feature/description` (e.g., `feature/chatbot-session-management`)
- `bugfix/issue-number` (e.g., `bugfix/123-auth-token-expiry`)
- `refactor/module-name` (e.g., `refactor/ai-service-structure`)

### Daily Workflow

```bash
# 1. Start your day - sync with develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start development servers
just dev  # Or separately: just backend-dev && just frontend-dev

# 4. Make changes and test locally
# ... code changes ...
just test
just lint

# 5. Commit with conventional commits
git add .
git commit -m "feat: add user profile endpoint"
git push origin feature/your-feature-name

# 6. Create PR targeting develop branch
```

### Available Commands (justfile)

```bash
# Development
just dev              # Start all services (backend + frontend + DBs)
just backend-dev       # Start only FastAPI backend (port 8000)
just frontend-dev      # Start only Next.js frontend (port 3000)
just install          # Install all dependencies

# Database Management
just db-start         # Start MongoDB + Orion-LD containers
just db-stop          # Stop database containers
just db-reset         # Reset databases (WARNING: deletes all data)
just db-logs          # View database logs

# Code Quality
just format           # Format code (black + prettier)
just lint             # Run linters (flake8 + eslint)
just type-check       # Type checking (mypy + tsc)
just test             # Run all tests
just test-backend     # Run backend tests only
just test-frontend    # Run frontend tests only

# Utilities
just setup            # Complete dev environment setup
just clean            # Clean build artifacts and caches
just logs             # View all service logs
```

### Development Best Practices

1. **Always run tests before committing**
   ```bash
   just test && just lint && just type-check
   ```

2. **Use TypeScript/Pydantic types strictly**
   - No `any` types in TypeScript
   - Use Pydantic models for all API schemas

3. **Write async code properly**
```python
# ✓ Good
async def get_user(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return user

# ✗ Bad (blocking)
def get_user(user_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})  # Blocking!
    return user
   ```

4. **Handle errors gracefully**
   ```python
   # ✓ Good
   try:
       result = await some_async_operation()
   except SpecificError as e:
       logger.error(f"Operation failed: {e}")
       raise HTTPException(status_code=500, detail=str(e))
   
   # ✗ Bad (silent failures)
   try:
       result = await some_async_operation()
   except:
       pass  # Silent failure!
   ```

5. **Use environment variables, never hardcode**
   ```python
   # ✓ Good
   api_key = os.getenv("GEMINI_API_KEY")
   
   # ✗ Bad
   api_key = "hardcoded-key-12345"
   ```

---

## Code Review Guidelines

### For Authors (PR Submitters)

#### Before Submitting PR

- [ ] **Code Quality**
  - [ ] All tests pass (`just test`)
  - [ ] No linter errors (`just lint`)
  - [ ] Type checking passes (`just type-check`)
  - [ ] Code formatted (`just format`)

- [ ] **Documentation**
  - [ ] Docstrings added for new functions/classes
  - [ ] README updated if needed
  - [ ] API documentation updated (if adding endpoints)
  - [ ] Comments explain "why", not "what"

- [ ] **Testing**
  - [ ] Unit tests for new functions
  - [ ] Integration tests for new endpoints
  - [ ] Edge cases handled
  - [ ] Error cases tested

- [ ] **PR Description**
  - [ ] Clear description of changes
  - [ ] Screenshots (for UI changes)
  - [ ] Related issue numbers
  - [ ] Breaking changes documented

#### PR Template Checklist

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### For Reviewers

#### Review Checklist

1. **Functionality**
   - [ ] Code works as intended
   - [ ] Edge cases handled
   - [ ] Error handling appropriate
   - [ ] No security vulnerabilities

2. **Code Quality**
   - [ ] Follows project conventions
   - [ ] No code duplication
   - [ ] Functions are focused and small
   - [ ] Variable names are descriptive

3. **Performance**
   - [ ] No obvious performance issues
   - [ ] Database queries optimized
   - [ ] No N+1 queries
   - [ ] Async/await used correctly

4. **Testing**
   - [ ] Adequate test coverage
   - [ ] Tests are meaningful
   - [ ] Edge cases tested

5. **Documentation**
   - [ ] Code is self-documenting
   - [ ] Complex logic explained
   - [ ] API changes documented

#### Review Comments Guidelines

**Be constructive:**
- ✓ "Consider using async/await here for better performance"
- ✗ "This is wrong"

**Explain why:**
- ✓ "Using `any` type defeats TypeScript's purpose. Let's add proper types."
- ✗ "Don't use any"

**Suggest alternatives:**
- ✓ "This could be simplified using `Promise.all()` instead of sequential awaits"
- ✗ "This is inefficient"

**Approve when ready:**
- ✓ "Looks good! Just one small suggestion about error handling."
- ✗ "Needs work" (without specifics)

### Common Issues to Watch For

#### Backend (Python/FastAPI)

```python
# ✗ Missing error handling
async def get_user(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return user  # Returns None if not found, no error handling

# ✓ Proper error handling
async def get_user(user_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return serialize_doc(user)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
```

```python
# ✗ Blocking I/O in async function
async def fetch_data():
    response = requests.get("https://api.example.com")  # Blocking!
    return response.json()

# ✓ Async I/O
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")
        return response.json()
```

#### Frontend (TypeScript/React)

```typescript
// ✗ Missing error handling
const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;  // No error handling
};

// ✓ Proper error handling
const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
```

```typescript
// ✗ Using any type
function processData(data: any) {
  return data.value * 2;
}

// ✓ Proper typing
function processData(data: { value: number }): number {
  return data.value * 2;
}
```

---

## Coding Standards

### Python (Backend)

#### Style Guide
- Follow **PEP 8** (enforced by `black` formatter)
- Use **type hints** for all function signatures
- Maximum line length: **100 characters**
- Use **async/await** for all I/O operations

#### Naming Conventions
```python
# Functions: snake_case
async def get_user_by_id(user_id: str) -> Optional[User]:
    pass

# Classes: PascalCase
class UserService:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_ATTEMPTS = 3

# Private methods: _leading_underscore
def _validate_password(password: str) -> bool:
    pass
```

#### Docstrings
```python
async def classify_report(
    title: str,
    description: str
) -> Dict[str, Any]:
    """
    Classify a citizen report using NLP classification.
    
    Args:
        title: Report title (max 200 chars)
        description: Report description (max 2000 chars)
        
    Returns:
        Dictionary with keys:
        - category: str (e.g., "streetlight_broken")
        - confidence: float (0.0 to 1.0)
        
    Raises:
        ValueError: If title or description is empty
        
    Example:
        >>> result = await classify_report(
        ...     "Broken streetlight",
        ...     "Streetlight not working on Main St"
        ... )
        >>> result["category"]
        'streetlight_broken'
    """
    pass
```

### TypeScript (Frontend)

#### Style Guide
- Follow **ESLint** rules (Next.js recommended config)
- Use **strict TypeScript** (no `any` types)
- Use **functional components** with hooks
- Maximum line length: **100 characters**

#### Naming Conventions
```typescript
// Components: PascalCase
export function UserProfile() {
  return <div>...</div>;
}

// Functions: camelCase
const fetchUserData = async (userId: string): Promise<User> => {
  // ...
};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Types/Interfaces: PascalCase
interface UserProfile {
  id: string;
  name: string;
}
```

#### Component Structure
```typescript
// ✓ Good component structure
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Event handlers
  const handleEdit = useCallback(() => {
    onEdit?.(user);
  }, [user, onEdit]);
  
  // 3. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 4. Render
  return (
    <div className="user-card">
      {/* JSX */}
    </div>
  );
}
```

### File Organization

#### Backend Structure
```
app/
├── routers/
│   └── users.py          # Route handlers only
├── models/
│   └── user.py           # Database models
├── schemas/
│   └── user.py           # Pydantic schemas
└── services/             # Business logic (if needed)
    └── user_service.py
```

#### Frontend Structure
```
website/
├── app/
│   └── users/
│       └── page.tsx      # Page component
├── components/
│   └── users/
│       └── UserCard.tsx  # Reusable component
└── lib/
    └── api/
        └── users.ts      # API client functions
```

---

## Testing

### Backend Testing (pytest)

#### Test Structure
```python
# tests/test_users.py
import pytest
from fastapi.testclient import TestClient
from app.app import app

client = TestClient(app)

def test_create_user():
    """Test user creation endpoint."""
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "securepass123",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_get_user_async():
    """Test async user retrieval."""
    # Use async test client for async endpoints
    pass
```

#### Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_users.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run with verbose output
pytest -v
```

### Frontend Testing (Jest + React Testing Library)

#### Test Structure
```typescript
// __tests__/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import { UserCard } from '@/components/users/UserCard';

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

#### Running Tests
```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Test Coverage Requirements

- **Backend**: Minimum 80% coverage for new code
- **Frontend**: Minimum 70% coverage for components
- **Critical paths**: 100% coverage (auth, payments, etc.)

### Integration Testing

```bash
# Test API endpoints with real database
pytest tests/integration/

# Test frontend-backend integration
npm run test:e2e
```

---

## Debugging & Troubleshooting

### Common Issues

#### Backend Issues

**Issue: MongoDB connection failed**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs urbanreflex-mongo

# Restart MongoDB
docker-compose restart mongo
```

**Issue: Import errors**
```bash
# Ensure you're in the project root
cd /path/to/UrbanReflex

# Check Python path
python -c "import sys; print(sys.path)"

# Reinstall dependencies
uv sync
```

**Issue: Async/await errors**
```python
# ✗ Wrong: Using sync function in async context
def get_data():
    return requests.get("https://api.example.com")

async def my_handler():
    data = get_data()  # Blocking!

# ✓ Correct: Use async HTTP client
async def get_data():
    async with httpx.AsyncClient() as client:
        return await client.get("https://api.example.com")

async def my_handler():
    data = await get_data()  # Non-blocking
```

#### Frontend Issues

**Issue: Build errors**
```bash
# Clear Next.js cache
rm -rf website/.next
cd website && npm run build
```

**Issue: Type errors**
```bash
# Run type checker
cd website && npx tsc --noEmit

# Check tsconfig.json settings
```

**Issue: API connection errors**
```typescript
// Check API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

// Verify CORS settings in backend
// app/app.py should allow frontend origin
```

### Debugging Tools

#### Backend Debugging
```python
# Use Python debugger
import pdb; pdb.set_trace()

# Or use logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message", exc_info=True)
```

#### Frontend Debugging
```typescript
// Use browser DevTools
console.log("Debug info", data);
console.error("Error", error);

// Use React DevTools extension
// Inspect component props and state
```

### Performance Debugging

```bash
# Backend profiling
python -m cProfile -o profile.stats app/app.py

# Frontend bundle analysis
cd website && npm run build
npm run analyze  # If configured
```

---

## Contributing

### Contribution Process

1. **Find or create an issue**
   - Check existing issues first
   - Create new issue if needed
   - Discuss approach before coding

2. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/UrbanReflex.git
   cd UrbanReflex
   git remote add upstream https://github.com/minhe51805/UrbanReflex.git
   ```

3. **Create feature branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

4. **Make changes**
   - Write code following standards
   - Add tests
   - Update documentation

5. **Test your changes**
   ```bash
   just test
   just lint
   just type-check
   ```

6. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add user profile endpoint"
   # Types: feat, fix, docs, style, refactor, test, chore
   ```

7. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub targeting develop branch
   ```

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(auth): add JWT token refresh endpoint
fix(chatbot): handle empty query gracefully
docs(readme): update setup instructions
refactor(ai-service): simplify embedding manager
```

---

## Team Collaboration

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general discussion
- **Pull Requests**: Code review and discussion
- **Team Chat**: (Add your team's chat platform)

### Code Review Process

1. **Author submits PR**
   - Fills out PR template
   - Requests review from team members
   - Adds relevant labels

2. **Reviewer reviews code**
   - Checks functionality
   - Reviews code quality
   - Leaves constructive comments
   - Approves or requests changes

3. **Author addresses feedback**
   - Responds to comments
   - Makes requested changes
   - Pushes updates

4. **Approval and merge**
   - At least 1 approval required
   - All CI checks must pass
   - Merge to `develop` branch

### Pair Programming

- Use VS Code Live Share or similar tools
- Share screen during code reviews
- Discuss architecture decisions together

### Knowledge Sharing

- Document complex logic in code comments
- Share learnings in team discussions
- Update documentation when adding features
- Write blog posts about interesting solutions

---

## Additional Resources

### Documentation
- [API Reference](./docs/API_REFERENCE.md)
- [Architecture Deep Dive](./docs/ARCHITECTURE.md)
- [Development Setup Guide](./docs/DEVELOPMENT_SETUP.md)
- [NGSI-LD Guide](./docs/NGSI_LD_GUIDE.md)

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Driver Documentation](https://motor.readthedocs.io/)
- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/)

---

## Support & Organization

<p align="center">
    <a href="https://hutech.edu.vn/" target="_blank">
        <img loading="lazy" src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png" height="60px" alt="Hutech">
    </a>
    <a href="https://vfossa.vn/" target="_blank">
        <img loading="lazy" src="https://vfossa.vn/uploads/about/logo-6b-new.png" height="60px" alt="VFOSSA">
    </a>
    <a href="https://www.olp.vn/" target="_blank">
        <img loading="lazy" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePWbAslFDMVxeJCgHI6f_LSIuNOrlrEsEhA&s" height="60px" alt="OLP">
    </a>
</p>

---

<div align="center">

**Built with ❤️ by the UrbanReflex Team**

[Website](https://urbanreflex.dev) • [Documentation](./docs/) • [Discussions](https://github.com/minhe51805/UrbanReflex/discussions) • [Issues](https://github.com/minhe51805/UrbanReflex/issues) • [Pull Requests](https://github.com/minhe51805/UrbanReflex/pulls)

</div>
