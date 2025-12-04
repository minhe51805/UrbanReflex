/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 03-12-2025
 * Description: API keys endpoint v1 for retrieving user's API keys data
 */
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://163.61.183.90:8001';

// GET - Get user's API keys
export async function GET(request: NextRequest) {
  console.log('✅ GET /api/v1/keyapi called');
  try {
    // Get authentication token from header or cookie
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth_token')?.value;
    const token = authHeader || cookieToken;

    if (!token) {
      console.log('API Keys: No token provided');
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication token is required. Please include it in the Authorization header or cookie.'
        },
        { status: 401 }
      );
    }

    // Extract token from Bearer format if needed
    const authToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    console.log('API Keys: Fetching from', `${API_BASE_URL}/api/keys`);

    // Fetch API keys from backend
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
        // Empty response - return empty array
        return NextResponse.json({
          success: true,
          data: [],
          count: 0
        });
      }
      data = JSON.parse(text);
    } catch (e) {
      console.error('Error parsing API response:', e);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from API',
          message: 'The backend API returned an invalid response format.'
        },
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

      // If 404, backend endpoint doesn't exist - return empty array
      if (response.status === 404) {
        console.warn('Backend API endpoint /api/keys not found, returning empty array');
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
          message: 'Backend API endpoint not available, returning empty list.'
        });
      }

      // Return the error from backend
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.detail || `Failed to fetch API keys: ${response.status} ${response.statusText}`,
          message: data?.message || 'An error occurred while fetching API keys.'
        },
        { status: response.status }
      );
    }

    // Handle different response formats and normalize to our format
    let keysArray: any[] = [];
    if (Array.isArray(data)) {
      keysArray = data;
    } else if (data && Array.isArray(data.keys)) {
      keysArray = data.keys;
    } else if (data && Array.isArray(data.data)) {
      keysArray = data.data;
    } else {
      // Empty or unexpected format - return empty array
      keysArray = [];
    }

    // Return normalized response
    return NextResponse.json({
      success: true,
      data: keysArray,
      count: keysArray.length,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: '/api/v1/keyapi'
      }
    });
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    // If connection error, return helpful message
    if (error.message?.includes('fetch') || error.message?.includes('ECONNREFUSED')) {
      console.warn('Cannot connect to backend API, returning empty array');
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Cannot connect to backend server. Returning empty list.'
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch API keys',
        message: error.message || 'An unexpected error occurred.'
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

