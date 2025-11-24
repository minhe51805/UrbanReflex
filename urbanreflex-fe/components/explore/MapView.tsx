/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Interactive fullscreen map view component using MapLibre GL for displaying air quality monitoring locations with markers and popups
 */

'use client';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import type { Location } from '@/types/openaq';

interface MapViewProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  center?: [number, number];
  zoom?: number;
}

const MapView = memo(function MapView({
  locations,
  onLocationClick,
  center = [0, 20],
  zoom = 2,
}: MapViewProps) {
  const stableOnLocationClick = useCallback(onLocationClick || (() => {}), [onLocationClick]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center,
      zoom,
      maxZoom: 18,
      minZoom: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({ center, zoom, duration: 1500 });
    }
  }, [center, zoom, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !locations.length) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    locations.forEach((location) => {
      if (!location.coordinates) return;

      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      const markerColor = location.isMonitor ? '#3b82f6' : '#10b981';
      el.style.backgroundColor = markerColor;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s ease';

      el.addEventListener('mouseenter', () => {
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.zIndex = '1';
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);

      el.addEventListener('click', () => {
        stableOnLocationClick(location);
      });

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: 'location-popup',
      });

      el.addEventListener('mouseenter', () => {
        const sensorCount = location.sensors?.length || 0;
        const locationTypeLabel = location.isMonitor ? 'Reference Monitor' : 'Air Sensor';

        popup
          .setLngLat([location.coordinates!.longitude, location.coordinates!.latitude])
          .setHTML(`
            <div style="padding: 10px; min-width: 200px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #1f2937;">
                ${location.name}
              </div>
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
                ${location.locality ? location.locality + ', ' : ''}${location.country?.name || 'Unknown'}
              </div>
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                <span style="background-color: ${markerColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                  ${locationTypeLabel}
                </span>
                ${sensorCount > 0 ? `<span style="color: #6b7280; font-size: 11px;">${sensorCount} sensors</span>` : ''}
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });
  }, [locations, mapLoaded, stableOnLocationClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default MapView;

