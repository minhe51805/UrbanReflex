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

function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

function parseDateTime(value: any): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'object' && value['@value']) {
    return value['@value'];
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

// GET - Get single report from NGSI-LD
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const encodedId = encodeURIComponent(id);
    
    const response = await fetch(`${ORION_URL}/entities/${encodedId}?options=keyValues`, {
      headers: {
        'Link': REPORT_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Report not found'
        }, { status: 404 });
      }
      throw new Error(`Failed to fetch report: ${response.status}`);
    }

    const report = await response.json();
    
    if (!report || (report.type !== 'CitizenReport' && report.type !== 'RoadReport')) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    // Map to component format
    const mappedReport = {
      id: report.id,
      type: getValue(report.category) || 'other',
      title: getValue(report.title) || 'Untitled Report',
      description: getValue(report.description) || '',
      status: getValue(report.status) || 'pending',
      priority: getValue(report.priority) || 'medium',
      locationId: null,
      locationName: null,
      reportedBy: getValue(report.reporterName) || getValue(report.reporterContact) || 'Unknown',
      reportedAt: parseDateTime(report.dateCreated),
      assignedTo: null,
      resolvedAt: report.resolvedAt ? parseDateTime(report.resolvedAt) : null,
      notes: [],
      metadata: {
        category: getValue(report.category),
        coordinates: report.location?.coordinates || null,
        reportId: report.id,
        images: report.images ? (Array.isArray(report.images) ? report.images : [report.images]) : [],
        imageCount: report.images ? (Array.isArray(report.images) ? report.images.length : 1) : 0,
      }
    };

    return NextResponse.json({
      success: true,
      data: mappedReport
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch report'
    }, { status: 500 });
  }
}

// PATCH - Update report in NGSI-LD
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const encodedId = encodeURIComponent(id);

    // First, get the current report to preserve other fields
    const getResponse = await fetch(`${ORION_URL}/entities/${encodedId}?options=keyValues`, {
      headers: {
        'Link': REPORT_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!getResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    const currentReport = await getResponse.json();

    // Update each attribute separately
    const updates: Promise<any>[] = [];

    // Update status if provided
    if (body.status) {
      const statusUpdate = {
        type: 'Property',
        value: body.status
      };
      
      updates.push(
        fetch(`${ORION_URL}/entities/${encodedId}/attrs/status`, {
          method: 'PATCH',
          headers: {
            'Link': REPORT_CONTEXT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(statusUpdate),
        })
      );
      
      // If resolving, add resolvedAt
      if (body.status === 'resolved') {
        const resolvedAtUpdate = {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': new Date().toISOString()
          }
        };
        
        updates.push(
          fetch(`${ORION_URL}/entities/${encodedId}/attrs/resolvedAt`, {
            method: 'PATCH',
            headers: {
              'Link': REPORT_CONTEXT,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(resolvedAtUpdate),
          })
        );
      }
    }

    // Update priority if provided
    if (body.priority) {
      const priorityUpdate = {
        type: 'Property',
        value: body.priority
      };
      
      updates.push(
        fetch(`${ORION_URL}/entities/${encodedId}/attrs/priority`, {
          method: 'PATCH',
          headers: {
            'Link': REPORT_CONTEXT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(priorityUpdate),
        })
      );
    }

    // Update type (category in NGSI-LD) if provided
    if (body.type) {
      // Map type to category values in NGSI-LD
      const typeToCategoryMap: Record<string, string> = {
        'road_report': 'streetlight_broken', // Default road report category
        'data_issue': 'data_issue',
        'missing_data': 'missing_data',
        'bug': 'bug',
        'feature_request': 'feature_request',
        'other': 'other'
      };
      
      const categoryValue = typeToCategoryMap[body.type] || body.type;
      
      const categoryUpdate = {
        type: 'Property',
        value: categoryValue
      };
      
      updates.push(
        fetch(`${ORION_URL}/entities/${encodedId}/attrs/category`, {
          method: 'PATCH',
          headers: {
            'Link': REPORT_CONTEXT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryUpdate),
        })
      );
    }

    // Execute all updates
    const patchResponses = await Promise.all(updates);
    
    // Check if any update failed
    const failedResponse = patchResponses.find(r => !r.ok);
    if (failedResponse) {
      const error = await failedResponse.json().catch(() => ({}));
      console.error('Error updating report in NGSI-LD:', error);
      return NextResponse.json({
        success: false,
        error: error.detail || `Failed to update report: ${failedResponse.status}`
      }, { status: failedResponse.status });
    }


    // Return updated report
    const updatedResponse = await fetch(`${ORION_URL}/entities/${encodedId}?options=keyValues`, {
      headers: {
        'Link': REPORT_CONTEXT,
      },
      cache: 'no-store',
    });

    if (!updatedResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Report updated successfully'
      });
    }

    const updatedReport = await updatedResponse.json();

    // Map category back to type
    const categoryToTypeMap: Record<string, string> = {
      'streetlight_broken': 'road_report',
      'traffic_issue': 'road_report',
      'waste_dump': 'road_report',
      'data_issue': 'data_issue',
      'missing_data': 'missing_data',
      'bug': 'bug',
      'feature_request': 'feature_request',
      'other': 'other'
    };
    
    const category = getValue(updatedReport.category) || '';
    const mappedType = categoryToTypeMap[category] || category || 'other';

    return NextResponse.json({
      success: true,
      data: {
        id: updatedReport.id,
        status: getValue(updatedReport.status) || body.status,
        priority: getValue(updatedReport.priority) || body.priority,
        type: mappedType,
        resolvedAt: updatedReport.resolvedAt ? parseDateTime(updatedReport.resolvedAt) : null,
      }
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update report'
    }, { status: 500 });
  }
}

// DELETE - Delete report from NGSI-LD
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const encodedId = encodeURIComponent(id);

    const response = await fetch(`${ORION_URL}/entities/${encodedId}`, {
      method: 'DELETE',
      headers: {
        'Link': REPORT_CONTEXT,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Report not found'
        }, { status: 404 });
      }
      throw new Error(`Failed to delete report: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete report'
    }, { status: 500 });
  }
}

