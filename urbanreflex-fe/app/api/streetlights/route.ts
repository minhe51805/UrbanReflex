/**
 * Streetlights API
 * Fetches streetlight data with optional road segment filtering
 * 
 * Author: Backend Integration Team
 * Date: 2025-11-27
 * 
 * Endpoint: GET /api/streetlights?roadId=urn:ngsi-ld:RoadSegment:HCMC-12345
 * Returns: Streetlights (filtered by roadId if provided)
 */

import { NextRequest, NextResponse } from 'next/server';

const ORION_URL = 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context for Streetlight (domain only, no core)
const STREETLIGHT_CONTEXT = '<https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roadId = searchParams.get('roadId');
  const limit = searchParams.get('limit') || '1000';
  const offset = searchParams.get('offset') || '0';

  try {
    const url = `${ORION_URL}/entities?type=Streetlight&options=keyValues&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url, {
      headers: {
        'Link': STREETLIGHT_CONTEXT,
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

    let data = await response.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ streetlights: [], count: 0 });
    }

    // Filter by roadId if provided (client-side filtering)
    if (roadId) {
      data = data.filter((sl: any) => 
        sl.refRoadSegment === roadId || getValue(sl.refRoadSegment) === roadId
      );
    }

    // Calculate statistics
    const onCount = data.filter((sl: any) => 
      getValue(sl.powerState) === 'on' || sl.powerState === 'on'
    ).length;

    return NextResponse.json({
      streetlights: data,
      count: data.length,
      statistics: {
        total: data.length,
        on: onCount,
        off: data.length - onCount,
      },
    });

  } catch (error) {
    console.error('Error fetching streetlights:', error);
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

