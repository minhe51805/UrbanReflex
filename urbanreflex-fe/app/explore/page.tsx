/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Explore page with fullscreen map and modal-based filters/location list
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, List, Map as MapIcon, Menu } from 'lucide-react';
import MapView from '@/components/explore/MapView';
import Filters, { FilterState } from '@/components/explore/Filters';
import LocationList from '@/components/explore/LocationList';
import LocationDetailModal from '@/components/explore/LocationDetailModal';
import type { Location } from '@/types/openaq';
import { openaqClient } from '@/lib/api/openaq-client';

export default function ExplorePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<'filters' | 'list'>('filters');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await openaqClient.getLocations({ limit: 1000 });
      setLocations(response.results);
      setFilteredLocations(response.results);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...locations];

    // Filter by pollutant
    if (filters.pollutant !== 'any') {
      filtered = filtered.filter(location =>
        location.sensors?.some(sensor =>
          sensor.parameter.name.toLowerCase() === filters.pollutant.toLowerCase()
        )
      );
    }

    // Filter by location type
    if (filters.locationType.length > 0) {
      filtered = filtered.filter(location => {
        if (filters.locationType.includes('monitor') && location.isMonitor) return true;
        if (filters.locationType.includes('sensor') && !location.isMonitor) return true;
        return false;
      });
    }

    setFilteredLocations(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.locality?.toLowerCase().includes(query.toLowerCase()) ||
      location.country?.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const toggleSidebar = (view?: 'filters' | 'list') => {
    if (view) {
      setSidebarView(view);
      setShowSidebar(true);
    } else {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        <MapView
          locations={filteredLocations}
          onLocationClick={setSelectedLocation}
          center={[20, 40]}
          zoom={1.2}
        />
      </div>

      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSidebar('filters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                showSidebar && sidebarView === 'filters'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              onClick={() => toggleSidebar('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                showSidebar && sidebarView === 'list'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Locations</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredLocations.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {sidebarView === 'filters' ? 'Filters' : `Locations (${filteredLocations.length})`}
          </h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-600">Loading locations...</p>
              </div>
            </div>
          ) : sidebarView === 'filters' ? (
            <div className="p-4">
              <Filters onFilterChange={handleFilterChange} />
            </div>
          ) : (
            <div className="p-4">
              <LocationList
                locations={filteredLocations}
                onLocationClick={(location) => {
                  setSelectedLocation(location);
                  // Optionally close sidebar on mobile
                  if (window.innerWidth < 640) {
                    setShowSidebar(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && !showSidebar && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            <p className="text-gray-700 font-medium">Loading locations...</p>
          </div>
        </div>
      )}

      {/* Info Card Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 max-w-xs">
        <div className="flex items-start gap-3">
          <MapIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-1">
              Explore Air Quality Data
            </p>
            <p className="text-xs text-gray-600">
              Showing {filteredLocations.length} monitoring locations worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Location Detail Modal */}
      <LocationDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
