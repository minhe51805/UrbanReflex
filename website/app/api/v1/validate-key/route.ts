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

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // In production, you would validate against a database
    // For now, we'll just check the format
    const isValidFormat = /^urx_[a-z0-9]+_[a-z0-9]+$/.test(apiKey);

    if (!isValidFormat) {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

