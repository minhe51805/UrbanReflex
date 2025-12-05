/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
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

