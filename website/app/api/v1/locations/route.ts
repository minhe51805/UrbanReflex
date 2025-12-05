/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: API endpoint for locations data with API key authentication
 */

import { NextRequest, NextResponse } from 'next/server';

// Middleware to validate API key
function validateAPIKey(request: NextRequest): { valid: boolean; error?: string } {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');

  if (!apiKey) {
    return { valid: false, error: 'API key is required. Include it in the X-API-Key header.' };
  }

  // Check API key format
  const isValidFormat = /^urx_[a-z0-9]+_[a-z0-9]+$/.test(apiKey);
  
  if (!isValidFormat) {
    return { valid: false, error: 'Invalid API key format' };
  }

  // In production, validate against database here
  // For now, we accept any properly formatted key
  
  return { valid: true };
}

// Sample location data
const sampleLocations = [
  {
    id: 1,
    name: 'Hanoi Central Station',
    city: 'Hanoi',
    country: 'Vietnam',
    coordinates: { lat: 21.0285, lon: 105.8542 },
    parameters: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'],
    lastUpdated: new Date().toISOString(),
    measurements: 15234,
  },
  {
    id: 2,
    name: 'Ho Chi Minh City Center',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    coordinates: { lat: 10.8231, lon: 106.6297 },
    parameters: ['pm25', 'pm10', 'o3', 'no2'],
    lastUpdated: new Date().toISOString(),
    measurements: 12456,
  },
  {
    id: 3,
    name: 'Da Nang Beach',
    city: 'Da Nang',
    country: 'Vietnam',
    coordinates: { lat: 16.0544, lon: 108.2022 },
    parameters: ['pm25', 'pm10', 'o3'],
    lastUpdated: new Date().toISOString(),
    measurements: 8932,
  },
  {
    id: 4,
    name: 'Bangkok Downtown',
    city: 'Bangkok',
    country: 'Thailand',
    coordinates: { lat: 13.7563, lon: 100.5018 },
    parameters: ['pm25', 'pm10', 'o3', 'no2', 'so2'],
    lastUpdated: new Date().toISOString(),
    measurements: 18765,
  },
  {
    id: 5,
    name: 'Singapore Central',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3521, lon: 103.8198 },
    parameters: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'],
    lastUpdated: new Date().toISOString(),
    measurements: 22341,
  },
];

export async function GET(request: NextRequest) {
  // Validate API key
  const validation = validateAPIKey(request);
  if (!validation.valid) {
    return NextResponse.json(
      { 
        error: validation.error,
        message: 'Authentication failed',
      },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'API-Key',
        },
      }
    );
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Filter locations
    let filteredLocations = [...sampleLocations];

    if (city) {
      filteredLocations = filteredLocations.filter(
        loc => loc.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (country) {
      filteredLocations = filteredLocations.filter(
        loc => loc.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    // Return response
    return NextResponse.json({
      meta: {
        name: 'openaq-api',
        license: 'CC BY 4.0',
        website: 'https://urbanreflex.org',
        page,
        limit,
        found: filteredLocations.length,
      },
      results: paginatedLocations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to add new location (example)
export async function POST(request: NextRequest) {
  // Validate API key
  const validation = validateAPIKey(request);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.city || !body.country || !body.coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields: name, city, country, coordinates' },
        { status: 400 }
      );
    }

    // In production, save to database
    const newLocation = {
      id: Date.now(),
      ...body,
      lastUpdated: new Date().toISOString(),
      measurements: 0,
    };

    return NextResponse.json({
      message: 'Location created successfully',
      location: newLocation,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

