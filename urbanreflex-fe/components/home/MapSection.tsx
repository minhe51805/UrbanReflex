/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Immersive 3D Air Quality Map with VR/AR visualization, location search, and real-time AQI data overlay
 */

'use client';

import { useState } from 'react';
import { Search, MapPin, Maximize2, Navigation2, Building2, Satellite, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' });
  const [vrViewMode, setVrViewMode] = useState<'3d' | 'satellite' | 'terrain'>('3d');
  const [vrZoom] = useState(18);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCurrentLocation({ lat: parseFloat(lat), lng: parseFloat(lon), name: display_name });
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search location. Please try again.');
    }
  };



  return (
    <div className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-br from-[#8f81ee] via-[#1e64ab] to-[#33a3a1] overflow-hidden">
      {/* 3D Map Iframe */}
      <iframe
        src={
          vrViewMode === '3d'
            ? `https://demo.f4map.com/#lat=${currentLocation.lat}&lon=${currentLocation.lng}&zoom=${vrZoom}`
            : vrViewMode === 'satellite'
            ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${currentLocation.lng}!3d${currentLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1234567890`
            : `https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng - 0.01}%2C${currentLocation.lat - 0.01}%2C${currentLocation.lng + 0.01}%2C${currentLocation.lat + 0.01}&layer=mapnik`
        }
        className="absolute inset-0 w-full h-full border-0"
        style={{ border: 0 }}
        loading="lazy"
        title="3D Air Quality Map"
        allowFullScreen
      />

      {/* Cover F4Map's search box - hide it */}
      <div className="absolute top-0 left-0 w-64 h-20 bg-transparent z-[15] pointer-events-none" />

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10 pointer-events-none" />

      {/* Search Bar - Top Center - Hidden in 3D mode */}
      {vrViewMode !== '3d' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[30] w-full max-w-2xl px-4">
          <motion.form
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSearch}
            className="relative"
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/50">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8f81ee]">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location for air quality data..."
                className="w-full pl-14 pr-14 py-4 rounded-full outline-none text-gray-800 placeholder-gray-400 text-base font-medium bg-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#8f81ee] to-[#1e64ab] hover:from-[#6a5cd8] hover:to-[#33a3a1] text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.form>

          {/* Current Location Badge */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 flex items-center justify-center gap-2 text-white/90 text-sm"
          >
            <Navigation2 className="w-4 h-4" />
            <span className="font-medium">{currentLocation.name}</span>
          </motion.div>
        </div>
      )}




      {/* Bottom Control Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[30]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVrViewMode('3d')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  vrViewMode === '3d'
                    ? 'bg-gradient-to-r from-[#8f81ee] to-[#6a5cd8] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#8f81ee] hover:bg-white/50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                3D View
              </button>
              <button
                onClick={() => setVrViewMode('satellite')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  vrViewMode === 'satellite'
                    ? 'bg-gradient-to-r from-[#1e64ab] to-[#33a3a1] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#1e64ab] hover:bg-white/50'
                }`}
              >
                <Satellite className="w-4 h-4" />
                Satellite
              </button>
              <button
                onClick={() => setVrViewMode('terrain')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  vrViewMode === 'terrain'
                    ? 'bg-gradient-to-r from-[#33a3a1] to-[#2a8886] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#33a3a1] hover:bg-white/50'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300/50" />

            {/* Fullscreen */}
            <button
              onClick={() => document.querySelector('iframe')?.requestFullscreen()}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:text-[#1e64ab] hover:bg-white/50 transition-all duration-300 flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </button>
          </div>
        </motion.div>
      </div>



      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />
    </div>
  );
}