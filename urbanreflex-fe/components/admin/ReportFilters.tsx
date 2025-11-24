'use client';

import { Search, Filter } from 'lucide-react';

interface ReportFiltersProps {
  filters: {
    status: string;
    type: string;
    priority: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function ReportFilters({ filters, onFilterChange }: ReportFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="data_issue">Data Issue</option>
            <option value="missing_data">Missing Data</option>
            <option value="bug">Bug</option>
            <option value="feature_request">Feature Request</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Priority
        </label>
        <div className="flex space-x-2">
          {['all', 'low', 'medium', 'high'].map((priority) => (
            <button
              key={priority}
              onClick={() => onFilterChange({ ...filters, priority })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.priority === priority
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

