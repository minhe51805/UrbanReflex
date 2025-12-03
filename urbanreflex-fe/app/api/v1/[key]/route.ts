/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 12-02-2025
 * Update at: 03-12-2025
 * Description: API endpoint to fetch NGSI-LD data using API key from URL
 */

import { NextRequest, NextResponse } from 'next/server';

const NGSI_LD_BASE_URL = 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context configurations matching Python script
const CORE = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const SOSA = '<https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const TRANSPORT = '<https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const WEATHER_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const AQI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const STREETLIGHT_CTX = '<https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const POI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

// Context mappings matching Python script CONTEXTS dict
const CONTEXTS: Record<string, string> = {
  road: [CORE, SOSA, TRANSPORT].join(', '),
  weather: [CORE, SOSA, WEATHER_CTX].join(', '),
  aqi: [CORE, SOSA, AQI_CTX].join(', '),
  streetlight: STREETLIGHT_CTX,
  report: CORE,
  poi: [CORE, POI_CTX].join(', '),
};

// Map entity types to context keys
const TYPE_TO_CONTEXT: Record<string, string> = {
  RoadSegment: 'road',
  WeatherObserved: 'weather',
  AirQualityObserved: 'aqi',
  Streetlight: 'streetlight',
  CitizenReport: 'report',
  RoadReport: 'report',
  PointOfInterest: 'poi',
};

function buildLinkHeader(type: string): string {
  const contextKey = TYPE_TO_CONTEXT[type] || 'report';
  return CONTEXTS[contextKey] || CONTEXTS.report;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { key: apiKey } = await params;

    // Basic API key format check
    if (!apiKey || !apiKey.startsWith('ur_')) {
      return NextResponse.json(
        {
          error: 'Invalid API key format',
          message: 'API key must start with "ur_"',
        },
        { status: 400 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint') || '/entities';
    const type = searchParams.get('type') || searchParams.get('entity-type') || '';
    const fetchAll = searchParams.get('all') === 'true' || !type; // Fetch all types if no type specified

    // All entity types to fetch when fetchAll is true
    const ALL_ENTITY_TYPES = [
      'RoadSegment',
      'WeatherObserved',
      'AirQualityObserved',
      'Streetlight',
      'CitizenReport',
      'PointOfInterest',
    ];

    // If no type specified, fetch all entity types
    const typesToFetch = fetchAll ? ALL_ENTITY_TYPES : [type];

    // Fetch data for each entity type
    let allData: any[] = [];
    const maxLimit = 1000; // NGSI-LD maximum limit
    const userLimit = searchParams.get('limit');
    const fetchLimit = userLimit ? Math.min(parseInt(userLimit), maxLimit) : maxLimit;

    console.log('📤 Fetching NGSI-LD data:', {
      types: typesToFetch,
      fetchAll,
      apiKey: apiKey.substring(0, 15) + '...',
      limit: fetchLimit,
    });

    // Fetch each entity type
    for (const entityType of typesToFetch) {
      console.log(`📥 Fetching ${entityType}...`);

      // Build query params for this entity type
      const queryParams = new URLSearchParams();
      queryParams.set('type', entityType);
      queryParams.set('limit', fetchLimit.toString());

      // Copy other query params except 'endpoint', 'type', 'options', 'all'
      // IMPORTANT: Do NOT add options=keyValues by default to get full format with URIs
      searchParams.forEach((value, key) => {
        if (key !== 'endpoint' && key !== 'type' && key !== 'options' && key !== 'all' && key !== 'entity-type') {
          queryParams.append(key, value);
        }
      });

      // Only add options if user explicitly requests it
      // By default, return full format (not keyValues) to get all fields with full URIs
      if (searchParams.has('options')) {
        const optionsValue = searchParams.get('options')!;
        queryParams.set('options', optionsValue);
        console.log(`  ⚠️ Using options=${optionsValue} (may return simplified format)`);
      } else {
        console.log(`  ✅ No options specified - will return full format with URIs`);
      }

      // Fetch all pages for this entity type
      let offset = 0;
      let pageCount = 0;
      const maxPages = 1000;
      let hasMore = true;
      let typeData: any[] = [];

      while (hasMore && pageCount < maxPages) {
        const pageParams = new URLSearchParams(queryParams);
        pageParams.set('offset', offset.toString());

        const currentUrl = `${NGSI_LD_BASE_URL}${endpoint}?${pageParams.toString()}`;

        const response = await fetch(currentUrl, {
          headers: {
            'Link': buildLinkHeader(entityType),
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({
            type: 'error',
            title: 'Request Failed',
            detail: `HTTP ${response.status}: ${response.statusText}`,
          }));

          console.error(`❌ NGSI-LD API Error for ${entityType}:`, {
            status: response.status,
            error,
            url: currentUrl,
          });

          // If this is the first page and it fails, log and continue to next type
          if (pageCount === 0) {
            console.warn(`⚠️ Skipping ${entityType} due to error`);
            break;
          }
          // If later page fails, break and continue with what we have
          break;
        }

        const data = await response.json();

        // Handle both array and object responses
        let pageData: any[] = [];
        if (Array.isArray(data)) {
          pageData = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.results)) {
            pageData = data.results;
          } else {
            pageData = [data];
          }
        }

        typeData = typeData.concat(pageData);
        pageCount++;

        console.log(`  📄 ${entityType} - Page ${pageCount}: ${pageData.length} items (total: ${typeData.length})`);

        // Check if there's more data
        if (pageData.length < fetchLimit) {
          hasMore = false;
        } else {
          offset += fetchLimit;
        }
      }

      console.log(`✅ ${entityType}: fetched ${typeData.length} items`);
      allData = allData.concat(typeData);
    }

    console.log('✅ NGSI-LD data fetched successfully:', {
      totalItems: allData.length,
      types: typesToFetch,
    });

    // Return all data directly (not wrapped)
    return NextResponse.json(allData);
  } catch (error) {
    console.error('❌ NGSI-LD API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
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

