# Code Examples - Chi tiết chức năng

## 📋 Tổng quan

Collection đầy đủ các code examples để tích hợp UrbanReflex API vào ứng dụng của bạn.

---

## 🌐 cURL Examples

### Get Locations

```bash
# Basic request
curl -X GET "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"

# With filters
curl -X GET "https://your-domain.com/api/v1/locations?city=Hanoi&limit=10" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"

# With pagination
curl -X GET "https://your-domain.com/api/v1/locations?page=2&limit=50" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

### Get Measurements

```bash
# Basic request
curl -X GET "https://your-domain.com/api/v1/measurements" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"

# Filter by parameter
curl -X GET "https://your-domain.com/api/v1/measurements?parameter=pm25" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"

# Multiple filters
curl -X GET "https://your-domain.com/api/v1/measurements?city=Hanoi&parameter=pm25&limit=20" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"

# Date range
curl -X GET "https://your-domain.com/api/v1/measurements?date_from=2025-11-17T00:00:00Z&date_to=2025-11-18T00:00:00Z" \
  -H "X-API-Key: urx_lq8k9j_abc123def456"
```

### Create Location

```bash
curl -X POST "https://your-domain.com/api/v1/locations" \
  -H "X-API-Key: urx_lq8k9j_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hanoi University",
    "city": "Hanoi",
    "country": "Vietnam",
    "coordinates": {
      "lat": 21.0045,
      "lon": 105.8412
    },
    "parameters": ["pm25", "pm10", "o3"]
  }'
```

### Submit Measurement

```bash
curl -X POST "https://your-domain.com/api/v1/measurements" \
  -H "X-API-Key: urx_lq8k9j_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": 1,
    "parameter": "pm25",
    "value": 45.2,
    "unit": "µg/m³"
  }'
```

---

## 🟨 JavaScript (Fetch API)

### Setup

```javascript
const API_KEY = 'urx_lq8k9j_abc123def456';
const BASE_URL = 'https://your-domain.com/api/v1';

const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json'
};
```

### Get Locations

```javascript
// Basic request
async function getLocations() {
  try {
    const response = await fetch(`${BASE_URL}/locations`, {
      headers: { 'X-API-Key': API_KEY }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Locations:', data);
    return data;
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
}

// With filters
async function getLocationsByCity(city) {
  const params = new URLSearchParams({ city, limit: '10' });
  
  const response = await fetch(`${BASE_URL}/locations?${params}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return await response.json();
}

// With pagination
async function getLocationsPaginated(page = 1, limit = 100) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  const response = await fetch(`${BASE_URL}/locations?${params}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return await response.json();
}
```

### Get Measurements

```javascript
// Basic request
async function getMeasurements() {
  const response = await fetch(`${BASE_URL}/measurements`, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return await response.json();
}

// With filters
async function getMeasurementsByParameter(parameter, city = null) {
  const params = new URLSearchParams({ parameter });
  if (city) params.append('city', city);
  
  const response = await fetch(`${BASE_URL}/measurements?${params}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return await response.json();
}

// Date range
async function getMeasurementsByDateRange(dateFrom, dateTo) {
  const params = new URLSearchParams({
    date_from: dateFrom,
    date_to: dateTo
  });
  
  const response = await fetch(`${BASE_URL}/measurements?${params}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return await response.json();
}
```

### Create Location

```javascript
async function createLocation(locationData) {
  try {
    const response = await fetch(`${BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create location');
    }
    
    const data = await response.json();
    console.log('Location created:', data);
    return data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
}

// Usage
createLocation({
  name: 'Hanoi University',
  city: 'Hanoi',
  country: 'Vietnam',
  coordinates: { lat: 21.0045, lon: 105.8412 },
  parameters: ['pm25', 'pm10', 'o3']
});
```

### Submit Measurement

```javascript
async function submitMeasurement(measurementData) {
  const response = await fetch(`${BASE_URL}/measurements`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(measurementData)
  });
  
  return await response.json();
}

// Usage
submitMeasurement({
  locationId: 1,
  parameter: 'pm25',
  value: 45.2,
  unit: 'µg/m³'
});
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useLocations(city = null) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        const params = city ? `?city=${city}` : '';
        const response = await fetch(`${BASE_URL}/locations${params}`, {
          headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setLocations(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [city]);

  return { locations, loading, error };
}

// Usage in component
function LocationsList() {
  const { locations, loading, error } = useLocations('Hanoi');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {locations.map(loc => (
        <li key={loc.id}>{loc.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🟦 TypeScript

### Type Definitions

```typescript
// types.ts
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  parameters: string[];
  lastUpdated: string;
  measurements: number;
}

export interface Measurement {
  locationId: number;
  location: string;
  city: string;
  country: string;
  parameter: string;
  value: number;
  unit: string;
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface APIResponse<T> {
  meta: {
    name: string;
    license: string;
    website: string;
    page: number;
    limit: number;
    found: number;
  };
  results: T[];
}

export interface APIError {
  error: string;
  message?: string;
}
```

### API Client Class

```typescript
// api-client.ts
class UrbanReflexAPI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://your-domain.com/api/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  }

  async getLocations(params?: {
    city?: string;
    country?: string;
    limit?: number;
    page?: number;
  }): Promise<APIResponse<Location>> {
    const queryParams = new URLSearchParams();
    if (params?.city) queryParams.append('city', params.city);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    const endpoint = `/locations${query ? `?${query}` : ''}`;

    return this.request<APIResponse<Location>>(endpoint);
  }

  async getMeasurements(params?: {
    city?: string;
    country?: string;
    parameter?: string;
    location_id?: number;
    date_from?: string;
    date_to?: string;
    limit?: number;
    page?: number;
  }): Promise<APIResponse<Measurement>> {
    const queryParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const query = queryParams.toString();
    const endpoint = `/measurements${query ? `?${query}` : ''}`;

    return this.request<APIResponse<Measurement>>(endpoint);
  }

  async createLocation(data: {
    name: string;
    city: string;
    country: string;
    coordinates: Coordinates;
    parameters?: string[];
  }): Promise<{ message: string; location: Location }> {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitMeasurement(data: {
    locationId: number;
    parameter: string;
    value: number;
    unit?: string;
    timestamp?: string;
  }): Promise<{ message: string; measurement: Measurement }> {
    return this.request('/measurements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Usage
const api = new UrbanReflexAPI('urx_lq8k9j_abc123def456');

// Get locations
const locations = await api.getLocations({ city: 'Hanoi', limit: 10 });
console.log(locations.results);

// Get measurements
const measurements = await api.getMeasurements({
  parameter: 'pm25',
  city: 'Hanoi',
  limit: 20
});
console.log(measurements.results);
```

---

## 🐍 Python

### Using Requests Library

```python
import requests
from typing import Optional, Dict, List
from datetime import datetime

class UrbanReflexAPI:
    def __init__(self, api_key: str, base_url: str = 'https://your-domain.com/api/v1'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {'X-API-Key': api_key}
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make API request"""
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        response.raise_for_status()
        return response.json()
    
    def get_locations(
        self,
        city: Optional[str] = None,
        country: Optional[str] = None,
        limit: int = 100,
        page: int = 1
    ) -> Dict:
        """Get locations"""
        params = {'limit': limit, 'page': page}
        if city:
            params['city'] = city
        if country:
            params['country'] = country
        
        return self._request('GET', '/locations', params=params)
    
    def get_measurements(
        self,
        city: Optional[str] = None,
        country: Optional[str] = None,
        parameter: Optional[str] = None,
        location_id: Optional[int] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        limit: int = 100,
        page: int = 1
    ) -> Dict:
        """Get measurements"""
        params = {'limit': limit, 'page': page}
        
        if city:
            params['city'] = city
        if country:
            params['country'] = country
        if parameter:
            params['parameter'] = parameter
        if location_id:
            params['location_id'] = location_id
        if date_from:
            params['date_from'] = date_from
        if date_to:
            params['date_to'] = date_to
        
        return self._request('GET', '/measurements', params=params)
    
    def create_location(self, data: Dict) -> Dict:
        """Create new location"""
        return self._request('POST', '/locations', json=data)
    
    def submit_measurement(self, data: Dict) -> Dict:
        """Submit new measurement"""
        return self._request('POST', '/measurements', json=data)

# Usage
api = UrbanReflexAPI('urx_lq8k9j_abc123def456')

# Get locations
locations = api.get_locations(city='Hanoi', limit=10)
print(f"Found {locations['meta']['found']} locations")
for loc in locations['results']:
    print(f"- {loc['name']}")

# Get measurements
measurements = api.get_measurements(
    parameter='pm25',
    city='Hanoi',
    limit=20
)
for m in measurements['results']:
    print(f"{m['location']}: {m['value']} {m['unit']}")

# Create location
new_location = api.create_location({
    'name': 'Hanoi University',
    'city': 'Hanoi',
    'country': 'Vietnam',
    'coordinates': {'lat': 21.0045, 'lon': 105.8412},
    'parameters': ['pm25', 'pm10', 'o3']
})
print(f"Created location: {new_location['location']['name']}")
```

---

## 📚 Related Documentation

- [API Endpoints](./API-Endpoints.md)
- [API Authentication](./API-Authentication.md)
- [Testing Guide](./Testing-Guide.md)

