/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: API endpoint to validate API keys
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

