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

const ORION_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context configurations EXACTLY matching verify_full_data_for_road.py
const CORE = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const SOSA = '<https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const TRANSPORT = '<https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

// EXACTLY like Python script: "road": ", ".join([CORE, SOSA, TRANSPORT])
const ROAD_CONTEXT = [CORE, SOSA, TRANSPORT].join(', ');

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset') || '0';
  const attrs = searchParams.get('attrs');

  try {
    // Build URL without limit to fetch all roads
    let url = `${ORION_URL}/entities?type=RoadSegment&options=keyValues`;

    // Only add limit if explicitly provided
    if (limit) {
      url += `&limit=${limit}`;
    }

    // Only add offset if provided
    if (offset && offset !== '0') {
      url += `&offset=${offset}`;
    }

    // Only add attrs if provided (Orion may not support all attrs combinations)
    if (attrs) {
      url += `&attrs=${attrs}`;
    }

    const response = await fetch(url, {
      headers: {
        'Link': ROAD_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = {
          type: 'error',
          title: 'Request Failed',
          detail: `HTTP ${response.status}: ${response.statusText} - ${errorText.substring(0, 200)}`
        };
      }

      console.error('Orion API error:', {
        status: response.status,
        statusText: response.statusText,
        error: error,
        url: url
      });

      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      roads: data,
      count: Array.isArray(data) ? data.length : 0,
      limit: limit ? parseInt(limit) : null,
      offset: parseInt(offset),
    });

  } catch (error) {
    console.error('Error fetching roads:', error);
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

