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

// Context URLs for different entity types
const CONTEXT_URLS = {
  RoadSegment: 'https://raw.githubusercontent.com/smart-data-models/dataModel.UrbanMobility/master/context.jsonld',
  Streetlight: 'https://raw.githubusercontent.com/smart-data-models/dataModel.Streetlighting/master/context.jsonld',
  PointOfInterest: 'https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld',
  WeatherObserved: 'https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld',
  AirQualityObserved: 'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld',
  CitizenReport: 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
};

const BASE_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

export type EntityType = keyof typeof CONTEXT_URLS;

interface QueryParams {
  type?: EntityType;
  limit?: number;
  offset?: number;
  attrs?: string;
  orderBy?: string;
  q?: string;
  options?: 'keyValues' | 'sysAttrs';
  georel?: string;
  geometry?: string;
  coordinates?: string;
}

/**
 * Build Link header for NGSI-LD requests
 */
function buildLinkHeader(type: EntityType): string {
  const contextUrl = CONTEXT_URLS[type];
  return `<${contextUrl}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`;
}

/**
 * Build query string from params
 */
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}

/**
 * Fetch entities from NGSI-LD broker
 */
export async function fetchEntities<T = any>(
  type: EntityType,
  params: Omit<QueryParams, 'type'> = {}
): Promise<T[]> {
  const queryString = buildQueryString({ type, ...params });
  const url = `${BASE_URL}/entities?${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Link': buildLinkHeader(type),
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
}

/**
 * Fetch a single entity by ID
 */
export async function fetchEntityById<T = any>(
  entityId: string,
  type: EntityType,
  options: { keyValues?: boolean } = {}
): Promise<T> {
  const queryString = options.keyValues ? '?options=keyValues' : '';
  const url = `${BASE_URL}/entities/${encodeURIComponent(entityId)}${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Link': buildLinkHeader(type),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching entity ${entityId}:`, error);
    throw error;
  }
}

/**
 * Create a new entity
 */
export async function createEntity(
  type: EntityType,
  entity: any
): Promise<void> {
  const url = `${BASE_URL}/entities`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Link': buildLinkHeader(type),
      },
      body: JSON.stringify(entity),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    throw error;
  }
}

/**
 * Update entity attributes
 */
export async function updateEntityAttrs(
  entityId: string,
  type: EntityType,
  attrs: any
): Promise<void> {
  const url = `${BASE_URL}/entities/${encodeURIComponent(entityId)}/attrs`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/ld+json',
        'Link': buildLinkHeader(type),
      },
      body: JSON.stringify(attrs),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error updating entity ${entityId}:`, error);
    throw error;
  }
}

 
