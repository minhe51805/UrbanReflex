'use client';

import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  MapPin
} from 'lucide-react';

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  locationId: string | null;
  locationName: string | null;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  notes: any[];
}

interface ReportsTableProps {
  reports: Report[];
  loading: boolean;
  onSelectReport: (report: Report) => void;
  onUpdateReport: (id: string, updates: Partial<Report>) => void;
  onDeleteReport: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  in_progress: {
    label: 'In Progress',
    icon: AlertCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200'
  }
};

const priorityConfig = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700'
};

const typeLabels: Record<string, string> = {
  data_issue: 'Data Issue',
  missing_data: 'Missing Data',
  bug: 'Bug',
  feature_request: 'Feature Request',
  other: 'Other'
};

export default function ReportsTable({
  reports,
  loading,
  onSelectReport,
  onUpdateReport,
  onDeleteReport
}: ReportsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
        <p className="text-slate-600">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Reported By
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => {
              const StatusIcon = statusConfig[report.status].icon;
              
              return (
                <tr 
                  key={report.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onSelectReport(report)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {report.title}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {report.description}
                        </p>
                        {report.locationName && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{report.locationName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {typeLabels[report.type] || report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[report.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig[report.status].label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[report.priority]}`}>
                      {report.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{report.reportedBy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{formatDate(report.reportedAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(report);
                        }}
                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteReport(report.id);
                        }}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

