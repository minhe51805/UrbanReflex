/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: [Current Date]
 * Description: TypeScript types for Orion-LD NGSI-LD API responses
 */

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface AQIStation {
  id: string;
  name: string;
  location?: GeoJSONPoint;
  dateObserved?: string;
  stationId?: string;
  
  // Air quality parameters
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  
  // Location info
  address?: string;
  city?: string;
  country?: string;
}

export interface AQIStationResponse {
  stations: AQIStation[];
  total: number;
}

export interface AQIMeasurement {
  parameter: string;
  value: number;
  unit: string;
  dateObserved: string;
}

// For compatibility with existing code
export interface Location {
  id: number;
  name: string;
  locality?: string;
  country?: string | { name: string };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  provider?: {
    name: string;
  };
  sensors?: Sensor[];
  lastUpdated?: string;
  firstUpdated?: string;
  isMobile?: boolean;
  isMonitor?: boolean;
}

export interface Sensor {
  id: number;
  name: string;
  parameter: {
    id: number;
    name: string;
    units: string;
    displayName?: string;
  };
  latest?: {
    datetime: string;
    value: number;
  };
}

export interface LocationsResponse {
  meta: {
    name: string;
    license: string;
    website: string;
    page: number;
    limit: number;
    found: number;
  };
  results: Location[];
}

export interface Measurement {
  period: {
    datetime: string;
    interval: string;
  };
  value: number;
  parameter: {
    id: number;
    name: string;
    units: string;
    displayName?: string;
  };
  sensor: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
}

export interface MeasurementsResponse {
  meta: {
    name: string;
    license: string;
    website: string;
    page: number;
    limit: number;
    found: number;
  };
  results: Measurement[];
}

