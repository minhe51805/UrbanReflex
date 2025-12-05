/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Hero section component for the homepage with animated title, description, and call-to-action buttons with realtime data
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CompactLocationCard from './CompactLocationCard';
import { useState, useEffect } from 'react';
import DotsBackground from '../ui/DotsBackground';

interface Road {
  id: string;
  name: string;
  roadType: string;
  length: number;
  centerLat?: number;
  centerLng?: number;
  distance?: number;
}

// Helper function to get value from Property object (like Python script)
function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

export default function HeroSection() {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roads, setRoads] = useState<Road[]>([]);
  const [selectedRoadId, setSelectedRoadId] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log('User location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Error getting user location:', error);
          // Continue without user location
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Fetch available roads on mount - fetch all at once
  useEffect(() => {
    const fetchRoads = async () => {
      try {
        // Fetch all roads without limit
        const response = await fetch('/api/roads');

        if (!response.ok) {
          console.error('Error fetching roads:', response.status, response.statusText);
          const errorData = await response.json().catch(() => ({}));
          console.error('Error details:', errorData);
          return;
        }

        const data = await response.json();

        if (data && data.roads && Array.isArray(data.roads)) {
          // Filter and map roads with location data
          let roadList = data.roads
            .filter((r: any) => r.name && r.name.trim() !== '')
            .map((r: any) => {
              // Calculate center point of road for distance calculation
              let centerLat = 0;
              let centerLng = 0;
              let distance = Infinity;

              if (r.location && r.location.coordinates && Array.isArray(r.location.coordinates)) {
                // Calculate average of all coordinates
                const coords = r.location.coordinates;
                const sumLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0);
                const sumLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0);
                centerLat = sumLat / coords.length;
                centerLng = sumLng / coords.length;

                // Calculate distance from user location if available
                if (userLocation) {
                  distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    centerLat,
                    centerLng
                  );
                }
              }

              return {
                id: r.id,
                name: r.name,
                roadType: r.roadClass || 'unknown',
                length: r.length || 0,
                centerLat,
                centerLng,
                distance,
              };
            });

          // Sort by distance if user location is available
          if (userLocation) {
            roadList = roadList.sort((a: Road, b: Road) => {
              // Roads with valid distance first
              const aDist = a.distance ?? Infinity;
              const bDist = b.distance ?? Infinity;
              if (aDist === Infinity && bDist === Infinity) return 0;
              if (aDist === Infinity) return 1;
              if (bDist === Infinity) return -1;
              return aDist - bDist;
            });
            console.log(`Sorted ${roadList.length} roads by distance from user location`);
          }

          setRoads(roadList);
          console.log(`Loaded ${roadList.length} roads`);

          // Select first road by default (closest if location available)
          if (roadList.length > 0) {
            if (userLocation) {
              // When user location is available, always select the closest road (first in sorted list)
              setSelectedRoadId(roadList[0].id);
            } else if (!selectedRoadId) {
              // Only set default if no road is selected yet and no user location
              setSelectedRoadId(roadList[0].id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching roads:', error);
      }
    };

    fetchRoads();
  }, [userLocation]); // Re-fetch and re-sort when user location is available

  // Fetch road data when selection changes
  useEffect(() => {
    if (!selectedRoadId) return;

    const fetchRoadData = async () => {
      try {
        setLoading(true);

        // Fetch comprehensive road data from /api/roads/[id]
        const response = await fetch(`/api/roads/${encodeURIComponent(selectedRoadId)}`);
        const data = await response.json();

        console.log('Road data:', data);

        if (data && data.road) {
          // Find road details from list
          const road = roads.find((r) => r.id === selectedRoadId);

          // Get current time from machine
          const getCurrentTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          };

          // Extract measurements from road data (Weather only)
          const measurements = [];

          // Add weather data - Basic (always shown) - using same logic as Python script
          if (data.weather) {
            if (data.weather.temperature !== undefined) {
              measurements.push({ parameter: 'temperature', value: Number(getValue(data.weather.temperature)).toFixed(1), unit: '°C' });
            }
            if (data.weather.relativeHumidity !== undefined || data.weather.humidity !== undefined) {
              // Handle humidity like Python script: if < 1, multiply by 100
              const humidityRaw = data.weather.relativeHumidity !== undefined ? data.weather.relativeHumidity : data.weather.humidity;
              const humidityValue = getValue(humidityRaw);
              const humidity = typeof humidityValue === 'number' && humidityValue < 1
                ? (humidityValue * 100)
                : humidityValue;
              measurements.push({ parameter: 'humidity', value: Number(humidity).toFixed(1), unit: '%' });
            }
            if (data.weather.windSpeed !== undefined) {
              measurements.push({ parameter: 'wind', value: Number(getValue(data.weather.windSpeed)).toFixed(2), unit: 'm/s' });
            }
            if (data.weather.weatherDescription) {
              measurements.push({ parameter: 'weather', value: data.weather.weatherDescription, unit: '' });
            }

            // Additional weather data (shown when expanded) - all fields from Python script
            if (data.weather.atmosphericPressure !== undefined || data.weather.pressure !== undefined) {
              const pressure = data.weather.atmosphericPressure !== undefined ? data.weather.atmosphericPressure : data.weather.pressure;
              measurements.push({ parameter: 'pressure', value: Number(getValue(pressure)).toFixed(0), unit: 'hPa' });
            }
            if (data.weather.windDirection !== undefined) {
              measurements.push({ parameter: 'windDirection', value: Number(getValue(data.weather.windDirection)).toFixed(0), unit: '°' });
            }
            if (data.weather.visibility !== undefined) {
              // Visibility is in meters (like Python script shows "10000 m")
              const visibilityValue = Number(getValue(data.weather.visibility));
              measurements.push({ parameter: 'visibility', value: visibilityValue.toFixed(0), unit: 'm' });
            }
            if (data.weather.feelsLikeTemperature !== undefined || data.weather.feelsLike !== undefined) {
              const feelsLike = data.weather.feelsLikeTemperature !== undefined ? data.weather.feelsLikeTemperature : data.weather.feelsLike;
              measurements.push({ parameter: 'feelsLike', value: Number(getValue(feelsLike)).toFixed(2), unit: '°C' });
            }
            if (data.weather.precipitation !== undefined) {
              measurements.push({ parameter: 'precipitation', value: Number(getValue(data.weather.precipitation)).toFixed(2), unit: 'mm' });
            }
            if (data.weather.cloudCover !== undefined) {
              measurements.push({ parameter: 'cloudCover', value: Number(getValue(data.weather.cloudCover)).toFixed(1), unit: '%' });
            }
          }

          // Add AQI data if available (shown when expanded)
          // Use first station from sorted list (already sorted by dateObserved descending like Python script)
          if (data.aqi && data.aqi.length > 0) {
            // Python script shows stations sorted by dateObserved descending, so use first one
            const latestAQI = data.aqi[0];

            if (latestAQI.aqi !== undefined) {
              measurements.push({ parameter: 'aqi', value: Number(getValue(latestAQI.aqi)).toFixed(0), unit: '' });
            }
            if (latestAQI.pm25 !== undefined) {
              measurements.push({ parameter: 'pm25', value: Number(getValue(latestAQI.pm25)).toFixed(1), unit: 'µg/m³' });
            }
            if (latestAQI.pm10 !== undefined) {
              measurements.push({ parameter: 'pm10', value: Number(getValue(latestAQI.pm10)).toFixed(1), unit: 'µg/m³' });
            }
            if (latestAQI.no2 !== undefined) {
              measurements.push({ parameter: 'no2', value: Number(getValue(latestAQI.no2)).toFixed(1), unit: 'µg/m³' });
            }
            if (latestAQI.o3 !== undefined) {
              measurements.push({ parameter: 'o3', value: Number(getValue(latestAQI.o3)).toFixed(1), unit: 'µg/m³' });
            }
            if (latestAQI.so2 !== undefined) {
              measurements.push({ parameter: 'so2', value: Number(getValue(latestAQI.so2)).toFixed(1), unit: 'µg/m³' });
            }
            if (latestAQI.co !== undefined) {
              measurements.push({ parameter: 'co', value: Number(getValue(latestAQI.co)).toFixed(2), unit: 'mg/m³' });
            }
          }

          setLocationData({
            name: road?.name || data.road.name || 'Unknown Road',
            city: 'Ho Chi Minh City',
            country: 'Vietnam',
            type: road?.roadType || 'road',
            measurements: measurements.length > 0 ? measurements : [{ parameter: 'length', value: road?.length || 0, unit: 'm' }],
            provider: 'UrbanReflex NGSI-LD',
            lastUpdated: `Updated ${getCurrentTime()}`,
            since: new Date().toLocaleDateString(),
            measurementQuality: 'measured',
            roadId: road?.id || data.road.id,
            coordinates: road?.centerLng && road?.centerLat ? [road.centerLng, road.centerLat] : undefined,
            streetlights: data.streetlights ? {
              total: data.streetlights.total || 0,
              on: data.streetlights.on || 0,
              off: data.streetlights.off || 0,
            } : undefined,
            reports: data.reports ? (Array.isArray(data.reports) ? data.reports.length : 0) : 0,
            pois: data.pois ? (Array.isArray(data.pois) ? data.pois.length : 0) : 0,
          });
          setLoading(false);
          return;
        }

        // Fallback: No data available
        setLocationData(null);
      } catch (error) {
        console.error('Error fetching road data:', error);
        setLocationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadData();
  }, [selectedRoadId, roads]);

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
              Smart urban monitoring for{' '}
              <span className="text-primary-600">Ho Chi Minh City.</span>
            </h1>

            <p className="text-lg text-neutral-soft-500 mb-10 max-w-xl">
              UrbanReflex is an intelligent urban management system providing real-time data
              on weather, air quality, streetlights, and citizen reports to empower smarter
              decision-making for a sustainable and livable city.
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
              {/* Road Selector */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-soft p-4 border border-white/80"
              >
                <label className="block text-xs font-bold text-neutral-soft-600 mb-2 uppercase tracking-wider">
                  Select a Road
                </label>
                <div className="relative">
                  <select
                    value={selectedRoadId}
                    onChange={(e) => {
                      setSelectedRoadId(e.target.value);
                      setLoading(true);
                    }}
                    className="w-full px-4 py-3.5 rounded-lg border-2 border-neutral-soft-200 bg-white text-neutral-soft-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none cursor-pointer hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={roads.length === 0}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {roads.length === 0 ? (
                      <option>🔄 Loading roads...</option>
                    ) : (
                      roads.map((road) => (
                        <option
                          key={road.id}
                          value={road.id}
                          className="py-2"
                        >
                          {road.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {/* {roads.length > 0 && (
                  <p className="text-xs text-neutral-soft-500 mt-2">
                    {roads.length} road{roads.length > 1 ? 's' : ''} available
                  </p>
                )} */}
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

