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
      className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#64BABE]/30 w-full max-w-md hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Header - UrbanReflex Teal banner */}
      <div className="bg-gradient-to-r from-[#008EA0] to-[#64BABE] px-4 py-3">
        <h2 className="text-lg font-semibold text-white">{name}</h2>
      </div>

      {/* Location below header */}
      <div className="px-4 py-2 bg-white border-b border-[#64BABE]/30">
        <p className="text-sm text-gray-900 font-medium">{city}, {country}</p>
        {type && (
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="font-medium">Type:</span> {type}
          </p>
        )}
      </div>

      {/* Body - White background with sections */}
      <div className="bg-white">
        {/* Measures Section */}
        {aqiPollutants.length > 0 && (
          <div className="px-4 py-3 border-b border-[#64BABE]/30 bg-gradient-to-br from-[#64BABE]/5 to-white">
            <p className="text-sm text-gray-800 mb-1">
              <span className="font-bold text-[#008EA0]">Measures:</span>
            </p>
            <p className="text-sm text-gray-700">
              {aqiPollutants.join(', ')}
            </p>
          </div>
        )}

        {/* Provider Section */}
        <div className="px-4 py-3 border-b border-[#64BABE]/30">
          <p className="text-sm text-gray-800">
            <span className="font-bold text-[#008EA0]">Provider:</span> <span className="text-gray-700">{provider}</span>
          </p>
        </div>

        {/* Reporting Section */}
        <div className="px-4 py-3 border-b border-[#64BABE]/30 bg-gradient-to-br from-white to-[#64BABE]/5">
          <p className="text-sm text-gray-800">
            <span className="font-bold text-[#008EA0]">Reporting:</span> <span className="text-gray-700">{lastUpdated}</span>
          </p>
          <p className="text-xs text-[#008EA0] mt-0.5 font-medium">Since {since}</p>
        </div>

        {/* Latest Readings Section */}
        <div className="px-4 py-3 border-b border-[#64BABE]/30">
          <p className="text-sm font-bold text-[#008EA0] mb-3 flex items-center gap-2">
            <span>Latest readings {localTime} (local time)</span>
          </p>
          <div className="space-y-2.5">
            {latestReadings.map((measurement, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-white to-[#64BABE]/5 border border-[#64BABE]/20 hover:border-[#008EA0]/40 transition-colors">
                <span className="text-sm font-semibold text-gray-800">
                  {getParameterDisplayName(measurement.parameter)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#008EA0]">
                    {measurement.value} {measurement.unit}
                  </span>
                  {/* Small trend indicator - UrbanReflex style */}
                  <div className="w-8 h-4 flex items-end justify-center">
                    <svg width="24" height="12" viewBox="0 0 24 12" className="text-[#64BABE]">
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
          <div className="px-4 py-3 border-b border-[#64BABE]/30 bg-gradient-to-br from-[#64BABE]/5 to-white">
            <p className="text-sm font-bold text-[#008EA0] mb-2">Additional Data</p>
            <div className="space-y-2">
              {streetlights && streetlights.total > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#64BABE]/20">
                  <span className="text-sm text-gray-700 font-medium">Streetlights</span>
                  <span className="text-sm text-[#008EA0] font-bold">
                    {streetlights.total} ({streetlights.on} ON / {streetlights.off} OFF)
                  </span>
                </div>
              )}
              {reports !== undefined && reports > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#64BABE]/20">
                  <span className="text-sm text-gray-700 font-medium">Citizen Reports</span>
                  <span className="text-sm text-[#008EA0] font-bold">{reports}</span>
                </div>
              )}
              {pois !== undefined && pois > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#64BABE]/20">
                  <span className="text-sm text-gray-700 font-medium">Points of Interest</span>
                  <span className="text-sm text-[#008EA0] font-bold">{pois}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 py-4 space-y-2 bg-gradient-to-br from-white to-[#64BABE]/5">
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 bg-white border-2 border-[#64BABE] text-[#008EA0] font-semibold rounded-lg hover:bg-[#64BABE]/10 hover:border-[#008EA0] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#008EA0] to-[#64BABE] text-white font-bold rounded-lg hover:from-[#085979] hover:to-[#008EA0] transition-all duration-200 shadow-md hover:shadow-lg border-2 border-[#085979]"
          >
            Show Full Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
