/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 12-02-2025
 * Update at: 03-12-2025
 * Description: API endpoint to fetch NGSI-LD data using API key from URL
 * 
 * Features:
 * - timeframe: latest | alltime | custom
 * - startDate/endDate: For custom timeframe
 * - entities: Comma-separated list of entity types to fetch
 * - Static data: RoadSegment (5k), Streetlight (17.5k)
 * - Dynamic data: AirQualityObserved (10), WeatherObserved (1), CitizenReport, RoadReport
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

// Date field mapping for each entity type
const TYPE_TO_DATE_FIELD: Record<string, string> = {
  RoadSegment: 'dateCreated',
  WeatherObserved: 'dateObserved',
  AirQualityObserved: 'dateObserved',
  Streetlight: 'dateCreated',
  CitizenReport: 'dateCreated',
  RoadReport: 'dateCreated',
  PointOfInterest: 'dateCreated',
};

function buildLinkHeader(type: string): string {
  const contextKey = TYPE_TO_CONTEXT[type] || 'report';
  return CONTEXTS[contextKey] || CONTEXTS.report;
}

// Helper to extract date from entity (handles both full format and keyValues)
function extractDate(entity: any, dateField: string): Date | null {
  try {
    const field = entity[dateField];
    if (!field) return null;

    // Handle full NGSI-LD format: { type: 'Property', value: { '@type': 'DateTime', '@value': '...' } }
    if (typeof field === 'object' && field.value) {
      const value = field.value;
      if (value['@value']) {
        return new Date(value['@value']);
      }
      if (typeof value === 'string') {
        return new Date(value);
      }
    }

    // Handle keyValues format: direct value
    if (typeof field === 'string') {
      return new Date(field);
    }

    // Handle object with @value
    if (typeof field === 'object' && field['@value']) {
      return new Date(field['@value']);
    }

    return null;
  } catch {
    return null;
  }
}

// Filter entities by date range
function filterByDateRange(entities: any[], dateField: string, startDate?: Date, endDate?: Date): any[] {
  if (!startDate && !endDate) return entities;

  return entities.filter((entity) => {
    const entityDate = extractDate(entity, dateField);
    if (!entityDate) return false;

    if (startDate && entityDate < startDate) return false;
    if (endDate && entityDate > endDate) return false;

    return true;
  });
}

// Get latest entity for each type (grouped by station/identifier if applicable)
function getLatestEntities(entities: any[], entityType: string, dateField: string): any[] {
  if (entities.length === 0) return [];

  // For WeatherObserved and AirQualityObserved, get latest per station
  if (entityType === 'WeatherObserved' || entityType === 'AirQualityObserved') {
    const grouped: Record<string, any> = {};
    
    entities.forEach((entity) => {
      const identifier = entity.stationId || entity.name || entity.id;
      const entityDate = extractDate(entity, dateField);
      
      if (!entityDate) return;
      
      const existing = grouped[identifier];
      if (!existing) {
        grouped[identifier] = entity;
      } else {
        const existingDate = extractDate(existing, dateField);
        if (existingDate && entityDate > existingDate) {
          grouped[identifier] = entity;
        }
      }
    });
    
    return Object.values(grouped);
  }

  // For other types, just get the single latest entity
  const sorted = entities
    .map((entity) => ({
      entity,
      date: extractDate(entity, dateField),
    }))
    .filter((item) => item.date !== null)
    .sort((a, b) => b.date!.getTime() - a.date!.getTime());

  return sorted.length > 0 ? [sorted[0].entity] : [];
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
    
    // New features: timeframe and entity selection
    const timeframe = searchParams.get('timeframe') || 'alltime'; // latest | alltime | custom
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const entitiesParam = searchParams.get('entities') || searchParams.get('types'); // Comma-separated list
    
    // Parse date range for custom timeframe
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (timeframe === 'custom' || startDateStr || endDateStr) {
      if (startDateStr) {
        startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid startDate format. Use ISO 8601 format (e.g., 2025-01-01T00:00:00Z)' },
            { status: 400 }
          );
        }
      }
      if (endDateStr) {
        endDate = new Date(endDateStr);
        if (isNaN(endDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid endDate format. Use ISO 8601 format (e.g., 2025-12-31T23:59:59Z)' },
            { status: 400 }
          );
        }
      }
    }

    // All available entity types
    const ALL_ENTITY_TYPES = [
      'RoadSegment',        // Static: ~5k
      'Streetlight',        // Static: ~17.5k
      'WeatherObserved',    // Dynamic: 1 (OWM)
      'AirQualityObserved', // Dynamic: 10 (OpenAQ)
      'CitizenReport',      // Dynamic
      'RoadReport',         // Dynamic
      'PointOfInterest',    // Static
    ];

    // Determine which entity types to fetch
    let typesToFetch: string[] = [];
    
    if (entitiesParam) {
      // User specified specific entities (comma-separated)
      typesToFetch = entitiesParam.split(',').map((t) => t.trim()).filter(Boolean);
      
      // Validate entity types
      const invalidTypes = typesToFetch.filter((t) => !ALL_ENTITY_TYPES.includes(t));
      if (invalidTypes.length > 0) {
        return NextResponse.json(
          {
            error: 'Invalid entity types',
            message: `Invalid types: ${invalidTypes.join(', ')}. Valid types: ${ALL_ENTITY_TYPES.join(', ')}`,
          },
          { status: 400 }
        );
      }
    } else if (type) {
      // Single type specified
      typesToFetch = [type];
    } else {
      // Fetch all types (default behavior)
      typesToFetch = ALL_ENTITY_TYPES;
    }

    // Fetch data for each entity type
    let allData: any[] = [];
    const maxLimit = 1000; // NGSI-LD maximum limit
    const userLimit = searchParams.get('limit');
    const fetchLimit = userLimit ? Math.min(parseInt(userLimit), maxLimit) : maxLimit;

    console.log('📤 Fetching NGSI-LD data:', {
      types: typesToFetch,
      timeframe,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
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

      // Apply timeframe filtering
      const dateField = TYPE_TO_DATE_FIELD[entityType] || 'dateCreated';
      
      let filteredData = typeData;
      
      if (timeframe === 'latest') {
        // Get latest entities only
        filteredData = getLatestEntities(typeData, entityType, dateField);
        console.log(`  🕐 Latest filter: ${typeData.length} → ${filteredData.length} items`);
      } else if (timeframe === 'custom' || startDate || endDate) {
        // Filter by date range
        filteredData = filterByDateRange(typeData, dateField, startDate, endDate);
        console.log(`  📅 Date range filter: ${typeData.length} → ${filteredData.length} items`);
      }
      // else: 'alltime' - no filtering needed

      console.log(`✅ ${entityType}: ${filteredData.length} items (after ${timeframe} filter)`);
      allData = allData.concat(filteredData);
    }

    console.log('✅ NGSI-LD data fetched successfully:', {
      totalItems: allData.length,
      types: typesToFetch,
      timeframe,
    });

    // Check if user wants unwrapped format (backward compatibility)
    const unwrapped = searchParams.get('unwrapped') === 'true' || !searchParams.has('timeframe') && !searchParams.has('entities');
    
    if (unwrapped) {
      // Return unwrapped array for backward compatibility
      return NextResponse.json(allData);
    }

    // Return data with metadata (new format)
    return NextResponse.json({
      success: true,
      data: allData,
      meta: {
        total: allData.length,
        types: typesToFetch,
        timeframe,
        startDate: startDate?.toISOString() || null,
        endDate: endDate?.toISOString() || null,
        timestamp: new Date().toISOString(),
      },
    });
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

