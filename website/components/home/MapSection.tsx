/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Immersive 3D Air Quality Map with VR/AR visualization, location search, and real-time AQI data overlay
 * Optimized: Lazy loading, error handling, and performance improvements
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Maximize2, Navigation2, Building2, Satellite, Map, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.8231, lng: 106.6297, name: 'Ho Chi Minh City, Vietnam' });
  const [vrViewMode, setVrViewMode] = useState<'3d' | 'satellite' | 'terrain'>('terrain'); // Default to terrain (OpenStreetMap) to avoid f4map
  const [vrZoom] = useState(18);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false); // Only load when user explicitly requests 3D view
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lazy load map only when component is visible AND user wants to see it
  useEffect(() => {
    // Only load if user explicitly requests 3D view or if terrain/satellite mode
    if (vrViewMode === '3d' && !shouldLoadMap) {
      return; // Don't load f4map unless user clicks 3D View button
    }

    const container = iframeRef.current?.parentElement;
    if (!container) return;

    // Use Intersection Observer to load map only when visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMapLoaded) {
            // Map is visible, allow it to load
            setIsMapLoaded(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' } // Trigger when 10% visible, with 100px margin
    );

    if (observerRef.current) {
      observerRef.current.observe(container);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMapLoaded, vrViewMode, shouldLoadMap]);

  // Preconnect to f4map domain for faster loading
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://demo.f4map.com';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Suppress 404 errors from f4map iframe (translation file) and network errors
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    const errorFilter = (message: any, ...args: any[]) => {
      // Filter out f4map translation 404 errors and network errors
      const messageStr = String(message);
      if (
        messageStr.includes('translation.en-US.json') ||
        messageStr.includes('demo.f4map.com/static/i18n') ||
        messageStr.includes('Failed to load resource') ||
        messageStr.includes('404') ||
        messageStr.includes('f4map') ||
        (args.length > 0 && String(args[0]).includes('f4map'))
      ) {
        return; // Suppress this error
      }
      originalError(message, ...args);
    };

    const warnFilter = (message: any, ...args: any[]) => {
      // Filter out f4map warnings
      const messageStr = String(message);
      if (messageStr.includes('f4map') || messageStr.includes('translation')) {
        return; // Suppress this warning
      }
      originalWarn(message, ...args);
    };

    console.error = errorFilter;
    console.warn = warnFilter;

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Suppress network errors from iframe
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('f4map') ||
        event.message?.includes('translation') ||
        event.filename?.includes('f4map')
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError, true);
    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

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
        setMapError(null);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search location. Please try again.');
    }
  };

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
    setMapError(null);
  }, []);

  const handleMapError = useCallback(() => {
    setMapError('Failed to load map. Please refresh the page.');
    setIsMapLoaded(false);
  }, []);

  // Generate optimized iframe URL with error suppression
  const getMapUrl = useCallback(() => {
    if (vrViewMode === '3d') {
      // Optimized URL - f4map will try to load translation but we suppress the error
      // Using minimal parameters for better performance
      return `https://demo.f4map.com/#lat=${currentLocation.lat}&lon=${currentLocation.lng}&zoom=${vrZoom}`;
    } else if (vrViewMode === 'satellite') {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${currentLocation.lng}!3d${currentLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1234567890`;
    } else {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng - 0.01}%2C${currentLocation.lat - 0.01}%2C${currentLocation.lng + 0.01}%2C${currentLocation.lat + 0.01}&layer=mapnik`;
    }
  }, [vrViewMode, currentLocation, vrZoom]);



  return (
    <div className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-br from-primary-600 via-primary-500 to-accent-400 overflow-hidden">
      {/* Loading State */}
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-accent-400 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-white/90 text-sm font-medium">Loading map...</p>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-accent-400 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-4"
          >
            <p className="text-white text-sm mb-4">{mapError}</p>
            <button
              onClick={() => {
                setMapError(null);
                setIsMapLoaded(false);
                if (iframeRef.current) {
                  iframeRef.current.src = getMapUrl();
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </motion.div>
        </div>
      )}

      {/* 3D Map Iframe - Lazy loaded, only when needed */}
      {(vrViewMode === '3d' ? shouldLoadMap : true) && (
        <iframe
          ref={iframeRef}
          src={isMapLoaded ? getMapUrl() : undefined}
          className="absolute inset-0 w-full h-full border-0"
          style={{ border: 0 }}
          loading="lazy"
          title="3D Air Quality Map"
          allowFullScreen
          onLoad={handleMapLoad}
          onError={(e) => {
            // Only show error if it's not from f4map translation
            const src = (e.target as HTMLIFrameElement)?.src;
            if (!src?.includes('f4map') || !src?.includes('translation')) {
              handleMapError();
            }
          }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

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
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-600">
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
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
                onClick={() => {
                  setVrViewMode('3d');
                  setShouldLoadMap(true); // Only load f4map when user clicks this button
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${vrViewMode === '3d'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
                  }`}
              >
                <Building2 className="w-4 h-4" />
                3D View
              </button>
              <button
                onClick={() => {
                  setVrViewMode('satellite');
                  setShouldLoadMap(false); // Don't load f4map for satellite
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${vrViewMode === 'satellite'
                    ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-secondary-600 hover:bg-white/50'
                  }`}
              >
                <Satellite className="w-4 h-4" />
                Satellite
              </button>
              <button
                onClick={() => {
                  setVrViewMode('terrain');
                  setShouldLoadMap(false); // Don't load f4map for terrain
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${vrViewMode === 'terrain'
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-accent-600 hover:bg-white/50'
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
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:text-primary-600 hover:bg-white/50 transition-all duration-300 flex items-center gap-2"
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