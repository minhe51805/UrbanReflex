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

