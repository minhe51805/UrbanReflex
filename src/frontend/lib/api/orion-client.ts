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


import type { AQIStation, AQIStationResponse, Location, LocationsResponse, Measurement, MeasurementsResponse } from '@/types/orion';

const USE_PROXY = typeof window !== 'undefined'; // Use API routes on client-side

export class OrionClient {
  /**
   * Fetch AQI stations with optional spatial filtering
   */
  async getAQIStations(params?: {
    limit?: number;
    lat?: number;
    lon?: number;
    maxDistance?: number;
    country?: string;
  }): Promise<AQIStation[]> {
    const { limit = 100, lat, lon, maxDistance = 50000 } = params || {};

    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (lat !== undefined && lon !== undefined) {
      queryParams.append('lat', lat.toString());
      queryParams.append('lon', lon.toString());
      queryParams.append('maxDistance', maxDistance.toString());
    }

    const response = await fetch(`/api/aqi?${queryParams.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`AQI API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.stations || !Array.isArray(data.stations)) {
      return [];
    }

    // Convert to AQIStation format
    return data.stations.map((station: any) => this.convertToAQIStation(station));
  }

  /**
   * Get a single AQI station by ID
   */
  async getAQIStation(id: string): Promise<AQIStation | null> {
    try {
      // Fetch all stations and find the one with matching ID
      const stations = await this.getAQIStations({ limit: 1000 });
      return stations.find(s => s.id === id) || null;
    } catch (error) {
      console.error(`Error fetching AQI station ${id}:`, error);
      return null;
    }
  }

  /**
   * Get locations (for compatibility with OpenAQ client)
   */
  async getLocations(params?: {
    limit?: number;
    page?: number;
    coordinates?: string;
    radius?: number;
    country?: string;
  }): Promise<LocationsResponse> {
    const { limit = 100, coordinates, radius } = params || {};

    let lat: number | undefined;
    let lon: number | undefined;

    if (coordinates) {
      const [latStr, lonStr] = coordinates.split(',');
      lat = parseFloat(latStr);
      lon = parseFloat(lonStr);
    }

    const stations = await this.getAQIStations({
      limit,
      lat,
      lon,
      maxDistance: radius,
    });

    // Convert AQIStations to Locations
    const locations: Location[] = stations.map((station, index) => ({
      id: index + 1, // Generate numeric ID
      name: station.name,
      locality: station.city,
      country: station.country,
      coordinates: station.location ? {
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
      } : undefined,
      provider: {
        name: 'UrbanReflex NGSI-LD',
      },
      sensors: this.createSensorsFromStation(station),
      lastUpdated: station.dateObserved,
      firstUpdated: station.dateObserved,
      isMobile: false,
      isMonitor: true,
    }));

    return {
      meta: {
        name: 'orion-ld-api',
        license: '',
        website: '/',
        page: 1,
        limit: locations.length,
        found: locations.length,
      },
      results: locations,
    };
  }

  /**
   * Get a single location by ID
   */
  async getLocation(id: number): Promise<Location> {
    const response = await this.getLocations({ limit: 1000 });
    const location = response.results.find(l => l.id === id);

    if (!location) {
      throw new Error(`Location ${id} not found`);
    }

    return location;
  }

  /**
   * Get measurements for a location
   */
  async getMeasurements(params?: {
    limit?: number;
    page?: number;
    sensor_id?: number;
    date_from?: string;
    date_to?: string;
    order_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<MeasurementsResponse> {
    // For now, return empty measurements as we don't have historical data
    return {
      meta: {
        name: 'orion-ld-api',
        license: '',
        website: '/',
        page: 1,
        limit: 0,
        found: 0,
      },
      results: [],
    };
  }

  /**
   * Get latest measurements for a location
   */
  async getLatestMeasurements(locationId: number): Promise<MeasurementsResponse> {
    try {
      const location = await this.getLocation(locationId);

      if (!location.sensors || location.sensors.length === 0) {
        return {
          meta: {
            name: 'orion-ld-api',
            license: '',
            website: '/',
            page: 1,
            limit: 0,
            found: 0,
          },
          results: [],
        };
      }

      // Convert sensors to measurements
      const measurements: Measurement[] = location.sensors
        .filter(sensor => sensor.latest)
        .map(sensor => ({
          period: {
            datetime: sensor.latest!.datetime,
            interval: '1 hour',
          },
          value: sensor.latest!.value,
          parameter: {
            id: sensor.parameter.id,
            name: sensor.parameter.name,
            units: sensor.parameter.units,
            displayName: sensor.parameter.displayName,
          },
          sensor: {
            id: sensor.id,
            name: sensor.name,
          },
          location: {
            id: location.id,
            name: location.name,
          },
        }));

      return {
        meta: {
          name: 'orion-ld-api',
          license: '',
          website: '/',
          page: 1,
          limit: measurements.length,
          found: measurements.length,
        },
        results: measurements,
      };
    } catch (error) {
      console.error('Error loading latest measurements:', error);
      return {
        meta: {
          name: 'orion-ld-api',
          license: '',
          website: '/',
          page: 1,
          limit: 0,
          found: 0,
        },
        results: [],
      };
    }
  }

  /**
   * Create sensors array from AQI station data
   */
  private createSensorsFromStation(station: AQIStation) {
    const sensors = [];
    let sensorId = 1;

    const parameterMap: Record<string, { name: string; units: string; displayName: string }> = {
      pm25: { name: 'pm25', units: 'µg/m³', displayName: 'PM2.5' },
      pm10: { name: 'pm10', units: 'µg/m³', displayName: 'PM10' },
      no2: { name: 'no2', units: 'ppb', displayName: 'NO₂' },
      so2: { name: 'so2', units: 'ppb', displayName: 'SO₂' },
      co: { name: 'co', units: 'ppb', displayName: 'CO' },
      o3: { name: 'o3', units: 'ppb', displayName: 'O₃' },
    };

    for (const [key, value] of Object.entries(station)) {
      if (key in parameterMap && typeof value === 'number') {
        const param = parameterMap[key];
        sensors.push({
          id: sensorId++,
          name: `${station.name} - ${param.displayName}`,
          parameter: {
            id: sensorId,
            name: param.name,
            units: param.units,
            displayName: param.displayName,
          },
          latest: station.dateObserved ? {
            datetime: station.dateObserved,
            value: value,
          } : undefined,
        });
      }
    }

    return sensors;
  }

  /**
   * Convert API response to AQIStation format
   */
  private convertToAQIStation(entity: any): AQIStation {
    return {
      id: entity.id,
      name: entity.name || entity.stationId || entity.id,
      location: entity.location,
      dateObserved: entity.dateObserved,
      stationId: entity.stationId,
      pm25: entity.pm25,
      pm10: entity.pm10,
      no2: entity.no2,
      so2: entity.so2,
      co: entity.co,
      o3: entity.o3,
      address: entity.address,
      city: entity.city,
      country: entity.country,
    };
  }
}

// Export a singleton instance
export const orionClient = new OrionClient();

// Helper functions for AQI
export async function getAQIStations(params?: Parameters<typeof orionClient.getAQIStations>[0]): Promise<AQIStation[]> {
  return orionClient.getAQIStations(params);
}

export async function getAQIStation(id: string): Promise<AQIStation | null> {
  return orionClient.getAQIStation(id);
}

// Helper functions for compatibility with OpenAQ client
export async function getLocationById(id: number): Promise<Location> {
  return orionClient.getLocation(id);
}

export async function getLocations(params?: Parameters<typeof orionClient.getLocations>[0]): Promise<LocationsResponse> {
  return orionClient.getLocations(params);
}

export async function getMeasurements(params?: Parameters<typeof orionClient.getMeasurements>[0]): Promise<MeasurementsResponse> {
  return orionClient.getMeasurements(params);
}

export async function getLatestMeasurements(locationId: number): Promise<MeasurementsResponse> {
  return orionClient.getLatestMeasurements(locationId);
}

 
