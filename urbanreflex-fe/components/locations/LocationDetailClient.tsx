/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Client-side location detail component displaying detailed air quality measurements and historical data charts
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Location, Measurement } from '@/types/openaq';
import { getParameterDisplayName, formatRelativeTime, getAQILevel } from '@/lib/utils/format';
import { openaqClient } from '@/lib/api/openaq-client';
import MeasurementChart from './MeasurementChart';

interface LocationDetailClientProps {
  location: Location;
}

export default function LocationDetailClient({ location }: LocationDetailClientProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState<string>('');

  useEffect(() => {
    loadMeasurements();
  }, [location.id]);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const response = await openaqClient.getLatestMeasurements(location.id);
      setMeasurements(response.results);

      // Set default parameter to first available
      if (response.results.length > 0 && !selectedParameter) {
        setSelectedParameter(response.results[0].parameter.name);
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get latest measurement for PM2.5 to show AQI
  const latestPM25 = measurements.find(m => m.parameter.name.toLowerCase() === 'pm25');
  const aqiInfo = latestPM25 ? getAQILevel('pm25', latestPM25.value) : null;

  // Get unique parameters
  const parameters = Array.from(new Set(measurements.map(m => m.parameter.name)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e64ab] to-[#33a3a1] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/explore"
            className="inline-flex items-center text-white hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {aqiInfo && (
              <div className="mb-4">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                  style={{ backgroundColor: aqiInfo.color }}
                >
                  {aqiInfo.level}
                </span>
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{location.name}</h1>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>
                  {location.locality && `${location.locality}, `}
                  {location.country?.name || 'Unknown'}
                </span>
              </div>

              {location.datetimeLast && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Updated {formatRelativeTime(location.datetimeLast.utc)}</span>
                </div>
              )}

              {location.datetimeFirst && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Since {new Date(location.datetimeFirst.utc).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Location Information</h2>

              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-semibold text-gray-900">
                  {location.isMonitor ? 'Reference Monitor' : 'Air Sensor'}
                </p>
              </div>

              {location.provider && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data Provider</p>
                  <p className="font-semibold text-gray-900">{location.provider.name}</p>
                </div>
              )}

              {location.sensors && location.sensors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Measured Parameters</p>
                  <div className="flex flex-wrap gap-2">
                    {location.sensors.map((sensor) => (
                      <span
                        key={sensor.id}
                        className="px-3 py-1 bg-[#e6f8f8] text-[#33a3a1] text-sm font-semibold rounded-full"
                      >
                        {getParameterDisplayName(sensor.parameter.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Measurements Chart */}
          <div className="lg:col-span-2">
            <MeasurementChart
              measurements={measurements}
              parameters={parameters}
              selectedParameter={selectedParameter}
              onParameterChange={setSelectedParameter}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

