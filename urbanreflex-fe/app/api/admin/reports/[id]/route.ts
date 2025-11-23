import { NextRequest, NextResponse } from 'next/server';

// Mock database - In production, use PostgreSQL
let reports = [
  {
    id: '1',
    type: 'data_issue',
    title: 'Incorrect PM2.5 reading at Bangkok Station',
    description: 'The PM2.5 reading shows 999 which seems incorrect. Previous readings were around 50-80.',
    status: 'pending',
    priority: 'high',
    locationId: '2178',
    locationName: 'Bangkok, Thailand',
    reportedBy: 'user@example.com',
    reportedAt: '2024-01-15T10:30:00Z',
    assignedTo: null,
    resolvedAt: null,
    notes: []
  },
  {
    id: '2',
    type: 'missing_data',
    title: 'No data for Singapore station since yesterday',
    description: 'The monitoring station in Singapore has not reported any data for the past 24 hours.',
    status: 'in_progress',
    priority: 'medium',
    locationId: '8756',
    locationName: 'Singapore',
    reportedBy: 'admin@urbanreflex.org',
    reportedAt: '2024-01-14T15:20:00Z',
    assignedTo: 'tech@urbanreflex.org',
    resolvedAt: null,
    notes: [
      {
        id: '1',
        author: 'tech@urbanreflex.org',
        content: 'Investigating the issue. Station may be offline.',
        createdAt: '2024-01-14T16:00:00Z'
      }
    ]
  },
  {
    id: '3',
    type: 'feature_request',
    title: 'Add air quality alerts',
    description: 'Would be great to have email alerts when AQI exceeds certain thresholds.',
    status: 'resolved',
    priority: 'low',
    locationId: null,
    locationName: null,
    reportedBy: 'feature@example.com',
    reportedAt: '2024-01-10T09:00:00Z',
    assignedTo: 'product@urbanreflex.org',
    resolvedAt: '2024-01-13T14:30:00Z',
    notes: [
      {
        id: '1',
        author: 'product@urbanreflex.org',
        content: 'Added to roadmap for Q2 2024.',
        createdAt: '2024-01-13T14:30:00Z'
      }
    ]
  }
];

// GET - Get single report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const report = reports.find(r => r.id === params.id);

  if (!report) {
    return NextResponse.json({
      success: false,
      error: 'Report not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: report
  });
}

// PATCH - Update report
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const reportIndex = reports.findIndex(r => r.id === params.id);

    if (reportIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    // Update report
    reports[reportIndex] = {
      ...reports[reportIndex],
      ...body,
      resolvedAt: body.status === 'resolved' ? new Date().toISOString() : reports[reportIndex].resolvedAt
    };

    return NextResponse.json({
      success: true,
      data: reports[reportIndex]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update report'
    }, { status: 500 });
  }
}

// DELETE - Delete report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reportIndex = reports.findIndex(r => r.id === params.id);

  if (reportIndex === -1) {
    return NextResponse.json({
      success: false,
      error: 'Report not found'
    }, { status: 404 });
  }

  reports.splice(reportIndex, 1);

  return NextResponse.json({
    success: true,
    message: 'Report deleted successfully'
  });
}

