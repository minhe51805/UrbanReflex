/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Description: Enhanced map with all data layers and location clustering
 */

'use client';

import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef, useMemo } from 'react';
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

interface AQIStation {
  id: string;
  name: string;
  aqi: number;
  aqiCategory: string;
  location: { type: 'Point'; coordinates: number[]; };
  pm25?: number;
  pm10?: number;
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
}

export interface EnhancedRoadMapViewRef {
  zoomToRoad: (road: RoadSegment) => void;
}

const EnhancedRoadMapView = memo(forwardRef<EnhancedRoadMapViewRef, EnhancedRoadMapViewProps>(function EnhancedRoadMapView({
  roadSegments,
  onRoadClick,
}, ref) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [aqiStations, setAqiStations] = useState<AQIStation[]>([]);
  const [streetlights, setStreetlights] = useState<Streetlight[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentZoom, setCurrentZoom] = useState(10);
  const userLocationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const aqiMarkersRef = useRef<maplibregl.Marker[]>([]);

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

  // Initialize Supercluster for AQI stations
  const aqiCluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 80,        // Smaller radius for tighter clustering
      maxZoom: 16,       // Cluster up to zoom 16
      minZoom: 0,
      minPoints: 2,      // Minimum 2 points to form a cluster
    });

    const features = aqiStations
      .filter(station => {
        // Check if location exists and has coordinates
        if (!station.location) return false;

        // Handle both GeoJSON Point format and direct coordinates array
        const coords = station.location.coordinates || station.location;
        return Array.isArray(coords) && coords.length >= 2;
      })
      .map((station) => {
        // Get coordinates - handle both formats
        const coords = station.location.coordinates || station.location;
        const [lng, lat] = coords;

        // Debug log first station
        if (station === aqiStations[0]) {
          console.log('First AQI station:', {
            name: station.name,
            location: station.location,
            coords: [lng, lat]
          });
        }

        return {
          type: 'Feature' as const,
          properties: {
            cluster: false,
            stationId: station.id,
            station: station,
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
  }, [aqiStations]);

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
        const [aqiRes, lightsRes, reportsRes, poisRes, weatherRes] = await Promise.all([
          fetch('/api/aqi'),
          fetch('/api/ngsi-ld?type=Streetlight&options=keyValues'),
          fetch('/api/ngsi-ld?type=CitizenReport&options=keyValues'),
          fetch('/api/ngsi-ld?type=PointOfInterest&options=keyValues'),
          fetch('/api/ngsi-ld?type=WeatherObserved&options=keyValues&limit=1'),
        ]);

        const aqiData = await aqiRes.json();
        if (aqiData?.stations) {
          const stations: AQIStation[] = aqiData.stations.map((s: any) => ({
            id: s.id,
            name: s.name,
            aqi: s.aqi,
            aqiCategory: s.aqiCategory,
            pm25: s.pm25,
            pm10: s.pm10,
            location: s.location,
          }));
          console.log('AQI Stations loaded:', stations.length);
          console.log('Sample station:', stations[0]);
          setAqiStations(stations);
        }

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
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }],
      },
      center: vietnamCenter,
      zoom: vietnamZoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
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

  // Add road segments layer
  useEffect(() => {
    if (!map.current || !mapLoaded || !roadSegments.length) return;

    if (map.current.getLayer('roads')) map.current.removeLayer('roads');
    if (map.current.getSource('roads')) map.current.removeSource('roads');

    const geojson = {
      type: 'FeatureCollection' as const,
      features: roadSegments.map((road) => ({
        type: 'Feature' as const,
        properties: { id: road.id, name: road.name, roadType: road.roadType },
        geometry: { type: 'LineString' as const, coordinates: road.location.coordinates },
      })),
    };

    map.current.addSource('roads', { type: 'geojson', data: geojson });
    map.current.addLayer({
      id: 'roads',
      type: 'line',
      source: 'roads',
      paint: {
        'line-color': ['match', ['get', 'roadType'], 'primary', '#dc2626', 'secondary', '#ea580c', '#6b7280'],
        'line-width': 2,
      },
    });

    map.current.on('click', 'roads', (e: any) => {
      if (e.features?.[0] && onRoadClick) {
        const road = roadSegments.find(r => r.id === e.features[0].properties?.id);
        if (road) onRoadClick(road);
      }
    });
  }, [roadSegments, mapLoaded, onRoadClick]);

  // Add AQI markers with clustering
  useEffect(() => {
    if (!map.current || !mapLoaded || !aqiStations.length) return;

    // Clear existing markers
    aqiMarkersRef.current.forEach(marker => marker.remove());
    aqiMarkersRef.current = [];

    const bounds = map.current.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    // Get clusters from supercluster
    const clusters = aqiCluster.getClusters(bbox, Math.floor(currentZoom));

    clusters.forEach((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = cluster.properties;

      if (isCluster) {
        // Create cluster marker - style similar to diemcuutro.com
        const el = document.createElement('div');

        // Calculate size based on point count
        let size = 40;
        if (pointCount > 10) size = 50;
        if (pointCount > 20) size = 60;
        if (pointCount > 50) size = 70;

        el.style.position = 'relative';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.cursor = 'pointer';

        // Create cluster with shadow effect like diemcuutro.com
        el.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 50%;
            transform: scale(1.2);
          "></div>
          <div class="cluster-inner" style="
            position: relative;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 3px solid white;
            transition: all 0.2s ease;
          ">
            <div style="font-size: 18px;">🌫️</div>
            <div style="font-size: 14px; margin-top: 2px;">${pointCount}</div>
          </div>
        `;

        // Hover effects
        el.addEventListener('mouseenter', () => {
          const innerDiv = el.querySelector('.cluster-inner') as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = 'scale(1.15)';
            innerDiv.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }
        });

        el.addEventListener('mouseleave', () => {
          const innerDiv = el.querySelector('.cluster-inner') as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = 'scale(1)';
            innerDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);

        aqiMarkersRef.current.push(marker);

        // Zoom in on cluster click
        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            aqiCluster.getClusterExpansionZoom(cluster.id as number),
            18
          );
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: expansionZoom,
            duration: 1000,
          });
        });

      } else {
        // Create individual station marker
        const station = cluster.properties.station as AQIStation;
        const el = document.createElement('div');
        el.innerHTML = `<div style="background: #f59e0b; color: white; padding: 6px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; white-space: nowrap;">🌫️ ${station.aqi}</div>`;

        el.addEventListener('click', () => {
          new maplibregl.Popup({ offset: 25 })
            .setLngLat([longitude, latitude])
            .setHTML(`
              <div style="padding: 12px;">
                <h3 style="font-weight: bold; margin-bottom: 8px;">📊 ${station.name}</h3>
                <div style="font-size: 12px; color: #666;">
                  <div><strong>AQI:</strong> ${station.aqi}</div>
                  ${station.pm25 ? `<div><strong>PM2.5:</strong> ${station.pm25.toFixed(1)} µg/m³</div>` : ''}
                  ${station.pm10 ? `<div><strong>PM10:</strong> ${station.pm10.toFixed(1)} µg/m³</div>` : ''}
                </div>
              </div>
            `)
            .addTo(map.current!);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);

        aqiMarkersRef.current.push(marker);
      }
    });
  }, [aqiStations, mapLoaded, currentZoom, aqiCluster]);

  // Update markers on map move
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const updateMarkers = () => {
      setCurrentZoom(map.current?.getZoom() || 10);
    };

    map.current.on('moveend', updateMarkers);

    return () => {
      map.current?.off('moveend', updateMarkers);
    };
  }, [mapLoaded]);

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
        <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs pointer-events-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">☁️</div>
            <div>
              <div className="font-bold text-lg">{weatherData.temperature}°C</div>
              <div className="text-xs text-gray-500">{weatherData.weatherDescription || 'Weather'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 pointer-events-auto">
        <h3 className="font-bold text-sm mb-3">🗺️ Map Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2"><span className="text-lg">🌫️</span><span>AQI Stations</span></div>
          <div className="flex items-center gap-2"><span className="text-lg">💡</span><span>Streetlights</span></div>
          <div className="flex items-center gap-2"><span className="text-lg">📍</span><span>Citizen Reports</span></div>
          <div className="flex items-center gap-2"><span className="text-lg">🏥</span><span>Points of Interest</span></div>
        </div>
      </div>

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

