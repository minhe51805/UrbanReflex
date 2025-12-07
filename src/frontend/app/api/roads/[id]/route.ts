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

const ORION_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context configurations EXACTLY matching verify_full_data_for_road.py
const CORE = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const SOSA = '<https://www.w3.org/ns/sosa/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const TRANSPORT = '<https://smart-data-models.github.io/dataModel.Transportation/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const WEATHER_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const AQI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const STREETLIGHT_CTX = '<https://smart-data-models.github.io/dataModel.Streetlighting/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';
const POI_CTX = '<https://raw.githubusercontent.com/smart-data-models/dataModel.PointOfInterest/master/context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

// EXACTLY like Python script: CONTEXTS = { "road": ", ".join([CORE, SOSA, TRANSPORT]), ... }
const CONTEXTS = {
  road: [CORE, SOSA, TRANSPORT].join(', '),
  weather: [CORE, SOSA, WEATHER_CTX].join(', '),
  aqi: [CORE, SOSA, AQI_CTX].join(', '),
  streetlight: STREETLIGHT_CTX,
  report: CORE,
  poi: [CORE, POI_CTX].join(', '),
};

// Helper functions
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

function getCenterPoint(coordinates: number[][]): [number, number] {
  if (!coordinates || coordinates.length === 0) return [0, 0];
  const midIndex = Math.floor(coordinates.length / 2);
  return coordinates[midIndex] as [number, number];
}

async function fetchWithContext(url: string, context: string) {
  const response = await fetch(url, {
    headers: { 'Link': context },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roadId } = await params;

  try {
    // 1. Fetch road segment
    const road = await fetchWithContext(
      `${ORION_URL}/entities/${encodeURIComponent(roadId)}?options=keyValues`,
      CONTEXTS.road
    );

    if (!road || !road.location) {
      return NextResponse.json(
        { error: 'Road segment not found or invalid' },
        { status: 404 }
      );
    }

    // 2. Calculate center point
    const coords = road.location.coordinates || [];
    const centerPoint = getCenterPoint(coords);

    // 3. Fetch weather (latest) - same logic as Python script
    const weatherData = await fetchWithContext(
      `${ORION_URL}/entities?type=WeatherObserved&options=keyValues&limit=200`,
      CONTEXTS.weather
    );

    const weather = Array.isArray(weatherData) && weatherData.length > 0
      ? weatherData.reduce((latest, current) => {
        const currentDate = parseDateTime(current.dateObserved);
        const latestDate = parseDateTime(latest.dateObserved);
        return currentDate > latestDate ? current : latest;
      })
      : null;

    // 4. Fetch AQI near road - same logic as Python script
    const aqiData = await fetchWithContext(
      `${ORION_URL}/entities?type=AirQualityObserved&georel=near;maxDistance==5000&geometry=Point&coordinates=${JSON.stringify(centerPoint)}&options=keyValues&limit=50`,
      CONTEXTS.aqi
    ).catch(() => []);

    // Get latest per station - EXACT same logic as Python script's latest_per_station function
    const aqiGrouped: Record<string, any> = {};
    (aqiData || []).forEach((entity: any) => {
      // EXACTLY like Python: station = e.get("stationId") or e.get("name")
      const stationId = entity.stationId || entity.name;
      if (!stationId) return; // Skip if no station identifier

      const currentDate = parseDateTime(entity.dateObserved);
      const existing = aqiGrouped[stationId];

      // EXACTLY like Python: if not prev or current_dt > parse_dt(prev.get("dateObserved"))
      if (!existing || currentDate > parseDateTime(existing.dateObserved)) {
        aqiGrouped[stationId] = entity;
      }
    });

    // Sort by dateObserved descending (like Python script)
    const aqiStations = Object.values(aqiGrouped).sort((a: any, b: any) => {
      const dateA = parseDateTime(a.dateObserved);
      const dateB = parseDateTime(b.dateObserved);
      return dateB.getTime() - dateA.getTime();
    });

    // 5. Fetch all streetlights with pagination (like Python script)
    const allStreetlights: any[] = [];
    let streetlightOffset = 0;
    const streetlightChunkLimit = 400;
    while (true) {
      try {
        const streetlightBatch = await fetchWithContext(
          `${ORION_URL}/entities?type=Streetlight&options=keyValues&limit=${streetlightChunkLimit}&offset=${streetlightOffset}`,
          CONTEXTS.streetlight
        );
        if (!Array.isArray(streetlightBatch) || streetlightBatch.length === 0) break;
        allStreetlights.push(...streetlightBatch);
        if (streetlightBatch.length < streetlightChunkLimit) break;
        streetlightOffset += streetlightChunkLimit;
      } catch (error) {
        console.error('Error fetching streetlights:', error);
        break;
      }
    }

    // Filter by refRoadSegment (like Python script)
    const streetlights = allStreetlights.filter(
      (sl: any) => getValue(sl.refRoadSegment) === roadId
    );

    const onCount = streetlights.filter(
      (sl: any) => getValue(sl.powerState) === 'on'
    ).length;

    // 6. Fetch all reports (CitizenReport + RoadReport) with pagination and filter by refRoadSegment (like Python script)
    const allReports: any[] = [];

    // Helper to paginate a given report type
    const fetchReportsByType = async (entityType: string) => {
      let offset = 0;
      const chunkLimit = 200;
      while (true) {
        try {
          const batch = await fetchWithContext(
            `${ORION_URL}/entities?type=${encodeURIComponent(entityType)}&options=keyValues&limit=${chunkLimit}&offset=${offset}`,
            CONTEXTS.report
          );
          if (!Array.isArray(batch) || batch.length === 0) break;
          allReports.push(...batch);
          if (batch.length < chunkLimit) break;
          offset += chunkLimit;
        } catch (error) {
          console.error(`Error fetching reports for type ${entityType}:`, error);
          break;
        }
      }
    };

    // CitizenReport (cũ) + RoadReport (do người dùng tạo bằng nút Báo cáo)
    await fetchReportsByType('CitizenReport');
    await fetchReportsByType('RoadReport');

    // Filter by refRoadSegment (NOT spatial query) - cả CitizenReport và RoadReport đều có refRoadSegment
    const reports = allReports.filter(
      (rep: any) => getValue(rep.refRoadSegment) === roadId
    );

    // 7. Fetch POIs near road (spatial query - like Python script)
    const pois = await fetchWithContext(
      `${ORION_URL}/entities?type=PointOfInterest&georel=near;maxDistance==1000&geometry=Point&coordinates=${JSON.stringify(centerPoint)}&options=keyValues&limit=20`,
      CONTEXTS.poi
    ).catch(() => []);

    // 8. Return comprehensive data
    return NextResponse.json({
      road: {
        id: road.id,
        name: road.name,
        location: road.location,
        roadClass: road.roadClass,
        roadType: road.roadType,
        length: road.length,
        laneCount: road.laneCount,
        surface: road.surface,
        oneway: road.oneway,
        maximumAllowedSpeed: road.maximumAllowedSpeed,
        source: road.source,
        dataProvider: road.dataProvider,
        dateCreated: road.dateCreated,
      },
      weather: weather ? {
        id: weather.id,
        dateObserved: weather.dateObserved,
        temperature: getValue(weather.temperature),
        feelsLikeTemperature: getValue(weather.feelsLikeTemperature), // Keep original name like Python
        relativeHumidity: getValue(weather.relativeHumidity), // Keep original name like Python
        atmosphericPressure: getValue(weather.atmosphericPressure), // Keep original name like Python
        windSpeed: getValue(weather.windSpeed),
        windDirection: getValue(weather.windDirection),
        visibility: getValue(weather.visibility),
        precipitation: getValue(weather.precipitation),
        cloudCover: getValue(weather.cloudCover),
        weatherDescription: weather.weatherDescription,
        weatherType: weather.weatherType,
        source: weather.source,
        location: weather.location,
        // Also provide aliases for backward compatibility
        feelsLike: getValue(weather.feelsLikeTemperature),
        humidity: getValue(weather.relativeHumidity),
        pressure: getValue(weather.atmosphericPressure),
      } : null,
      aqi: aqiStations.map((station: any) => ({
        id: station.id,
        stationId: station.stationId || station.name,
        name: station.name,
        dateObserved: station.dateObserved,
        aqi: getValue(station.aqi),
        airQualityLevel: station.airQualityLevel,
        pm25: getValue(station.pm25),
        pm10: getValue(station.pm10),
        no2: getValue(station.no2),
        o3: getValue(station.o3),
        so2: getValue(station.so2),
        co: getValue(station.co),
        measurementQuality: station.measurementQuality,
      })),
      streetlights: {
        total: streetlights.length,
        on: onCount,
        off: streetlights.length - onCount,
        list: streetlights.map((sl: any) => ({
          id: sl.id,
          powerState: getValue(sl.powerState),
          status: sl.status,
          lampType: sl.lampType,
          powerRating: getValue(sl.powerRating),
          lanternHeight: getValue(sl.lanternHeight),
          location: sl.location,
          refRoadSegment: sl.refRoadSegment,
        })),
      },
      reports: (reports || []).map((report: any) => ({
        id: report.id,
        location: report.location,
        category: report.category,
        title: report.title,
        description: report.description,
        status: report.status,
        priority: report.priority,
        dateCreated: report.dateCreated,
        refRoadSegment: report.refRoadSegment,
        reporterName: report.reporterName,
        reporterContact: report.reporterContact,
      })),
      pois: (pois || []).map((poi: any) => ({
        id: poi.id,
        name: poi.name,
        location: poi.location,
        category: poi.category,
        description: poi.description,
        address: poi.address,
      })),
    });

  } catch (error) {
    console.error('Error fetching road data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

