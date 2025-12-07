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


import { NextRequest, NextResponse } from 'next/server';

// GET - Get admin statistics
export async function GET(request: NextRequest) {
  // Mock statistics - In production, calculate from database
  const stats = {
    overview: {
      totalReports: 127,
      totalUsers: 1543,
      activeLocations: 8756,
      avgResponseTime: '4.2 hours'
    },
    reports: {
      total: 127,
      pending: 23,
      in_progress: 18,
      resolved: 82,
      rejected: 4,
      byType: {
        data_issue: 45,
        missing_data: 32,
        bug: 28,
        feature_request: 18,
        other: 4
      },
      byPriority: {
        low: 38,
        medium: 54,
        high: 35
      }
    },
    trends: {
      reportsThisWeek: 15,
      reportsLastWeek: 12,
      resolvedThisWeek: 18,
      resolvedLastWeek: 14,
      avgResolutionTime: '6.5 hours',
      avgResolutionTimePrevious: '8.2 hours'
    },
    topReporters: [
      {
        email: 'user1@example.com',
        count: 12,
        resolved: 10
      },
      {
        email: 'user2@example.com',
        count: 8,
        resolved: 7
      },
      {
        email: 'user3@example.com',
        count: 6,
        resolved: 5
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'report_created',
        description: 'New data issue reported for Bangkok station',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: '2',
        type: 'report_resolved',
        description: 'Bug report #45 marked as resolved',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '3',
        type: 'report_assigned',
        description: 'Report #67 assigned to tech@urbanreflex.org',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ]
  };

  return NextResponse.json({
    success: true,
    data: stats
  });
}

