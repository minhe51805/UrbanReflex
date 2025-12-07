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


import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

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
      entityId: body?.id,
      entityType: body?.type,
      bodyKeys: body ? Object.keys(body) : [],
      bodySize: body ? JSON.stringify(body).length : 0
    });

    // Ensure body exists and is valid
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      console.error('❌ Empty or invalid body:', body);
      return NextResponse.json(
        {
          type: 'error',
          title: 'Bad Request',
          detail: 'Request body is empty or invalid'
        },
        { status: 400 }
      );
    }

    // Check if @context is in body - determine Content-Type accordingly
    const hasContextInBody = '@context' in body;
    
    // If @context in body, use application/ld+json and remove Link header
    // If no @context in body, use application/json with Link header
    const headers: HeadersInit = hasContextInBody 
      ? {
          'Content-Type': 'application/ld+json',
        }
      : {
          'Content-Type': 'application/json',
          'Link': buildLinkHeader(type),
        };

    // Stringify body for forwarding
    const bodyString = JSON.stringify(body);
    console.log('📤 Forwarding body to NGSI-LD:', {
      bodyLength: bodyString.length,
      hasContextInBody,
      contentType: headers['Content-Type'],
      firstChars: bodyString.substring(0, 200)
    });

    console.log('📤 Sending to NGSI-LD:', {
      url,
      method: 'POST',
      headers: {
        'Content-Type': headers['Content-Type'],
        'Link': headers['Link']?.substring(0, 100) + '...'
      },
      bodyLength: bodyString.length
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: bodyString,
    });

    if (!response.ok) {
      let errorData;
      try {
        const errorText = await response.text();
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            type: 'error',
            title: 'Request Failed',
            detail: errorText || `HTTP ${response.status}: ${response.statusText}`
          };
        }
      } catch {
        errorData = {
          type: 'error',
          title: 'Request Failed',
          detail: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      // Log the error for debugging
      console.error('❌ NGSI-LD POST Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        body: JSON.stringify(body, null, 2),
        headers: Object.fromEntries(response.headers.entries())
      });

      return NextResponse.json({
        ...errorData,
        status: response.status,
        statusText: response.statusText
      }, { status: response.status });
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

