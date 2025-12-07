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

import type { LocationsResponse, MeasurementsResponse, Location } from '@/types/openaq';

const BASE_URL = 'https://api.openaq.org/v3';
const USE_PROXY = typeof window !== 'undefined'; // Use proxy on client-side

export class OpenAQClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url: string;

    if (USE_PROXY) {
      // Client-side: use proxy to avoid CORS
      const proxyUrl = new URL('/api/openaq', window.location.origin);
      proxyUrl.searchParams.append('endpoint', endpoint);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            proxyUrl.searchParams.append(key, String(value));
          }
        });
      }

      url = proxyUrl.toString();
    } else {
      // Server-side: direct API call
      const directUrl = new URL(`${this.baseUrl}${endpoint}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            directUrl.searchParams.append(key, String(value));
          }
        });
      }

      url = directUrl.toString();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Add API key for server-side requests
    if (!USE_PROXY) {
      const apiKey = process.env.NEXT_PUBLIC_OPENAQ_API_KEY;
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getLocations(params?: {
    limit?: number;
    page?: number;
    coordinates?: string;
    radius?: number;
    country?: string;
    city?: string;
    isMobile?: boolean;
    isMonitor?: boolean;
    parameter?: string;
    order_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<LocationsResponse> {
    return this.fetch<LocationsResponse>('/locations', params);
  }

  async getLocation(id: number): Promise<Location> {
    const response = await this.fetch<{ results: Location[] }>(`/locations/${id}`);
    return response.results[0];
  }

  async getMeasurements(params?: {
    limit?: number;
    page?: number;
    sensor_id?: number;
    date_from?: string;
    date_to?: string;
    order_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<MeasurementsResponse> {
    const { sensor_id, ...restParams } = params || {};

    if (!sensor_id) {
      // If no sensor_id is provided, return empty results
      return {
        meta: {
          name: 'openaq-api',
          license: '',
          website: '/',
          page: 1,
          limit: 0,
          found: 0,
        },
        results: [],
      };
    }

    return this.fetch<MeasurementsResponse>(`/sensors/${sensor_id}/measurements`, restParams);
  }

  async getLatestMeasurements(locationId: number): Promise<MeasurementsResponse> {
    // Get location to find its sensors
    const location = await this.getLocation(locationId);

    if (!location.sensors || location.sensors.length === 0) {
      return {
        meta: {
          name: 'openaq-api',
          license: '',
          website: '/',
          page: 1,
          limit: 0,
          found: 0,
        },
        results: [],
      };
    }

    // Fetch measurements from all sensors
    const allMeasurements: any[] = [];

    for (const sensor of location.sensors) {
      try {
        const response = await this.getMeasurements({
          sensor_id: sensor.id,
          limit: 100,
          sort_order: 'desc',
        });
        allMeasurements.push(...response.results);
      } catch (error) {
        console.log(`Could not fetch measurements for sensor ${sensor.id}`);
      }
    }

    return {
      meta: {
        name: 'openaq-api',
        license: '',
        website: '/',
        page: 1,
        limit: allMeasurements.length,
        found: allMeasurements.length,
      },
      results: allMeasurements,
    };
  }

  async searchLocations(query: string, limit: number = 10): Promise<LocationsResponse> {
    return this.getLocations({
      limit,
      // Add search functionality when available in API
    });
  }
}

// Export a singleton instance
export const openaqClient = new OpenAQClient();

// Helper functions
export async function getLocationById(id: number): Promise<Location> {
  return openaqClient.getLocation(id);
}

export async function getLocations(params?: Parameters<typeof openaqClient.getLocations>[0]): Promise<LocationsResponse> {
  return openaqClient.getLocations(params);
}

export async function getMeasurements(params?: Parameters<typeof openaqClient.getMeasurements>[0]): Promise<MeasurementsResponse> {
  return openaqClient.getMeasurements(params);
}

export async function getLatestMeasurements(locationId: number): Promise<MeasurementsResponse> {
  return openaqClient.getLatestMeasurements(locationId);
}

