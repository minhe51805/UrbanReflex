/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 15-11-2025
 * Update at: 01-12-2025
 * Description: Compact location card for displaying realtime air quality data on the homepage hero section
 * Redesigned to match McMillan Reservoir card style
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getParameterDisplayName } from '@/lib/utils/format';

interface Measurement {
  parameter: string;
  value: number;
  unit: string;
}

interface CompactLocationCardProps {
  name: string;
  city: string;
  country: string;
  type?: string;
  measurements: Measurement[];
  provider: string;
  lastUpdated: string;
  since: string;
  measurementQuality?: 'measured' | 'synthetic';
  roadId?: string;
  coordinates?: [number, number]; // [lng, lat]
  streetlights?: {
    total: number;
    on: number;
    off: number;
  };
  reports?: number;
  pois?: number;
}

export default function CompactLocationCard({
  name,
  city,
  country,
  type,
  measurements,
  provider,
  lastUpdated,
  since,
  measurementQuality = 'measured',
  roadId,
  coordinates,
  streetlights,
  reports,
  pois,
}: CompactLocationCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowFullDetails = () => {
    // Navigate to explore page with query params
    const params = new URLSearchParams();
    if (roadId) {
      params.set('roadId', roadId);
    } else if (coordinates) {
      params.set('lng', coordinates[0].toString());
      params.set('lat', coordinates[1].toString());
    }

    router.push(`/explore?${params.toString()}`);
  };

  // Sort measurements by priority - Weather first, then AQI
  const parameterOrder = [
    'temperature', 'humidity', 'wind', 'weather', // Basic weather (always shown)
    'pressure', 'windDirection', 'visibility', 'feelsLike', 'precipitation', 'cloudCover', // Extended weather
    'aqi', 'pm25', 'pm10', 'bc', 'o3', 'no2', 'so2', 'co' // AQI
  ];
  const sortedMeasurements = [...measurements].sort((a, b) => {
    const aIndex = parameterOrder.indexOf(a.parameter.toLowerCase());
    const bIndex = parameterOrder.indexOf(b.parameter.toLowerCase());
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Get AQI pollutants for "Measures" section
  const aqiPollutants = sortedMeasurements
    .filter(m => ['pm25', 'pm10', 'so2', 'o3', 'co', 'bc', 'no2'].includes(m.parameter.toLowerCase()))
    .map(m => {
      const displayName = getParameterDisplayName(m.parameter);
      const unit = m.unit || '';
      return `${displayName}${unit ? ` (${unit})` : ''}`;
    });

  // Get latest readings (first few measurements)
  const latestReadings = sortedMeasurements.slice(0, isExpanded ? sortedMeasurements.length : 5);

  // Get local time for "Latest readings" section
  const localTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 w-full max-w-md"
    >
      {/* Header - Blue banner */}
      <div className="bg-blue-600 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">{name}</h2>
      </div>

      {/* Location below header */}
      <div className="px-4 py-2 bg-white border-b border-gray-200">
        <p className="text-sm text-gray-900">{city}, {country}</p>
      </div>

      {/* Body - White background with sections */}
      <div className="bg-white">
        {/* Type Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Type:</span> {type || 'Road'}
          </p>
        </div>

        {/* Measures Section */}
        {aqiPollutants.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Measures:</span>
            </p>
            <p className="text-sm text-gray-600">
              {aqiPollutants.join(', ')}
            </p>
          </div>
        )}

        {/* Provider Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Provider:</span> {provider}
          </p>
        </div>

        {/* Reporting Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Reporting:</span> {lastUpdated}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Since {since}</p>
        </div>

        {/* Latest Readings Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Latest readings {localTime} (local time)
          </p>
          <div className="space-y-2">
            {latestReadings.map((measurement, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {getParameterDisplayName(measurement.parameter)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {measurement.value} {measurement.unit}
                  </span>
                  {/* Small trend indicator (simple line) */}
                  <div className="w-8 h-4 flex items-end justify-center">
                    <svg width="24" height="12" viewBox="0 0 24 12" className="text-purple-400">
                      <path
                        d="M0,10 Q6,6 12,7 T24,5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Data Section (when expanded) */}
        {isExpanded && (streetlights || reports || pois) && (
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Additional Data</p>
            <div className="space-y-2">
              {streetlights && streetlights.total > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Streetlights</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {streetlights.total} ({streetlights.on} ON / {streetlights.off} OFF)
                  </span>
                </div>
              )}
              {reports !== undefined && reports > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Citizen Reports</span>
                  <span className="text-sm text-gray-900 font-medium">{reports}</span>
                </div>
              )}
              {pois !== undefined && pois > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Points of Interest</span>
                  <span className="text-sm text-gray-900 font-medium">{pois}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 py-4 space-y-2">
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Thu gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>
                  {sortedMeasurements.length > 5
                    ? `Xem thêm ${sortedMeasurements.length - 5} readings`
                    : 'Xem tất cả readings'}
                </span>
              </>
            )}
          </button>

          {/* Show Full Details Button */}
          <button
            onClick={handleShowFullDetails}
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Show Full Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
