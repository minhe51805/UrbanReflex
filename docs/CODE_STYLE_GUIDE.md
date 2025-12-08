# Code Style Guide

Coding standards and best practices for contributing to UrbanReflex. This guide ensures consistent, maintainable, and high-quality code across the project.

## Table of Contents

- [General Principles](#general-principles)
- [Python Style Guide](#python-style-guide)
- [TypeScript/JavaScript Style Guide](#typescriptjavascript-style-guide)
- [React/Next.js Conventions](#reactnextjs-conventions)
- [Git Commit Guidelines](#git-commit-guidelines)
- [Documentation Standards](#documentation-standards)
- [Testing Standards](#testing-standards)
- [Code Review Checklist](#code-review-checklist)

---

## General Principles

### Code Quality Standards

**Readability First**:

- Code is read more often than written
- Favor clarity over cleverness
- Use descriptive names
- Write self-documenting code

**DRY (Don't Repeat Yourself)**:

- Extract reusable functions
- Create shared utilities
- Avoid code duplication
- Use constants for repeated values

**KISS (Keep It Simple, Stupid)**:

- Simple solutions over complex ones
- Break down complex logic
- Avoid premature optimization
- Write straightforward code

**YAGNI (You Aren't Gonna Need It)**:

- Don't add unused features
- Implement what's needed now
- Avoid speculative coding
- Refactor when requirements change

### File Organization

**Backend Structure**:

```
src/backend/
├── routers/          # API route handlers (one file per resource)
├── models/           # Pydantic models
├── schemas/          # Request/response schemas
├── utils/            # Utility functions
├── ai_service/       # AI-related services
├── config/           # Configuration
└── tests/            # Test files mirror structure
```

**Frontend Structure**:

```
src/frontend/
├── app/              # Next.js pages
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── charts/       # Data visualization
│   ├── maps/         # Map components
│   └── forms/        # Form components
├── lib/              # Utilities
├── types/            # TypeScript definitions
└── contexts/         # React contexts
```

---

## Python Style Guide

### Code Formatting

**Use Black for Formatting**:

```bash
# Format all Python files
black src/backend

# Check without modifying
black --check src/backend
```

**Configuration**:

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py310']
include = '\.pyi?$'
```

### Import Ordering

**Use isort**:

```bash
# Sort imports
isort src/backend

# Check without modifying
isort --check-only src/backend
```

**Import Order**:

```python
# 1. Standard library imports
import os
import sys
from datetime import datetime
from typing import Optional, List, Dict

# 2. Third-party imports
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

# 3. Local application imports
from ..models.citizen_report import CitizenReport
from ..utils.ngsi_ld import format_entity
from ..config.settings import settings
```

### Naming Conventions

**Variables and Functions**:

```python
# snake_case for variables and functions
user_name = "John Doe"
max_attempts = 5

def calculate_air_quality_index(pm25_value: float) -> int:
    """Calculate AQI from PM2.5 value."""
    pass

def get_citizen_reports(limit: int = 100) -> List[CitizenReport]:
    """Retrieve citizen reports from database."""
    pass
```

**Classes**:

```python
# PascalCase for class names
class CitizenReport(BaseModel):
    """Citizen report data model."""
    id: str
    description: str
    category: str

class AirQualityService:
    """Service for air quality data operations."""

    def __init__(self):
        pass
```

**Constants**:

```python
# UPPER_CASE for constants
MAX_REPORT_LENGTH = 1000
DEFAULT_PAGE_SIZE = 100
API_VERSION = "1.0.0"
```

**Private Members**:

```python
# Leading underscore for private/internal
class DataProcessor:
    def __init__(self):
        self._cache = {}
        self._connection = None

    def _internal_method(self):
        """Internal method, not part of public API."""
        pass
```

### Type Hints

**Always Use Type Hints**:

```python
from typing import Optional, List, Dict, Any, Union

def process_report(
    report_id: str,
    category: str,
    priority: Optional[int] = None
) -> Dict[str, Any]:
    """Process a citizen report."""
    return {
        "id": report_id,
        "category": category,
        "priority": priority or 1
    }

def get_entities(
    entity_type: str,
    limit: int = 100,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """Retrieve entities from Orion-LD."""
    pass
```

**Complex Types**:

```python
from typing import TypedDict, Literal

class ReportData(TypedDict):
    id: str
    description: str
    category: Literal["infrastructure", "environment", "safety"]
    priority: int

def create_report(data: ReportData) -> str:
    """Create a new report."""
    pass
```

### Docstrings

**Use Google Style Docstrings**:

```python
def classify_citizen_report(entity_id: str, description: str) -> Dict[str, Any]:
    """Classify a citizen report using NLP.

    This function uses a machine learning model to categorize the report
    and determine its priority based on content and location.

    Args:
        entity_id: NGSI-LD entity identifier
        description: Text description of the issue

    Returns:
        Dictionary containing:
            - category: Classified category
            - priority: Determined priority level
            - confidence: Classification confidence score

    Raises:
        HTTPException: If entity not found or classification fails

    Example:
        >>> result = classify_citizen_report(
        ...     "urn:ngsi-ld:CitizenReport:001",
        ...     "Broken streetlight"
        ... )
        >>> print(result["category"])
        'infrastructure'
    """
    pass
```

### Error Handling

**Specific Exceptions**:

```python
from fastapi import HTTPException, status

# Good: Specific exception
def get_report(report_id: str) -> CitizenReport:
    try:
        report = database.get(report_id)
    except NotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report {report_id} not found"
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    return report

# Bad: Catching all exceptions
def get_report(report_id: str) -> CitizenReport:
    try:
        return database.get(report_id)
    except Exception:  # Too broad
        return None
```

### Async/Await

**Async Functions**:

```python
import httpx
from typing import Dict, Any

async def fetch_external_data(url: str) -> Dict[str, Any]:
    """Fetch data from external API asynchronously."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

async def process_multiple_reports(report_ids: List[str]) -> List[Dict]:
    """Process multiple reports concurrently."""
    tasks = [classify_report(rid) for rid in report_ids]
    return await asyncio.gather(*tasks)
```

### Logging

**Use Proper Logging**:

```python
import logging

logger = logging.getLogger(__name__)

def process_data(data: Dict) -> None:
    """Process incoming data."""
    logger.info(f"Processing data: {data.get('id')}")

    try:
        result = transform_data(data)
        logger.debug(f"Transform result: {result}")
    except ValueError as e:
        logger.error(f"Transform failed: {e}", exc_info=True)
        raise

    logger.info("Processing completed successfully")
```

---

## TypeScript/JavaScript Style Guide

### Code Formatting

**Use Prettier**:

```bash
# Format all files
cd src/frontend
npm run format

# Check formatting
npm run format:check
```

**Configuration**:

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### TypeScript Configuration

**Strict Type Checking**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Naming Conventions

**Variables and Functions**:

```typescript
// camelCase for variables and functions
const userName = 'John Doe';
const maxAttempts = 5;

function calculateAirQualityIndex(pm25Value: number): number {
  return Math.round(pm25Value * 2);
}

const getReports = async (limit: number = 100): Promise<Report[]> => {
  // Implementation
};
```

**Interfaces and Types**:

```typescript
// PascalCase for interfaces and types
interface CitizenReport {
  id: string;
  description: string;
  category: string;
  priority: number;
}

type ReportCategory = 'infrastructure' | 'environment' | 'safety';

type ReportStatus = 'pending' | 'in_progress' | 'resolved';
```

**Components**:

```typescript
// PascalCase for React components
export function AirQualityCard({ data }: AirQualityCardProps) {
  return <div>{data.aqi}</div>;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  return <div>{location}</div>;
};
```

**Constants**:

```typescript
// UPPER_CASE for constants
export const API_BASE_URL = 'http://localhost:8000';
export const MAX_REPORT_LENGTH = 1000;
export const DEFAULT_MAP_CENTER = [10.7769, 106.6951];
```

### Type Definitions

**Explicit Types**:

```typescript
// Good: Explicit types
interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  location: [number, number];
  timestamp: string;
}

function processAirQuality(data: AirQualityData): string {
  return `AQI: ${data.aqi}`;
}

// Bad: Implicit any
function processData(data) {
  return data.value;
}
```

**Union Types**:

```typescript
type Status = 'pending' | 'success' | 'error';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: Status;
}

function handleResponse<T>(response: ApiResponse<T>): void {
  if (response.status === 'success' && response.data) {
    console.log(response.data);
  }
}
```

### Async/Await

**Async Functions**:

```typescript
async function fetchReports(limit: number): Promise<Report[]> {
  try {
    const response = await fetch(`/api/reports?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reports;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    throw error;
  }
}
```

### Error Handling

**Try-Catch Blocks**:

```typescript
async function submitReport(report: ReportData): Promise<string> {
  try {
    const response = await apiClient.post('/reports', report);
    return response.data.id;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error('Failed to submit report');
  }
}
```

---

## React/Next.js Conventions

### Component Structure

**Functional Components**:

```typescript
// Good: Functional component with TypeScript
interface AirQualityCardProps {
  aqi: number;
  pm25: number;
  location: string;
}

export function AirQualityCard({ aqi, pm25, location }: AirQualityCardProps) {
  const aqiColor = getAqiColor(aqi);

  return (
    <div className="air-quality-card">
      <h3>{location}</h3>
      <div className={`aqi ${aqiColor}`}>
        <span>AQI: {aqi}</span>
      </div>
      <p>PM2.5: {pm25} µg/m³</p>
    </div>
  );
}
```

### Hooks Usage

**useState**:

```typescript
const [reports, setReports] = useState<Report[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**useEffect**:

```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []); // Empty deps array - run once on mount
```

**Custom Hooks**:

```typescript
function useAirQuality(location: string) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAirQuality() {
      const result = await getAirQuality(location);
      setData(result);
      setLoading(false);
    }

    fetchAirQuality();
  }, [location]);

  return { data, loading };
}

// Usage
const { data, loading } = useAirQuality('District 1');
```

### File Naming

**Component Files**:

```
AirQualityCard.tsx       # Component
AirQualityCard.test.tsx  # Tests
AirQualityCard.module.css # Styles (if not using Tailwind)
```

**Utility Files**:

```
formatters.ts            # Utility functions
api-client.ts            # API client
types.ts                 # Type definitions
constants.ts             # Constants
```

### CSS/Tailwind

**Tailwind Classes**:

```typescript
// Good: Use Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h3 className="text-lg font-semibold">Title</h3>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click
  </button>
</div>

// For complex/repeated styles, extract to component
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 bg-white rounded-lg shadow">
    {children}
  </div>
);
```

---

## Git Commit Guidelines

### Commit Message Format

**Structure**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(reports): add photo upload to citizen reports

Add ability for users to upload up to 5 photos when submitting
a report. Photos are validated for size and type.

Closes #123

---

fix(api): correct AQI calculation for PM2.5

The AQI calculation was using incorrect breakpoints for PM2.5.
Updated to match EPA standards.

---

docs: update installation instructions in README

Add troubleshooting section for UV installation on Windows
```

### Branch Naming

```
feature/add-photo-upload
fix/aqi-calculation-bug
docs/update-api-reference
refactor/simplify-auth-flow
```

---

## Documentation Standards

### Code Comments

**When to Comment**:

```typescript
// Good: Explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the API
const delay = Math.pow(2, attempt) * 1000;

// Bad: States the obvious
// Increment counter by 1
counter++;
```

**TODO Comments**:

```typescript
// TODO(username): Add error handling for network failures
// FIXME: This breaks when input is negative
// NOTE: This is a temporary workaround for API limitation
```

### API Documentation

**FastAPI Docstrings**:

```python
@router.post("/classify/{entity_id}")
async def classify_citizen_report(
    entity_id: str
) -> Dict[str, Any]:
    """
    Classify and prioritize a citizen report.

    This endpoint retrieves a CitizenReport entity from Orion-LD,
    processes it through an NLP classifier to determine the category,
    and applies POI-based priority adjustment.

    - **entity_id**: NGSI-LD entity ID (required)

    Returns:
        - category: Classified category
        - priority: Assigned priority level
        - confidence: Classification confidence
    """
    pass
```

---

## Testing Standards

### Python Tests

**pytest Style**:

```python
def test_calculate_aqi():
    """Test AQI calculation for various PM2.5 values."""
    assert calculate_aqi(12.0) == 50
    assert calculate_aqi(35.5) == 100
    assert calculate_aqi(55.5) == 150

def test_classify_report_success():
    """Test successful report classification."""
    result = classify_report("Broken streetlight")
    assert result["category"] == "infrastructure"
    assert result["confidence"] > 0.7

@pytest.mark.asyncio
async def test_fetch_air_quality():
    """Test fetching air quality data from API."""
    data = await fetch_air_quality("District 1")
    assert data["aqi"] > 0
    assert "pm25" in data
```

### TypeScript Tests

**Jest Style**:

```typescript
describe("AirQualityCard", () => {
  it("renders AQI value correctly", () => {
    const { getByText } = render(
      <AirQualityCard aqi={50} pm25={12} location="District 1" />
    );
    expect(getByText("AQI: 50")).toBeInTheDocument();
  });

  it("applies correct color for moderate AQI", () => {
    const { container } = render(
      <AirQualityCard aqi={75} pm25={25} location="District 1" />
    );
    expect(container.querySelector(".aqi")).toHaveClass("moderate");
  });
});
```

---

## Code Review Checklist

### Before Submitting PR

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log or print statements
- [ ] Type hints/types added
- [ ] Error handling implemented
- [ ] Commit messages follow guidelines

### During Review

- [ ] Code is readable and maintainable
- [ ] Logic is sound and efficient
- [ ] Edge cases handled
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Accessibility requirements met (frontend)

---

## Tools and Automation

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
```

### IDE Configuration

**VS Code Settings**:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Additional Resources

- [PEP 8 - Python Style Guide](https://pep8.org/)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Conventional Commits](https://www.conventionalcommits.org/)

For more information, see:

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Development setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
