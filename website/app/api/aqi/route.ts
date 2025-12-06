/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 03-12-2025
 * Description: AQI API route for fetching air quality data with spatial query support
 */

import { NextRequest, NextResponse } from 'next/server';

const ORION_URL = 'http://103.178.233.233:1026/ngsi-ld/v1';

// Full context for AirQualityObserved (core + sosa + environment)
const AQI_CONTEXT = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

function parseDateTime(value: any): Date {
  if (!value) return new Date(0);
  if (typeof value === 'object' && value['@value']) {
    return new Date(value['@value']);
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  return new Date(0);
}

function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const maxDistance = searchParams.get('maxDistance') || '5000';
  const limit = searchParams.get('limit') || '100';

  try {
    let url = `${ORION_URL}/entities?type=AirQualityObserved&options=keyValues&limit=${limit}`;

    // Add spatial query if coordinates provided
    if (lat && lon) {
      const coordinates = `[${lon},${lat}]`;
      url += `&georel=near;maxDistance==${maxDistance}&geometry=Point&coordinates=${coordinates}`;
    }

    const response = await fetch(url, {
      headers: {
        'Link': AQI_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ stations: [] });
    }

    // Group by station and get latest for each
    const grouped: Record<string, any> = {};

    data.forEach((entity: any) => {
      const stationId = entity.stationId || entity.name || entity.id;
      const currentDate = parseDateTime(entity.dateObserved);
      const existing = grouped[stationId];

      if (!existing || currentDate > parseDateTime(existing.dateObserved)) {
        grouped[stationId] = entity;
      }
    });

    // Format stations
    const stations = Object.values(grouped).map((station: any) => ({
      id: station.id,
      stationId: station.stationId || station.name,
      name: station.name,
      dateObserved: station.dateObserved,
      location: station.location,
      aqi: getValue(station.aqi),
      pm25: getValue(station.pm25),
      pm10: getValue(station.pm10),
      no2: getValue(station.no2),
      o3: getValue(station.o3),
      so2: getValue(station.so2),
      co: getValue(station.co),
      airQualityLevel: getValue(station.airQualityLevel),
      measurementQuality: getValue(station.measurementQuality),
    }));

    // Sort by dateObserved (newest first)
    stations.sort((a, b) => {
      const dateA = parseDateTime(a.dateObserved);
      const dateB = parseDateTime(b.dateObserved);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      stations,
      count: stations.length,
    });

  } catch (error) {
    console.error('Error fetching AQI:', error);
    return NextResponse.json(
      {
        type: 'error',
        title: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

