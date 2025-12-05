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
import { processReportWithAI } from '@/lib/services/reportApproval';

export async function POST(request: NextRequest) {
  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: 'reportId is required' },
        { status: 400 }
      );
    }

    console.log(`[AI Process API] Processing report: ${reportId}`);

    // Process with AI and auto-approval logic
    const finalStatus = await processReportWithAI(reportId);

    if (!finalStatus) {
      return NextResponse.json(
        { error: 'Failed to process report with AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId,
      finalStatus,
      message: `Report processed successfully. Final status: ${finalStatus}`
    });

  } catch (error) {
    console.error('[AI Process API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
