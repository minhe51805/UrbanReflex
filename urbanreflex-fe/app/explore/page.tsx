/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 25-11-2025
 * Description: Explore page with Vietnam road network visualization and community reporting system
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, List, Map as MapIcon, Menu, Route, Minus, Maximize2, MapPin } from 'lucide-react';
import EnhancedRoadMapView, { EnhancedRoadMapViewRef } from '@/components/explore/EnhancedRoadMapView';
import RoadDetailModal from '@/components/explore/RoadDetailModal';
import ReportsListSidebar from '@/components/explore/ReportsListSidebar';

interface RoadSegment {
  id: string;
  type: string;
  dataProvider: string;
  dateCreated: string;
  laneCount?: number;
  length: number;
  name: string;
  roadType: string;
  source?: string;
  surface?: string;
  oneway?: boolean;
  maximumAllowedSpeed?: string;
  location: {
    type: 'LineString';
    coordinates: number[][];
  };
  [key: string]: any; // Allow additional fields from API
}

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>([]);
  const [filteredRoadSegments, setFilteredRoadSegments] = useState<RoadSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<'filters' | 'list'>('list');
  const [showReportsSidebar, setShowReportsSidebar] = useState(false);
  const [reportsLocation, setReportsLocation] = useState<number[] | null>(null);
  const [isSearchMinimized, setIsSearchMinimized] = useState(false);
  const mapRef = useRef<EnhancedRoadMapViewRef>(null);
  const [initialRoadLoaded, setInitialRoadLoaded] = useState(false);
  const [highlightLocation, setHighlightLocation] = useState<number[] | null>(null);
  const [highlightLabel, setHighlightLabel] = useState<string>('');

  useEffect(() => {
    loadRoadSegments();
  }, []);

  // Handle query params to auto-select and zoom to road
  useEffect(() => {
    if (!loading && roadSegments.length > 0 && !initialRoadLoaded) {
      const roadId = searchParams.get('roadId');
      const lng = searchParams.get('lng');
      const lat = searchParams.get('lat');

      if (roadId) {
        // Find road by ID
        const road = roadSegments.find(r => r.id === roadId);
        if (road) {
          handleRoadSelection(road);
          setInitialRoadLoaded(true);
        }
      } else if (lng && lat) {
        // Find nearest road by coordinates
        const targetLng = parseFloat(lng);
        const targetLat = parseFloat(lat);
        
        // Find the nearest road
        let nearestRoad: RoadSegment | null = null;
        let minDistance = Infinity;

        roadSegments.forEach(road => {
          if (road.location?.coordinates) {
            // Calculate distance to each point in the road
            road.location.coordinates.forEach(([coordLng, coordLat]) => {
              const distance = Math.sqrt(
                Math.pow(coordLng - targetLng, 2) + Math.pow(coordLat - targetLat, 2)
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestRoad = road;
              }
            });
          }
        });

        if (nearestRoad) {
          handleRoadSelection(nearestRoad);
          setInitialRoadLoaded(true);
        }
      }
    }
  }, [loading, roadSegments, searchParams, initialRoadLoaded]);

  const handleRoadSelection = (road: RoadSegment) => {
    setSelectedRoad(road);
    
    // Zoom to the road on map
    if (mapRef.current) {
      mapRef.current.zoomToRoad(road);
    }
    
    // Show reports for this road's location
    const centerIndex = Math.floor(road.location.coordinates.length / 2);
    const [lng, lat] = road.location.coordinates[centerIndex];
    const centerLocation: [number, number] = [lng, lat];
    setReportsLocation(centerLocation);
    setHighlightLocation(centerLocation);
    setHighlightLabel(road.name);
    setShowReportsSidebar(true);
  };

  const loadRoadSegments = async () => {
    try {
      setLoading(true);

      // Backend has limit of 1000 per request, so we need to paginate
      const BATCH_SIZE = 1000;
      let allRoads: any[] = [];
      let offset = 0;
      let hasMore = true;

      console.log('🔄 Loading all road segments with pagination...');

      while (hasMore) {
        const response = await fetch(
          `/api/ngsi-ld?type=RoadSegment&options=keyValues&limit=${BATCH_SIZE}&offset=${offset}`
        );
        const roadData = await response.json();

        if (Array.isArray(roadData) && roadData.length > 0) {
          allRoads = [...allRoads, ...roadData];
          console.log(`  📦 Batch ${Math.floor(offset / BATCH_SIZE) + 1}: Loaded ${roadData.length} roads (Total: ${allRoads.length})`);

          // If we got less than BATCH_SIZE, we've reached the end
          if (roadData.length < BATCH_SIZE) {
            hasMore = false;
          } else {
            offset += BATCH_SIZE;
          }
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ Finished loading ${allRoads.length} road segments`);
      setRoadSegments(allRoads);
      setFilteredRoadSegments(allRoads);

    } catch (error) {
      console.error('❌ Error loading road segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoadTypeFilter = (roadType: string) => {
    if (roadType === 'all') {
      setFilteredRoadSegments(roadSegments);
      return;
    }

    const filtered = roadSegments.filter(road => road.roadType === roadType);
    setFilteredRoadSegments(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredRoadSegments(roadSegments);
      return;
    }

    const filtered = roadSegments.filter(road =>
      road.name.toLowerCase().includes(query.toLowerCase()) ||
      road.roadType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRoadSegments(filtered);
  };

  const toggleSidebar = (view?: 'filters' | 'list') => {
    if (view) {
      setSidebarView(view);
      setShowSidebar(true);
    } else {
      setShowSidebar(!showSidebar);
    }
  };

  const handleRoadClick = (road: RoadSegment) => {
    handleRoadSelection(road);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        <EnhancedRoadMapView
          ref={mapRef}
          roadSegments={filteredRoadSegments}
          onRoadClick={handleRoadClick}
          highlightLocation={highlightLocation}
          highlightLabel={highlightLabel}
        />
      </div>

      {/* Top Control Bar - Redesigned with Minimize Feature */}
      <div className="absolute top-4 left-4 right-4 z-50">
        {isSearchMinimized ? (
          // Minimized State - Small Compact Button
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchMinimized(false)}
              className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-3 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Search className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Search Roads</span>
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => toggleSidebar('list')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg ${
                showSidebar && sidebarView === 'list'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <List className="h-5 w-5" />
              <span className="hidden sm:inline font-bold">Roads</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                showSidebar && sidebarView === 'list'
                  ? 'bg-white/20 text-white'
                  : 'bg-primary-100 text-primary-700'
              }`}>
                {filteredRoadSegments.length}
              </span>
            </button>
          </div>
        ) : (
          // Expanded State - Full Search Bar
          <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50">
            <div className="px-6 py-4">
              {/* Search Bar with Minimize Button */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roads by name or type..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium transition-all"
                  />
                </div>

                <button
                  onClick={() => setIsSearchMinimized(true)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                  title="Minimize search bar"
                >
                  <Minus className="h-5 w-5" />
                </button>

                <button
                  onClick={() => toggleSidebar('list')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg ${
                    showSidebar && sidebarView === 'list'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                  <span className="hidden sm:inline font-bold">Roads</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    showSidebar && sidebarView === 'list'
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700'
                  }`}>
                    {filteredRoadSegments.length}
                  </span>
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mr-2">Filter:</span>
                <button
                  onClick={() => handleRoadTypeFilter('all')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md"
                >
                  All Roads
                </button>
                <button
                  onClick={() => handleRoadTypeFilter('primary')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 transition-all shadow-sm hover:shadow-md"
                >
                  🛣️ Primary
                </button>
                <button
                  onClick={() => handleRoadTypeFilter('secondary')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 transition-all shadow-sm hover:shadow-md"
                >
                  🚗 Secondary
                </button>
                <button
                  onClick={() => handleRoadTypeFilter('tertiary')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 transition-all shadow-sm hover:shadow-md"
                >
                  🚗 Tertiary
                </button>
                <button
                  onClick={() => handleRoadTypeFilter('residential')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 transition-all shadow-sm hover:shadow-md"
                >
                  🏘️ Residential
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Panel - Redesigned - Moved to Left */}
      <div
        className={`absolute top-[15rem] left-0 bottom-0 w-full sm:w-[420px] bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Route className="h-5 w-5 text-blue-600" />
              </div>
              Road Segments
            </h2>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {filteredRoadSegments.length} roads found
            </p>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100vh-9rem-88px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-500"></div>
                <p className="mt-4 text-gray-600 font-semibold">Loading roads...</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredRoadSegments.map((road) => (
                <div
                  key={road.id}
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.zoomToRoad(road);
                    }
                    handleRoadSelection(road);
                    if (window.innerWidth < 640) {
                      setShowSidebar(false);
                    }
                  }}
                  className="group bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors flex-1">
                      {road.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase shadow-sm ${
                      road.roadType === 'primary' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                      road.roadType === 'secondary' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' :
                      road.roadType === 'tertiary' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                      road.roadType === 'residential' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' :
                      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                    }`}>
                      {road.roadType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">📏</span>
                      <span className="font-medium">{road.length.toFixed(0)}m</span>
                    </div>
                    {road.laneCount && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">🛣️</span>
                        <span className="font-medium">{road.laneCount} lanes</span>
                      </div>
                    )}
                    {road.surface && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">⚙️</span>
                        <span className="font-medium capitalize">{road.surface}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay - Redesigned */}
      {loading && !showSidebar && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-5 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-500"></div>
            <div>
              <p className="text-gray-900 font-bold text-base">Loading road network...</p>
              <p className="text-gray-500 text-sm">Please wait</p>
            </div>
          </div>
        </div>
      )}


      {/* Road Detail Modal */}
      <RoadDetailModal
        road={selectedRoad}
        onClose={() => setSelectedRoad(null)}
      />

      {/*Reports List Sidebar*/}
      {showReportsSidebar && reportsLocation && (
        <ReportsListSidebar
          location={reportsLocation}
          radius={1}
          onClose={() => setShowReportsSidebar(false)}
        />
      )}
    </div>
  );
}
