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
import { MapPin, Route, Ruler, Layers, Navigation, Database, X, Cloud, Wind, Droplets, Gauge, Eye, Lightbulb, AlertTriangle, Landmark, Loader2 } from 'lucide-react';
import ReportButton from './ReportButton';

interface RoadSegment {
  id: string;
  type: string;
  dataProvider: string;
  dateCreated: string;
  name: string;
  roadType: string;
  length: number;
  laneCount?: number;
  surface?: string;
  oneway?: boolean;
  maximumAllowedSpeed?: string;
  source?: string;
  location: {
    type: 'LineString';
    coordinates: number[][];
  };
  [key: string]: any; // Allow additional fields from API
}

interface RoadDetailModalProps {
  road: RoadSegment | null;
  onClose: () => void;
  onOpenAreaReports?: () => void;
}

interface RoadDetailData {
  road: any;
  weather: any;
  aqi: any[];
  streetlights: {
    total: number;
    on: number;
    off: number;
    list: any[];
  };
  reports: RoadReport[];
  pois: any[];
}

interface RoadReport {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  priority?: string;
  location?: {
    coordinates?: [number, number];
  };
  dateCreated?: string;
  refRoadSegment?: string;
  reporterName?: string;
  reporterContact?: string;
}

// Simple in-memory cache cho dữ liệu chi tiết road trong phiên hiện tại
// Key: roadId, Value: { data, timestamp }
const ROAD_DETAIL_CACHE = new Map<string, { data: RoadDetailData; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút

export default function RoadDetailModal({ road, onClose, onOpenAreaReports }: RoadDetailModalProps) {
  const [detailData, setDetailData] = useState<RoadDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (road) {
      fetchRoadDetails(road.id);
    } else {
      setDetailData(null);
    }
  }, [road]);

  const fetchRoadDetails = async (roadId: string) => {
    // Nếu không có roadId thì bỏ qua
    if (!roadId) return;

    try {
      setError(null);

      const now = Date.now();
      const cached = ROAD_DETAIL_CACHE.get(roadId);

      // Nếu có cache còn hạn, dùng luôn để hiển thị nhanh, không cần spinner
      if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        setDetailData(cached.data);
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await fetch(`/api/roads/${encodeURIComponent(roadId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch road details');
      }

      const data = await response.json();
      console.log('Road detail data received:', data);
      console.log('Streetlights data:', data.streetlights);

      setDetailData(data);
      ROAD_DETAIL_CACHE.set(roadId, { data, timestamp: Date.now() });
    } catch (err) {
      console.error('Error fetching road details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!road) return null;

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
    <>
      {/* Main Modal */}
      <div className={`fixed top-[13rem] right-6 bottom-32 z-[9999] transition-all duration-300 w-[420px] ${road ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
        <div className="h-full flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with Transparent Background */}
          <div className="px-6 py-3 relative flex-shrink-0 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-xl p-2.5 flex-shrink-0">
                <span className="text-2xl">{getRoadTypeIcon(road.roadType)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 break-words mb-1.5">
                  {road.name || 'Unnamed Road'}
                </h3>
                {(() => {
                  // Get the latest timestamp from available data sources
                  const timestamps: (string | Date)[] = [];
                  
                  if (detailData?.weather?.dateObserved) {
                    timestamps.push(new Date(detailData.weather.dateObserved));
                  }
                  if (road.dateCreated) {
                    timestamps.push(new Date(road.dateCreated));
                  }
                  if (detailData?.aqi && Array.isArray(detailData.aqi) && detailData.aqi.length > 0) {
                    detailData.aqi.forEach((station: any) => {
                      if (station.dateObserved) {
                        timestamps.push(new Date(station.dateObserved));
                      }
                    });
                  }
                  
                  // Find the latest timestamp
                  const latestTime = timestamps.length > 0 
                    ? new Date(Math.max(...timestamps.map(t => new Date(t).getTime())))
                    : null;
                  
                  return latestTime ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                      {latestTime.toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase bg-blue-100 text-blue-700">
                      {road.roadType}
                    </span>
                  );
                })()}
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable with hidden scrollbar */}
          <div className="px-5 py-4 flex-1 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 15rem)' }}>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading road details...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 text-sm">Error: {error}</p>
              </div>
            )}

            {!loading && !error && detailData && (
              <>
                {/* Weather Section */}
                {detailData.weather && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-sky-100 p-2 rounded-lg">
                        <Cloud className="h-5 w-5 text-sky-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">1. Weather Observed</h4>
                    </div>
                    <div className="bg-sky-50 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">Temperature</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{detailData.weather.temperature}°C</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-500">Humidity</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {typeof detailData.weather.humidity === 'number' && detailData.weather.humidity < 1
                              ? (detailData.weather.humidity * 100).toFixed(1)
                              : detailData.weather.humidity}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Gauge className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-gray-500">Pressure</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{detailData.weather.pressure} hPa</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Wind className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-500">Wind</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {detailData.weather.windSpeed} m/s @ {detailData.weather.windDirection}°
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {detailData.weather.feelsLike && (
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500">Feels Like</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{detailData.weather.feelsLike}°C</p>
                          </div>
                        )}
                        {detailData.weather.visibility && (
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-500">Visibility</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{detailData.weather.visibility} m</p>
                          </div>
                        )}
                      </div>
                      {(detailData.weather.precipitation !== undefined || detailData.weather.cloudCover !== undefined) && (
                        <div className="grid grid-cols-2 gap-3">
                          {detailData.weather.precipitation !== undefined && (
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="text-xs text-gray-500">Precipitation</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900">{detailData.weather.precipitation} mm</p>
                            </div>
                          )}
                          {detailData.weather.cloudCover !== undefined && (
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Cloud className="h-4 w-4 text-gray-500" />
                                <span className="text-xs text-gray-500">Cloud Cover</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900">{detailData.weather.cloudCover}%</p>
                            </div>
                          )}
                        </div>
                      )}
                      {detailData.weather.weatherDescription && (
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">Weather</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{detailData.weather.weatherDescription} ({detailData.weather.weatherType})</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AQI Section - Only Nearest Station */}
                {detailData.aqi !== undefined && detailData.aqi !== null && Array.isArray(detailData.aqi) && detailData.aqi.length > 0 && (() => {
                  const nearestStation = detailData.aqi[0];
                  return (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <span className="text-xl">🌬️</span>
                        </div>
                        <h4 className="font-bold text-gray-900">2. Air Quality Observed</h4>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                        {/* Station Name & AQI Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-bold text-gray-900 text-base">{nearestStation.name || nearestStation.stationId}</p>
                          <span className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
                            AQI: {nearestStation.aqi}
                          </span>
                        </div>
                        
                        {/* Air Quality Parameters Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* PM2.5 */}
                          {nearestStation.pm25 !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-orange-700">PM</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">PM2.5</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.pm25}</p>
                              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                            </div>
                          )}
                          
                          {/* PM10 */}
                          {nearestStation.pm10 !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-red-700">PM</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">PM10</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.pm10}</p>
                              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                            </div>
                          )}
                          
                          {/* NO₂ */}
                          {nearestStation.no2 !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-yellow-700">NO</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">NO₂</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.no2}</p>
                              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                            </div>
                          )}
                          
                          {/* O₃ */}
                          {nearestStation.o3 !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-700">O</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">O₃</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.o3}</p>
                              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                            </div>
                          )}
                          
                          {/* SO₂ */}
                          {nearestStation.so2 !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-purple-700">SO</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">SO₂</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.so2}</p>
                              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                            </div>
                          )}
                          
                          {/* CO */}
                          {nearestStation.co !== undefined && (
                            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-700">CO</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">CO</span>
                              </div>
                              <p className="text-2xl font-bold text-gray-900">{nearestStation.co}</p>
                              <p className="text-xs text-gray-500 mt-1">mg/m³</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Streetlights Section - removed from UI per design request */}

                {/* Reports Section - Always show */}
                {detailData.reports !== undefined && detailData.reports !== null && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-rose-100 p-2 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-rose-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">3. Citizen Reports</h4>
                          {Array.isArray(detailData.reports) && detailData.reports.length > 0 && (
                            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-semibold">
                              {detailData.reports.length}
                            </span>
                          )}
                        </div>
                      </div>
                      {onOpenAreaReports && (
                        <button
                          type="button"
                          onClick={onOpenAreaReports}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          View area reports
                        </button>
                      )}
                    </div>
                    {Array.isArray(detailData.reports) && detailData.reports.length > 0 ? (
                      <div className="bg-rose-50 rounded-xl p-4 space-y-3">
                        {detailData.reports.slice(0, 5).map((report: RoadReport, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3">
                            {report.title && (
                              <p className="font-semibold text-gray-900 text-sm mb-1">{report.title}</p>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {report.category || 'Report'}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                  report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {report.status}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${report.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  report.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {report.priority}
                              </span>
                            </div>
                            {report.description && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                            )}
                            {report.location && report.location.coordinates && (
                              <p className="text-xs text-gray-500 mb-1">
                                Location: [{report.location.coordinates[0].toFixed(5)}, {report.location.coordinates[1].toFixed(5)}]
                              </p>
                            )}
                            {report.dateCreated && (() => {
                              try {
                                const date = new Date(report.dateCreated);
                                if (!isNaN(date.getTime())) {
                                  return (
                                    <p className="text-xs text-gray-500">
                                      {date.toLocaleString()}
                                    </p>
                                  );
                                }
                              } catch (e) {
                                // Invalid date, don't display
                              }
                              return null;
                            })()}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-rose-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">(Không có report nào cho tuyến đường này)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* POIs Section - Always show */}
                {detailData.pois !== undefined && detailData.pois !== null && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Landmark className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">4. Points of Interest</h4>
                      {Array.isArray(detailData.pois) && detailData.pois.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                          {detailData.pois.length}
                        </span>
                      )}
                    </div>
                    {Array.isArray(detailData.pois) && detailData.pois.length > 0 ? (
                      <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                        {detailData.pois.slice(0, 5).map((poi: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3">
                            <p className="font-semibold text-gray-900 text-sm">{poi.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{poi.category}</p>
                            {poi.location && poi.location.coordinates && (
                              <p className="text-xs text-gray-500 mt-1">
                                Location: [{poi.location.coordinates[0].toFixed(5)}, {poi.location.coordinates[1].toFixed(5)}]
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">(Không có POI nào gần tuyến đường trong bán kính đặt ra)</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Road Statistics - Length and Surface in one row */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Length */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Length</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {road.length && typeof road.length === 'number' 
                      ? `${road.length.toFixed(0)} m`
                      : detailData?.road?.length && typeof detailData.road.length === 'number'
                      ? `${detailData.road.length.toFixed(0)} m`
                      : 'N/A'}
                  </p>
                </div>

                {/* Surface */}
                {road.surface && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-semibold uppercase text-purple-700">Surface</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 capitalize">{road.surface}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}
