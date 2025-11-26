/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 20-11-2025
 * Update at: 25-11-2025
 * Description: Sidebar component displaying nearby road reports with filtering and image thumbnails
 */

'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock, MapPin, User, Filter, Camera } from 'lucide-react';
import Image from 'next/image';

interface Report {
  id: string;
  type: string;
  title: { value: string };
  description: { value: string };
  category: { value: string };
  status: { value: string };
  priority: { value: string };
  reporterName: { value: string };
  dateCreated: { value: { '@value': string } };
  location: {
    value: {
      type: string;
      coordinates: number[];
    };
  };
  relatedRoad?: { object: string };
  images?: { value: string[] };
  imageCount?: { value: number };
}

interface ReportsListSidebarProps {
  location: number[]; // [lng, lat]
  radius?: number; // km
  onClose: () => void;
}

const PRIORITY_COLORS = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  unassigned: 'bg-gray-100 text-gray-800 border-gray-300',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ReportsListSidebar({ location, radius = 1, onClose }: ReportsListSidebarProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('all');

  useEffect(() => {
    fetchReports();
  }, [location]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ngsi-ld?type=RoadReport&limit=50&options=keyValues`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Filter reports within radius
        const nearbyReports = data.filter((report: Report) => {
          if (!report.location?.value?.coordinates) return false;
          const [lng, lat] = report.location.value.coordinates;
          const distance = calculateDistance(location[1], location[0], lat, lng);
          return distance <= radius;
        });

        setReports(nearbyReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula for distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'pending') return report.status.value === 'pending';
    if (filter === 'urgent') return report.priority.value === 'urgent';
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed top-20 left-4 z-40 w-96 max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-bold text-base">Area Reports</h3>
            <p className="text-xs opacity-90">{reports.length} reports within {radius}km</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b bg-gray-50 flex gap-2">
        {['all', 'pending', 'urgent'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No reports found</p>
            <p className="text-xs mt-1">No issues reported in this area</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-sm text-gray-900 flex-1 line-clamp-2">
                  {report.title.value}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                  PRIORITY_COLORS[report.priority.value as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.unassigned
                }`}>
                  {report.priority.value}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {report.description.value}
              </p>

              {/* Images */}
              {report.images?.value && report.images.value.length > 0 && (
                <div className="flex gap-1 mb-2">
                  {report.images.value.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
                      <Image
                        src={img}
                        alt={`Report image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {report.imageCount && report.imageCount.value > 3 && (
                    <div className="w-16 h-16 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                      +{report.imageCount.value - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className={`px-2 py-0.5 rounded-full ${
                  STATUS_COLORS[report.status.value as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'
                }`}>
                  {report.status.value}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(report.dateCreated.value['@value'])}
                </span>
              </div>

              {/* Reporter */}
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600">
                  <User className="h-3 w-3" />
                  {report.reporterName.value}
                </span>
                <span className="text-gray-400 font-mono">
                  {report.category.value.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-600 text-center">
        Showing reports within {radius}km radius
      </div>
    </div>
  );
}


