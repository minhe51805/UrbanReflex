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
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface Report {
  id: string;
  type: string;
  entityType?: string; // NGSI-LD entity type
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
  notes: unknown[];
  metadata?: {
    category?: string;
    coordinates?: number[];
    reportId?: string;
    images?: string[];
    imageCount?: number;
  };
}

const CATEGORY_LABELS: Record<string, { emoji: string; label: string }> = {
  'road_damage': { emoji: '🛣️', label: 'Road Damage' },
  'pothole': { emoji: '🕳️', label: 'Pothole' },
  'traffic_sign': { emoji: '🚦', label: 'Traffic Sign' },
  'streetlight': { emoji: '💡', label: 'Streetlight' },
  'drainage': { emoji: '💧', label: 'Drainage' },
  'other': { emoji: '❓', label: 'Other' }
};

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: '🔴 Urgent - Need Immediate Action', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'high', label: '🟠 High - Important', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'medium', label: '🟡 Medium - Review Needed', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'low', label: '🔵 Low - Not Critical', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'unassigned', label: '⚪ Unassigned', color: 'bg-gray-100 text-gray-800 border-gray-300' }
];

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'road_report'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewReport, setViewReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.reports) {
          setReports(result.reports);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status === 'pending' || r.status === 'submitted';
    if (filter === 'road_report') return r.type === 'road_report';
    return true;
  });

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
        const result = await response.json();
        if (result.success) {
          setReports(reports.map(r =>
            r.id === reportId ? { ...r, priority } : r
          ));
          // Refresh reports list
          fetchReports();
        }
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to update priority' }));
        console.error('Error updating priority:', error);
        alert(`Failed to update priority: ${error.error || error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority. Please try again.');
    }
  };

  const updateType = async (reportId: string, type: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setReports(reports.map(r =>
            r.id === reportId ? { ...r, type } : r
          ));
          // Refresh reports list
          fetchReports();
        }
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to update type' }));
        console.error('Error updating type:', error);
        alert(`Failed to update type: ${error.error || error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating type:', error);
      alert('Failed to update type. Please try again.');
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
        const result = await response.json();
        if (result.success) {
          setReports(reports.map(r =>
            r.id === reportId ? { ...r, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : r.resolvedAt } : r
          ));
          // Refresh reports list
          fetchReports();
        }
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to update status' }));
        console.error('Error updating status:', error);
        alert(`Failed to update status: ${error.error || error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
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
            onClick={() => setFilter(f as 'all' | 'pending' | 'road_report')}
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
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có báo cáo nào</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Hiện tại chưa có báo cáo nào trong hệ thống.'
              : filter === 'pending'
                ? 'Không có báo cáo đang chờ xử lý.'
                : 'Không có báo cáo về đường phố.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                {/* Report Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{report.description}</p>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap gap-2">
                    {report.entityType && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {report.entityType}
                      </span>
                    )}
                    {report.metadata?.category && CATEGORY_LABELS[report.metadata.category] && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {CATEGORY_LABELS[report.metadata.category].emoji} {CATEGORY_LABELS[report.metadata.category].label}
                      </span>
                    )}
                    {report.locationName && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        📍 {report.locationName}
                      </span>
                    )}
                    {report.metadata?.imageCount !== undefined && report.metadata.imageCount > 0 && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        📷 {report.metadata.imageCount} images
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Reported by: {report.reportedBy} • {formatDate(report.reportedAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setViewReport(report)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
                  >
                    View Details
                  </button>
                  {report.status === 'pending' || report.status === 'submitted' ? (
                    <>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-sm"
                      >
                        Assign Priority
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, 'in_progress')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, 'rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
                      >
                        Reject
                      </button>
                    </>
                  ) : report.status === 'in_progress' ? (
                    <button
                      onClick={() => updateStatus(report.id, 'resolved')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                    >
                      Mark Resolved
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Report Details Modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setViewReport(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Report Details</h3>
              <button
                onClick={() => setViewReport(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Title</h4>
                <p className="text-gray-700">{viewReport.title}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                <p className="text-gray-700">{viewReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <select
                    value={viewReport.status}
                    onChange={(e) => updateStatus(viewReport.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                  <select
                    value={viewReport.priority}
                    onChange={(e) => updatePriority(viewReport.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="unassigned">Unassigned</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Type</h4>
                <select
                  value={viewReport.type}
                  onChange={(e) => updateType(viewReport.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="road_report">Road Report</option>
                  <option value="data_issue">Data Issue</option>
                  <option value="missing_data">Missing Data</option>
                  <option value="bug">Bug</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {viewReport.locationName && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-700">{viewReport.locationName}</p>
                </div>
              )}

              {viewReport.metadata?.category && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
                  <p className="text-gray-700">
                    {CATEGORY_LABELS[viewReport.metadata.category]?.emoji} {CATEGORY_LABELS[viewReport.metadata.category]?.label || viewReport.metadata.category}
                  </p>
                </div>
              )}

              {viewReport.entityType && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Entity Type</h4>
                  <p className="text-gray-700">{viewReport.entityType}</p>
                </div>
              )}

              {viewReport.metadata?.coordinates && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Coordinates</h4>
                  <p className="text-gray-700">
                    {viewReport.metadata.coordinates[1]}, {viewReport.metadata.coordinates[0]}
                  </p>
                </div>
              )}

              {viewReport.metadata?.images && viewReport.metadata.images.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {viewReport.metadata.images.map((img, idx) => (
                      <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={img}
                          alt={`Report image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Reported At</h4>
                <p className="text-gray-700">{formatDate(viewReport.reportedAt)}</p>
              </div>

              {viewReport.resolvedAt && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Resolved At</h4>
                  <p className="text-gray-700">{formatDate(viewReport.resolvedAt)}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              {viewReport.status === 'pending' || viewReport.status === 'submitted' ? (
                <>
                  <button
                    onClick={() => {
                      updateStatus(viewReport.id, 'in_progress');
                      setViewReport(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(viewReport.id, 'rejected');
                      setViewReport(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                  >
                    Reject
                  </button>
                </>
              ) : viewReport.status === 'in_progress' ? (
                <button
                  onClick={() => {
                    updateStatus(viewReport.id, 'resolved');
                    setViewReport(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                >
                  Mark Resolved
                </button>
              ) : null}
              <button
                onClick={() => setViewReport(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Priority Assignment Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assign Priority</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm text-gray-900">{selectedReport.title}</p>
              <p className="text-xs text-gray-600 mt-1">{selectedReport.description}</p>
            </div>

            <div className="space-y-2 mb-6">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updatePriority(selectedReport.id, option.value);
                    setSelectedReport(null);
                  }}
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


