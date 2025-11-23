import { NextRequest, NextResponse } from 'next/server';

// Mock database
const reports: any[] = [];

// POST - Add note to report
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // In production, find report from database
    // For now, return success
    const newNote = {
      id: String(Date.now()),
      author: body.author,
      content: body.content,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newNote
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to add note'
    }, { status: 500 });
  }
}

