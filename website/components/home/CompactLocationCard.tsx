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

  // Format city and country to short codes
  const formatCityCountry = (city: string, country: string): string => {
    const cityMap: { [key: string]: string } = {
      'Ho Chi Minh City': 'HCM',
      'Hanoi': 'HN',
      'Da Nang': 'DN',
    };
    const countryMap: { [key: string]: string } = {
      'Vietnam': 'VN',
      'Viet Nam': 'VN',
    };
    
    const cityCode = cityMap[city] || city.substring(0, 3).toUpperCase();
    const countryCode = countryMap[country] || country.substring(0, 2).toUpperCase();
    
    return `${cityCode}, ${countryCode}`;
  };

  // Format datetime from lastUpdated and since
  const formatDateTime = (lastUpdated: string, since: string): string => {
    // Extract time from lastUpdated (e.g., "22:15" or "Updated 22:15")
    const timeMatch = lastUpdated.match(/(\d{1,2}):(\d{2})/);
    const time = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : lastUpdated.replace(/Updated\s*/i, '').trim();
    
    // Extract date from since (e.g., "12/6/2025" or "Since 12/6/2025")
    const dateMatch = since.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const date = dateMatch ? dateMatch[1] : since.replace(/Since\s*/i, '').trim();
    
    return `${time} ${date}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#64BABE]/30 w-full max-w-md hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Header - UrbanReflex Teal banner */}
      <div className="bg-gradient-to-r from-[#008EA0] to-[#64BABE] px-4 py-3">
        <div className="text-white">
          <p className="text-xl font-semibold mb-1">{formatCityCountry(city, country)}</p>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm font-medium mt-1">{formatDateTime(lastUpdated, since)}</p>
        </div>
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

        {/* Latest Readings Section */}
        <div className="px-4 py-3 border-b border-[#64BABE]/30">
          <p className="text-xs font-semibold text-[#008EA0] mb-2.5">
            Latest readings {localTime} (local time)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {latestReadings.map((measurement, index) => (
              <div key={index} className="p-2 rounded-lg bg-gradient-to-br from-[#64BABE]/5 to-white border border-[#64BABE]/20 hover:border-[#008EA0]/40 transition-all hover:shadow-sm">
                <div className="text-[10px] font-medium text-gray-600 mb-0.5 uppercase tracking-wide">
                  {getParameterDisplayName(measurement.parameter)}
                </div>
                <div className="text-sm font-bold text-[#008EA0]">
                  {measurement.value} <span className="text-xs font-semibold text-gray-600">{measurement.unit}</span>
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
