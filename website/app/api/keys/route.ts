/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 03-12-2025
 * Description: API Keys route handler proxying to backend API for key management
 */
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://163.61.183.90:8001';

// GET - List all API keys
export async function GET(request: NextRequest) {
  console.log('✅ GET /api/keys called');
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth_token')?.value;
    const token = authHeader || cookieToken;

    if (!token) {
      console.log('API Keys: No token provided');
      return NextResponse.json([]);
    }

    const authToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    console.log('API Keys: Fetching from', `${API_BASE_URL}/api/keys`);

    const response = await fetch(`${API_BASE_URL}/api/keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    let data;
    try {
      const text = await response.text();
      if (!text) {
        return NextResponse.json([]);
      }
      data = JSON.parse(text);

      // Log raw response to check if keys are truncated
      console.log('🔍 Raw backend response:', {
        isArray: Array.isArray(data),
        hasKeys: !!(data && data.keys),
        hasData: !!(data && data.data),
        firstKey: Array.isArray(data) && data[0] ? {
          id: data[0].id,
          name: data[0].name,
          keyLength: data[0].key?.length || 0,
          keyFull: data[0].key // Log full key to verify
        } : null
      });
    } catch (e) {
      console.error('Error parsing API response:', e);
      return NextResponse.json(
        { error: 'Invalid response from API' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${API_BASE_URL}/api/keys`
      });

      if (response.status === 404) {
        console.warn('Backend API endpoint /api/keys not found, returning empty array');
        return NextResponse.json([]);
      }

      return NextResponse.json(
        data || { error: `Failed to fetch API keys: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Handle different response formats
    let keysArray: any[] = [];
    if (Array.isArray(data)) {
      keysArray = data;
    } else if (data && Array.isArray(data.keys)) {
      keysArray = data.keys;
    } else if (data && Array.isArray(data.data)) {
      keysArray = data.data;
    } else {
      keysArray = [];
    }

    // Log to verify API keys are complete (not truncated)
    console.log('✅ API Keys from backend:', keysArray.length, 'keys');
    keysArray.forEach((key, idx) => {
      if (key && key.key) {
        console.log(`  Key ${idx + 1} (${key.name || 'Unnamed'}):`, {
          id: key.id,
          length: key.key.length,
          preview: key.key.substring(0, 20) + '...' + key.key.substring(key.key.length - 10),
          full: key.key, // Log full key to verify it's complete
          // Check if key looks truncated (less than expected length)
          isComplete: key.key.length >= 30 // Most API keys are at least 30 chars
        });

        // Warn if key seems too short
        if (key.key.length < 30) {
          console.warn(`⚠️ Key ${idx + 1} seems too short (${key.key.length} chars). Expected at least 30-64 chars.`);
        }
      } else {
        console.warn(`⚠️ Key ${idx + 1} is missing key field:`, key);
      }
    });

    return NextResponse.json(keysArray);
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    if (error.message?.includes('fetch') || error.message?.includes('ECONNREFUSED')) {
      console.warn('Cannot connect to backend API, returning empty array');
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  console.log('✅ POST /api/keys called');
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth_token')?.value;
    const token = authHeader || cookieToken;

    if (!token) {
      console.log('POST /api/keys: No token provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    const body = await request.json();
    console.log('POST /api/keys: Request body:', body);

    try {
      const response = await fetch(`${API_BASE_URL}/api/keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      let data;
      try {
        const text = await response.text();
        if (!text) {
          return NextResponse.json(
            { error: 'Empty response from backend' },
            { status: 500 }
          );
        }
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing backend response:', parseError);
        return NextResponse.json(
          { error: 'Invalid response from backend API' },
          { status: 500 }
        );
      }

      if (!response.ok) {
        console.error('Backend API error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: `${API_BASE_URL}/api/keys`
        });

        if (response.status === 404) {
          console.warn('Backend API endpoint /api/keys not found');
          return NextResponse.json(
            {
              error: 'Backend API endpoint not available',
              detail: 'The /api/keys endpoint is not implemented on the backend server yet.'
            },
            { status: 404 }
          );
        }

        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error('Error calling backend API:', fetchError);
      if (fetchError.message?.includes('fetch') || fetchError.message?.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: 'Cannot connect to backend server',
            detail: 'The backend API server is not available. Please check if the server is running.'
          },
          { status: 503 }
        );
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      {
        error: 'Failed to create API key',
        detail: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
