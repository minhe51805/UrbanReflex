/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 15-11-2025
 * Update at: 15-11-2025
 * Description: API proxy route to bypass CORS issues when fetching data from OpenAQ API
 */

import { NextRequest, NextResponse } from 'next/server';

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const endpoint = searchParams.get('endpoint') || '/locations';
    searchParams.delete('endpoint'); // Remove endpoint from params to avoid duplication

    const url = `${OPENAQ_BASE_URL}${endpoint}?${searchParams.toString()}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_OPENAQ_API_KEY;
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenAQ API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from OpenAQ API' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

