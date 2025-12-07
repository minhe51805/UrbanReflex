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

