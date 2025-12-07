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

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { Measurement as OpenAQMeasurement } from '@/types/openaq';
import type { Measurement as OrionMeasurement } from '@/types/orion';
import { getParameterDisplayName } from '@/lib/utils/format';

type Measurement = OpenAQMeasurement | OrionMeasurement;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MeasurementChartProps {
  measurements: Measurement[];
  parameters: string[];
  selectedParameter: string;
  onParameterChange: (parameter: string) => void;
  loading: boolean;
}

// Helper functions to handle both measurement types
function getParameterName(m: Measurement): string {
  if ('parameter' in m && typeof m.parameter === 'object' && 'name' in m.parameter) {
    return m.parameter.name;
  }
  return '';
}

function getMeasurementDatetime(m: Measurement): Date {
  if ('period' in m) {
    const period = m.period as any;
    if ('datetimeFrom' in period && period.datetimeFrom?.utc) {
      return new Date(period.datetimeFrom.utc);
    }
    if ('datetime' in period) {
      return new Date(period.datetime);
    }
  }
  return new Date();
}

export default function MeasurementChart({
  measurements,
  parameters,
  selectedParameter,
  onParameterChange,
  loading,
}: MeasurementChartProps) {
  const chartData = useMemo(() => {
    const filtered = measurements
      .filter(m => getParameterName(m) === selectedParameter)
      .sort((a, b) => getMeasurementDatetime(a).getTime() - getMeasurementDatetime(b).getTime())
      .slice(-100); // Last 100 measurements

    return {
      labels: filtered.map(m => getMeasurementDatetime(m).toLocaleString()),
      datasets: [
        {
          label: getParameterDisplayName(selectedParameter),
          data: filtered.map(m => m.value),
          borderColor: '#33a3a1',
          backgroundColor: 'rgba(51, 163, 161, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [measurements, selectedParameter]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: measurements.find(m => m.parameter.name === selectedParameter)?.parameter.units || '',
        },
      },
      x: {
        display: false, // Hide x-axis labels for cleaner look
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#33a3a1]"></div>
        <p className="mt-4 text-gray-600">Loading measurements...</p>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">No measurement data available for this location.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Measurements</h2>

        {/* Parameter Selector */}
        <div className="flex flex-wrap gap-2">
          {parameters.map((param) => (
            <button
              key={param}
              onClick={() => onParameterChange(param)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedParameter === param
                  ? 'bg-[#33a3a1] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {getParameterDisplayName(param)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>

      {/* Latest Value */}
      {measurements.filter(m => m.parameter.name === selectedParameter).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Latest Value</p>
              <p className="text-2xl font-bold text-[#1e64ab]">
                {measurements.filter(m => m.parameter.name === selectedParameter)[0]?.value.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {measurements.filter(m => m.parameter.name === selectedParameter)[0]?.parameter.units}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

