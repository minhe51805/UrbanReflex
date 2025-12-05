/**
 * Weather API
 * Fetches latest city-wide weather data
 * 
 * Author: Backend Integration Team
 * Date: 2025-11-27
 * 
 * Endpoint: GET /api/weather
 * Returns: Latest weather observation for the city
 */

import { NextRequest, NextResponse } from 'next/server';

const ORION_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

// Full context for WeatherObserved (core + sosa + weather)
const WEATHER_CONTEXT = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json", <https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

function parseDateTime(value: any): Date {
  if (!value) return new Date(0);
  if (typeof value === 'object' && value['@value']) {
    return new Date(value['@value']);
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  return new Date(0);
}

function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

function calculateDewPoint(tempC: number, humidity: number): number | null {
  if (!tempC || !humidity) return null;
  
  // Convert humidity to 0-1 range if needed
  const h = humidity > 1 ? humidity / 100 : humidity;
  
  // Magnus formula
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(h);
  const dewPoint = (b * alpha) / (a - alpha);
  
  return Math.round(dewPoint * 10) / 10;
}

export async function GET(request: NextRequest) {
  try {
    const url = `${ORION_URL}/entities?type=WeatherObserved&options=keyValues&limit=200`;
    
    const response = await fetch(url, {
      headers: {
        'Link': WEATHER_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No weather data available' },
        { status: 404 }
      );
    }

    // Get latest by dateObserved
    const latest = data.reduce((latest, current) => {
      const currentDate = parseDateTime(current.dateObserved);
      const latestDate = parseDateTime(latest.dateObserved);
      return currentDate > latestDate ? current : latest;
    });

    const temp = getValue(latest.temperature);
    const humidity = getValue(latest.relativeHumidity);

    return NextResponse.json({
      id: latest.id,
      dateObserved: latest.dateObserved,
      temperature: temp,
      feelsLikeTemperature: getValue(latest.feelsLikeTemperature),
      relativeHumidity: humidity,
      atmosphericPressure: getValue(latest.atmosphericPressure),
      windSpeed: getValue(latest.windSpeed),
      windDirection: getValue(latest.windDirection),
      visibility: getValue(latest.visibility),
      precipitation: getValue(latest.precipitation),
      dewPoint: calculateDewPoint(temp, humidity),
      weatherDescription: latest.weatherDescription,
      weatherType: latest.weatherType,
      source: latest.source,
    });

  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      {
        type: 'error',
        title: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

