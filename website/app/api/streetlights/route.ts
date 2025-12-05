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

