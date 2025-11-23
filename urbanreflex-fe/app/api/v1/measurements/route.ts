/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: API endpoint for measurements data with API key authentication
 */

import { NextRequest, NextResponse } from 'next/server';

// Middleware to validate API key
function validateAPIKey(request: NextRequest): { valid: boolean; error?: string } {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');

  if (!apiKey) {
    return { valid: false, error: 'API key is required. Include it in the X-API-Key header.' };
  }

  const isValidFormat = /^urx_[a-z0-9]+_[a-z0-9]+$/.test(apiKey);
  
  if (!isValidFormat) {
    return { valid: false, error: 'Invalid API key format' };
  }

  return { valid: true };
}

// Generate sample measurements
function generateMeasurements(count: number = 10) {
  const parameters = ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'];
  const locations = ['Hanoi Central Station', 'Ho Chi Minh City Center', 'Da Nang Beach', 'Bangkok Downtown', 'Singapore Central'];
  const cities = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Bangkok', 'Singapore'];
  const countries = ['Vietnam', 'Vietnam', 'Vietnam', 'Thailand', 'Singapore'];

  const measurements = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const locationIndex = Math.floor(Math.random() * locations.length);
    const parameter = parameters[Math.floor(Math.random() * parameters.length)];
    
    // Generate realistic values based on parameter
    let value, unit;
    switch (parameter) {
      case 'pm25':
        value = Math.random() * 100 + 10;
        unit = 'µg/m³';
        break;
      case 'pm10':
        value = Math.random() * 150 + 20;
        unit = 'µg/m³';
        break;
      case 'o3':
        value = Math.random() * 80 + 10;
        unit = 'µg/m³';
        break;
      case 'no2':
        value = Math.random() * 60 + 5;
        unit = 'µg/m³';
        break;
      case 'so2':
        value = Math.random() * 40 + 2;
        unit = 'µg/m³';
        break;
      case 'co':
        value = Math.random() * 2 + 0.1;
        unit = 'mg/m³';
        break;
      default:
        value = Math.random() * 50;
        unit = 'µg/m³';
    }

    const timestamp = new Date(now.getTime() - i * 3600000); // Each measurement 1 hour apart

    measurements.push({
      locationId: locationIndex + 1,
      location: locations[locationIndex],
      city: cities[locationIndex],
      country: countries[locationIndex],
      parameter,
      value: parseFloat(value.toFixed(2)),
      unit,
      timestamp: timestamp.toISOString(),
      coordinates: {
        latitude: 10 + Math.random() * 15,
        longitude: 100 + Math.random() * 10,
      },
    });
  }

  return measurements;
}

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
    const parameter = searchParams.get('parameter');
    const locationId = searchParams.get('location_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Generate sample data
    let measurements = generateMeasurements(limit * 2);

    // Filter measurements
    if (city) {
      measurements = measurements.filter(
        m => m.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (country) {
      measurements = measurements.filter(
        m => m.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (parameter) {
      measurements = measurements.filter(
        m => m.parameter === parameter.toLowerCase()
      );
    }

    if (locationId) {
      measurements = measurements.filter(
        m => m.locationId === parseInt(locationId)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      measurements = measurements.filter(
        m => new Date(m.timestamp) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      measurements = measurements.filter(
        m => new Date(m.timestamp) <= toDate
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeasurements = measurements.slice(startIndex, endIndex);

    // Return response
    return NextResponse.json({
      meta: {
        name: 'openaq-api',
        license: 'CC BY 4.0',
        website: 'https://urbanreflex.org',
        page,
        limit,
        found: measurements.length,
      },
      results: paginatedMeasurements,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to submit new measurement
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
    if (!body.locationId || !body.parameter || body.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: locationId, parameter, value' },
        { status: 400 }
      );
    }

    // In production, save to database
    const newMeasurement = {
      id: Date.now(),
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Measurement created successfully',
      measurement: newMeasurement,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

