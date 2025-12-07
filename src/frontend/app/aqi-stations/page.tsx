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
import { Search, Filter, X, List, Map as MapIcon, Menu } from 'lucide-react';
import { orionClient } from '@/lib/api/orion-client';
import type { Location } from '@/types/orion';
import LocationList from '@/components/explore/LocationList';
import MapView from '@/components/explore/MapView';

export default function AQIStationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await orionClient.getLocations({ limit: 100 });
      setLocations(response.results);
      setFilteredLocations(response.results);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(location => {
      const countryStr = typeof location.country === 'string'
        ? location.country
        : location.country?.name || '';
      return (
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.locality?.toLowerCase().includes(query.toLowerCase()) ||
        countryStr.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredLocations(filtered);
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    // Navigate to location detail page
    window.location.href = `/locations/${location.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e64ab] to-[#33a3a1] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-4">Air Quality Monitoring Stations</h1>
          <p className="text-lg text-white/90">
            Explore real-time air quality data from monitoring stations across Vietnam
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location name, city, or country..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33a3a1] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'list'
                    ? 'bg-[#33a3a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <List className="h-5 w-5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'map'
                    ? 'bg-[#33a3a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <MapIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#33a3a1] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading stations...</p>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <LocationList locations={filteredLocations} onLocationClick={handleLocationClick} />
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
            <MapView locations={filteredLocations} onLocationClick={handleLocationClick} />
          </div>
        )}
      </div>
    </div>
  );
}

