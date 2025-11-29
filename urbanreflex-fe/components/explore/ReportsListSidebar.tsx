/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 20-11-2025
 * Update at: 28-11-2025
 * Description: Modern sidebar component displaying nearby road reports with clean white/transparent design
 */

'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock, MapPin, User, Filter, Camera, CheckCircle2, Circle, Loader2, AlertCircle, Minus } from 'lucide-react';
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

const PRIORITY_CONFIG = {
  urgent: { 
    color: 'text-red-700', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    label: 'Urgent',
    dot: 'bg-red-500'
  },
  high: { 
    color: 'text-orange-700', 
    bg: 'bg-orange-50', 
    border: 'border-orange-200',
    label: 'High',
    dot: 'bg-orange-500'
  },
  medium: { 
    color: 'text-yellow-700', 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-200',
    label: 'Medium',
    dot: 'bg-yellow-500'
  },
  low: { 
    color: 'text-blue-700', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    label: 'Low',
    dot: 'bg-blue-500'
  },
  unassigned: { 
    color: 'text-gray-700', 
    bg: 'bg-gray-50', 
    border: 'border-gray-200',
    label: 'Unassigned',
    dot: 'bg-gray-500'
  },
};

const STATUS_CONFIG = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock,
    label: 'Pending'
  },
  in_progress: { 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Loader2,
    label: 'In Progress'
  },
  resolved: { 
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle2,
    label: 'Resolved'
  },
  rejected: { 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: X,
    label: 'Rejected'
  },
};

export default function ReportsListSidebar({ location, radius = 1, onClose }: ReportsListSidebarProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('all');
  const [collapsed, setCollapsed] = useState(false);

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

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('streetlight')) return '💡';
    if (cat.includes('traffic')) return '🚦';
    if (cat.includes('waste')) return '🗑️';
    if (cat.includes('road')) return '🛣️';
    return '📍';
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (collapsed) {
    return (
      <button
        className="fixed top-20 right-4 z-40 px-4 py-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg text-sm font-semibold text-gray-700 hover:bg-white transition-colors pointer-events-auto"
        onClick={() => setCollapsed(false)}
      >
        🛈 Area Reports
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-40 w-[420px] max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden pointer-events-auto">
      {/* Header - Clean White/Transparent Design */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="px-6 py-5">
          {/* Title and Close */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
          <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Area Reports</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{filteredReports.length} reports within {radius}km</span>
                </p>
          </div>
        </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCollapsed(true)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs font-semibold"
                aria-label="Collapse"
              >
                <Minus className="h-4 w-4" />
                <span>Hide</span>
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
          <X className="h-5 w-5" />
        </button>
            </div>
      </div>

          {/* Filter Tabs - Clean Design */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: reports.length },
              { key: 'pending', label: 'Pending', count: reports.filter(r => r.status.value === 'pending').length },
              { key: 'urgent', label: 'Urgent', count: reports.filter(r => r.priority.value === 'urgent').length },
            ].map((tab) => (
          <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      filter === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
          </button>
        ))}
          </div>
        </div>
      </div>

      {/* Reports List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
            <p className="text-sm font-semibold text-gray-700">Loading reports...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-2">No reports found</h4>
            <p className="text-sm text-gray-600 mb-4">No issues reported in this area</p>
            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-medium">
                Showing reports within {radius}km radius
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredReports.map((report) => {
              const priority = PRIORITY_CONFIG[report.priority.value as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.unassigned;
              const status = STATUS_CONFIG[report.status.value as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;

              return (
            <div
              key={report.id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
                  {/* Header - Title and Priority */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(report.category.value)}</span>
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2">
                  {report.title.value}
                </h4>
              </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {report.description.value}
              </p>
                    </div>
                    <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg border ${priority.bg} ${priority.border}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
                        <span className={`text-xs font-bold ${priority.color}`}>{priority.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Images Gallery */}
              {report.images?.value && report.images.value.length > 0 && (
                    <div className="flex gap-2 mb-3">
                  {report.images.value.slice(0, 3).map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                        >
                      <Image
                        src={img}
                        alt={`Report image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {report.imageCount && report.imageCount.value > 3 && (
                        <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">
                      +{report.imageCount.value - 3}
                    </div>
                  )}
                </div>
              )}

                  {/* Status and Time */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${status.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">{formatDate(report.dateCreated.value['@value'])}</span>
                    </div>
              </div>

                  {/* Footer - Reporter and Category */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <User className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{report.reporterName.value}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {getCategoryLabel(report.category.value)}
                </span>
              </div>
            </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Info */}
      {!loading && filteredReports.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-center text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredReports.length}</span> of <span className="font-bold text-gray-900">{reports.length}</span> reports within {radius}km radius
          </p>
      </div>
      )}
    </div>
  );
}
