/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 20-11-2025
 * Update at: 25-11-2025
 * Description: Admin component for managing community reports with priority assignment and image previews
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, Filter, Search, Camera } from 'lucide-react';
import Image from 'next/image';

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  locationId: string | null;
  locationName: string | null;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  notes: any[];
  metadata?: {
    category?: string;
    coordinates?: number[];
    reportId?: string;
    images?: string[];
    imageCount?: number;
  };
}

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: '🔴 Urgent - Need Immediate Action', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'high', label: '🟠 High - Important', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'medium', label: '🟡 Medium - Review Needed', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'low', label: '🔵 Low - Not Critical', color: 'bg-blue-100 text-blue-800 border-blue-300' },
];

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'road_report'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/admin/reports'
        : filter === 'road_report'
        ? '/api/admin/reports?type=road_report'
        : '/api/admin/reports?status=pending';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (reportId: string, priority: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, priority } : r
        ));
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status } : r
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const option = PRIORITY_OPTIONS.find(o => o.value === priority);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports Management</h2>
        <p className="text-gray-600">Review and prioritize community reports</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-3">
        {['all', 'pending', 'road_report'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'road_report' ? 'Road Reports' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Report Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-bold text-gray-900">{report.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                  {/* Images */}
                  {report.metadata?.images && report.metadata.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {report.metadata.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={img}
                            alt={`Report image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {report.metadata.imageCount && report.metadata.imageCount > 4 && (
                        <div className="w-20 h-20 rounded-lg border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                            <span className="text-xs font-semibold text-gray-600">
                              +{report.metadata.imageCount - 4}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full font-semibold ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-semibold border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {report.type.replace('_', ' ')}
                    </span>
                    {report.locationName && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        [object Object]
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Reported by: {report.reportedBy} • {formatDate(report.reportedAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {report.priority === 'unassigned' || report.status === 'pending' ? (
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-sm"
                    >
                      Assign Priority
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(report.id, 'resolved')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Priority Assignment Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Assign Priority</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm text-gray-900">{selectedReport.title}</p>
              <p className="text-xs text-gray-600 mt-1">{selectedReport.description}</p>
            </div>

            <div className="space-y-2 mb-6">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updatePriority(selectedReport.id, option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 font-semibold transition-all hover:scale-105 ${option.color}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


