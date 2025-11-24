/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Measurement chart component using Chart.js to visualize air quality measurement trends over time
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
import type { Measurement } from '@/types/openaq';
import { getParameterDisplayName } from '@/lib/utils/format';

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

export default function MeasurementChart({
  measurements,
  parameters,
  selectedParameter,
  onParameterChange,
  loading,
}: MeasurementChartProps) {
  const chartData = useMemo(() => {
    const filtered = measurements
      .filter(m => m.parameter.name === selectedParameter)
      .sort((a, b) => new Date(a.period.datetimeFrom.utc).getTime() - new Date(b.period.datetimeFrom.utc).getTime())
      .slice(-100); // Last 100 measurements

    return {
      labels: filtered.map(m => new Date(m.period.datetimeFrom.utc).toLocaleString()),
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
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedParameter === param
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

