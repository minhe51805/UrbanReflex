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

const ORION_URL = 'http://103.178.233.233:1026/ngsi-ld/v1';
const REPORT_CONTEXT = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

// Helper functions
function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

function parseDateTime(value: any): string {
  if (!value) return new Date().toISOString();
  
  // Handle NGSI-LD DateTime format
  if (typeof value === 'object' && value !== null) {
    if (value['@value']) {
      return value['@value'];
    }
    if (value.value && typeof value.value === 'object' && value.value['@value']) {
      return value.value['@value'];
    }
    if (value.value && typeof value.value === 'string') {
      return value.value;
    }
  }
  
  // Handle string format
  if (typeof value === 'string') {
    // Try to parse the string
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return value;
  }
  
  // Fallback to current time
  return new Date().toISOString();
}

// Map NGSI-LD entity type to display category
function mapEntityTypeToCategory(entityType: string): string {
  const typeMap: Record<string, string> = {
    'RoadReport': 'road_damage',
    'PotholeReport': 'pothole',
    'TrafficSignReport': 'traffic_sign',
    'StreetlightReport': 'streetlight',
    'DrainageReport': 'drainage',
    'CitizenReport': 'other'
  };
  return typeMap[entityType] || 'other';
}

// Map NGSI-LD category to report type
function mapCategoryToType(category: string): string {
  const categoryMap: Record<string, string> = {
    'streetlight_broken': 'road_report',
    'traffic_issue': 'road_report',
    'waste_dump': 'road_report',
    'data_issue': 'data_issue',
    'bug': 'bug',
    'feature_request': 'feature_request',
    'missing_data': 'missing_data',
  };
  return categoryMap[category] || 'other';
}

// GET - Get all reports with filters from NGSI-LD
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Fetch all reports from NGSI-LD (all entity types)
    const reportTypes = [
      'CitizenReport',
      'RoadReport',
      'PotholeReport',
      'TrafficSignReport',
      'StreetlightReport',
      'DrainageReport'
    ];
    let allReports: any[] = [];

    for (const reportType of reportTypes) {
      try {
        let url = `${ORION_URL}/entities?type=${reportType}&options=keyValues&limit=1000`;
        
        const response = await fetch(url, {
          headers: {
            'Link': REPORT_CONTEXT,
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            allReports.push(...data);
            console.log(`✅ Fetched ${data.length} ${reportType} reports`);
          }
        } else {
          console.warn(`⚠️ Failed to fetch ${reportType}:`, response.status, response.statusText);
        }
      } catch (error) {
        console.error(`❌ Error fetching ${reportType}:`, error);
      }
    }

    if (allReports.length === 0) {
      console.log('📊 No reports found in NGSI-LD');
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          total: 0,
          pending: 0,
          in_progress: 0,
          resolved: 0,
          rejected: 0
        }
      });
    }

    const data = allReports;

    // Map NGSI-LD format to component format
    let reports = data.map((report: any) => {
      // Use entity type to determine category if category field is missing
      const category = getValue(report.category) || mapEntityTypeToCategory(report.type);
      const reportType = mapCategoryToType(category);
      
      // Extract location info
      let locationId = null;
      let locationName = null;
      if (report.refRoadSegment) {
        const roadSegment = getValue(report.refRoadSegment);
        if (typeof roadSegment === 'string') {
          locationId = roadSegment.split(':').pop() || roadSegment;
        } else if (typeof roadSegment === 'object' && roadSegment.object) {
          locationId = roadSegment.object.split(':').pop() || roadSegment.object;
        }
      }
      
      // Extract coordinates for location name
      if (report.location && report.location.coordinates) {
        const coords = report.location.coordinates;
        if (Array.isArray(coords) && coords.length >= 2) {
          locationName = `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
        }
      }

      return {
        id: report.id,
        type: reportType,
        entityType: report.type, // NGSI-LD entity type (RoadReport, PotholeReport, etc.)
        title: getValue(report.title) || 'Untitled Report',
        description: getValue(report.description) || '',
        status: getValue(report.status) || 'pending',
        priority: getValue(report.priority) || 'unassigned',
        locationId: locationId,
        locationName: locationName,
        reportedBy: getValue(report.reporterName) || getValue(report.reporterEmail) || getValue(report.reporterContact) || 'Unknown',
        reportedAt: parseDateTime(report.dateCreated),
        assignedTo: null,
        resolvedAt: report.resolvedAt ? parseDateTime(report.resolvedAt) : null,
        notes: [],
        metadata: {
          category: category,
          categoryConfidence: getValue(report.categoryConfidence) || '',
          severity: getValue(report.severity) || '',
          coordinates: report.location?.coordinates || null,
          reportId: report.id,
          images: getValue(report.images) || [],
          imageCount: getValue(report.imageCount) || 0,
        }
      };
    });

    // Filter by status
    if (status && status !== 'all') {
      reports = reports.filter((r: any) => r.status === status);
    }

    // Filter by type
    if (type && type !== 'all') {
      reports = reports.filter((r: any) => r.type === type);
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      reports = reports.filter((r: any) => r.priority === priority);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      reports = reports.filter((r: any) => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.reportedBy.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    reports.sort((a: any, b: any) => 
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );

    // Calculate meta stats from all reports (before filtering)
    const allReportsForStats = data.map((report: any) => ({
      status: getValue(report.status) || 'pending',
    }));

    return NextResponse.json({
      success: true,
      data: reports,
      meta: {
        total: reports.length,
        pending: allReportsForStats.filter((r: any) => r.status === 'pending').length,
        in_progress: allReportsForStats.filter((r: any) => r.status === 'in_progress').length,
        resolved: allReportsForStats.filter((r: any) => r.status === 'resolved').length,
        rejected: allReportsForStats.filter((r: any) => r.status === 'rejected').length
      }
    });
  } catch (error) {
    console.error('Error in GET /api/admin/reports:', error);
    return NextResponse.json({
      success: true,
      data: [],
      meta: {
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0
      }
    });
  }
}

// POST - Create new report (delegate to /api/reports)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to the main reports API endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create report' }));
      return NextResponse.json({
        success: false,
        error: error.error || error.detail || 'Failed to create report'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Report created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create report'
    }, { status: 500 });
  }
}

