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

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  pollutant: string;
  locationType: string[];
  showNoRecentUpdates: boolean;
  providers: string[];
}

const pollutants = [
  { value: 'any', label: 'Any pollutant' },
  { value: 'pm25', label: 'PM₂.₅' },
  { value: 'pm10', label: 'PM₁₀' },
  { value: 'o3', label: 'O₃' },
  { value: 'no2', label: 'NO₂' },
  { value: 'so2', label: 'SO₂' },
  { value: 'co', label: 'CO' },
];

const locationTypes = [
  { value: 'monitor', label: 'Reference monitor locations' },
  { value: 'sensor', label: 'Air sensors locations' },
];

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    pollutant: 'any',
    locationType: ['monitor', 'sensor'],
    showNoRecentUpdates: false,
    providers: [],
  });

  const [showProviders, setShowProviders] = useState(false);

  const handlePollutantChange = (value: string) => {
    const newFilters = { ...filters, pollutant: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationTypeChange = (value: string) => {
    const newTypes = filters.locationType.includes(value)
      ? filters.locationType.filter(t => t !== value)
      : [...filters.locationType, value];
    const newFilters = { ...filters, locationType: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleShowNoRecentUpdates = (checked: boolean) => {
    const newFilters = { ...filters, showNoRecentUpdates: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Pollutant Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Choose a pollutant
        </label>
        <select
          value={filters.pollutant}
          onChange={(e) => handlePollutantChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
        >
          {pollutants.map((pollutant) => (
            <option key={pollutant.value} value={pollutant.value}>
              {pollutant.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Choose location type
        </label>
        <div className="space-y-3">
          {locationTypes.map((type) => (
            <label key={type.value} className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.locationType.includes(type.value)}
                onChange={() => handleLocationTypeChange(type.value)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Show No Recent Updates */}
      <div className="pt-2 border-t border-gray-200">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.showNoRecentUpdates}
            onChange={(e) => handleShowNoRecentUpdates(e.target.checked)}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
            Show locations with no recent updates
          </span>
        </label>
      </div>

      {/* Data Providers */}
      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={() => setShowProviders(!showProviders)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span>Choose data providers</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showProviders ? 'rotate-180' : ''}`}
          />
        </button>
        {showProviders && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              Showing data from all providers
            </p>
          </div>
        )}
      </div>

      {/* Update Button */}
      <div className="pt-4">
        <button
          onClick={() => onFilterChange(filters)}
          className="w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

