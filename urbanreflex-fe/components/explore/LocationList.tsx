/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Location list component displaying air quality monitoring locations with AQI indicators and navigation links
 */

'use client';

import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import type { Location } from '@/types/orion';
import { getParameterDisplayName, formatRelativeTime } from '@/lib/utils/format';

interface LocationListProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

export default function LocationList({ locations, onLocationClick }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No locations found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Listing {locations.length} of {locations.length} providers
      </div>

      {locations.map((location) => (
        <div
          key={location.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onLocationClick?.(location)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {location.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {location.locality && `${location.locality}, `}
                    {typeof location.country === 'string' ? location.country : location.country?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${location.isMonitor
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                  {location.isMonitor ? 'Monitor' : 'Air Sensor'}
                </span>
              </div>
            </div>

            {/* Measurements */}
            {location.sensors && location.sensors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Measures</p>
                <div className="flex flex-wrap gap-2">
                  {location.sensors.slice(0, 6).map((sensor) => (
                    <span
                      key={sensor.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {getParameterDisplayName(sensor.parameter.name)}
                    </span>
                  ))}
                  {location.sensors.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{location.sensors.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Provider and Last Update */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {location.provider && (
                <div>
                  <p className="text-gray-600 mb-1">Source</p>
                  <p className="font-semibold text-gray-900">{location.provider.name}</p>
                </div>
              )}
              {location.lastUpdated && (
                <div>
                  <p className="text-gray-600 mb-1">Reporting</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="font-semibold text-gray-900">
                      {formatRelativeTime(location.lastUpdated)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Latest Readings */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Latest Readings (last 24 hours)</p>
              <Link
                href={`/locations/${location.id}`}
                className="text-[#1e64ab] font-semibold hover:text-[#33a3a1] transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Show Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

