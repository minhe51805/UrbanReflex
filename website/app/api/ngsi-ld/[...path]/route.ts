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

const ORION_LD_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    // Decode each path segment (handles encoded URNs like urn%3Angsi-ld%3A...)
    const decodedPath = params.path.map(segment => decodeURIComponent(segment)).join('/');
    
    // Preserve query string from original request
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    
    const url = `${ORION_LD_URL}/${decodedPath}${queryString}`;
    
    console.log(`[NGSI-LD Proxy] GET ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/ld+json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[NGSI-LD Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from NGSI-LD' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    // Decode each path segment (handles encoded URNs)
    const decodedPath = params.path.map(segment => decodeURIComponent(segment)).join('/');
    const url = `${ORION_LD_URL}/${decodedPath}`;
    const body = await request.json();
    
    console.log(`[NGSI-LD Proxy] PATCH ${url}`);
    console.log(`[NGSI-LD Proxy] Body:`, body);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[NGSI-LD Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update NGSI-LD entity' },
      { status: 500 }
    );
  }
}
