'use client';

import { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Send,
  Trash2
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

interface ReportModalProps {
  report: Report;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Report>) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50' }
};

const typeLabels: Record<string, string> = {
  data_issue: 'Data Issue',
  missing_data: 'Missing Data',
  bug: 'Bug',
  feature_request: 'Feature Request',
  other: 'Other'
};

export default function ReportModal({ report, onClose, onUpdate, onDelete }: ReportModalProps) {
  const [newNote, setNewNote] = useState('');
  const [assignee, setAssignee] = useState(report.assignedTo || '');

  const StatusIcon = statusConfig[report.status].icon;

  const handleStatusChange = (newStatus: Report['status']) => {
    onUpdate(report.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Report['priority']) => {
    onUpdate(report.id, { priority: newPriority });
  };

  const handleAssign = () => {
    onUpdate(report.id, { assignedTo: assignee });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In production, call API to add note
    const updatedNotes = [
      ...report.notes,
      {
        id: String(Date.now()),
        author: 'admin@urbanreflex.org',
        content: newNote,
        createdAt: new Date().toISOString()
      }
    ];
    
    onUpdate(report.id, { notes: updatedNotes });
    setNewNote('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${statusConfig[report.status].color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{report.title}</h2>
                  <p className="text-sm text-slate-500">Report #{report.id}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600">{report.description}</p>
                </div>

                {/* Location */}
                {report.locationName && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Location</h3>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{report.locationName}</span>
                      {report.locationId && (
                        <span className="text-sm text-slate-400">(ID: {report.locationId})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Notes & Comments</h3>
                  <div className="space-y-3 mb-4">
                    {report.notes.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No notes yet</p>
                    ) : (
                      report.notes.map((note) => (
                        <div key={note.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900">{note.author}</span>
                            <span className="text-xs text-slate-500">{formatDate(note.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                      placeholder="Add a note..."
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Status</h3>
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(e.target.value as Report['status'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Priority</h3>
                  <select
                    value={report.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Report['priority'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Type</h3>
                  <p className="text-slate-600">{typeLabels[report.type] || report.type}</p>
                </div>

                {/* Assign To */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Assign To</h3>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleAssign}
                      className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Reported by:</span>
                    <span className="font-medium text-slate-900">{report.reportedBy}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{formatDate(report.reportedAt)}</span>
                  </div>
                  {report.resolvedAt && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Resolved:</span>
                      <span className="font-medium text-slate-900">{formatDate(report.resolvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => onDelete(report.id)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

