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


/**
 * Report Status Management Utilities
 * 
 * @module lib/utils/reportStatus
 * @description Manages report status workflow and auto-approval logic
 * 
 * Status Flow:
 * submitted → ai_processing → [auto_approved | pending_review] 
 *           → [approved | rejected] → resolved
 */

/**
 * Report status types
 */
export type ReportStatus = 
  | 'submitted'       // User just submitted
  | 'ai_processing'   // AI is analyzing
  | 'auto_approved'   // Auto-approved by AI
  | 'pending_review'  // Needs admin review
  | 'approved'        // Manually approved by admin
  | 'rejected'        // Rejected by admin
  | 'resolved';       // Issue resolved

/**
 * Status display configuration
 */
export const STATUS_CONFIG: Record<ReportStatus, {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  isPublic: boolean; // Whether to show on public map
}> = {
  submitted: {
    label: 'Submitted',
    emoji: '📝',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Report just submitted, awaiting processing',
    isPublic: false
  },
  ai_processing: {
    label: 'Processing',
    emoji: '🤖',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    description: 'AI is analyzing and classifying',
    isPublic: false
  },
  auto_approved: {
    label: 'Auto Approved',
    emoji: '✅',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Automatically approved by AI and displayed publicly',
    isPublic: true
  },
  pending_review: {
    label: 'Pending Review',
    emoji: '⏳',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    description: 'Requires admin review and approval',
    isPublic: false
  },
  approved: {
    label: 'Approved',
    emoji: '✓',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Approved by admin and displayed publicly',
    isPublic: true
  },
  rejected: {
    label: 'Rejected',
    emoji: '✗',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    description: 'Report is invalid or duplicate',
    isPublic: false
  },
  resolved: {
    label: 'Resolved',
    emoji: '🎉',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
    description: 'Issue has been resolved',
    isPublic: true
  }
};

/**
 * Auto-approval criteria
 */
export interface AutoApprovalCriteria {
  minConfidence: number;      // Minimum AI confidence (0-1)
  allowedPriorities: string[]; // Allowed priority levels
  allowedSeverities: string[]; // Allowed severity levels
  requiresImage: boolean;      // Must have image verification
}

/**
 * Default auto-approval criteria
 */
export const DEFAULT_AUTO_APPROVAL_CRITERIA: AutoApprovalCriteria = {
  minConfidence: 0.7,
  allowedPriorities: ['low', 'medium'],
  allowedSeverities: ['low', 'medium'],
  requiresImage: true
};

/**
 * Check if report should be auto-approved
 * 
 * @param report - Report data with AI classification
 * @param criteria - Custom criteria (optional)
 * @returns true if report should be auto-approved
 */
export function shouldAutoApprove(
  report: {
    categoryConfidence?: number;
    priority?: string;
    severity?: string;
    verified?: boolean;
    imageUrl?: string | string[];
  },
  criteria: AutoApprovalCriteria = DEFAULT_AUTO_APPROVAL_CRITERIA
): boolean {
  // Check confidence
  const confidence = report.categoryConfidence || 0;
  if (confidence < criteria.minConfidence) {
    console.log(`❌ Auto-approve failed: Low confidence (${confidence} < ${criteria.minConfidence})`);
    return false;
  }

  // Check priority
  const priority = report.priority?.toLowerCase() || 'unassigned';
  if (!criteria.allowedPriorities.includes(priority)) {
    console.log(`❌ Auto-approve failed: High priority (${priority})`);
    return false;
  }

  // Check severity
  const severity = report.severity?.toLowerCase() || 'unassigned';
  if (!criteria.allowedSeverities.includes(severity)) {
    console.log(`❌ Auto-approve failed: High severity (${severity})`);
    return false;
  }

  // Check image verification
  if (criteria.requiresImage) {
    const hasImage = report.verified || 
                    (report.imageUrl && (
                      (typeof report.imageUrl === 'string' && report.imageUrl.length > 0) ||
                      (Array.isArray(report.imageUrl) && report.imageUrl.length > 0)
                    ));
    if (!hasImage) {
      console.log(`❌ Auto-approve failed: No image verification`);
      return false;
    }
  }

  console.log(`✅ Auto-approve passed: confidence=${confidence}, priority=${priority}, severity=${severity}`);
  return true;
}

/**
 * Get next status after AI processing
 * 
 * @param report - Report with AI classification
 * @returns Next status (auto_approved or pending_review)
 */
export function getStatusAfterAI(report: {
  categoryConfidence?: number;
  priority?: string;
  severity?: string;
  verified?: boolean;
  imageUrl?: string | string[];
}): 'auto_approved' | 'pending_review' {
  return shouldAutoApprove(report) ? 'auto_approved' : 'pending_review';
}

/**
 * Check if report is publicly visible
 * 
 * @param status - Report status
 * @returns true if report should be shown on public map
 */
export function isPubliclyVisible(status: ReportStatus): boolean {
  return STATUS_CONFIG[status]?.isPublic || false;
}

/**
 * Get allowed status transitions from current status
 * 
 * @param currentStatus - Current report status
 * @param isAdmin - Whether user is admin
 * @returns Array of allowed next statuses
 */
export function getAllowedTransitions(
  currentStatus: ReportStatus,
  isAdmin: boolean
): ReportStatus[] {
  if (!isAdmin) {
    return []; // Normal users cannot change status
  }

  const transitions: Record<ReportStatus, ReportStatus[]> = {
    submitted: ['ai_processing', 'rejected'],
    ai_processing: ['auto_approved', 'pending_review', 'rejected'],
    auto_approved: ['resolved', 'rejected'],
    pending_review: ['approved', 'rejected'],
    approved: ['resolved', 'rejected'],
    rejected: ['pending_review'], // Can reopen
    resolved: [] // Terminal state
  };

  return transitions[currentStatus] || [];
}

/**
 * Get status badge classes for UI display
 * 
 * @param status - Report status
 * @returns CSS classes for badge
 */
export function getStatusBadgeClasses(status: ReportStatus): string {
  const config = STATUS_CONFIG[status];
  if (!config) return 'bg-gray-100 text-gray-700 border-gray-200';
  
  return `${config.bgColor} ${config.color} border`;
}

/**
 * Format status for display
 * 
 * @param status - Report status
 * @returns Formatted status string
 */
export function formatStatus(status: ReportStatus): string {
  const config = STATUS_CONFIG[status];
  return config ? `${config.emoji} ${config.label}` : status;
}
