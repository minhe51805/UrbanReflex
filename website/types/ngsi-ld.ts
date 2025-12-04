/**
 * TypeScript types for NGSI-LD entities
 */

// Base NGSI-LD types
export interface GeoProperty {
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface Property<T = any> {
  type: 'Property';
  value: T;
}

export interface Relationship {
  type: 'Relationship';
  object: string; // Entity ID
}

// AirQualityObserved entity (with keyValues option)
export interface AirQualityObserved {
  id: string;
  type: 'AirQualityObserved';
  location: GeoProperty;
  dateObserved: string; // ISO 8601
  
  // Air quality parameters
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
  
  // Metadata
  measurementQuality: 'measured' | 'synthetic';
  source?: string;
  stationName?: string;
  address?: string;
  
  // AQI
  airQualityIndex?: number;
  airQualityLevel?: string;
  
  // Timestamps
  dateCreated?: string;
  dateModified?: string;
}

// WeatherObserved entity
export interface WeatherObserved {
  id: string;
  type: 'WeatherObserved';
  location: GeoProperty;
  dateObserved: string;
  
  // Weather parameters
  temperature?: number;
  relativeHumidity?: number;
  atmosphericPressure?: number;
  windSpeed?: number;
  windDirection?: number;
  precipitation?: number;
  weatherCondition?: string;
  
  // Forecast (if available)
  weatherForecast?: Array<{
    date: string;
    temperature: { min: number; max: number };
    condition: string;
    precipitation?: number;
  }>;
  
  // Metadata
  source?: string;
  stationName?: string;
  
  dateCreated?: string;
  dateModified?: string;
}

// RoadSegment entity
export interface RoadSegment {
  id: string;
  type: 'RoadSegment';
  location: GeoProperty; // LineString
  
  name?: string;
  category?: string;
  refRoad?: string;
  totalLaneNumber?: number;
  width?: number;
  laneUsage?: string[];
  
  // Traffic data
  averageVehicleSpeed?: number;
  averageVehicleLength?: number;
  congested?: boolean;
  
  dateCreated?: string;
  dateModified?: string;
}

// Streetlight entity
export interface Streetlight {
  id: string;
  type: 'Streetlight';
  location: GeoProperty; // Point
  
  // Status
  powerState?: 'on' | 'off';
  status?: 'ok' | 'defectiveLamp' | 'columnIssue';
  
  // Specifications
  lanternHeight?: number;
  illuminanceLevel?: number;
  powerConsumption?: number;
  
  // References
  refRoadSegment?: string;
  refStreetlightGroup?: string;
  
  // Control
  dateLastSwitchingOn?: string;
  dateLastSwitchingOff?: string;
  
  dateCreated?: string;
  dateModified?: string;
}

// PointOfInterest entity
export interface PointOfInterest {
  id: string;
  type: 'PointOfInterest';
  location: GeoProperty; // Point
  
  name: string;
  category: string[]; // ['school', 'hospital', 'parking', etc.]
  description?: string;
  address?: string;
  
  // Contact
  contactPoint?: {
    telephone?: string;
    email?: string;
    url?: string;
  };
  
  // Opening hours
  openingHours?: string;
  
  dateCreated?: string;
  dateModified?: string;
}

// CitizenReport entity
export interface CitizenReport {
  id: string;
  type: 'CitizenReport';
  '@context': string[];
  location: GeoProperty; // Point
  
  // Report details
  category: 'streetlight_broken' | 'traffic_issue' | 'waste_dump' | 'road_damage' | 'other';
  status: 'submitted' | 'in_progress' | 'resolved';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  
  // Reporter info (optional)
  reporterName?: string;
  reporterContact?: string;
  
  // References
  refStreetlight?: string;
  refRoadSegment?: string;
  
  // Attachments
  attachments?: string[]; // URLs to images/videos
  
  // Timestamps
  dateCreated: string;
  dateModified?: string;
  dateResolved?: string;
}

