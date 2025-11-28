/**
 * Data Helper Functions
 * Utilities for processing NGSI-LD data
 * 
 * Author: Backend Integration Team
 * Date: 2025-11-27
 */

import { parseDateTime, getValue } from './format';

/**
 * Get latest entity from array based on dateObserved
 */
export function getLatestEntity<T extends { dateObserved?: any }>(entities: T[]): T | null {
  if (!entities || entities.length === 0) return null;
  
  return entities.reduce((latest, current) => {
    const currentDate = parseDateTime(current.dateObserved);
    const latestDate = parseDateTime(latest.dateObserved);
    return currentDate > latestDate ? current : latest;
  });
}

/**
 * Group AQI entities by station and get latest for each
 */
export function getLatestPerStation(aqiEntities: any[]) {
  const grouped: Record<string, any> = {};
  
  aqiEntities.forEach(entity => {
    const stationId = entity.stationId || entity.name || entity.id;
    const currentDate = parseDateTime(entity.dateObserved);
    const existing = grouped[stationId];
    
    if (!existing || currentDate > parseDateTime(existing.dateObserved)) {
      grouped[stationId] = entity;
    }
  });
  
  return Object.values(grouped).sort((a, b) => {
    const dateA = parseDateTime(a.dateObserved);
    const dateB = parseDateTime(b.dateObserved);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Calculate dew point from temperature and humidity
 */
export function calculateDewPoint(tempC: number | any, humidity: number | any): number | null {
  const temp = typeof tempC === 'object' ? getValue(tempC) : tempC;
  const hum = typeof humidity === 'object' ? getValue(humidity) : humidity;
  
  if (!temp || !hum) return null;
  
  // Convert humidity to 0-1 range if needed
  const h = hum > 1 ? hum / 100 : hum;
  
  // Magnus formula approximation
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(h);
  const dewPoint = (b * alpha) / (a - alpha);
  
  return Math.round(dewPoint * 10) / 10;
}

/**
 * Get center point of a LineString
 */
export function getCenterPoint(coordinates: number[][]): [number, number] {
  if (!coordinates || coordinates.length === 0) {
    return [0, 0];
  }
  
  const midIndex = Math.floor(coordinates.length / 2);
  return coordinates[midIndex] as [number, number];
}

/**
 * Filter streetlights by road segment ID
 */
export function filterStreetlightsByRoad(streetlights: any[], roadId: string) {
  return streetlights.filter(sl => 
    sl.refRoadSegment === roadId || 
    getValue(sl.refRoadSegment) === roadId
  );
}

/**
 * Count streetlight states
 */
export function countStreetlightStates(streetlights: any[]) {
  const on = streetlights.filter(sl => 
    getValue(sl.powerState) === 'on' || sl.powerState === 'on'
  ).length;
  
  return {
    total: streetlights.length,
    on,
    off: streetlights.length - on,
  };
}

/**
 * Format weather data for display
 */
export function formatWeatherData(weather: any) {
  if (!weather) return null;
  
  return {
    temperature: getValue(weather.temperature),
    feelsLike: getValue(weather.feelsLikeTemperature),
    humidity: getValue(weather.relativeHumidity),
    pressure: getValue(weather.atmosphericPressure),
    windSpeed: getValue(weather.windSpeed),
    windDirection: getValue(weather.windDirection),
    visibility: getValue(weather.visibility),
    precipitation: getValue(weather.precipitation),
    dewPoint: calculateDewPoint(
      getValue(weather.temperature),
      getValue(weather.relativeHumidity)
    ),
    condition: weather.weatherDescription || weather.weatherType,
    dateObserved: parseDateTime(weather.dateObserved),
  };
}

/**
 * Format AQI data for display
 */
export function formatAQIData(aqi: any) {
  if (!aqi) return null;
  
  return {
    aqi: getValue(aqi.aqi),
    pm25: getValue(aqi.pm25),
    pm10: getValue(aqi.pm10),
    no2: getValue(aqi.no2),
    o3: getValue(aqi.o3),
    so2: getValue(aqi.so2),
    co: getValue(aqi.co),
    qualityLevel: getValue(aqi.airQualityLevel),
    measurementQuality: getValue(aqi.measurementQuality),
    stationId: aqi.stationId || aqi.name,
    dateObserved: parseDateTime(aqi.dateObserved),
  };
}

/**
 * Format citizen report data
 */
export function formatReportData(report: any) {
  if (!report) return null;
  
  return {
    id: report.id,
    title: getValue(report.title),
    description: getValue(report.description),
    category: getValue(report.category),
    status: getValue(report.status),
    priority: getValue(report.priority),
    reporterName: getValue(report.reporterName),
    reporterContact: getValue(report.reporterContact),
    dateCreated: parseDateTime(report.dateCreated),
    location: report.location,
  };
}

