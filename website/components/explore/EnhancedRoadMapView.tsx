/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Description: Simple map with road segments and markers
 */

'use client';

import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Route as RouteIcon, Lightbulb } from 'lucide-react';
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
  location: { type: 'LineString'; coordinates: number[][]; };
  [key: string]: any;
}

export interface ReportMarker {
  id: string;
  title: string;
  status: string;
  coordinates: [number, number];
  description?: string;
  category?: string;
  priority?: string;
}

export interface StreetlightMarker {
  id: string;
  coordinates: [number, number];
  powerState?: string;
  status?: string;
}

interface EnhancedRoadMapViewProps {
  roadSegments: RoadSegment[];
  onRoadClick?: (road: RoadSegment) => void;
  highlightLocation?: [number, number] | null;
  highlightLabel?: string;
  reportMarkers?: ReportMarker[];
  streetlightMarkers?: StreetlightMarker[];
}

export interface EnhancedRoadMapViewRef {
  zoomToRoad: (road: RoadSegment) => void;
}

// Ensure coordinates are always in [lng, lat] order (GeoJSON standard)
// Enhanced validation with Vietnam-specific checks for better accuracy
const normalizeLngLat = (coord: number[]): [number, number] => {
  if (!Array.isArray(coord) || coord.length < 2) {
    return [0, 0];
  }

  let [a, b] = coord;

  // Validate ranges: lng should be -180 to 180, lat should be -90 to 90
  const aIsLng = a >= -180 && a <= 180;
  const aIsLat = a >= -90 && a <= 90;
  const bIsLng = b >= -180 && b <= 180;
  const bIsLat = b >= -90 && b <= 90;

  // Vietnam-specific: lng ~102-110, lat ~8-24
  // This helps identify correct format for Vietnam coordinates
  const isVietnamLng = a >= 102 && a <= 110;
  const isVietnamLat = b >= 8 && b <= 24;
  const isVietnamLngSwapped = b >= 102 && b <= 110;
  const isVietnamLatSwapped = a >= 8 && a <= 24;

  // If both are valid, check which combination makes more sense
  if (aIsLng && bIsLat) {
    // Already [lng, lat] - correct format
    // Prefer Vietnam-specific validation
    if (isVietnamLng && isVietnamLat) {
      return [a, b]; // Confirmed correct for Vietnam
    }
    return [a, b];
  } else if (aIsLat && bIsLng) {
    // [lat, lng] - need to swap
    // Prefer Vietnam-specific validation
    if (isVietnamLatSwapped && isVietnamLngSwapped) {
      return [b, a]; // Confirmed swapped for Vietnam
    }
    return [b, a];
  } else if (aIsLng && bIsLng) {
    // Both are lng - invalid, but assume first is lng, second is lat (edge case)
    return [a, b];
  } else if (aIsLat && bIsLat) {
    // Both are lat - invalid, but assume first is lat, second is lng (edge case)
    return [b, a];
  }

  // Fallback: if |a| <= 90 and |b| > 90, likely [lat, lng]
  if (Math.abs(a) <= 90 && Math.abs(b) > 90) {
    return [b, a];
  }

  // Default: assume already [lng, lat]
  return [a, b];
};

// Optional external style URL (Google Maps–like) - configure via env if desired
// Example (MapTiler Streets, similar to Google Maps):
// NEXT_PUBLIC_MAP_STYLE_URL="https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_KEY"
const MAP_STYLE_URL = process.env.NEXT_PUBLIC_MAP_STYLE_URL;

const normalizeStatusKey = (status: string) =>
  (status || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const EnhancedRoadMapView = memo(forwardRef<EnhancedRoadMapViewRef, EnhancedRoadMapViewProps>(function EnhancedRoadMapView({
  roadSegments,
  onRoadClick,
  highlightLocation,
  highlightLabel,
  reportMarkers = [],
  streetlightMarkers = [],
}, ref) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const highlightMarkerRef = useRef<maplibregl.Marker | null>(null);
  const reportMarkerRefs = useRef<maplibregl.Marker[]>([]);
  const streetlightMarkerRefs = useRef<maplibregl.Marker[]>([]);
  const geoJsonPopupRef = useRef<maplibregl.Popup | null>(null);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  const vietnamCenter: [number, number] = [106.6297, 10.8231];
  const vietnamZoom = 10;

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherRes = await fetch('/api/ngsi-ld?type=WeatherObserved&options=keyValues&limit=1');
        const weatherDataRes = await weatherRes.json();
        if (Array.isArray(weatherDataRes) && weatherDataRes.length > 0) {
          setWeatherData(weatherDataRes[0]);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    fetchWeather();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const baseOptions: maplibregl.MapOptions = {
      container: mapContainer.current,
      center: vietnamCenter,
      zoom: vietnamZoom,
    };

    // If a vector style URL is provided, use it (Google Maps–like look)
    // Otherwise, fall back to our local raster tiles.
    const options: maplibregl.MapOptions = MAP_STYLE_URL
      ? {
          ...baseOptions,
          style: MAP_STYLE_URL,
        }
      : {
          ...baseOptions,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: ['/api/tiles/{z}/{x}/{y}'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
            },
            layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }],
          } as any,
        };

    map.current = new maplibregl.Map(options as any);

    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Handle window resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
      map.current = null;
    };

    // Cleanup report markers
    reportMarkerRefs.current.forEach(marker => marker.remove());
    reportMarkerRefs.current = [];
  }, []);

  // Highlight marker
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

      const popup = new maplibregl.Popup({ 
        offset: [0, -10],
        closeButton: true,      // allow user to close
        closeOnClick: true,     // clicking map will also close
        className: 'highlight-popup'
      }).setHTML(`
        <div style="padding:10px;">
          <div style="font-weight:600; color:#111827;">${highlightLabel || 'Selected Road'}</div>
          <div style="font-size:12px; color:#6b7280;">${highlightLocation[1].toFixed(4)}, ${highlightLocation[0].toFixed(4)}</div>
        </div>
      `);

      highlightMarkerRef.current = new maplibregl.Marker({ 
        element: el, 
        anchor: 'bottom',
        draggable: false
      })
        .setLngLat(highlightLocation)
        .setPopup(popup)
        .addTo(map.current);

      // Khi đóng popup thì remove luôn marker để không còn pin trên map
      popup.on('close', () => {
        if (highlightMarkerRef.current) {
          highlightMarkerRef.current.remove();
          highlightMarkerRef.current = null;
        }
      });
    }
  }, [highlightLocation, highlightLabel, mapLoaded]);

  // Report markers for approved reports (Đang xử lý / Đã giải quyết)
  useEffect(() => {
    // Remove existing report markers
    reportMarkerRefs.current.forEach(marker => marker.remove());
    reportMarkerRefs.current = [];

    if (!map.current || !mapLoaded || !reportMarkers.length) return;

    const resolvedKeys = new Set(['resolved', 'da_giai_quyet', 'hoan_thanh', 'resolved_status']);
    const inProgressKeys = new Set(['in_progress', 'dang_xu_ly', 'processing', 'dieu_tra']);

    const escapeHtml = (value: string | undefined) =>
      (value ?? '')
        .toString()
        .replace(/[&<>"']/g, (char) => {
          switch (char) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case '\'': return '&#39;';
            default: return char;
          }
        });

    reportMarkers.forEach((report) => {
      if (!Array.isArray(report.coordinates) || report.coordinates.length < 2) return;
      const [rawLng, rawLat] = report.coordinates;
      const [lng, lat] = normalizeLngLat([rawLng, rawLat]);

      if (!isFinite(lng) || !isFinite(lat)) return;

      const normalizedStatus = normalizeStatusKey(report.status);
      const isResolved = resolvedKeys.has(normalizedStatus);
      const isInProgress = inProgressKeys.has(normalizedStatus);

      if (!isResolved && !isInProgress) return;

      const color = isResolved ? '#22c55e' : '#f97316';
      const label = isResolved ? 'Đã giải quyết' : 'Đang xử lý';
      const icon = isResolved ? '✔' : '⏳';

      const markerEl = document.createElement('div');
      markerEl.style.width = '30px';
      markerEl.style.height = '30px';
      markerEl.style.position = 'relative';
      markerEl.style.cursor = 'pointer';
      markerEl.innerHTML = `
        <div style="
          position:absolute;
          bottom:-4px;
          left:50%;
          transform:translateX(-50%);
          width:18px;
          height:6px;
          background:rgba(0,0,0,0.25);
          border-radius:50%;
          filter:blur(2px);
        "></div>
        <div style="
          position:absolute;
          top:0;
          left:50%;
          transform:translate(-50%, -20%) rotate(-45deg);
          width:32px;
          height:32px;
          background:${color};
          border-radius:50% 50% 50% 0;
          border:2px solid white;
          box-shadow:0 8px 18px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:700;
          font-size:14px;
        ">
          ${icon}
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: [0, -10],
        closeButton: true,
        closeOnClick: true,
        className: 'report-marker-popup',
      }).setHTML(`
        <div style="min-width:180px; max-width:240px;">
          <div style="font-weight:600; font-size:14px; color:#111827; margin-bottom:4px;">${escapeHtml(report.title)}</div>
          <div style="font-size:12px; color:#374151; margin-bottom:6px;">${escapeHtml(report.description || '')}</div>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:12px; color:#6b7280;">
            <div><strong>Trạng thái:</strong> <span style="color:${color}; font-weight:600;">${label}</span></div>
            ${report.category ? `<div><strong>Loại:</strong> ${escapeHtml(report.category)}</div>` : ''}
            ${report.priority ? `<div><strong>Ưu tiên:</strong> ${escapeHtml(report.priority)}</div>` : ''}
            <div><strong>Vị trí:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: 'bottom',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      reportMarkerRefs.current.push(marker);
    });

    return () => {
      reportMarkerRefs.current.forEach(marker => marker.remove());
      reportMarkerRefs.current = [];
    };
  }, [reportMarkers, mapLoaded]);

  // Streetlight markers - chỉ hiện khi click vào road có streetlights
  useEffect(() => {
    // Remove existing streetlight markers
    streetlightMarkerRefs.current.forEach(marker => marker.remove());
    streetlightMarkerRefs.current = [];

    if (!map.current || !mapLoaded || !streetlightMarkers.length) return;

    streetlightMarkers.forEach((streetlight) => {
      if (!Array.isArray(streetlight.coordinates) || streetlight.coordinates.length < 2) return;
      const [rawLng, rawLat] = streetlight.coordinates;
      const [lng, lat] = normalizeLngLat([rawLng, rawLat]);

      if (!isFinite(lng) || !isFinite(lat)) return;

      const powerState = streetlight.powerState || 'unknown';
      const isOn = powerState.toLowerCase() === 'on';
      const color = isOn ? '#fbbf24' : '#6b7280'; // Yellow for on, gray for off
      const iconColor = isOn ? '#fbbf24' : '#9ca3af';

      const markerEl = document.createElement('div');
      markerEl.style.width = '32px';
      markerEl.style.height = '32px';
      markerEl.style.position = 'relative';
      markerEl.style.cursor = 'pointer';
      markerEl.style.zIndex = '1000';
      markerEl.innerHTML = `
        <div style="
          position:absolute;
          bottom:-4px;
          left:50%;
          transform:translateX(-50%);
          width:20px;
          height:6px;
          background:rgba(0,0,0,0.2);
          border-radius:50%;
          filter:blur(2px);
        "></div>
        <div style="
          position:absolute;
          top:0;
          left:50%;
          transform:translateX(-50%);
          width:32px;
          height:32px;
          background:${color};
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 4px 12px rgba(0,0,0,0.3);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="9" r="1" fill="${iconColor}"/>
          </svg>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: [0, -10],
        closeButton: true,
        closeOnClick: true,
        className: 'streetlight-popup'
      }).setHTML(`
        <div style="padding:8px; min-width:150px;">
          <div style="font-weight:600; color:#111827; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Streetlight
          </div>
          <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">
            <strong>Trạng thái:</strong> <span style="color:${color}; font-weight:600;">${isOn ? 'Bật' : 'Tắt'}</span>
          </div>
          <div style="font-size:11px; color:#9ca3af;">
            ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: 'bottom',
        draggable: false, // Không cho phép di chuyển marker
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      streetlightMarkerRefs.current.push(marker);
    });

    return () => {
      streetlightMarkerRefs.current.forEach(marker => marker.remove());
      streetlightMarkerRefs.current = [];
    };
  }, [streetlightMarkers, mapLoaded]);

  // Zoom to road function
  useImperativeHandle(ref, () => ({
    zoomToRoad: (road: RoadSegment) => {
      if (!map.current || !road.location.coordinates.length) return;
      const bounds = new maplibregl.LngLatBounds();
      road.location.coordinates.forEach(coord => {
        const [lng, lat] = normalizeLngLat(coord);
        bounds.extend([lng, lat]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 16, duration: 1000 });
    }
  }), []);

  // ---------- GeoJSON layer for road nodes (points) ----------

  // Build / update GeoJSON source from roadSegments
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;
    if (!roadSegments.length) {
      const src = mapInstance.getSource('road-points') as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData({
          type: 'FeatureCollection',
          features: [],
        } as any);
      }
      return;
    }

    // Build features for all roads (MapLibre sẽ tự ẩn/hiện theo zoom qua circle-opacity)
    const features = roadSegments
      .map((road) => {
        const coords = road.location?.coordinates;
        if (!coords || !coords.length) return null;

          const midIndex = Math.floor(coords.length / 2);
        const raw = coords[midIndex];
        if (!Array.isArray(raw) || raw.length < 2) return null;

        const [lng, lat] = normalizeLngLat(raw);
          if (
            typeof lng !== 'number' ||
            typeof lat !== 'number' ||
            isNaN(lng) ||
            isNaN(lat) ||
            !isFinite(lng) ||
            !isFinite(lat)
          ) {
          return null;
          }

        return {
          type: 'Feature' as const,
          properties: {
            id: road.id,
            name: road.name,
            roadType: road.roadType,
            length: road.length,
            laneCount: road.laneCount ?? null,
            surface: road.surface ?? null,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [lng, lat],
          },
        };
      })
      .filter(Boolean) as any[];

    const geojson: any = {
      type: 'FeatureCollection',
      features,
    };

    const existingSource = mapInstance.getSource('road-points') as maplibregl.GeoJSONSource | undefined;

    if (existingSource) {
      existingSource.setData(geojson);
    } else {
      // Enable built-in clustering to group nearby roads (roughly by area/district)
      mapInstance.addSource('road-points', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterRadius: 60,   // pixels
        clusterMaxZoom: 14,  // beyond this zoom, show individual points
      } as any);

      // Cluster circles
          if (mapInstance && !mapInstance.getLayer('road-clusters')) {
        mapInstance.addLayer({
          id: 'road-clusters',
          type: 'circle',
          source: 'road-points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              14,   // default radius
              10, 20,
              30, 30,
              60, 40,
            ],
            'circle-color': [
              'step',
              ['get', 'point_count'],
              // Use project primary blue shades instead of arbitrary greens
              '#bfdbfe',    // small cluster (light blue)
              10, '#60a5fa', // medium cluster
              30, '#3b82f6', // large cluster
              60, '#1d4ed8', // very large cluster
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            // Fade clusters in/out smoothly theo zoom
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              11, 0.9,
              14, 0.9,
              15, 0,
            ],
          },
        } as any);
      }

      // Cluster count labels
      if (mapInstance && !mapInstance.getLayer('road-cluster-count')) {
        mapInstance.addLayer({
          id: 'road-cluster-count',
          type: 'symbol',
          source: 'road-points',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        } as any);
      }

      // Unclustered individual road points (only when zoomed in enough)
      // Layer viền trắng bên ngoài (đặt trước để nằm phía dưới)
      if (mapInstance && !mapInstance.getLayer('road-points-circle-white')) {
        mapInstance.addLayer({
          id: 'road-points-circle-white',
          type: 'circle',
          source: 'road-points',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 9,
              16, 12,
              18, 15,
            ],
            'circle-color': '#ffffff', // Màu trắng cho viền
            'circle-opacity': 0, // Không fill
            'circle-stroke-color': '#ffffff', // Viền trắng
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 2,
              16, 2.5,
              18, 3,
            ],
            'circle-stroke-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14, 0.9,
            ],
          },
        } as any);
      }
      
      // Layer donut xanh chính (đặt sau để nằm phía trên viền trắng)
      if (mapInstance && !mapInstance.getLayer('road-points-circle')) {
        mapInstance.addLayer({
          id: 'road-points-circle',
          type: 'circle',
          source: 'road-points',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 7,
              16, 10,
              18, 13,
            ],
            'circle-color': '#3b82f6', // Tất cả cùng một màu xanh
            'circle-opacity': 0, // Không fill, chỉ stroke để tạo donut effect
            'circle-stroke-color': '#3b82f6', // Màu vòng donut
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 5,
              16, 6,
              18, 7,
            ],
            'circle-stroke-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14, 0.9,
            ],
          },
        } as any);
          }
    }
  }, [roadSegments, mapLoaded]);

  // Hover & click for GeoJSON circles & clusters
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const mapInstance = map.current;

    const handleMouseEnter = (e: any) => {
      if (!e.features || !e.features.length) return;
      mapInstance.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];
      const props = feature.properties || {};
      const [lng, lat] = feature.geometry.coordinates;

      const { id, name, roadType, length, laneCount, surface } = props;

      const popupHtml = `
        <div style="padding: 12px; min-width: 200px;">
          <div style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 6px;">
            ${name || 'Unnamed Road'}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              background: rgba(37, 99, 235, 0.08);
              color: #1d4ed8;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
            ">${roadType || 'road'}</span>
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 6px;">
            ${length ? `📏 ${Number(length).toFixed(0)}m` : ''}
            ${laneCount ? ` • 🛣️ ${laneCount} lanes` : ''}
            ${surface ? ` • 🏔️ ${surface}` : ''}
          </div>
          <div style="font-size: 10px; color: #9ca3af; margin-top: 4px; font-family: monospace;">
            ID: ${id ? String(id).substring(0, 8) : 'n/a'}...
          </div>
        </div>
          `;

      if (!geoJsonPopupRef.current) {
        geoJsonPopupRef.current = new maplibregl.Popup({
          offset: [0, -12],
          closeButton: true,      // hiển thị nút X để tắt popup
          closeOnClick: false,
          className: 'road-marker-popup',
          maxWidth: '300px',
        });
      }

      geoJsonPopupRef.current
            .setLngLat([lng, lat])
        .setHTML(popupHtml)
        .addTo(mapInstance);
    };

    const handleMouseLeave = () => {
      mapInstance.getCanvas().style.cursor = '';
      if (geoJsonPopupRef.current) {
        geoJsonPopupRef.current.remove();
      }
    };
    
    const handleClick = (e: any) => {
      if (!e.features || !e.features.length) return;
      const feature = e.features[0];
      const props = feature.properties || {};

      // If this is a cluster, zoom into it instead of opening detail
      if (props.cluster) {
        const clusterId = props.cluster_id;
        const source = mapInstance.getSource('road-points') as any;
        if (!source || typeof source.getClusterExpansionZoom !== 'function') return;

        source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;
          mapInstance.easeTo({
            center: feature.geometry.coordinates,
            zoom,
          });
        });
        return;
      }

      // Unclustered point → open road detail
      const roadId = props.id;
      if (!roadId || !onRoadClick) return;
      const road = roadSegments.find((r) => r.id === roadId);
      if (road) {
        onRoadClick(road);
      }
    };

    // Check if mapInstance exists before adding event listeners
    if (!mapInstance) return;
    
    try {
      if (mapInstance.getLayer('road-points-circle')) {
        mapInstance.on('mouseenter', 'road-points-circle', handleMouseEnter);
        mapInstance.on('mouseleave', 'road-points-circle', handleMouseLeave);
        mapInstance.on('click', 'road-points-circle', handleClick);
      }
    } catch (e) {
      console.warn('Error adding event listeners to road-points-circle:', e);
    }
    
    try {
      if (mapInstance.getLayer('road-clusters')) {
        mapInstance.on('mouseenter', 'road-clusters', () => {
          try {
            if (mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = 'pointer';
            }
          } catch (e) {
            // Ignore
          }
        });
        mapInstance.on('mouseleave', 'road-clusters', () => {
          try {
            if (mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = '';
            }
          } catch (e) {
            // Ignore
          }
        });
        mapInstance.on('click', 'road-clusters', handleClick);
      }
    } catch (e) {
      console.warn('Error adding event listeners to road-clusters:', e);
    }

    return () => {
      // Check if mapInstance exists before accessing its methods
      if (!mapInstance) return;
      
      try {
        if (mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = '';
        }
      } catch (e) {
        // Map may be destroyed, ignore
      }
      
      if (geoJsonPopupRef.current) {
        try {
          geoJsonPopupRef.current.remove();
        } catch (e) {
          // Popup may already be removed, ignore
        }
      }
      
      try {
        if (mapInstance.getLayer('road-points-circle')) {
          mapInstance.off('mouseenter', 'road-points-circle', handleMouseEnter);
          mapInstance.off('mouseleave', 'road-points-circle', handleMouseLeave);
          mapInstance.off('click', 'road-points-circle', handleClick);
        }
      } catch (e) {
        // Layer may not exist, ignore
      }
      
      try {
        if (mapInstance.getLayer('road-clusters')) {
          mapInstance.off('click', 'road-clusters', handleClick);
          mapInstance.off('mouseenter', 'road-clusters', () => {});
          mapInstance.off('mouseleave', 'road-clusters', () => {});
        }
      } catch (e) {
        // Layer may not exist, ignore
      }
    };
  }, [mapLoaded, roadSegments, onRoadClick]);

  return (
    <div className="relative w-full h-full">
      <style>{`
        .road-marker-popup .maplibregl-popup-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 0 !important;
        }
        .road-marker-popup .maplibregl-popup-tip {
          border-top-color: white;
          border-left-color: transparent;
          border-right-color: transparent;
        }
      `}</style>
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

      {/* Map Legend */}
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
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50">
                <RouteIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700 font-medium">Road Segments</span>
      </div>
          </div>
        </div>
      )}

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
}));

export default EnhancedRoadMapView;
