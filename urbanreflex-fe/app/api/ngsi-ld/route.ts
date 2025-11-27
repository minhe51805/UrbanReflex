/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 22-11-2025
 * Update at: 26-11-2025
 * Description: NGSI-LD API Proxy Route Proxies requests to Orion Context Broker to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context configurations matching FE_INTEGRATION_GUIDE
// IMPORTANT: RoadSegment, WeatherObserved, AirQualityObserved need 3 contexts (core + sosa + domain)
// Streetlight and PointOfInterest need ONLY domain context (no core)
const CONTEXTS: Record<string, string> = {
  RoadSegment: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  WeatherObserved: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  AirQualityObserved: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  Streetlight: '<https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  PointOfInterest: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  CitizenReport: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
  RoadReport: '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"',
};

function buildLinkHeader(type: string): string {
  return CONTEXTS[type] || CONTEXTS.CitizenReport;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '/entities';
  const type = searchParams.get('type') || '';

  // Build query string (exclude our custom params)
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Link': buildLinkHeader(type),
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
    return NextResponse.json(data);

  } catch (error) {
    console.error('NGSI-LD API Error:', error);
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

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '/entities';
  const type = searchParams.get('type') || 'CitizenReport';

  const url = `${BASE_URL}${endpoint}`;

  try {
    const body = await request.json();

    // Log the request for debugging
    console.log('📤 POST to NGSI-LD:', {
      url,
      type,
      entityId: body.id,
      entityType: body.type
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Link': buildLinkHeader(type),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      // Log the error for debugging
      console.error('❌ NGSI-LD POST Error:', {
        status: response.status,
        error,
        body: JSON.stringify(body, null, 2)
      });

      return NextResponse.json(error, { status: response.status });
    }

    // POST usually returns 201 with no body
    if (response.status === 201) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const data = await response.json().catch(() => ({ success: true }));
    return NextResponse.json(data);

  } catch (error) {
    console.error('NGSI-LD API Error:', error);
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

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '/entities';
  const type = searchParams.get('type') || 'CitizenReport';

  const url = `${BASE_URL}${endpoint}`;

  try {
    const body = await request.json();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/ld+json',
        'Link': buildLinkHeader(type),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('NGSI-LD API Error:', error);
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

