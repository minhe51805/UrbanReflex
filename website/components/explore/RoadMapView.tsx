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

import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';

interface RoadSegment {
  id: string;
  type: string;
  dataProvider: string;
  dateCreated: string;
  name: string;
  roadType: string;
  length: number;
  laneCount?: number;
  surface?: string;
  oneway?: boolean;
  maximumAllowedSpeed?: string;
  source?: string;
  location: {
    type: 'LineString';
    coordinates: number[][];
  };
  [key: string]: any; // Allow additional fields from API
}

interface RoadMapViewProps {
  roadSegments: RoadSegment[];
  onRoadClick?: (road: RoadSegment) => void;
}

export interface RoadMapViewRef {
  zoomToRoad: (road: RoadSegment) => void;
}

const RoadMapView = memo(forwardRef<RoadMapViewRef, RoadMapViewProps>(function RoadMapView({
  roadSegments,
  onRoadClick,
}, ref) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const roadMarkersRef = useRef<maplibregl.Marker[]>([]);
  const clickHandlerRef = useRef<((e: any) => void) | null>(null);
  const mouseEnterHandlerRef = useRef<(() => void) | null>(null);
  const mouseLeaveHandlerRef = useRef<(() => void) | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredRoad, setHoveredRoad] = useState<RoadSegment | null>(null);

  // Expose zoomToRoad function via ref
  useImperativeHandle(ref, () => ({
    zoomToRoad: (road: RoadSegment) => {
      if (!map.current || !road.location.coordinates.length) return;

      // Calculate bounds for the road coordinates
      const coordinates = road.location.coordinates;
      const bounds = new maplibregl.LngLatBounds();

      coordinates.forEach(coord => {
        bounds.extend([coord[0], coord[1]]);
      });

      // Zoom to the road with padding
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 16,
        duration: 1000
      });
    }
  }), []);

  // Vietnam center coordinates
  const vietnamCenter: [number, number] = [106.6297, 10.8231]; // Ho Chi Minh City
  const vietnamZoom = 10;

  // Memoize onRoadClick to keep dependency stable
  const stableOnRoadClick = useCallback(onRoadClick || (() => { }), [onRoadClick]);

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
      center: vietnamCenter,
      zoom: vietnamZoom,
      maxZoom: 18,
      minZoom: 6,
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
    if (!map.current || !mapLoaded || !roadSegments.length) return;

    // Remove existing road layers
    if (map.current.getLayer('roads')) {
      map.current.removeLayer('roads');
    }
    if (map.current.getSource('roads')) {
      map.current.removeSource('roads');
    }

    // Create GeoJSON from road segments
    const geojson = {
      type: 'FeatureCollection' as const,
      features: roadSegments.map((road) => ({
        type: 'Feature' as const,
        properties: {
          id: road.id,
          name: road.name,
          roadType: road.roadType,
          length: road.length,
          laneCount: road.laneCount,
          surface: road.surface,
          oneway: road.oneway,
          maximumAllowedSpeed: road.maximumAllowedSpeed,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: road.location.coordinates,
        },
      })),
    };

    // Add source
    map.current.addSource('roads', {
      type: 'geojson',
      data: geojson,
    });

    // Add road lines layer
    map.current.addLayer({
      id: 'roads',
      type: 'line',
      source: 'roads',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': [
          'match',
          ['get', 'roadType'],
          'primary', '#dc2626',
          'secondary', '#ea580c',
          'tertiary', '#ca8a04',
          'residential', '#2563eb',
          '#6b7280'
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 1,
          12, 2,
          16, 4
        ],
        'line-opacity': 0.8,
      },
    });

    // Add markers for each road at their midpoint
    // Clean up old markers first
    roadMarkersRef.current.forEach(m => m.remove());
    roadMarkersRef.current = [];

    roadSegments.forEach((road) => {
      const coords = road.location.coordinates;
      if (!coords.length) return;

      // Get midpoint
      const midIndex = Math.floor(coords.length / 2);
      const [lng, lat] = coords[midIndex];

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'road-list-marker';
      markerEl.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${getMarkerColor(road.roadType)}" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `;
      markerEl.style.cursor = 'pointer';
      markerEl.addEventListener('click', () => {
        if (onRoadClick) {
          onRoadClick(road);
        }
      });

      const m = new maplibregl.Marker({ element: markerEl })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      roadMarkersRef.current.push(m);
    });

    // Add click handler (store reference for cleanup)
    const handleRoadClick = (e: any) => {
      console.log('🖱️ Road clicked:', e);
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const roadId = feature.properties?.id;
        console.log('📍 Road ID:', roadId, 'onRoadClick:', typeof stableOnRoadClick);
        const road = roadSegments.find(r => r.id === roadId);
        console.log('🛣️ Found road:', road);
        if (road && stableOnRoadClick) {
          // Get the middle point of the road for popup placement
          const coords = road.location.coordinates;
          const midIndex = Math.floor(coords.length / 2);
          const [lng, lat] = coords[midIndex];

          // Create popup content
          const popupContent = `
            <div style="padding: 8px; background: white; border-radius: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${road.name || 'Unnamed'}</div>
              <div style="font-size: 12px; color: #666; margin-bottom: 2px;">
                <span style="display: inline-block; background: #e0f2fe; color: #0c4a6e; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">
                  ${road.roadType}
                </span>
              </div>
              <div style="font-size: 12px; color: #666;">
                📏 ${road.length.toFixed(0)}m
                ${road.laneCount ? ` • 🛣️ ${road.laneCount} lanes` : ''}
                ${road.surface ? ` • 🏔️ ${road.surface}` : ''}
              </div>
            </div>
          `;

          // Close previous popup if exists
          if (popup.current) {
            popup.current.remove();
          }

          // Remove previous marker if exists
          if (marker.current) {
            marker.current.remove();
          }

          // Create marker element (pin icon like Google Maps)
          const markerEl = document.createElement('div');
          markerEl.className = 'road-marker';
          markerEl.innerHTML = `
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C12.27 0 6 6.27 6 14c0 9 14 35 14 35s14-26 14-35c0-7.73-6.27-14-14-14z"
                    fill="#3b82f6"
                    stroke="white"
                    stroke-width="2"/>
              <circle cx="20" cy="14" r="5" fill="white"/>
            </svg>
          `;
          markerEl.style.cssText = `
            cursor: pointer;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          `;

          // Add new marker
          if (map.current) {
            console.log('🎯 Adding marker at:', [lng, lat]);
            marker.current = new maplibregl.Marker({ element: markerEl })
              .setLngLat([lng, lat])
              .addTo(map.current);

            console.log('✅ Marker added:', marker.current);

            // Create and show new popup (có nút X để tắt)
            popup.current = new maplibregl.Popup({
              offset: 25,
              closeButton: true,
              className: 'road-popup',
            })
              .setLngLat([lng, lat])
              .setHTML(popupContent)
              .addTo(map.current);

            console.log('✅ Popup added');
          } else {
            console.error('❌ map.current is null!');
          }

          console.log('📢 Calling stableOnRoadClick');
          stableOnRoadClick(road);
        }
      }
    };

    clickHandlerRef.current = handleRoadClick;
    map.current.on('click', 'roads', handleRoadClick);

    // Change cursor on hover
    const handleMouseEnter = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    };

    const handleMouseLeave = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    };

    mouseEnterHandlerRef.current = handleMouseEnter;
    mouseLeaveHandlerRef.current = handleMouseLeave;

    map.current.on('mouseenter', 'roads', handleMouseEnter);
    map.current.on('mouseleave', 'roads', handleMouseLeave);

    // Cleanup on unmount or dependency change
    return () => {
      // Remove event listeners using stored references
      if (map.current) {
        if (clickHandlerRef.current) {
          map.current.off('click', 'roads', clickHandlerRef.current);
        }
        if (mouseEnterHandlerRef.current) {
          map.current.off('mouseenter', 'roads', mouseEnterHandlerRef.current);
        }
        if (mouseLeaveHandlerRef.current) {
          map.current.off('mouseleave', 'roads', mouseLeaveHandlerRef.current);
        }
      }

      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (popup.current) {
        popup.current.remove();
        popup.current = null;
      }

      // Clean up road markers
      roadMarkersRef.current.forEach(m => m.remove());
      roadMarkersRef.current = [];
    };
  }, [roadSegments, mapLoaded, stableOnRoadClick]);

  // Helper function to get marker color based on road type
  const getMarkerColor = (roadType: string): string => {
    switch (roadType) {
      case 'primary':
        return '#dc2626';
      case 'secondary':
        return '#ea580c';
      case 'tertiary':
        return '#ca8a04';
      case 'residential':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="relative w-full h-full">
      <style>{`
        .road-marker {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: 40px;
          height: 50px;
          cursor: pointer;
          z-index: 1000;
        }

        .road-marker svg {
          width: 100%;
          height: 100%;
        }

        .road-list-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          cursor: pointer;
          z-index: 10;
          transition: transform 0.2s ease;
        }

        .road-list-marker:hover {
          transform: scale(1.2);
        }

        .road-list-marker svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .road-popup .maplibregl-popup-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 0 !important;
        }
        .road-popup .maplibregl-popup-tip {
          border-top-color: white;
          border-left-color: transparent;
          border-right-color: transparent;
        }
      `}</style>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading Vietnam road map...</p>
          </div>
        </div>
      )}
    </div>
  );
}));

export default RoadMapView;
