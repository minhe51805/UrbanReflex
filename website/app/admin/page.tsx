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

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { STATUS_CONFIG, formatStatus, getStatusBadgeClasses, getAllowedTransitions, type ReportStatus } from '@/lib/utils/reportStatus';
import { retrieveImages } from '@/lib/utils/imageProcessor';
import * as XLSX from 'xlsx';
import {
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Filter,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Activity,
  Settings,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Camera,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface UserForAdmin {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  is_admin: boolean;
  created_at?: string;
}

// Helper function to normalize images to array
const normalizeImages = (images: string | string[] | undefined): string[] => {
  if (!images) return [];
  if (typeof images === 'string') return [images];
  if (Array.isArray(images)) return images;
  return [];
};

interface Report {
  id: string;
  category: string;
  status: string;
  priority: string;
  description: string;
  title?: string;
  location?: {
    coordinates: [number, number];
  };
  created_at?: string;
  reportedAt?: string; // From API
  updated_at?: string;
  user_id?: string;
  road_id?: string;
  reportedBy?: string;
  locationName?: string;
  dateCreated?: string;
  metadata?: {
    images?: string | string[];
    categoryConfidence?: string;
    severity?: string;
    coordinates?: [number, number];
  };
}

type TabType = 'overview' | 'reports' | 'users' | 'settings';
type ReportStatusFilter = 'all' | ReportStatus;
type ReportPriority = 'all' | 'low' | 'medium' | 'high' | 'urgent';
type ReportCategory = 'all' | 'pothole' | 'traffic' | 'lighting' | 'safety' | 'other';
type DateRange = 'all' | 'today' | 'week' | 'month' | 'custom';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State
  const [users, setUsers] = useState<UserForAdmin[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Filter states
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatus, setReportStatus] = useState<ReportStatusFilter>('all');
  const [reportPriority, setReportPriority] = useState<ReportPriority>('all');
  const [reportCategory, setReportCategory] = useState<ReportCategory>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  
  // User filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [userSortBy, setUserSortBy] = useState<'name' | 'email' | 'created'>('name');
  
  // Edit user modal states
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserForAdmin | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    is_admin: false,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [activeEditTab, setActiveEditTab] = useState<'info' | 'password'>('info');
  
  // Delete user modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserForAdmin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Report detail modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [editingPriority, setEditingPriority] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<(string | null)[]>([]);

  // Stats
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const inProgressReports = reports.filter(r => r.status === 'in_progress').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const highPriorityReports = reports.filter(r => r.priority === 'high' || r.priority === 'urgent').length;
    
    return {
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports,
      highPriorityReports,
      totalUsers: users.length,
      adminUsers: users.filter(u => u.is_admin).length,
    };
  }, [reports, users]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Search filter
    if (reportSearch) {
      const searchLower = reportSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.description?.toLowerCase().includes(searchLower) ||
        r.category?.toLowerCase().includes(searchLower) ||
        r.id?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (reportStatus !== 'all') {
      filtered = filtered.filter(r => r.status === reportStatus);
    }

    // Priority filter
    if (reportPriority !== 'all') {
      filtered = filtered.filter(r => r.priority === reportPriority);
    }

    // Category filter
    if (reportCategory !== 'all') {
      filtered = filtered.filter(r => r.category === reportCategory);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'custom':
          if (customStartDate) {
            startDate = new Date(customStartDate);
            const endDate = customEndDate ? new Date(customEndDate) : new Date();
            filtered = filtered.filter(r => {
              const dateStr = r.reportedAt || r.created_at;
              if (!dateStr) return false;
              const reportDate = new Date(dateStr);
              return reportDate >= startDate && reportDate <= endDate;
            });
          }
          break;
        default:
          startDate = new Date(0);
      }

      if (dateRange !== 'custom') {
        filtered = filtered.filter(r => {
          const dateStr = r.reportedAt || r.created_at;
          if (!dateStr) return false;
          return new Date(dateStr) >= startDate;
        });
      }
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.reportedAt || a.created_at || 0).getTime();
      const dateB = new Date(b.reportedAt || b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [reports, reportSearch, reportStatus, reportPriority, reportCategory, dateRange, customStartDate, customEndDate]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (userSearch) {
      const searchLower = userSearch.toLowerCase();
      filtered = filtered.filter(u =>
        u.email?.toLowerCase().includes(searchLower) ||
        u.username?.toLowerCase().includes(searchLower) ||
        u.full_name?.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (userRoleFilter !== 'all') {
      filtered = filtered.filter(u =>
        userRoleFilter === 'admin' ? u.is_admin : !u.is_admin
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (userSortBy) {
        case 'name':
          return (a.full_name || '').localeCompare(b.full_name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'created':
          return (b.created_at || '').localeCompare(a.created_at || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, userSearch, userRoleFilter, userSortBy]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Load images from hashes when modal opens
  useEffect(() => {
    if (selectedReport && showReportModal) {
      const imageHashes = normalizeImages(selectedReport.metadata?.images);
      
      // Check if images are hashes (64 char hex) or data URLs
      const areHashes = imageHashes.every(img => 
        typeof img === 'string' && /^[a-f0-9]{64}$/i.test(img)
      );
      
      if (areHashes && imageHashes.length > 0) {
        console.log(`📸 Loading ${imageHashes.length} images from hashes...`);
        retrieveImages(imageHashes).then(images => {
          setLoadedImages(images);
          console.log(`✅ Loaded ${images.filter(img => img !== null).length}/${images.length} images`);
        });
      } else {
        // Already data URLs or old format
        setLoadedImages(imageHashes);
      }
    } else {
      setLoadedImages([]);
      setCurrentImageIndex(0);
    }
  }, [selectedReport, showReportModal]);

  const loadData = async () => {
        setLoading(true);
    setError('');
        try {
          const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Load users
      try {
        const usersRes = await fetch('http://163.61.183.90:8001/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          let usersArray = Array.isArray(usersData) ? usersData : usersData.users || [];
          
          // Ensure all users have id field (map from _id, user_id, etc. if needed)
          usersArray = usersArray.map((user: any) => ({
            ...user,
            id: user.id || user._id || user.user_id || user.userId || `user-${Date.now()}-${Math.random()}`,
          }));
          
          console.log('Loaded users:', usersArray.length, usersArray);
          setUsers(usersArray);
        } else if (usersRes.status === 404) {
          console.warn('Admin users endpoint not found, using empty array');
          setUsers([]);
        } else {
          console.error('Failed to load users:', usersRes.status);
        }
      } catch (usersErr) {
        console.error('Error loading users:', usersErr);
        setUsers([]);
      }

      // Load reports
      try {
        const reportsRes = await fetch('/api/admin/reports', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          console.log('📊 Reports response:', {
            status: reportsRes.status,
            dataType: Array.isArray(reportsData) ? 'array' : typeof reportsData,
            dataKeys: reportsData ? Object.keys(reportsData) : [],
            reportsCount: Array.isArray(reportsData) ? reportsData.length : reportsData.reports?.length || 0
          });
          
          const reportsArray = Array.isArray(reportsData) 
            ? reportsData 
            : reportsData.reports || reportsData.data || [];
          
          console.log('📊 Loaded reports:', reportsArray.length, reportsArray);
          setReports(reportsArray);
        } else if (reportsRes.status === 404) {
          console.warn('Admin reports endpoint not found, using empty array');
          setReports([]);
        } else {
          const errorData = await reportsRes.json().catch(() => ({}));
          console.error('Failed to load reports:', {
            status: reportsRes.status,
            error: errorData
          });
          setReports([]);
        }
      } catch (reportsErr) {
        console.error('Error loading reports:', reportsErr);
        setReports([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setReportSearch('');
    setReportStatus('all');
    setReportPriority('all');
    setReportCategory('all');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setUserSearch('');
    setUserRoleFilter('all');
  };

  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredReports.map((report) => {
        const dateStr = report.reportedAt || report.created_at;
        let formattedDate = 'N/A';
        if (dateStr) {
          try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          } catch (e) {
            formattedDate = dateStr;
          }
        }

        return {
          'ID': report.id,
          'Category': report.category || 'N/A',
          'Description': report.description || 'N/A',
          'Status': formatStatus(report.status as ReportStatus),
          'Priority': report.priority === 'urgent' ? 'Urgent' :
                       report.priority === 'high' ? 'High' :
                       report.priority === 'medium' ? 'Medium' : 'Low',
          'Created Date': formattedDate,
          'Reporter': report.reportedBy || 'N/A',
          'Location': report.locationName || 'N/A',
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

      // Set column widths automatically
      const columnWidths = [
        { wch: 30 }, // ID
        { wch: 15 }, // Category
        { wch: 50 }, // Description
        { wch: 20 }, // Status
        { wch: 15 }, // Priority
        { wch: 20 }, // Created Date
        { wch: 25 }, // Reporter
        { wch: 30 }, // Location
      ];
      worksheet['!cols'] = columnWidths;

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `Reports_${timestamp}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      setError('An error occurred while exporting Excel file. Please try again.');
    }
  };

  const openEditUserModal = (user: UserForAdmin) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      username: user.username || '',
      phone: user.phone || '',
      is_admin: user.is_admin || false,
    });
    setNewPassword('');
    setConfirmPassword('');
    setEditError('');
    setEditSuccess('');
    setActiveEditTab('info');
    setShowEditUserModal(true);
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setSelectedUser(null);
    setEditFormData({
      full_name: '',
      email: '',
      username: '',
      phone: '',
      is_admin: false,
    });
    setNewPassword('');
    setConfirmPassword('');
    setEditError('');
    setEditSuccess('');
    setActiveEditTab('info');
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setEditError('');
    setEditSuccess('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://163.61.183.90:8001/admin/users/${selectedUser.id}`, {
        method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
            },
        body: JSON.stringify(editFormData),
          });

      const data = await response.json();

          if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to update user');
      }

      setEditSuccess('Information updated successfully!');
      // Reload users list
      setTimeout(() => {
        loadData();
        closeEditUserModal();
      }, 1500);
        } catch (err: any) {
      setEditError(err.message || 'An error occurred while updating information');
      console.error('Update user error:', err);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    // Validation
    if (!newPassword || newPassword.length < 6) {
      setEditError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setEditError('Password confirmation does not match');
      return;
    }

    setEditError('');
    setEditSuccess('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://163.61.183.90:8001/admin/users/${selectedUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      });

      // Handle response - check if it's JSON or text
      let errorMessage = 'An error occurred while changing password';
      
      if (!response.ok) {
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            // Handle 422 validation error format: { detail: [{ loc: [...], msg: "...", type: "..." }] }
            if (response.status === 422 && Array.isArray(data.detail)) {
              const validationErrors = data.detail.map((err: any) => {
                const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field';
                return `${field}: ${err.msg || err.message || 'Validation error'}`;
              });
              errorMessage = validationErrors.join('; ') || 'Data validation error';
            } 
            // Handle other error formats
            else if (data.detail) {
              // If detail is a string
              if (typeof data.detail === 'string') {
                errorMessage = data.detail;
              } 
              // If detail is an array (other format)
              else if (Array.isArray(data.detail) && data.detail.length > 0) {
                errorMessage = data.detail[0].msg || data.detail[0].message || String(data.detail[0]);
              }
            } else {
              errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
            }
          } else {
            const text = await response.text();
            errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Success - try to parse JSON if available, otherwise just show success
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Password changed successfully:', data);
        }
      } catch (parseError) {
        // Response might be empty on success, which is fine
        console.log('Password changed successfully (empty response)');
      }

      setEditSuccess('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setActiveEditTab('info');
      }, 1500);
    } catch (err: any) {
      // Better error handling
      let errorMessage = 'An error occurred while changing password';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = err.message || err.detail || err.error || JSON.stringify(err);
      }
      
      setEditError(errorMessage);
      console.error('Change password error:', err);
    }
  };

  const openDeleteModal = (user: UserForAdmin) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    // Get user ID - try multiple possible fields
    const userId = userToDelete.id || 
                   (userToDelete as any)._id || 
                   (userToDelete as any).user_id ||
                   (userToDelete as any).userId;

    if (!userId) {
      setError('User ID not found. Please refresh the page and try again.');
      console.error('User object:', userToDelete);
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      console.log('Deleting user:', {
        userId,
        user: userToDelete
      });

      const response = await fetch(`http://163.61.183.90:8001/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.message || `Failed to delete user: ${response.status} ${response.statusText}`);
      }

      // Reload users list
      await loadData();
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the user');
      console.error('Delete user error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Update report via API
      const response = await fetch(`/api/admin/reports/${selectedReport.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editingStatus,
          priority: editingPriority,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to update report');
      }

      setUpdateSuccess('Report updated successfully!');
      
      // Update selected report immediately with new values
      const updatedReport = {
        ...selectedReport,
        status: editingStatus,
        priority: editingPriority,
      };
      setSelectedReport(updatedReport);
      
      // Reload reports list in background
      loadData();

      setTimeout(() => {
        setUpdateSuccess('');
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'An error occurred while updating report');
      console.error('Update report error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage UrbanReflex system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.full_name || user?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

        {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
          <button
                  key={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
          </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="py-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReports}</p>
                    </div>
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingReports}</p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgressReports}</p>
                    </div>
                    <Activity className="w-12 h-12 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolved</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedReports}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">High Priority</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{stats.highPriorityReports}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-red-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-12 h-12 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Administrators</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{stats.adminUsers}</p>
                    </div>
                    <Shield className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                  </h2>
          <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={reportSearch}
                          onChange={(e) => setReportSearch(e.target.value)}
                          placeholder="Search reports..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={reportStatus}
                        onChange={(e) => setReportStatus(e.target.value as ReportStatusFilter)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All</option>
                        <option value="submitted">{formatStatus('submitted')}</option>
                        <option value="ai_processing">{formatStatus('ai_processing')}</option>
                        <option value="auto_approved">{formatStatus('auto_approved')}</option>
                        <option value="pending_review">{formatStatus('pending_review')}</option>
                        <option value="approved">{formatStatus('approved')}</option>
                        <option value="rejected">{formatStatus('rejected')}</option>
                        <option value="resolved">{formatStatus('resolved')}</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={reportPriority}
                        onChange={(e) => setReportPriority(e.target.value as ReportPriority)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value as ReportCategory)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All</option>
                        <option value="pothole">Pothole</option>
                        <option value="traffic">Traffic</option>
                        <option value="lighting">Lighting</option>
                        <option value="safety">Safety</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as DateRange)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    {/* Custom Date Range */}
                    {dateRange === 'custom' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {/* Reset Button */}
                    <div className="flex items-end">
                      <button
                        onClick={resetFilters}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reports List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reports List ({filteredReports.length})
                  </h3>
                  <button 
                    onClick={exportToExcel}
                    disabled={filteredReports.length === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No reports found
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map((report, index) => (
                          <tr key={report.id || `report-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {report.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {report.category}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {report.description}
                            </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(report.status as ReportStatus)}`}
                              >
                                {formatStatus(report.status as ReportStatus)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  report.priority === 'urgent'
                                    ? 'bg-red-100 text-red-800'
                                    : report.priority === 'high'
                                    ? 'bg-orange-100 text-orange-800'
                                    : report.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {report.priority === 'urgent' ? 'Urgent' :
                                 report.priority === 'high' ? 'High' :
                                 report.priority === 'medium' ? 'Medium' : 'Low'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(() => {
                                const dateStr = report.reportedAt || report.created_at;
                                if (!dateStr) return 'N/A';
                                try {
                                  const date = new Date(dateStr);
                                  if (isNaN(date.getTime())) return 'Invalid Date';
                                  return date.toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  });
                                } catch {
                                  return 'Invalid Date';
                                }
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => {
                                  setSelectedReport(report);
                                  setEditingStatus(report.status || 'pending');
                                  setEditingPriority(report.priority || 'medium');
                                  setUpdateError('');
                                  setUpdateSuccess('');
                                  setShowReportModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 font-medium hover:underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                    </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* User Filters */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All</option>
                      <option value="admin">Administrator</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={userSortBy}
                      onChange={(e) => setUserSortBy(e.target.value as 'name' | 'email' | 'created')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="name">By Name</option>
                      <option value="email">By Email</option>
                      <option value="created">By Created Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Users List ({filteredUsers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No users found
                  </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <tr key={user.id || `user-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.full_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.username}
                            </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                              {user.is_admin ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  Administrator
                      </span>
                    ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                                onClick={() => openEditUserModal(user)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                    </button>
                  </td>
                </tr>
                        ))
                      )}
            </tbody>
          </table>
                </div>
              </div>
          </div>
        )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-500">Feature under development...</p>
      </div>
          )}
    </div>
      </div>

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Edit User Information</span>
              </h3>
              <button
                onClick={closeEditUserModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveEditTab('info')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeEditTab === 'info'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Information
                  </button>
                  <button
                    onClick={() => setActiveEditTab('password')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                      activeEditTab === 'password'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </nav>
              </div>

              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {editSuccess}
                </div>
              )}

              {/* Info Tab */}
              {activeEditTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_name}
                      onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.is_admin}
                        onChange={(e) => setEditFormData({ ...editFormData, is_admin: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Administrator</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeEditTab === 'password' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Change password for: <span className="font-medium text-gray-900">{selectedUser.full_name || selectedUser.username}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (minimum 6 characters)"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeEditUserModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {activeEditTab === 'info' ? (
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Confirm Delete User</span>
              </h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={deleteLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this user?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-medium text-gray-900">{userToDelete.full_name || 'N/A'}</p>
                <p className="text-sm text-gray-600">{userToDelete.email}</p>
                <p className="text-sm text-gray-500">@{userToDelete.username}</p>
              </div>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ This action cannot be undone!
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Delete User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết báo cáo</h3>
                  <p className="text-xs text-gray-500 mt-0.5">ID: {selectedReport.id.substring(0, 15)}...</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-3">
                {/* Title */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Tiêu đề
                  </label>
                  <h4 className="text-base font-bold text-gray-900 line-clamp-2">
                    {selectedReport.title || selectedReport.description || 'No title'}
                    {selectedReport.title || selectedReport.description || 'Không có tiêu đề'}
                  </h4>
                </div>

                {/* Status and Priority Row - Editable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Trạng thái
                      </label>
                      {editingStatus !== selectedReport.status && (
                        <span className="text-xs text-orange-600 font-medium">● Đã thay đổi</span>
                      )}
                    </div>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium ${
                        editingStatus !== selectedReport.status ? 'border-orange-400' : 'border-gray-300'
                      }`}
                    >
                      <option value="submitted">{formatStatus('submitted')}</option>
                      <option value="ai_processing">{formatStatus('ai_processing')}</option>
                      <option value="auto_approved">{formatStatus('auto_approved')}</option>
                      <option value="pending_review">{formatStatus('pending_review')}</option>
                      <option value="approved">{formatStatus('approved')}</option>
                      <option value="rejected">{formatStatus('rejected')}</option>
                      <option value="resolved">{formatStatus('resolved')}</option>
                    </select>
                    {/* Status Description */}
                    {editingStatus && STATUS_CONFIG[editingStatus as ReportStatus] && (
                      <p className="mt-1.5 text-xs text-gray-500">
                        {STATUS_CONFIG[editingStatus as ReportStatus].description}
                      </p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Độ ưu tiên
                      </label>
                      {editingPriority !== selectedReport.priority && (
                        <span className="text-xs text-orange-600 font-medium">● Đã thay đổi</span>
                      )}
                    </div>
                    <select
                      value={editingPriority}
                      onChange={(e) => setEditingPriority(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium ${
                        editingPriority !== selectedReport.priority ? 'border-orange-400' : 'border-gray-300'
                      }`}
                    >
                      <option value="low">⚪ Thấp</option>
                      <option value="medium">🟡 Trung bình</option>
                      <option value="high">🟠 Cao</option>
                      <option value="urgent">🔴 Khẩn cấp</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Update Messages */}
                {updateError && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
                    {updateError}
                  </div>
                )}
                {updateSuccess && (
                  <div className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
                    {updateSuccess}
                  </div>
                )}

                {/* Description */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Mô tả chi tiết
                  </label>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-xs text-gray-900 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
                      {selectedReport.description || (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Images Gallery - Carousel Style */}
                {(() => {
                  // Use loadedImages if available, otherwise fall back to raw images
                  const displayImages = loadedImages.length > 0 
                    ? loadedImages.filter(img => img !== null) as string[]
                    : normalizeImages(selectedReport.metadata?.images);
                    
                  if (displayImages.length === 0) return null;
                  
                  return (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Camera className="w-3 h-3" />
                      <span>Images ({displayImages.length})</span>
                    </label>
                    
                    {/* Main Image Display */}
                    <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100 mb-2" style={{ aspectRatio: '16/9' }}>
                      {loadedImages.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                            <p className="text-xs">Loading images...</p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={displayImages[currentImageIndex]}
                          alt={`Report image ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      )}
                      
                      {/* Navigation Arrows */}
                      {displayImages.length > 1 && loadedImages.length > 0 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => 
                                prev === 0 ? displayImages.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => 
                                prev === displayImages.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    </div>
                    
                    {/* Thumbnail Strip */}
                    {displayImages.length > 1 && loadedImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {displayImages.map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === idx
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })()}

                {/* AI Classification Metrics */}
                {(selectedReport.category || selectedReport.metadata?.categoryConfidence || selectedReport.metadata?.severity) && (
                  <div className="bg-gradient-to-br from-purple-50 to-white p-3 rounded-lg border border-purple-200">
                    <label className="block text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <span>Phân loại AI</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Category */}
                      <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                        <p className="text-xs text-gray-500 mb-1">Danh mục</p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedReport.category === 'pothole' && '🕳️ Ổ gà'}
                          {selectedReport.category === 'road_damage' && '🛣️ Hư hỏng đường'}
                          {selectedReport.category === 'traffic_sign' && '🚦 Biển báo'}
                          {selectedReport.category === 'streetlight' && '💡 Đèn đường'}
                          {selectedReport.category === 'drainage' && '💧 Thoát nước'}
                          {(!selectedReport.category || selectedReport.category === 'unknown') && '❓ Chưa xác định'}
                        </p>
                      </div>
                      
                      {/* Confidence */}
                      {selectedReport.metadata?.categoryConfidence && (
                        <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                          <p className="text-xs text-gray-500 mb-1">Độ tin cậy</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  parseFloat(selectedReport.metadata.categoryConfidence) >= 0.7 
                                    ? 'bg-green-500' 
                                    : parseFloat(selectedReport.metadata.categoryConfidence) >= 0.5
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${parseFloat(selectedReport.metadata.categoryConfidence) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {(parseFloat(selectedReport.metadata.categoryConfidence) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Priority */}
                      <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                        <p className="text-xs text-gray-500 mb-1">Mức độ ưu tiên AI</p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedReport.priority === 'low' && '⚪ Thấp'}
                          {selectedReport.priority === 'medium' && '🟡 Trung bình'}
                          {selectedReport.priority === 'high' && '🟠 Cao'}
                          {selectedReport.priority === 'urgent' && '🔴 Khẩn cấp'}
                        </p>
                      </div>
                      
                      {/* Severity */}
                      {selectedReport.metadata?.severity && (
                        <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                          <p className="text-xs text-gray-500 mb-1">Mức độ nghiêm trọng</p>
                          <p className="text-sm font-bold text-gray-900 capitalize">
                            {selectedReport.metadata.severity === 'low' && '⚪ Nhẹ'}
                            {selectedReport.metadata.severity === 'medium' && '🟡 Vừa'}
                            {selectedReport.metadata.severity === 'high' && '🟠 Nặng'}
                            {selectedReport.metadata.severity === 'critical' && '🔴 Nghiêm trọng'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Auto-approval conditions check */}
                    {selectedReport.metadata?.categoryConfidence && (
                      <div className="mt-3 p-2.5 bg-white rounded-lg border border-purple-100">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Điều kiện tự động duyệt:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            {parseFloat(selectedReport.metadata.categoryConfidence) >= 0.7 ? (
                              <span className="text-green-600">✅</span>
                            ) : (
                              <span className="text-red-600">❌</span>
                            )}
                            <span className="text-gray-700">
                              Độ tin cậy ≥ 70% ({(parseFloat(selectedReport.metadata.categoryConfidence) * 100).toFixed(0)}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {['low', 'medium'].includes(selectedReport.priority) ? (
                              <span className="text-green-600">✅</span>
                            ) : (
                              <span className="text-red-600">❌</span>
                            )}
                            <span className="text-gray-700">
                              Ưu tiên thấp/trung bình ({selectedReport.priority})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {selectedReport.metadata?.severity && ['low', 'medium'].includes(selectedReport.metadata.severity) ? (
                              <span className="text-green-600">✅</span>
                            ) : (
                              <span className="text-red-600">❌</span>
                            )}
                            <span className="text-gray-700">
                              Mức độ nhẹ/vừa ({selectedReport.metadata?.severity || 'N/A'})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {normalizeImages(selectedReport.metadata?.images).length > 0 ? (
                              <span className="text-green-600">✅</span>
                            ) : (
                              <span className="text-red-600">❌</span>
                            )}
                            <span className="text-gray-700">
                              Has images ({normalizeImages(selectedReport.metadata?.images).length} images)
                              Có hình ảnh ({normalizeImages(selectedReport.metadata?.images).length} ảnh)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Workflow Timeline */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-200">
                  <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span>Quy trình xử lý</span>
                    <span>PROCESSING WORKFLOW</span>
                  </label>
                  
                  <div className="relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                    
                    <div className="space-y-4">
                      {/* Step 1: Submitted */}
                      <div className="relative flex items-start gap-3">
                        <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedReport.status ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                          {selectedReport.status ? '✓' : '1'}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-bold text-gray-900">Report Submitted</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedReport.dateCreated 
                              ? new Date(selectedReport.dateCreated).toLocaleString('vi-VN')
                              : 'N/A'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Step 2: AI Processing */}
                      <div className="relative flex items-start gap-3">
                        <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedReport.metadata?.categoryConfidence !== undefined && selectedReport.metadata?.categoryConfidence !== ''
                            ? 'bg-green-500 text-white' 
                            : selectedReport.status === 'ai_processing'
                            ? 'bg-yellow-500 text-white animate-pulse'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          {selectedReport.metadata?.categoryConfidence !== undefined && selectedReport.metadata?.categoryConfidence !== '' ? '✓' : '2'}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-bold text-gray-900">AI Classification</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedReport.metadata?.categoryConfidence !== undefined && selectedReport.metadata?.categoryConfidence !== ''
                              ? `Completed - ${selectedReport.category || 'unknown'} (${(parseFloat(selectedReport.metadata.categoryConfidence) * 100).toFixed(0)}%)`
                              : selectedReport.status === 'ai_processing'
                              ? 'Processing...'
                              : 'Pending'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Step 3: Auto Approval or Review */}
                      <div className="relative flex items-start gap-3">
                        <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          ['auto_approved', 'approved', 'rejected', 'resolved'].includes(selectedReport.status)
                            ? 'bg-green-500 text-white'
                            : selectedReport.status === 'pending_review'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          {['auto_approved', 'approved', 'rejected', 'resolved'].includes(selectedReport.status) ? '✓' : '3'}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-bold text-gray-900">
                            {selectedReport.status === 'auto_approved' && 'Auto Approved'}
                            {selectedReport.status === 'pending_review' && 'Pending Review'}
                            {selectedReport.status === 'approved' && 'Approved'}
                            {selectedReport.status === 'rejected' && 'Rejected'}
                            {!['auto_approved', 'pending_review', 'approved', 'rejected', 'resolved'].includes(selectedReport.status) && 'Pending Review'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedReport.status === 'auto_approved' && 'Meets auto-approval conditions'}
                            {selectedReport.status === 'pending_review' && 'Requires manual review'}
                            {selectedReport.status === 'approved' && 'Administrator approved'}
                            {selectedReport.status === 'rejected' && 'Administrator rejected'}
                            {selectedReport.status === 'auto_approved' && '✨ Đáp ứng điều kiện tự động duyệt'}
                            {selectedReport.status === 'pending_review' && '⏳ Cần kiểm tra thủ công'}
                            {selectedReport.status === 'approved' && '✅ Quản trị viên đã duyệt'}
                            {selectedReport.status === 'rejected' && '❌ Quản trị viên đã từ chối'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Step 4: Resolved (if applicable) */}
                      <div className="relative flex items-start gap-3">
                        <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedReport.status === 'resolved'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          {selectedReport.status === 'resolved' ? '✓' : '4'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">Resolved</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedReport.status === 'resolved'
                              ? 'Issue has been resolved'
                              : 'Pending resolution'
                              ? '🎉 Vấn đề đã được xử lý'
                              : 'Chờ xử lý'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {selectedReport.locationName && (
                  <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-lg border border-green-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-green-600" />
                      <span>Vị trí báo cáo</span>
                    </label>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Tọa độ</p>
                        <p className="text-xs font-mono text-gray-900">
                          {selectedReport.locationName}
                        </p>
                      </div>
                      {selectedReport.metadata?.coordinates && Array.isArray(selectedReport.metadata.coordinates) && selectedReport.metadata.coordinates.length >= 2 && (
                        <a
                          href={`https://www.google.com/maps?q=${selectedReport.metadata.coordinates[1]},${selectedReport.metadata.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Xem trên Google Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Category and Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-2 rounded-lg border border-blue-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Category
                    </label>
                    <p className="text-xs font-medium text-gray-900 capitalize">
                      {selectedReport.category || 'Other'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white p-2 rounded-lg border border-purple-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center space-x-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Created Date</span>
                    </label>
                    <p className="text-xs font-medium text-gray-900">
                      {(() => {
                        const dateStr = selectedReport.reportedAt || selectedReport.created_at;
                        if (!dateStr) return 'N/A';
                        try {
                          const date = new Date(dateStr);
                          if (isNaN(date.getTime())) return 'Invalid Date';
                          return date.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch {
                          return 'Invalid Date';
                        }
                      })()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-2 rounded-lg border border-indigo-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center space-x-1">
                      <User className="w-2.5 h-2.5" />
                      <span>Reporter</span>
                    </label>
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {selectedReport.reportedBy || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Full Report ID */}
                <div className="bg-gray-900 p-2 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Full ID
                  </label>
                  <p className="text-xs font-mono text-gray-300 break-all">{selectedReport.id}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleUpdateReport}
                disabled={updateLoading || (editingStatus === selectedReport.status && editingPriority === selectedReport.priority)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {updateLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

