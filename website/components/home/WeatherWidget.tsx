/**
 * Weather Widget Component
 * Displays real-time weather data from NGSI-LD WeatherObserved entities
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye } from 'lucide-react';

interface WeatherData {
  id: string;
  location: {
    type: string;
    coordinates: number[];
  };
  dateObserved: string;
  temperature?: number;
  relativeHumidity?: number;
  atmosphericPressure?: number;
  windSpeed?: number;
  windDirection?: number;
  precipitation?: number;
  weatherCondition?: string;
  stationName?: string;
  source?: string;
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/ngsi-ld?type=WeatherObserved&limit=1&orderBy=!dateObserved&options=keyValues');
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          setWeatherData(data[0]);
        } else {
          // Fallback weather data
          setWeatherData({
            id: 'fallback',
            location: { type: 'Point', coordinates: [106.7008, 10.775] },
            dateObserved: new Date().toISOString(),
            temperature: 28 + Math.random() * 4, // 28-32°C
            relativeHumidity: 70 + Math.random() * 20, // 70-90%
            atmosphericPressure: 1010 + Math.random() * 10, // 1010-1020 hPa
            windSpeed: 5 + Math.random() * 10, // 5-15 km/h
            windDirection: Math.random() * 360,
            precipitation: Math.random() * 2, // 0-2mm
            weatherCondition: 'partly-cloudy',
            stationName: 'HCMC Weather Station',
            source: 'Synthetic Data'
          });
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'cloudy':
      case 'overcast':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 text-center">
        <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl shadow-soft p-6 border border-sky-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Weather</h3>
        <div className="text-xs text-gray-500">
          Updated {mounted ? formatTime(weatherData.dateObserved) : '--:--'}
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weatherData.weatherCondition)}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {weatherData.temperature?.toFixed(1) || '--'}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weatherData.weatherCondition?.replace('-', ' ') || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
          <Droplets className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Humidity</div>
            <div className="font-semibold">{weatherData.relativeHumidity?.toFixed(0) || '--'}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
          <Wind className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Wind</div>
            <div className="font-semibold">{weatherData.windSpeed?.toFixed(1) || '--'} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
          <Eye className="h-4 w-4 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Pressure</div>
            <div className="font-semibold">{weatherData.atmosphericPressure?.toFixed(0) || '--'} hPa</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
          <CloudRain className="h-4 w-4 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Rain</div>
            <div className="font-semibold">{weatherData.precipitation?.toFixed(1) || '0.0'} mm</div>
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {weatherData.stationName || 'Weather Station'} • {weatherData.source || 'NGSI-LD'}
      </div>
    </motion.div>
  );
}
