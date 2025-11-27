/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Hero section component for the homepage with animated title, description, and call-to-action buttons with realtime data
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CompactLocationCard from './CompactLocationCard';
import { useState, useEffect } from 'react';
import DotsBackground from '../ui/DotsBackground';

interface Station {
  id: string;
  stationId: string;
  name: string;
  city?: string;
  address?: string;
}

export default function HeroSection() {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string>('');

  // Fetch available stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('/api/aqi');
        const data = await response.json();

        if (data && data.stations && Array.isArray(data.stations)) {
          // Group by station ID to get unique stations
          const uniqueStations = new Map<string, Station>();

          data.stations.forEach((s: any) => {
            const stationId = s.stationId || s.name || s.id;
            if (!uniqueStations.has(stationId)) {
              uniqueStations.set(stationId, {
                id: s.id,
                stationId: stationId,
                name: s.name || stationId,
                city: s.city,
                address: s.address,
              });
            }
          });

          const stationList = Array.from(uniqueStations.values());
          setStations(stationList);

          // Select first station by default
          if (stationList.length > 0 && !selectedStationId) {
            setSelectedStationId(stationList[0].stationId);
          }
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };

    fetchStations();
  }, []);

  // Fetch station data when selection changes
  useEffect(() => {
    if (!selectedStationId) return;

    const fetchRealtimeData = async () => {
      try {
        setLoading(true);

        // Fetch AirQualityObserved entities from NGSI-LD via /api/aqi
        const response = await fetch('/api/aqi');
        const data = await response.json();

        console.log('NGSI-LD AQI data:', data);

        if (data && data.stations && Array.isArray(data.stations) && data.stations.length > 0) {
          // Find the selected station
          let station = data.stations.find((s: any) =>
            (s.stationId || s.name || s.id) === selectedStationId
          );

          // If not found, use first station
          if (!station) {
            station = data.stations[0];
          }

          // Get current time from machine
          const getCurrentTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          };

          // Extract measurements from station
          const measurements = [];
          if (station.pm25) measurements.push({ parameter: 'pm25', value: station.pm25, unit: 'µg/m³' });
          if (station.pm10) measurements.push({ parameter: 'pm10', value: station.pm10, unit: 'µg/m³' });
          if (station.o3) measurements.push({ parameter: 'o3', value: station.o3, unit: 'ppb' });
          if (station.no2) measurements.push({ parameter: 'no2', value: station.no2, unit: 'ppb' });
          if (station.so2) measurements.push({ parameter: 'so2', value: station.so2, unit: 'ppb' });
          if (station.co) measurements.push({ parameter: 'co', value: station.co, unit: 'ppb' });

          setLocationData({
            name: station.name || station.stationId || 'Station',
            city: station.city || 'Ho Chi Minh City',
            country: station.country || 'VN',
            type: station.measurementQuality === 'measured' ? 'Monitor' : 'Synthetic',
            measurements: measurements,
            provider: station.source || 'UrbanReflex NGSI-LD',
            lastUpdated: `Updated ${getCurrentTime()}`,
            since: station.dateObserved ? new Date(station.dateObserved).toLocaleDateString() : 'Unknown',
            measurementQuality: station.measurementQuality,
          });
          setLoading(false);
          return;
        }

        // Fallback: No data available
        setLocationData(null);
      } catch (error) {
        console.error('Error fetching realtime data:', error);
        setLocationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtimeData();
  }, [selectedStationId]);

  return (
    <section className="relative bg-white overflow-hidden min-h-[600px]">
      {/* Dots Background */}
      <div className="absolute inset-0">
        <DotsBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-soft-800 mb-6 leading-tight tracking-tighter">
              Fighting air inequality through{' '}
              <span className="text-primary-600">open data.</span>
            </h1>

            <p className="text-lg text-neutral-soft-500 mb-10 max-w-xl">
              OpenAQ is a nonprofit organization providing universal access to air quality data
              to empower a global community of changemakers to solve air inequality—the unequal
              access to clean air.
            </p>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-0.5"
            >
              Explore Data
            </Link>
          </motion.div>

          {/* Right side - Realtime Data Card */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full bg-gradient-to-t from-sky-100/50 to-gray-50/10 rounded-full blur-3xl"></div>
              <div className="absolute w-96 h-96 border-4 border-sky-200/50 rounded-full animate-spin-slow"></div>
              <div className="absolute w-80 h-80 border-4 border-cyan-200/50 rounded-full animate-spin-slow-reverse"></div>
            </div>

            <div className="relative z-10 space-y-4 w-full max-w-md">
              {/* Location Selector */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-soft p-4 border border-white/80"
              >
                <label className="block text-xs font-bold text-neutral-soft-600 mb-2 uppercase tracking-wider">
                  📍 Select a Station
                </label>
                <div className="relative">
                  <select
                    value={selectedStationId}
                    onChange={(e) => {
                      setSelectedStationId(e.target.value);
                      setLoading(true);
                    }}
                    className="w-full px-4 py-3.5 rounded-lg border-2 border-neutral-soft-200 bg-white text-neutral-soft-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none cursor-pointer hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={stations.length === 0}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {stations.length === 0 ? (
                      <option>🔄 Loading stations...</option>
                    ) : (
                      stations.map((station) => (
                        <option
                          key={station.id}
                          value={station.stationId}
                          className="py-2"
                        >
                          {station.name}{station.address ? ` • ${station.address}` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {stations.length > 0 && (
                  <p className="text-xs text-neutral-soft-500 mt-2">
                    {stations.length} station{stations.length > 1 ? 's' : ''} available
                  </p>
                )}
              </motion.div>

              {/* Realtime Data Card */}
              {loading ? (
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-large p-8 w-full border border-white/80">
                  <div className="animate-pulse space-y-6">
                    <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
                  </div>
                </div>
              ) : locationData ? (
                <CompactLocationCard {...locationData} />
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

