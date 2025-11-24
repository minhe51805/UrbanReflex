/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Featured location card component displaying air quality data for specific locations with real-time measurements
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { getParameterDisplayName, formatParameterValue, getAQILevel } from '@/lib/utils/format';

interface Measurement {
  parameter: string;
  value: number;
  unit: string;
}

interface FeaturedLocationCardProps {
  locationId: number;
  name: string;
  city: string;
  country: string;
  type: string;
  measurements: Measurement[];
  provider: string;
  lastUpdated: string;
  since: string;
}

export default function FeaturedLocationCard({
  locationId,
  name,
  city,
  country,
  type,
  measurements,
  provider,
  lastUpdated,
  since,
}: FeaturedLocationCardProps) {
  const pm25Measurement = measurements.find(m => m.parameter.toLowerCase() === 'pm25');
  const aqiInfo = pm25Measurement ? getAQILevel('pm25', pm25Measurement.value) : null;

  // Sort measurements by priority
  const parameterOrder = ['pm25', 'pm10', 'bc', 'o3', 'no2', 'so2', 'co'];
  const sortedMeasurements = [...measurements].sort((a, b) => {
    const aIndex = parameterOrder.indexOf(a.parameter.toLowerCase());
    const bIndex = parameterOrder.indexOf(b.parameter.toLowerCase());
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20"
    >
      {/* Card with glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/50">

        {/* Content */}
        <div className="p-3.5">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#1e64ab] to-[#33a3a1] rounded-xl p-2.5 mb-2.5 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {aqiInfo && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="inline-block mb-1.5"
                  >
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-lg"
                      style={{ backgroundColor: aqiInfo.color }}
                    >
                      {aqiInfo.level}
                    </span>
                  </motion.div>
                )}
                <h2 className="text-xl font-bold mb-1 text-white">{name}</h2>
                <div className="flex items-center gap-1.5 text-sm text-white/90">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-sm">{city}, {country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            {/* Location Info - Left Column */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 shadow-lg">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                <div className="w-1 h-3.5 bg-gradient-to-b from-[#1e64ab] to-[#33a3a1] rounded-full" />
                Location Info
              </h3>

              <div className="space-y-1.5">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Type</p>
                  <p className="font-semibold text-gray-900">{type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Measures</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {sortedMeasurements.map(m => getParameterDisplayName(m.parameter)).join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Provider</p>
                  <p className="font-semibold text-gray-900">{provider}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Reporting</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#1e64ab]" />
                    <p className="font-semibold text-gray-900">{lastUpdated}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Since</p>
                  <p className="font-semibold text-gray-900">{since}</p>
                </div>
              </div>
            </div>

            {/* Latest Readings - Right 2 Columns */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-2.5 shadow-lg">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#1e64ab]" />
                Latest Readings
                <span className="text-xs font-normal text-gray-500 ml-2">{lastUpdated}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {sortedMeasurements.map((measurement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-1.5 hover:shadow-md transition-shadow border border-gray-200/50"
                  >
                    <p className="text-[9px] text-gray-600 mb-0.5 uppercase tracking-wide font-medium">
                      {getParameterDisplayName(measurement.parameter)}
                    </p>
                    <p className="text-lg font-bold text-[#1e64ab] mb-0.5">
                      {measurement.value}
                    </p>
                    <p className="text-[9px] text-gray-500">{measurement.unit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-2.5 text-center">
            <Link
              href={`/locations/${locationId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-white/90 backdrop-blur-sm text-[#1e64ab] font-semibold rounded-full hover:bg-white hover:shadow-lg transition-all"
            >
              Show Details →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

