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

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Clock, MapPin, User, Filter, Camera, CheckCircle2, Circle, Loader2, AlertCircle, Minus, Share2, Copy, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { ReportMarker } from './EnhancedRoadMapView';

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
  onApprovedReportsUpdate?: (reports: ReportMarker[]) => void;
  attachToRoadDetail?: boolean;
  onFocusLocation?: (coords: [number, number], label?: string) => void;
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

const normalizeStatusKey = (status: string) =>
  (status || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const APPROVED_STATUS_KEYS = new Set([
  // Auto-approved by AI
  'auto_approved',
  'tu_dong_duyet',
  // Approved by admin
  'approved',
  'da_duyet',
  'duyet',
  // In progress
  'in_progress',
  'dang_xu_ly',
  'processing',
  // Resolved
  'resolved',
  'da_giai_quyet',
  'da_xu_ly',
  'hoan_thanh',
]);

const isApprovedStatus = (status: string) => APPROVED_STATUS_KEYS.has(normalizeStatusKey(status));

const extractCoordinates = (report: any, fallback: [number, number]): [number, number] => {
  const coords =
    report?.location?.value?.coordinates ||
    report?.location?.coordinates ||
    (Array.isArray(report?.location) ? report.location : null);

  if (Array.isArray(coords) && coords.length >= 2) {
    const [lngRaw, latRaw] = coords;
    const lng = typeof lngRaw === 'number' ? lngRaw : parseFloat(lngRaw) || fallback[0];
    const lat = typeof latRaw === 'number' ? latRaw : parseFloat(latRaw) || fallback[1];
    return [lng, lat];
  }

  return fallback;
};

// Helper: Check if string looks like base64 (long alphanumeric string)
const looksLikeBase64 = (str: string): boolean => {
  // Base64 thường dài và chỉ chứa A-Z, a-z, 0-9, +, /, =
  if (str.length < 100) return false; // Base64 image thường rất dài
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str);
};

// Convert base64 string to data URL if needed
const normalizeImageUrl = (value: string): string => {
  const trimmed = value.trim();
  
  // Nếu đã là URL hợp lệ, trả về nguyên
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  
  // Nếu là base64 thuần, convert thành data URL
  if (looksLikeBase64(trimmed)) {
    // Thử detect image type từ đầu chuỗi hoặc mặc định là jpeg
    // Base64 thường bắt đầu với một số pattern nhất định
    return `data:image/jpeg;base64,${trimmed}`;
  }
  
  return trimmed;
};

// Validate that a string looks like a usable image URL for next/image
const isValidImageUrl = (value: any): value is string => {
  if (typeof value !== 'string') return false;
  const url = value.trim();
  if (!url) return false;
  // Chấp nhận http(s) tuyệt đối hoặc path tương đối bắt đầu bằng /
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return true;
  // Chấp nhận base64 data URLs (data:image/...)
  if (url.startsWith('data:image/')) return true;
  // Chấp nhận base64 thuần (sẽ được normalize thành data URL)
  if (looksLikeBase64(url)) return true;
  return false;
};

// Chuẩn hoá trường ảnh từ nhiều format backend khác nhau thành mảng string URL đơn giản
const extractImages = (report: any): string[] => {
  // Debug: log raw data để kiểm tra
  console.log('[extractImages] Processing report:', report.id);
  console.log('[extractImages] report.images:', report.images);
  console.log('[extractImages] report.imageCount:', report.imageCount);
  
  // Một số kiểu thường gặp: NGSI-LD images.value, metadata.images, imageUrls, photos...
  let raw =
    report?.images?.value ||
    report?.images ||
    report?.metadata?.images ||
    report?.imageUrls ||
    report?.image_urls ||
    report?.photos ||
    report?.photo;

  console.log('[extractImages] Extracted raw:', raw, 'type:', typeof raw, 'isArray:', Array.isArray(raw));

  if (!raw) {
    console.log('[extractImages] No images found');
    return [];
  }

  let result: string[] = [];

  // Nếu là mảng
  if (Array.isArray(raw)) {
    result = raw.filter(isValidImageUrl).map(normalizeImageUrl);
    console.log('[extractImages] Array result:', result.length, 'images');
    return result;
  }

  // Nếu là string đơn
  if (typeof raw === 'string') {
    if (isValidImageUrl(raw)) {
      result = [normalizeImageUrl(raw)];
    }
    console.log('[extractImages] String result:', result.length, 'images');
    return result;
  }

  // Kiểu NGSI-LD: { "@list": [ ... ] }
  if (raw && typeof raw === 'object' && Array.isArray(raw['@list'])) {
    result = raw['@list'].filter(isValidImageUrl).map(normalizeImageUrl);
    console.log('[extractImages] @list result:', result.length, 'images');
    return result;
  }

  // Kiểu object có value là array: { value: [...] }
  if (raw && typeof raw === 'object' && Array.isArray(raw.value)) {
    result = raw.value.filter(isValidImageUrl).map(normalizeImageUrl);
    console.log('[extractImages] object.value result:', result.length, 'images');
    return result;
  }

  console.log('[extractImages] No valid format found, returning empty');
  return [];
};

export default function ReportsListSidebar({ location, radius = 1, onClose, onApprovedReportsUpdate, attachToRoadDetail = false, onFocusLocation }: ReportsListSidebarProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('all');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [location]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch reports from API with spatial query
      const [lng, lat] = Array.isArray(location) ? location : [106.7, 10.78];
      const response = await fetch(`/api/reports?lat=${lat}&lon=${lng}&maxDistance=${radius * 1000}&limit=50`);

      if (response.ok) {
        const data = await response.json();
        const reportsList = data.reports || [];

        // Map ALL reports cho sidebar, đồng thời chuẩn hoá ảnh
        const mappedReports: Report[] = reportsList.map((report: any) => {
          const imageArray = extractImages(report);
          
          // Debug: log ra để kiểm tra dữ liệu ảnh từ API
          if (imageArray.length > 0) {
            console.log(`[ReportsListSidebar] Report ${report.id} has ${imageArray.length} images:`, imageArray);
            console.log(`[ReportsListSidebar] Raw report.images:`, report.images);
          }

          return {
            id: report.id,
            type: report.category?.value || report.category || 'other',
            title: { value: report.title?.value || report.title || 'Untitled' },
            description: { value: report.description?.value || report.description || '' },
            category: { value: report.category?.value || report.category || 'other' },
            status: { value: report.status?.value || report.status || 'pending' },
            priority: { value: report.priority?.value || report.priority || 'medium' },
            reporterName: { value: report.reporterName?.value || report.reporterName || 'Unknown' },
            dateCreated: {
              value: {
                '@value':
                  report.dateCreated?.value?.['@value'] ||
                  report.dateCreated?.['@value'] ||
                  report.dateCreated ||
                  new Date().toISOString(),
              },
            },
            location: {
              value: {
                type: 'Point',
                coordinates: report.location?.coordinates || report.location?.value?.coordinates || [lng, lat],
              },
            },
            relatedRoad: report.refRoadSegment ? { object: report.refRoadSegment } : undefined,
            images: imageArray.length > 0 ? { value: imageArray } : undefined,
            imageCount: imageArray.length > 0 ? { value: imageArray.length } : undefined,
          };
        });

        // Filter thêm một lần phía client để chắc chắn chỉ lấy trong bán kính radius
        const reportsWithinRadius = mappedReports.filter((report) => {
          const coords = extractCoordinates(report, [lng, lat]);
          const distanceKm = calculateDistance(lat, lng, coords[1], coords[0]);
          return distanceKm <= radius;
        });

        setReports(reportsWithinRadius);

        if (onApprovedReportsUpdate) {
          const markerPayload: ReportMarker[] = reportsWithinRadius
            .filter((report) => isApprovedStatus(report.status.value))
            .map((report) => ({
              id: report.id,
              title: report.title.value,
              status: report.status.value,
              coordinates: extractCoordinates(report, [lng, lat]),
              description: report.description.value,
              category: report.category.value,
              priority: report.priority.value,
            }));
          onApprovedReportsUpdate(markerPayload);
        }
      } else if (onApprovedReportsUpdate) {
        onApprovedReportsUpdate([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
      onApprovedReportsUpdate?.([]);
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  const rightClass = attachToRoadDetail ? 'right-[460px] top-[13rem] bottom-32 h-auto' : 'right-4 top-20 max-h-[calc(100vh-120px)]';

  const modalPortal =
    selectedReport && typeof window !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-6"
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Chi tiết báo cáo</h3>
                    <p className="text-xs text-gray-500 mt-0.5">ID: {selectedReport.id.substring(0, 20)}...</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Tiêu đề
                    </label>
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(selectedReport.category.value)}</span>
                      {selectedReport.title.value}
                    </h4>
                  </div>

                  {/* Status and Priority Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Trạng thái
                      </label>
                      {(() => {
                        const status =
                          STATUS_CONFIG[selectedReport.status.value as keyof typeof STATUS_CONFIG] ||
                          STATUS_CONFIG.pending;
                        const StatusIcon = status.icon;
                        return (
                          <span
                            className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border ${status.color}`}
                          >
                            <StatusIcon className="w-4 h-4 mr-2" />
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Độ ưu tiên
                      </label>
                      {(() => {
                        const priority =
                          PRIORITY_CONFIG[selectedReport.priority.value as keyof typeof PRIORITY_CONFIG] ||
                          PRIORITY_CONFIG.unassigned;
                        return (
                          <span
                            className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border ${priority.bg} ${priority.border} ${priority.color}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${priority.dot} mr-2`}></span>
                            {priority.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Mô tả chi tiết
                    </label>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {selectedReport.description.value || (
                          <span className="text-gray-400 italic">Không có mô tả</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Images Gallery */}
                  {(() => {
                    // Debug: log ra để kiểm tra dữ liệu ảnh khi render modal
                    console.log('[Modal] selectedReport.images:', selectedReport.images);
                    console.log('[Modal] selectedReport.images?.value:', selectedReport.images?.value);
                    
                    const validImages = Array.isArray(selectedReport.images?.value)
                      ? selectedReport.images.value.filter(isValidImageUrl)
                      : [];
                    
                    console.log('[Modal] validImages count:', validImages.length);
                    console.log('[Modal] validImages:', validImages);
                    
                    if (validImages.length === 0) return null;
                    
                    return (
                      <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Hình ảnh ({validImages.length})</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {validImages.map((img, idx) => {
                            const normalizedUrl = normalizeImageUrl(img);
                            return (
                              <div
                                key={idx}
                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group cursor-pointer"
                              >
                                <Image
                                  src={normalizedUrl}
                                  alt={`Report image ${idx + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  unoptimized={normalizedUrl.startsWith('data:')} // Disable optimization for data URLs
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Location */}
                  {selectedReport.location &&
                    selectedReport.location.value &&
                    selectedReport.location.value.coordinates && (
                      <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border border-green-100">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>Vị trí báo cáo</span>
                        </label>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Tọa độ</p>
                            <p className="text-sm font-mono text-gray-900">
                              [{selectedReport.location.value.coordinates.join(', ')}]
                            </p>
                          </div>
                          {selectedReport.location.value.coordinates.length >= 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const [lng, lat] = selectedReport.location.value.coordinates;
                                if (onFocusLocation) {
                                  onFocusLocation([lng, lat], selectedReport.title?.value || 'Citizen report');
                                }
                              }}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <MapPin className="w-4 h-4" />
                              <span>Xem trên bản đồ</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Category and Dates Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Danh mục
                      </label>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {getCategoryLabel(selectedReport.category.value)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Ngày tạo</span>
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedReport.dateCreated.value['@value']).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg border border-indigo-100">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Người báo cáo</span>
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedReport.reporterName.value}
                      </p>
                    </div>
                  </div>

                  {/* Full Report ID */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      ID đầy đủ
                    </label>
                    <p className="text-xs font-mono text-gray-300 break-all">{selectedReport.id}</p>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                  {selectedReport.location &&
                    selectedReport.location.value &&
                    selectedReport.location.value.coordinates &&
                    selectedReport.location.value.coordinates.length >= 2 && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedReport.location.value.coordinates[1]},${selectedReport.location.value.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Xem bản đồ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedReport.id);
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Sao chép ID"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Sao chép ID</span>
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedReport.title.value,
                          text: selectedReport.description.value,
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Chia sẻ"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className={`fixed ${rightClass} z-40 w-[420px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden pointer-events-auto transition-transform duration-300`}>
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
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${filter === tab.key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === tab.key
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
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
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
                      {report.images.value
                        .filter(isValidImageUrl)
                        .map(normalizeImageUrl)
                        .slice(0, 3)
                        .map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <Image
                              src={img}
                              alt={`Report image ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized={img.startsWith('data:')} // Disable optimization for data URLs
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

      {/* Report Detail Modal - render bằng portal để không bị giới hạn width sidebar */}
      {modalPortal}
    </>
  );
}
