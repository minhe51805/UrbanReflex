/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 03-12-2025
 * Description: Nearby roads API for fetching road segments within a specified radius of a location
 */

import { NextRequest, NextResponse } from 'next/server';

const ORION_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

// Full context for RoadSegment
const ROAD_CONTEXT = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '1000'; // Default 1km

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat, lng' },
      { status: 400 }
    );
  }

  try {
    // NGSI-LD spatial query: georel=near;maxDistance==<radius>
    const coordinates = [parseFloat(lng), parseFloat(lat)];
    const url = `${ORION_URL}/entities?type=RoadSegment&georel=near;maxDistance==${radius}&geometry=Point&coordinates=${JSON.stringify(coordinates)}&options=keyValues&limit=50`;

    console.log('🔍 Fetching nearby roads:', { lat, lng, radius, url });

    const response = await fetch(url, {
      headers: {
        'Link': ROAD_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      console.error('❌ Orion error:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Found roads:', Array.isArray(data) ? data.length : 0);

    // Transform to match RoadSegment interface
    const roads = Array.isArray(data) ? data.map((road: any) => ({
      id: road.id,
      type: road.type || 'RoadSegment',
      name: road.name || 'Unnamed Road',
      roadType: road.roadClass || road.roadType || 'residential',
      length: road.length || 0,
      laneCount: road.totalLaneNumber || road.laneCount,
      surface: road.surface,
      oneway: road.oneway,
      maximumAllowedSpeed: road.maximumAllowedSpeed,
      location: road.location,
      dataProvider: road.dataProvider || 'NGSI-LD',
      dateCreated: road.dateCreated || new Date().toISOString(),
    })) : [];

    return NextResponse.json(roads);

  } catch (error) {
    console.error('❌ Error fetching nearby roads:', error);
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

