/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Explore page with Vietnam road network visualization and community reporting system
 */

'use client';

import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, List, Map as MapIcon, Menu, Route, Minus, Maximize2, MapPin } from 'lucide-react';
import EnhancedRoadMapView, { EnhancedRoadMapViewRef, ReportMarker } from '@/components/explore/EnhancedRoadMapView';
import RoadDetailModal from '@/components/explore/RoadDetailModal';
import ReportsListSidebar from '@/components/explore/ReportsListSidebar';
import FloatingReportButton from '@/components/explore/FloatingReportButton';

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

// Chuẩn hoá toạ độ về dạng [lng, lat] giống logic trên map component,
// để tránh trường hợp dữ liệu trả về [lat, lng] làm nhảy sai vị trí.
const normalizeLngLat = (coord: number[]): [number, number] => {
  if (!Array.isArray(coord) || coord.length < 2) {
    return [0, 0];
  }

  let [a, b] = coord;

  const looksLikeLatLng = Math.abs(a) <= 90 && Math.abs(b) > 90;
  if (looksLikeLatLng) {
    return [b, a];
  }

  return [a, b];
};

// Virtualized Road List Component for performance
// Simplified version - only render first 50 items initially, load more on scroll
function VirtualizedRoadList({ roads, onRoadClick }: { roads: RoadSegment[]; onRoadClick: (road: RoadSegment) => void }) {
  const [visibleCount, setVisibleCount] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Load more when user scrolls near bottom (80% of scroll)
      if (scrollTop + clientHeight >= scrollHeight * 0.8 && visibleCount < roads.length) {
        setVisibleCount(prev => Math.min(prev + 50, roads.length));
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [roads.length, visibleCount]);

  // Reset visible count when roads change
  useEffect(() => {
    setVisibleCount(50);
  }, [roads.length]);

  const visibleRoads = roads.slice(0, visibleCount);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="p-4 space-y-3">
        {visibleRoads.map((road) => (
          <div
            key={road.id}
            onClick={() => onRoadClick(road)}
            className="group bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors flex-1">
                {road.name}
              </h3>
              <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase shadow-sm ${road.roadType === 'primary' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
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
        {visibleCount < roads.length && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Loading more roads... ({visibleCount} / {roads.length})
          </div>
        )}
      </div>
    </div>
  );
}

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const MAX_ROADS_DISPLAY = 2500;
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
  const [highlightLocation, setHighlightLocation] = useState<[number, number] | null>(null);
  const [highlightLabel, setHighlightLabel] = useState<string>('');
  const [areaReports, setAreaReports] = useState<ReportMarker[]>([]);
  const totalRoadCount = filteredRoadSegments.length;

  const displayedRoadSegments = useMemo(
    () => filteredRoadSegments.slice(0, MAX_ROADS_DISPLAY),
    [filteredRoadSegments, MAX_ROADS_DISPLAY]
  );

  const displayedRoadCount = displayedRoadSegments.length;

  useEffect(() => {
    loadRoadSegments();
  }, []);

  useEffect(() => {
    if (!showReportsSidebar) {
      setAreaReports([]);
    }
  }, [showReportsSidebar]);

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

  const handleRoadSelection = useCallback((road: RoadSegment) => {
    setSelectedRoad(road);

    // Zoom to the road on map
    if (mapRef.current) {
      mapRef.current.zoomToRoad(road);
    }

    // Show reports for this road's location
    const centerIndex = Math.floor(road.location.coordinates.length / 2);
    const rawCenter = road.location.coordinates[centerIndex] || [0, 0];
    const [lng, lat] = normalizeLngLat(rawCenter);
    const centerLocation: [number, number] = [lng, lat];
    setReportsLocation(centerLocation);
    setHighlightLocation(centerLocation);
    setHighlightLabel(road.name);
    setShowReportsSidebar(true);
  }, []);

  const loadRoadSegments = async () => {
    try {
      setLoading(true);

      // Check cache first
      const CACHE_KEY = 'urbanreflex_road_segments';
      const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          // Check if cache is still valid (less than 24 hours old)
          if (now - timestamp < CACHE_EXPIRY) {
            console.log('✅ Using cached road segments:', data.length);
            setRoadSegments(data);
            setFilteredRoadSegments(data);
            setLoading(false);
            return;
          } else {
            console.log('⏰ Cache expired, fetching fresh data...');
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (error) {
        console.warn('⚠️ Error reading cache:', error);
      }

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

      // Save to cache
      try {
        const cacheData = {
          data: allRoads,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('💾 Cached road segments for future use');
      } catch (error) {
        console.warn('⚠️ Error saving cache:', error);
      }

      setRoadSegments(allRoads);
      setFilteredRoadSegments(allRoads);

    } catch (error) {
      console.error('❌ Error loading road segments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce hook for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized filtered results based on search query and road type
  const [activeRoadTypeFilter, setActiveRoadTypeFilter] = useState<string>('all');

  const filteredRoadSegmentsMemo = useMemo(() => {
    let filtered = roadSegments;

    // Apply road type filter
    if (activeRoadTypeFilter !== 'all') {
      filtered = filtered.filter(road => road.roadType === activeRoadTypeFilter);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter(road =>
        road.name.toLowerCase().includes(queryLower) ||
        road.roadType.toLowerCase().includes(queryLower)
      );
    }

    return filtered;
  }, [roadSegments, activeRoadTypeFilter, searchQuery]);

  // Update filteredRoadSegments when memoized result changes
  useEffect(() => {
    setFilteredRoadSegments(filteredRoadSegmentsMemo);
  }, [filteredRoadSegmentsMemo]);

  const handleRoadTypeFilter = useCallback((roadType: string) => {
    setActiveRoadTypeFilter(roadType);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search - update filter after 300ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      // Filter is now handled by useMemo, no need to manually update
    }, 300);
  }, []);

  const toggleSidebar = useCallback((view?: 'filters' | 'list') => {
    if (view) {
      setSidebarView(view);
      setShowSidebar(true);
    } else {
      setShowSidebar(!showSidebar);
    }
  }, [showSidebar]);

  const handleRoadClick = useCallback((road: RoadSegment) => {
    handleRoadSelection(road);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        <EnhancedRoadMapView
          ref={mapRef}
          roadSegments={displayedRoadSegments}
          onRoadClick={handleRoadClick}
          highlightLocation={highlightLocation}
          highlightLabel={highlightLabel}
          reportMarkers={areaReports}
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
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg ${showSidebar && sidebarView === 'list'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
            >
              <List className="h-5 w-5" />
              <span className="hidden sm:inline font-bold">Roads</span>
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
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg ${showSidebar && sidebarView === 'list'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                >
                  <List className="h-5 w-5" />
                  <span className="hidden sm:inline font-bold">Roads</span>
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
        className={`absolute top-[15rem] left-0 bottom-0 w-full sm:w-[420px] bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-10 ${showSidebar ? 'translate-x-0' : '-translate-x-full'
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
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content - Virtualized */}
        <div className="h-[calc(100vh-9rem-88px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-500"></div>
                <p className="mt-4 text-gray-600 font-semibold">Loading roads...</p>
              </div>
            </div>
          ) : (
            <VirtualizedRoadList
              roads={displayedRoadSegments}
              onRoadClick={(road) => {
                if (mapRef.current) {
                  mapRef.current.zoomToRoad(road);
                }
                handleRoadSelection(road);
                if (window.innerWidth < 640) {
                  setShowSidebar(false);
                }
              }}
            />
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
          onClose={() => {
            setShowReportsSidebar(false);
            setAreaReports([]);
          }}
          onApprovedReportsUpdate={setAreaReports}
        />
      )}

      {/* Floating Report Button */}
      <FloatingReportButton
        selectedRoad={selectedRoad ? {
          id: selectedRoad.id,
          name: selectedRoad.name,
          location: selectedRoad.location
        } : null}
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="relative w-full h-screen overflow-hidden bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-500"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
 
 
 
