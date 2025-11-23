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
  },
  {
    id: '4',
    type: 'bug',
    title: 'Map not loading on mobile',
    description: 'The map explorer page fails to load on iPhone Safari.',
    status: 'pending',
    priority: 'high',
    locationId: null,
    locationName: null,
    reportedBy: 'mobile@example.com',
    reportedAt: '2024-01-16T08:45:00Z',
    assignedTo: null,
    resolvedAt: null,
    notes: []
  },
  {
    id: '5',
    type: 'data_issue',
    title: 'Duplicate measurements',
    description: 'Seeing duplicate measurements for the same timestamp at Delhi station.',
    status: 'in_progress',
    priority: 'medium',
    locationId: '4521',
    locationName: 'Delhi, India',
    reportedBy: 'data@example.com',
    reportedAt: '2024-01-15T12:00:00Z',
    assignedTo: 'data@urbanreflex.org',
    resolvedAt: null,
    notes: []
  }
];

// GET - Get all reports with filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');

  let filteredReports = [...reports];

  // Filter by status
  if (status && status !== 'all') {
    filteredReports = filteredReports.filter(r => r.status === status);
  }

  // Filter by type
  if (type && type !== 'all') {
    filteredReports = filteredReports.filter(r => r.type === type);
  }

  // Filter by priority
  if (priority && priority !== 'all') {
    filteredReports = filteredReports.filter(r => r.priority === priority);
  }

  // Search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredReports = filteredReports.filter(r => 
      r.title.toLowerCase().includes(searchLower) ||
      r.description.toLowerCase().includes(searchLower) ||
      r.reportedBy.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date (newest first)
  filteredReports.sort((a, b) => 
    new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  return NextResponse.json({
    success: true,
    data: filteredReports,
    meta: {
      total: filteredReports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      in_progress: reports.filter(r => r.status === 'in_progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length
    }
  });
}

// POST - Create new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newReport = {
      id: String(reports.length + 1),
      type: body.type,
      title: body.title,
      description: body.description,
      status: 'pending',
      priority: body.priority || 'medium',
      locationId: body.locationId || null,
      locationName: body.locationName || null,
      reportedBy: body.reportedBy,
      reportedAt: new Date().toISOString(),
      assignedTo: null,
      resolvedAt: null,
      notes: []
    };

    reports.push(newReport);

    return NextResponse.json({
      success: true,
      data: newReport
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create report'
    }, { status: 500 });
  }
}

