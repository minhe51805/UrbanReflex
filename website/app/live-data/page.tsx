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

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Wind, AlertCircle, RefreshCw, Route, Navigation } from 'lucide-react';
import WeatherWidget from '@/components/home/WeatherWidget';

interface RoadSegment {
  id: string;
  type: string;
  dataProvider: string;
  dateCreated: string;
  laneCount?: number;
  length: number;
  name: string;
  roadType: string;
  source: string;
  surface?: string;
  oneway?: boolean;
  maximumAllowedSpeed?: string;
  location: {
    type: 'LineString';
    coordinates: number[][];
  };
}

export default function LiveDataPage() {
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch RoadSegment entities
      const roadResponse = await fetch('/api/ngsi-ld?type=RoadSegment&limit=50&options=keyValues');
      const roadData = await roadResponse.json();

      if (Array.isArray(roadData)) {
        setRoadSegments(roadData);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoadTypeColor = (roadType: string) => {
    switch (roadType) {
      case 'primary': return 'bg-red-100 text-red-800 border-red-300';
      case 'secondary': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'tertiary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'residential': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoadTypeIcon = (roadType: string) => {
    switch (roadType) {
      case 'primary':
      case 'secondary':
        return '🛣️';
      case 'tertiary':
        return '🚗';
      case 'residential':
        return '🏠';
      default:
        return '📍';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Live Data Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time road network data from NGSI-LD Context Broker
              </p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Last updated: {mounted && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
          </div>
        </motion.div>

        {/* Weather Widget */}
        <div className="mb-8">
          <WeatherWidget />
        </div>

        {/* Road Segments Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Route className="h-6 w-6 text-primary-600" />
            Road Segments ({roadSegments.length})
          </h2>

          {loading && roadSegments.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadSegments.map((road, index) => (
                <motion.div
                  key={road.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-all"
                >
                  {/* Road Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getRoadTypeIcon(road.roadType)}</span>
                        <h3 className="font-bold text-gray-900">
                          {road.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {road.location.coordinates.length} points
                      </div>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getRoadTypeColor(road.roadType)}`}>
                      {road.roadType}
                    </span>
                  </div>

                  {/* Road Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Length</div>
                      <div className="font-bold text-blue-600">{road.length.toFixed(0)} m</div>
                    </div>

                    {road.laneCount && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Lanes</div>
                        <div className="font-bold text-green-600">{road.laneCount}</div>
                      </div>
                    )}

                    {road.surface && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Surface</div>
                        <div className="font-bold text-purple-600 capitalize">{road.surface}</div>
                      </div>
                    )}

                    {road.maximumAllowedSpeed && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Max Speed</div>
                        <div className="font-bold text-orange-600">{road.maximumAllowedSpeed} km/h</div>
                      </div>
                    )}
                  </div>

                  {/* Road Properties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {road.oneway && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ➡️ One-way
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {road.dataProvider}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <div className="truncate">Source: {road.source}</div>
                    <div>Created: {mounted ? new Date(road.dateCreated).toLocaleDateString() : '--/--/--'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

