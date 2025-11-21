/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 20-11-2025
 * Description: TypeScript type definitions for OpenAQ API responses including locations, measurements, and parameters
 */

// OpenAQ API Types

export interface Location {
  id: number;
  name: string;
  locality?: string;
  timezone?: string;
  country?: {
    id: number;
    code: string;
    name: string;
  };
  owner?: {
    id: number;
    name: string;
  };
  provider?: {
    id: number;
    name: string;
  };
  isMobile: boolean;
  isMonitor: boolean;
  instruments?: Instrument[];
  sensors?: Sensor[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  bounds?: number[];
  distance?: number;
  datetimeFirst?: {
    utc: string;
    local: string;
  };
  datetimeLast?: {
    utc: string;
    local: string;
  };
}

export interface Instrument {
  id: number;
  name: string;
}

export interface Sensor {
  id: number;
  name: string;
  parameter: Parameter;
}

export interface Parameter {
  id: number;
  name: string;
  units: string;
  displayName?: string;
}

export interface Measurement {
  value: number;
  parameter: Parameter;
  period: {
    label: string;
    interval: string;
    datetimeFrom: {
      utc: string;
      local: string;
    };
    datetimeTo: {
      utc: string;
      local: string;
    };
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  coverage?: {
    expectedCount: number;
    expectedInterval: string;
    observedCount: number;
    observedInterval: string;
    percentComplete: number;
    percentCoverage: number;
    datetimeFrom: {
      utc: string;
      local: string;
    };
    datetimeTo: {
      utc: string;
      local: string;
    };
  };
  flagInfo?: {
    hasFlags: boolean;
  };
  summary?: any;
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

export interface LatestMeasurement {
  parameter: string;
  value: number;
  unit: string;
  lastUpdated: string;
  displayName?: string;
}

export interface AQILevel {
  level: number;
  label: string;
  color: string;
  description: string;
}

export interface Provider {
  id: number;
  name: string;
  sourceName?: string;
  exportPrefix?: string;
  license?: string;
  datetimeAdded?: string;
  datetimeFirst?: string;
  datetimeLast?: string;
  entitiesId?: number;
  parametersCount?: number;
  locationsCount?: number;
  measurementsCount?: number;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  datetimeFirst?: string;
  datetimeLast?: string;
  parametersCount?: number;
  locationsCount?: number;
  measurementsCount?: number;
}

