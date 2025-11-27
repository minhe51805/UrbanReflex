/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 15-11-2025
 * Update at: 19-11-2025
 * Description: Compact location card for displaying realtime air quality data on the homepage hero section
 */

'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
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
}: CompactLocationCardProps) {
  // const pm25Measurement = measurements.find(m => m.parameter.toLowerCase() === 'pm25');
  // const aqiInfo = pm25Measurement ? getAQILevel('pm25', pm25Measurement.value) : null;

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-large overflow-hidden border border-neutral-soft-200 h-auto w-full max-w-md"
    >
      {/* Header - Professional gradient design */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10">
          {/* Location name */}
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">{name}</h2>

          {/* Date and Time below name */}
          <div className="text-xs text-white/70 mb-3">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} • {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Location info */}
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">{city}, {country}</span>
          </div>
        </div>
      </div>

      {/* Content - New clean design */}
      <div className="p-6 bg-gray-50">
        {/* Latest Readings */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-cyan-500" />
            Latest Readings
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {sortedMeasurements.slice(0, 6).map((measurement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                className="text-center bg-white rounded-xl p-3 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300"
              >
                <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wide font-medium">
                  {getParameterDisplayName(measurement.parameter)}
                </p>
                <p className="text-xl font-bold text-sky-600">
                  {measurement.value}
                </p>
                <p className="text-[9px] text-slate-500">{measurement.unit}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Clock className="h-4 w-4 text-cyan-500" />
            Location Info
          </h3>
          <div className="space-y-2 text-sm font-medium">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200/80">
              <span className="text-slate-600">Provider</span>
              <span className="font-semibold text-gray-700">{provider}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200/80">
              <span className="text-slate-600">Last Updated</span>
              <span className="font-semibold text-gray-700">{lastUpdated}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200/80">
              <span className="text-slate-600">Since</span>
              <span className="font-semibold text-gray-700">{since}</span>
            </div>
          </div>
        </div>

        {/* Show Details Link */}
        <div className="mt-6 text-center">
          <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold rounded-lg hover:from-slate-800 hover:to-black transition-all duration-300 shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 transform hover:-translate-y-0.5">
            Show Full Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

