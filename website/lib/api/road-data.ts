/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 01-12-2025
 * Description: Road Data API Client handling comprehensive road segment data including weather, AQI, streetlights, and reports
 */

import { parseDateTime, getValue } from '@/lib/utils/format';

const API_BASE = '/api/ngsi-ld';

// Context configurations matching backend
const CONTEXTS = {
  road: 'RoadSegment',
  weather: 'WeatherObserved',
  aqi: 'AirQualityObserved',
  streetlight: 'Streetlight',
  report: 'CitizenReport',
  poi: 'PointOfInterest',
};

/**
 * Fetch all road segments with pagination
 */
export async function fetchAllRoads(limit = 5000, offset = 0) {
  const params = new URLSearchParams({
    type: CONTEXTS.road,
    options: 'keyValues',
    limit: limit.toString(),
    offset: offset.toString(),
    attrs: 'id,name,location,roadClass',
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch roads: ${response.statusText}`);
  return response.json();
}

/**
 * Fetch a single road segment by ID
 */
export async function fetchRoadById(roadId: string) {
  const params = new URLSearchParams({
    endpoint: `/entities/${encodeURIComponent(roadId)}`,
    type: CONTEXTS.road,
    options: 'keyValues',
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch road: ${response.statusText}`);
  return response.json();
}

/**
 * Fetch latest weather data (city-wide)
 */
export async function fetchLatestWeather() {
  const params = new URLSearchParams({
    type: CONTEXTS.weather,
    options: 'keyValues',
    limit: '100',
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch weather: ${response.statusText}`);

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No weather data available');
  }

  // Get latest by dateObserved
  return data.reduce((latest, current) => {
    const currentDate = parseDateTime(current.dateObserved);
    const latestDate = parseDateTime(latest.dateObserved);
    return currentDate > latestDate ? current : latest;
  });
}

/**
 * Fetch AQI data near a location (spatial query)
 */
export async function fetchAQINearLocation(
  coordinates: [number, number],
  maxDistance = 5000,
  limit = 50
) {
  const params = new URLSearchParams({
    type: CONTEXTS.aqi,
    options: 'keyValues',
    georel: `near;maxDistance==${maxDistance}`,
    geometry: 'Point',
    coordinates: JSON.stringify(coordinates),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch AQI: ${response.statusText}`);
  return response.json();
}

/**
 * Fetch all streetlights (needs client-side filtering)
 */
export async function fetchAllStreetlights(limit = 1000, offset = 0) {
  const params = new URLSearchParams({
    type: CONTEXTS.streetlight,
    options: 'keyValues',
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch streetlights: ${response.statusText}`);
  return response.json();
}

/**
 * Fetch citizen reports near a location
 */
export async function fetchReportsNearLocation(
  coordinates: [number, number],
  maxDistance = 1000,
  limit = 20
) {
  const params = new URLSearchParams({
    type: CONTEXTS.report,
    options: 'keyValues',
    georel: `near;maxDistance==${maxDistance}`,
    geometry: 'Point',
    coordinates: JSON.stringify(coordinates),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`);
  return response.json();
}

/**
 * Create a new citizen report
 */
export async function createCitizenReport(reportData: any) {
  const response = await fetch(`${API_BASE}?type=${CONTEXTS.report}&endpoint=/entities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create report: ${response.statusText}`);
  }
  return response.json();
}

 
