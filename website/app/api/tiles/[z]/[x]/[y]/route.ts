/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 28-11-2025
 * Update at: 03-12-2025
 * Description: Proxy route for OpenStreetMap tiles to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await params;

  // Validate parameters
  if (!z || !x || !y) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // OpenStreetMap tile servers (round-robin for load balancing)
  const tileServers = [
    'https://a.tile.openstreetmap.org',
    'https://b.tile.openstreetmap.org',
    'https://c.tile.openstreetmap.org',
  ];

  // Select server based on tile coordinates for load balancing
  const serverIndex = (parseInt(x) + parseInt(y)) % tileServers.length;
  const tileUrl = `${tileServers[serverIndex]}/${z}/${x}/${y}.png`;

  try {
    const response = await fetch(tileUrl, {
      headers: {
        'User-Agent': 'UrbanReflex/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tile' },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching tile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

