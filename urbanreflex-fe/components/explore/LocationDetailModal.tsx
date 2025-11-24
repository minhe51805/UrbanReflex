/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 16-11-2025
 * Update at: 19-11-2025
 * Description: Modal component displaying detailed location information and latest measurements when clicking on map markers
 */

'use client';

import { useEffect, useState } from 'react';
import { X, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { Location, Measurement } from '@/types/openaq';
import { openaqClient } from '@/lib/api/openaq-client';
import { getParameterDisplayName, formatRelativeTime } from '@/lib/utils/format';
import Link from 'next/link';

interface LocationDetailModalProps {
  location: Location | null;
  onClose: () => void;
}

export default function LocationDetailModal({ location, onClose }: LocationDetailModalProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    // Try to load measurements, but don't fail if API doesn't support it
    const loadMeasurements = async () => {
      try {
        setLoading(true);
        const response = await openaqClient.getLatestMeasurements(location.id);
        if (response && response.results) {
          setMeasurements(response.results.slice(0, 10));
        }
      } catch (error) {
        // Silently fail - we'll show sensor info instead
        console.log('Measurements not available for this location');
        setMeasurements([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [location]);

  if (!location) return null;

  // Get unique parameters from measurements
  const uniqueParams = measurements.reduce((acc, m) => {
    const key = m.parameter.name;
    if (!acc[key] || new Date(m.period.datetimeFrom.utc) > new Date(acc[key].period.datetimeFrom.utc)) {
      acc[key] = m;
    }
    return acc;
  }, {} as Record<string, Measurement>);

  const latestMeasurements = Object.values(uniqueParams);

  // If no measurements, show placeholder data from sensors
  const showPlaceholder = !loading && latestMeasurements.length === 0;

  // Get AQI color based on value (simplified)
  const getAQIColor = (value: number, param: string): string => {
    if (param === 'pm25') {
      if (value <= 12) return 'bg-green-500';
      if (value <= 35.4) return 'bg-yellow-500';
      if (value <= 55.4) return 'bg-orange-500';
      if (value <= 150.4) return 'bg-red-500';
      return 'bg-purple-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{location.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {location.locality && `${location.locality}, `}
                {location.country?.name || 'Unknown'}
              </span>
            </div>
            {location.coordinates && (
              <div className="text-xs text-gray-500 mt-1">
                {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Location Type and Info */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              location.isMonitor
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {location.isMonitor ? 'Reference Monitor' : 'Air Sensor'}
            </span>
            {location.isMobile && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                Mobile
              </span>
            )}
          </div>

          {/* Provider Info */}
          {location.provider && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Source</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{location.provider.name}</p>
              </div>
            </div>
          )}

          {/* Last Update */}
          {location.datetimeLast && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Last Reporting</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatRelativeTime(location.datetimeLast.utc)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs">{new Date(location.datetimeLast.utc).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Latest Measurements */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Latest Readings (last 24 hours)</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : latestMeasurements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {latestMeasurements.map((measurement, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      {getParameterDisplayName(measurement.parameter.name)}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {measurement.value.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-600">{measurement.unit}</span>
                    </div>
                    <div className="mt-2">
                      <div className={`h-1.5 rounded-full ${getAQIColor(measurement.value, measurement.parameter.name)}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : showPlaceholder && location.sensors && location.sensors.length > 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  This location monitors <strong>{location.sensors.length} parameters</strong>.
                  Click "View Full Details" below to see historical data and trends.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No recent measurements available</p>
            )}
          </div>

          {/* Sensors */}
          {location.sensors && location.sensors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Parameters</h3>
              <div className="flex flex-wrap gap-2">
                {location.sensors.map((sensor) => (
                  <span
                    key={sensor.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                  >
                    {getParameterDisplayName(sensor.parameter.name)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Link
            href={`/locations/${location.id}`}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
            onClick={onClose}
          >
            View Full Details
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
