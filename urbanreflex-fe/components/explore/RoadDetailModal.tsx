/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 20-11-2025
 * Update at: 26-11-2025
 * Description: Road detail panel component displaying road segment information with report button
 */

'use client';

import { MapPin, Route, Ruler, Layers, Navigation, Database, X } from 'lucide-react';
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
}

export default function RoadDetailModal({ road, onClose }: RoadDetailModalProps) {
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
      <div className={`fixed top-[13rem] right-6 bottom-32 z-[5] transition-all duration-300 w-[420px] ${
        road ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
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
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase bg-blue-100 text-blue-700">
                  {road.roadType}
                </span>
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
          <div className="px-5 py-4 flex-1 overflow-y-auto scrollbar-hide">
            {/* Location & Coordinates Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Location & Coordinates</h4>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">START POINT</p>
                    <p className="text-sm font-mono text-gray-900">
                      {road.location.coordinates[0][1].toFixed(5)}°
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {road.location.coordinates[0][0].toFixed(5)}°
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">END POINT</p>
                    <p className="text-sm font-mono text-gray-900">
                      {road.location.coordinates[road.location.coordinates.length - 1][1].toFixed(5)}°
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {road.location.coordinates[road.location.coordinates.length - 1][0].toFixed(5)}°
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-semibold mb-1">TOTAL POINTS</p>
                    <p className="text-xl font-bold text-blue-900">{road.location.coordinates.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">TYPE</p>
                    <p className="text-sm font-semibold text-gray-900">{road.location.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Road Statistics */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Length</span>
                  </div>
                  <p className="text-2xl font-bold">{road.length.toFixed(0)} m</p>
                </div>

                {road.laneCount && (
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Lanes</span>
                    </div>
                    <p className="text-2xl font-bold">{road.laneCount}</p>
                  </div>
                )}
              </div>
            </div>

            {(road.surface || road.maximumAllowedSpeed) && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {road.surface && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-semibold uppercase text-purple-700">Surface</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900 capitalize">{road.surface}</p>
                    </div>
                  )}

                  {road.maximumAllowedSpeed && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-semibold uppercase text-orange-700">Max Speed</span>
                      </div>
                      <p className="text-lg font-bold text-orange-900">{road.maximumAllowedSpeed} km/h</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata & Information */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900">Metadata & Information</h4>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-semibold mb-1">DATA PROVIDER</p>
                  <p className="text-sm text-gray-900 font-semibold">{road.dataProvider}</p>
                </div>

                {road.source && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">SOURCE</p>
                    <p className="text-sm text-gray-900 font-mono break-all">{road.source}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">ENTITY TYPE</p>
                    <p className="text-sm text-gray-900 font-semibold">{road.type}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">CREATED</p>
                    <p className="text-sm text-gray-900 font-semibold">{new Date(road.dateCreated).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-semibold mb-1">ROAD ID</p>
                  <p className="text-xs text-blue-900 font-mono break-all">{road.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Button - Separate from modal */}
      <div className={`fixed bottom-6 right-6 z-[5] transition-all duration-300 w-[420px] ${
        road ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      }`}>
        <ReportButton
          roadId={road.id}
          roadName={road.name}
          location={road.location}
        />
      </div>
    </>
  );
}
