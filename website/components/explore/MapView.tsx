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

import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import Supercluster from 'supercluster';
import type { Location } from '@/types/orion';

interface MapViewProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  center?: [number, number];
  zoom?: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const haversineDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

const getLocationClusterRadiusThresholdKm = (zoom: number) => {
  if (zoom <= 4) return 400; // continent
  if (zoom <= 6) return 200; // large country
  if (zoom <= 8) return 80;  // region
  if (zoom <= 10) return 40; // province
  if (zoom <= 12) return 20; // metro area
  if (zoom <= 14) return 8;  // district
  return 2; // street view
};

const MapView = memo(function MapView({
  locations,
  onLocationClick,
  center = [0, 20],
  zoom = 2,
}: MapViewProps) {
  const stableOnLocationClick = useCallback(onLocationClick || (() => { }), [onLocationClick]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Initialize Supercluster with 10km radius configuration
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 150, // Increased radius for ~10km clustering at low zoom
      maxZoom: 14, // Cluster up to zoom 14, then show individual markers
      minZoom: 0,
      minPoints: 2, // Minimum 2 points to form a cluster
    });

    // Convert locations to GeoJSON features
    const features = locations
      .filter(loc => loc.coordinates)
      .map((location) => ({
        type: 'Feature' as const,
        properties: {
          cluster: false,
          locationId: location.id,
          location: location,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [location.coordinates!.longitude, location.coordinates!.latitude],
        },
      }));

    if (features.length > 0) {
      cluster.load(features);
    }

    return cluster;
  }, [locations]);

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

    // Track zoom changes for clustering
    map.current.on('zoom', () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom());
      }
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

  // Update markers with clustering
  useEffect(() => {
    if (!map.current || !mapLoaded || !locations.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Tính cluster trên toàn bản đồ, không phụ thuộc viewport hiện tại,
    // để khi pan nhẹ thì cụm/node không bị "mất" chỉ vì nó vừa ra khỏi bbox.
    const worldBbox: [number, number, number, number] = [-180, -85, 180, 85];

    const zoomLevel = Math.floor(currentZoom);

    // Get clusters from supercluster (global, then MapLibre tự cắt theo viewport)
    const rawClusters = supercluster.getClusters(worldBbox, zoomLevel);
    const renderQueue = [...rawClusters];
    const resolvedClusters: typeof rawClusters = [];

    const computeClusterSpreadKm = (clusterFeature: typeof rawClusters[number]) => {
      const pointCount = clusterFeature.properties.point_count || 0;
      if (!pointCount) return 0;
      const sampleSize = Math.min(pointCount, 25);
      const [clusterLng, clusterLat] = clusterFeature.geometry.coordinates as [number, number];
      let maxDistance = 0;
      const leaves = supercluster.getLeaves(clusterFeature.id as number, sampleSize, 0);
      leaves.forEach((leaf) => {
        const [leafLng, leafLat] = leaf.geometry.coordinates as [number, number];
        const distance = haversineDistanceKm(clusterLat, clusterLng, leafLat, leafLng);
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      });
      return maxDistance;
    };

    while (renderQueue.length) {
      const clusterFeature = renderQueue.pop()!;
      if (clusterFeature.properties.cluster) {
        const spreadKm = computeClusterSpreadKm(clusterFeature);
        const thresholdKm = getLocationClusterRadiusThresholdKm(zoomLevel);
        if (spreadKm > thresholdKm) {
          const children = supercluster.getChildren(clusterFeature.id as number);
          renderQueue.push(...children);
          continue;
        }
      }
      resolvedClusters.push(clusterFeature);
    }

    resolvedClusters.forEach((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = cluster.properties;

      if (isCluster) {
        // Create cluster marker
        const el = document.createElement('div');
        el.className = 'cluster-marker';
        el.style.width = `${40 + (pointCount / locations.length) * 40}px`;
        el.style.height = `${40 + (pointCount / locations.length) * 40}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '14px';
        el.style.transition = 'all 0.2s ease';
        el.textContent = pointCount.toString();

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
          el.style.zIndex = '1000';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Zoom in on cluster click
        // IMPORTANT:
        // - Chỉ thay đổi zoom, giữ nguyên center hiện tại của map.
        // - Không dùng "around" theo toạ độ cụm để tránh cảm giác
        //   cụm bị trượt lên/xuống rồi mới tách.
        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.id as number),
            18
          );
          if (map.current) {
            const currentCenter = map.current.getCenter();
            map.current.easeTo({
              center: [currentCenter.lng, currentCenter.lat],
              zoom: expansionZoom,
              duration: 800,
            });
          }
        });

      } else {
        // Create individual location marker
        const location = cluster.properties.location as Location;

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
          .setLngLat([longitude, latitude])
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
          const countryName = typeof location.country === 'string' ? location.country : location.country?.name || 'Unknown';

          popup
            .setLngLat([longitude, latitude])
            .setHTML(`
              <div style="padding: 10px; min-width: 200px;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #1f2937;">
                  ${location.name}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
                  ${location.locality ? location.locality + ', ' : ''}${countryName}
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
      }
    });
  }, [locations, mapLoaded, currentZoom, supercluster, stableOnLocationClick]);

  // NOTE:
  // We cố ý KHÔNG cập nhật lại clustering theo pan (moveend).
  // Cụm chỉ được tính lại khi zoom level thay đổi (xử lý trong sự kiện 'zoom' ở trên),
  // nên khi bạn kéo map qua lại mà chưa đến ngưỡng tách/gom mới, cụm hiện tại sẽ
  // giữ nguyên cấu trúc – giống behaviour “chết cứng” mà bạn mô tả.

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

