/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 20-11-2025
 * Update at: 25-11-2025
 * Description: API route for adding notes to reports - POST notes to specific report
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock database
const reports: any[] = [];

// POST - Add note to report
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

