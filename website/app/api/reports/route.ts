/**
 * Citizen Reports API
 * Fetches and creates citizen reports with spatial query support
 * 
 * Author: Backend Integration Team
 * Date: 2025-11-27
 * 
 * Endpoints:
 * - GET /api/reports?lat=10.78&lon=106.7&maxDistance=1000
 * - POST /api/reports (create new report)
 */

import { NextRequest, NextResponse } from 'next/server';

const ORION_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';

// Context for CitizenReport
const REPORT_CONTEXT = '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

function parseDateTime(value: any): Date {
  if (!value) return new Date(0);
  if (typeof value === 'object' && value['@value']) {
    return new Date(value['@value']);
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  return new Date(0);
}

function getValue(prop: any): any {
  if (typeof prop === 'object' && prop !== null && 'value' in prop) {
    return prop.value;
  }
  return prop;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const maxDistance = searchParams.get('maxDistance') || '1000';
  const limit = searchParams.get('limit') || '50';

  try {
    // Fetch all report types
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
      let url = `${ORION_URL}/entities?type=${reportType}&options=keyValues&limit=${limit}`;
      
      // Add spatial query if coordinates provided
      if (lat && lon) {
        const coordinates = `[${lon},${lat}]`;
        url += `&georel=near;maxDistance==${maxDistance}&geometry=Point&coordinates=${coordinates}`;
      }
      
      try {
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
          }
        }
      } catch (error) {
        console.error(`Error fetching ${reportType}:`, error);
      }
    }
    
    if (allReports.length === 0) {
      return NextResponse.json({ reports: [], count: 0 });
    }

    // Format reports - giữ lại cả trường images / imageCount để frontend hiển thị gallery
    const reports = allReports.map((report: any) => {
      // Debug: log raw images từ NGSI-LD
      if (report.images || report.imageCount) {
        console.log(`[API /reports] Report ${report.id} images:`, report.images);
        console.log(`[API /reports] Report ${report.id} imageCount:`, report.imageCount);
      }
      
      return {
        id: report.id,
        title: getValue(report.title),
        description: getValue(report.description),
        category: getValue(report.category),
        status: getValue(report.status),
        priority: getValue(report.priority),
        reporterName: getValue(report.reporterName),
        reporterContact: getValue(report.reporterContact),
        dateCreated: report.dateCreated,
        location: report.location,
        refRoadSegment: report.refRoadSegment,
        // Raw images from NGSI-LD (có thể là array hoặc object) - sẽ được chuẩn hoá ở frontend
        images: report.images,
        imageCount: report.imageCount,
        // Thêm metadata nếu có (một số backend trả về images trong metadata)
        metadata: report.metadata || {},
      };
    });

    // Sort by dateCreated (newest first)
    reports.sort((a, b) => {
      const dateA = parseDateTime(a.dateCreated);
      const dateB = parseDateTime(b.dateCreated);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      reports,
      count: reports.length,
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      {
        type: 'error',
        title: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.type || body.type !== 'CitizenReport') {
      return NextResponse.json(
        { error: 'Missing required fields: id, type' },
        { status: 400 }
      );
    }

    const response = await fetch(`${ORION_URL}/entities`, {
      method: 'POST',
      headers: {
        'Link': REPORT_CONTEXT,
        'Content-Type': 'application/ld+json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        type: 'error',
        title: 'Request Failed',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));

      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      {
        type: 'error',
        title: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

