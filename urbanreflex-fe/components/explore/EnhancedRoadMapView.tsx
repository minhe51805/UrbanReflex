/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Description: Enhanced map with all data layers and location clustering
 */

'use client';

import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Route as RouteIcon, Lightbulb, Landmark, AlertTriangle } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import Supercluster from 'supercluster';

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
  location: { type: 'LineString'; coordinates: number[][]; };
  [key: string]: any;
}

interface Streetlight {
  id: string;
  state: string;
  location: { type: 'Point'; coordinates: number[]; };
}

interface CitizenReport {
  id: string;
  category: string;
  description: string;
  location: { type: 'Point'; coordinates: number[]; };
  dateCreated: string;
}

interface POI {
  id: string;
  name: string;
  category: string;
  location: { type: 'Point'; coordinates: number[]; };
}

interface EnhancedRoadMapViewProps {
  roadSegments: RoadSegment[];
  onRoadClick?: (road: RoadSegment) => void;
  highlightLocation?: [number, number] | null;
  highlightLabel?: string;
}

export interface EnhancedRoadMapViewRef {
  zoomToRoad: (road: RoadSegment) => void;
}

const EnhancedRoadMapView = memo(forwardRef<EnhancedRoadMapViewRef, EnhancedRoadMapViewProps>(function EnhancedRoadMapView({
  roadSegments,
  onRoadClick,
  highlightLocation,
  highlightLabel,
}, ref) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [streetlights, setStreetlights] = useState<Streetlight[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentZoom, setCurrentZoom] = useState(10);
  const userLocationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const roadMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const legendItems = useMemo(() => ([
    { label: 'Road Segments', icon: RouteIcon, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Streetlights', icon: Lightbulb, bg: 'bg-amber-50', color: 'text-amber-500' },
    { label: 'Citizen Reports', icon: AlertTriangle, bg: 'bg-rose-50', color: 'text-rose-500' },
    { label: 'Points of Interest', icon: Landmark, bg: 'bg-purple-50', color: 'text-purple-600' },
  ]), []);
  const highlightMarkerRef = useRef<maplibregl.Marker | null>(null);
  // Highlight selected road location
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }

    if (highlightLocation) {
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.position = 'relative';
      el.style.cursor = 'pointer';
      el.style.zIndex = '1000';
      el.innerHTML = `
        <div style="
          position:absolute;
          bottom:-2px;
          left:50%;
          transform:translateX(-50%);
          width:22px;
          height:8px;
          background:rgba(0,0,0,0.2);
          border-radius:50%;
          filter:blur(2px);
        "></div>
        <div style="
          position:absolute;
          top:0;
          left:50%;
          transform:translateX(-50%) rotate(-45deg);
          width:32px;
          height:32px;
          background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);
          border-radius:50% 50% 50% 0;
          border:3px solid white;
          box-shadow:0 8px 20px rgba(220,38,38,0.4);
        ">
          <div style="
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%) rotate(45deg);
            font-size:13px;
            color:white;
            font-weight:700;
          ">📍</div>
        </div>
      `;

      highlightMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(highlightLocation)
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div style="padding:10px;">
              <div style="font-weight:600; color:#111827;">${highlightLabel || 'Selected Road'}</div>
              <div style="font-size:12px; color:#6b7280;">${highlightLocation[1].toFixed(4)}, ${highlightLocation[0].toFixed(4)}</div>
            </div>
          `)
        )
        .addTo(map.current);
    }
  }, [highlightLocation, highlightLabel, mapLoaded]);

  // Helper: Convert LineString to Polygon (buffer effect)
  const lineToPolygon = (coordinates: number[][], widthInMeters: number = 5): number[][] => {
    if (coordinates.length < 2) return [];

    const offsetPoints = (coords: number[][], offset: number): number[][] => {
      const result: number[][] = [];
      for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len * offset;
        const perpY = dx / len * offset;
        result.push([x1 + perpX, y1 + perpY]);
      }
      const last = coords[coords.length - 1];
      const prev = coords[coords.length - 2];
      const dx = last[0] - prev[0];
      const dy = last[1] - prev[1];
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = -dy / len * offset;
      const perpY = dx / len * offset;
      result.push([last[0] + perpX, last[1] + perpY]);
      return result;
    };

    const offsetDegrees = widthInMeters / 111320; // rough conversion
    const leftSide = offsetPoints(coordinates, offsetDegrees);
    const rightSide = offsetPoints(coordinates, -offsetDegrees).reverse();

    return [...leftSide, ...rightSide, leftSide[0]];
  };

  useImperativeHandle(ref, () => ({
    zoomToRoad: (road: RoadSegment) => {
      if (!map.current || !road.location.coordinates.length) return;
      const coordinates = road.location.coordinates;
      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend([coord[0], coord[1]]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 16, duration: 1000 });
    }
  }), []);

  const vietnamCenter: [number, number] = [106.6297, 10.8231];
  const vietnamZoom = 10;


  // Get user's current location
  // Temporarily disable geolocation to prevent map jumping
  useEffect(() => {
    // Set to Ho Chi Minh City center
    setUserLocation([106.6297, 10.8231]);
  }, []);

  // Fetch all data layers
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [lightsRes, reportsRes, poisRes, weatherRes] = await Promise.all([
          fetch('/api/ngsi-ld?type=Streetlight&options=keyValues'),
          fetch('/api/ngsi-ld?type=CitizenReport&options=keyValues'),
          fetch('/api/ngsi-ld?type=PointOfInterest&options=keyValues'),
          fetch('/api/ngsi-ld?type=WeatherObserved&options=keyValues&limit=1'),
        ]);

        const lightsData = await lightsRes.json();
        if (Array.isArray(lightsData)) setStreetlights(lightsData);

        const reportsData = await reportsRes.json();
        if (Array.isArray(reportsData)) setReports(reportsData);

        const poisData = await poisRes.json();
        if (Array.isArray(poisData)) setPois(poisData);

        const weatherDataRes = await weatherRes.json();
        if (Array.isArray(weatherDataRes) && weatherDataRes.length > 0) {
          setWeatherData(weatherDataRes[0]);
        }
      } catch (error) {
        console.error('Error fetching data layers:', error);
      }
    };

    fetchAllData();
  }, []);

  // Initialize map
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
              '/api/tiles/{z}/{x}/{y}',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }],
      },
      center: vietnamCenter,
      zoom: vietnamZoom,
    });

    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.current.on('load', () => setMapLoaded(true));

    // Track zoom level for clustering
    map.current.on('zoom', () => {
      setCurrentZoom(map.current?.getZoom() || 10);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Initialize Supercluster for Road markers (like diemcuutro.com)
  const roadCluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 100,        // Clustering radius
      maxZoom: 15,        // Cluster up to zoom 15
      minZoom: 0,
      minPoints: 2,       // Minimum 2 points to form a cluster
    });

    // Convert roads to points (use center point of each road)
    const features = roadSegments
      .filter(road => road.location?.coordinates && road.location.coordinates.length > 0)
      .map((road) => {
        // Get center point of the road
        const coords = road.location.coordinates;
        const centerIndex = Math.floor(coords.length / 2);
        const [lng, lat] = coords[centerIndex];

        return {
          type: 'Feature' as const,
          properties: {
            cluster: false,
            roadId: road.id,
            road: road,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [lng, lat],
          },
        };
      });

    if (features.length > 0) {
      cluster.load(features);
    }

    return cluster;
  }, [roadSegments]);

  // Render road markers with clustering (like diemcuutro.com)
  useEffect(() => {
    if (!map.current || !mapLoaded || !roadSegments.length) return;

    const updateMarkers = () => {
      if (!map.current) return;

      // Clear existing road markers
      roadMarkersRef.current.forEach(marker => marker.remove());
      roadMarkersRef.current = [];

      const bounds = map.current.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      const zoom = map.current.getZoom();
      // Get clusters from supercluster
      const clusters = roadCluster.getClusters(bbox, Math.floor(zoom));

    clusters.forEach((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = cluster.properties;

      if (isCluster) {
        // Create cluster marker (like diemcuutro.com - circular with number)
        const el = document.createElement('div');
        
        // Calculate size and color based on point count (like diemcuutro.com)
        let size = 40;
        let bgColor = '#f59e0b'; // Yellow/Orange

        if (pointCount > 10) {
          size = 50;
          bgColor = '#ea580c'; // Orange
        }
        if (pointCount > 30) {
          size = 60;
          bgColor = '#d97706'; // Darker orange
        }
        if (pointCount > 50) {
          size = 70;
          bgColor = '#b45309'; // Brown
        }
        if (pointCount > 100) {
          size = 80;
          bgColor = '#92400e'; // Dark brown
        }

        el.style.position = 'relative';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.cursor = 'pointer';

        // Create cluster marker like diemcuutro.com
        el.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${bgColor}33;
            border-radius: 50%;
            transform: scale(1.3);
          "></div>
          <div class="road-cluster-inner" style="
            position: relative;
            width: 100%;
            height: 100%;
            background: ${bgColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size > 50 ? '18px' : '16px'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 3px solid white;
            transition: all 0.2s ease;
          ">
            ${pointCount}
          </div>
        `;

        // Hover effects
        el.addEventListener('mouseenter', () => {
          const innerDiv = el.querySelector('.road-cluster-inner') as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = 'scale(1.15)';
            innerDiv.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }
        });

        el.addEventListener('mouseleave', () => {
          const innerDiv = el.querySelector('.road-cluster-inner') as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = 'scale(1)';
            innerDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);

        roadMarkersRef.current.push(marker);

        // Zoom in on cluster click
        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            roadCluster.getClusterExpansionZoom(cluster.id as number),
            18
          );
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: expansionZoom,
            duration: 1000,
          });
        });

      } else {
        // Create individual road marker (pin style like diemcuutro.com)
        const road = cluster.properties.road as RoadSegment;
        const el = document.createElement('div');
        el.style.position = 'relative';
        el.style.width = '32px';
        el.style.height = '40px';
        el.style.cursor = 'pointer';

        // Create pin marker like diemcuutro.com
        el.innerHTML = `
          <div style="
            position: relative;
            width: 100%;
            height: 100%;
          ">
            <!-- Pin shadow -->
            <div style="
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 16px;
              height: 6px;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 50%;
              filter: blur(2px);
            "></div>

            <!-- Pin body -->
            <div style="
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              border-radius: 50% 50% 50% 0;
              transform: translateX(-50%) rotate(-45deg);
              box-shadow: 0 3px 10px rgba(59, 130, 246, 0.4);
              border: 2px solid white;
            ">
              <!-- Road icon -->
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
                font-size: 14px;
                line-height: 1;
              ">🛣️</div>
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          if (onRoadClick) {
            onRoadClick(road);
          }
        });

        // Add popup on hover
        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15,
        });

        el.addEventListener('mouseenter', () => {
          popup
            .setLngLat([longitude, latitude])
            .setHTML(`
              <div style="padding: 10px; min-width: 200px;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #1f2937;">
                  ${road.name || 'Unnamed Road'}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
                  ${road.roadType || 'unknown'} road
                </div>
                <div style="font-size: 11px; color: #6b7280;">
                  ${road.length ? `${road.length.toFixed(0)}m` : ''}
                </div>
              </div>
            `)
            .addTo(map.current!);
        });

        el.addEventListener('mouseleave', () => {
          popup.remove();
        });

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom'
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);

        roadMarkersRef.current.push(marker);
      }
    });
    };

    // Initial update
    updateMarkers();

    // Throttle function for smooth updates during zoom/move
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    
    const throttledUpdate = () => {
      if (throttleTimer) return;
      
      // Use requestAnimationFrame for smoother updates
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateMarkers();
        setCurrentZoom(map.current?.getZoom() || 10);
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 16); // ~60fps
      });
    };

    // Listen to zoom and move events for real-time updates
    map.current.on('zoom', throttledUpdate);
    map.current.on('move', throttledUpdate);
    map.current.on('zoomend', updateMarkers);
    map.current.on('moveend', updateMarkers);

    return () => {
      if (throttleTimer) {
        clearTimeout(throttleTimer);
        throttleTimer = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (map.current) {
        map.current.off('zoom', throttledUpdate);
        map.current.off('move', throttledUpdate);
        map.current.off('zoomend', updateMarkers);
        map.current.off('moveend', updateMarkers);
      }
      roadMarkersRef.current.forEach(marker => marker.remove());
      roadMarkersRef.current = [];
    };
  }, [roadSegments, mapLoaded, roadCluster, onRoadClick]);


  // Toggle 3D mode
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const has3DLayer = map.current.getLayer('roads-3d-extrusion');
    const has2DLayer = map.current.getLayer('roads-3d');

    if (has3DLayer && has2DLayer) {
      map.current.setLayoutProperty('roads-3d-extrusion', 'visibility', is3DMode ? 'visible' : 'none');
      map.current.setLayoutProperty('roads-3d', 'visibility', is3DMode ? 'none' : 'visible');
      map.current.setLayoutProperty('roads-3d-outline', 'visibility', is3DMode ? 'none' : 'visible');

      // Animate camera
      map.current.easeTo({
        pitch: is3DMode ? 60 : 0,
        bearing: is3DMode ? 30 : 0,
        duration: 1000,
      });
    }
  }, [is3DMode, mapLoaded]);

  // Add Streetlights markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !streetlights.length) return;
    const markers: maplibregl.Marker[] = [];

    streetlights.forEach((light) => {
      if (!light.location?.coordinates) return;
      const [lng, lat] = light.location.coordinates;
      const isOn = light.state === 'on';
      const el = document.createElement('div');
      el.innerHTML = `<div style="font-size: 20px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${isOn ? '💡' : '🔦'}</div>`;
      el.addEventListener('click', () => {
        new maplibregl.Popup({ offset: 15 }).setLngLat([lng, lat]).setHTML(`<div style="padding: 8px;"><div style="font-weight: bold; font-size: 12px;">${isOn ? '💡 Light ON' : '🔦 Light OFF'}</div></div>`).addTo(map.current!);
      });
      const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current!);
      markers.push(marker);
    });

    return () => markers.forEach(m => m.remove());
  }, [streetlights, mapLoaded]);

  // Add Citizen Reports markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !reports.length) return;
    const markers: maplibregl.Marker[] = [];

    reports.forEach((report) => {
      if (!report.location?.coordinates) return;
      const [lng, lat] = report.location.coordinates;
      const el = document.createElement('div');
      el.innerHTML = `<div style="background: #ef4444; color: white; padding: 8px; border-radius: 50%; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">📍</div>`;
      el.addEventListener('click', () => {
        new maplibregl.Popup({ offset: 20 }).setLngLat([lng, lat]).setHTML(`<div style="padding: 12px;"><h3 style="font-weight: bold; margin-bottom: 8px;">${report.category}</h3><div style="font-size: 12px; color: #666;">${report.description}</div></div>`).addTo(map.current!);
      });
      const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current!);
      markers.push(marker);
    });

    return () => markers.forEach(m => m.remove());
  }, [reports, mapLoaded]);

  // Add POIs markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !pois.length) return;
    const markers: maplibregl.Marker[] = [];

    pois.forEach((poi) => {
      if (!poi.location?.coordinates) return;
      const [lng, lat] = poi.location.coordinates;
      const el = document.createElement('div');
      el.innerHTML = `<div style="background: #8b5cf6; color: white; padding: 6px 10px; border-radius: 16px; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; white-space: nowrap;">🏥 ${poi.name}</div>`;
      el.addEventListener('click', () => {
        new maplibregl.Popup({ offset: 15 }).setLngLat([lng, lat]).setHTML(`<div style="padding: 12px;"><h3 style="font-weight: bold; margin-bottom: 8px;">🏥 ${poi.name}</h3><div style="font-size: 12px; color: #666;"><div><strong>Category:</strong> ${poi.category}</div></div></div>`).addTo(map.current!);
      });
      const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current!);
      markers.push(marker);
    });

    return () => markers.forEach(m => m.remove());
  }, [pois, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Weather Info Card */}
      {weatherData && (
        <div className="absolute top-4 right-12 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs pointer-events-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">☁️</div>
            <div>
              <div className="font-bold text-lg">{weatherData.temperature}°C</div>
              <div className="text-xs text-gray-500">{weatherData.weatherDescription || 'Weather'}</div>
            </div>
          </div>
        </div>
      )}


      {/* Map Legend - UrbanReflex */}
      {isLegendCollapsed ? (
        <button
          onClick={() => setIsLegendCollapsed(false)}
          className="absolute bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-4 py-2 pointer-events-auto text-xs font-semibold text-gray-700 hover:bg-white"
        >
          🗺️ Map Legend
        </button>
      ) : (
        <div className="absolute bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 pointer-events-auto min-w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <span className="text-base">🗺️</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900">Map Legend</h3>
            </div>
            <button
              onClick={() => setIsLegendCollapsed(true)}
              className="p-1 text-gray-500 hover:text-gray-800"
              aria-label="Collapse legend"
            >
              ×
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-gray-700 font-medium">{item.label}</span>
              </div>
            ))}
            
            {/* 3D Roads (conditional) */}
            {is3DMode && (
              <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200">
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50">
                  <span className="text-lg">🏗️</span>
                </div>
                <span className="text-gray-700 font-medium">3D Roads (AQI colored)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading enhanced map...</p>
          </div>
        </div>
      )}
    </div>
  );
}));

export default EnhancedRoadMapView;

