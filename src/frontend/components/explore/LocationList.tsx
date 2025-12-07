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

