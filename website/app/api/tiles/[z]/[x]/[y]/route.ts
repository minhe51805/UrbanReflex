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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await params;

  // Validate parameters
  if (!z || !x || !y) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const zNum = parseInt(z, 10);
  const MAX_ZOOM = 19;

  // Nếu zoom level vượt quá mức hỗ trợ của OpenStreetMap, không gọi ra ngoài nữa
  // mà trả về 204 (no content). Map sẽ chỉ dùng lại tile ở level cao hơn, không lỗi 400.
  if (Number.isNaN(zNum) || zNum > MAX_ZOOM || zNum < 0) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // OpenStreetMap tile servers (round-robin for load balancing)
  const tileServers = [
    'https://a.tile.openstreetmap.org',
    'https://b.tile.openstreetmap.org',
    'https://c.tile.openstreetmap.org',
  ];

  // Select server based on tile coordinates for load balancing
  const serverIndex = (parseInt(x) + parseInt(y)) % tileServers.length;
  const tileUrl = `${tileServers[serverIndex]}/${zNum}/${x}/${y}.png`;

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

