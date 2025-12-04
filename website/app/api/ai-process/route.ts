/**
 * AI Processing API Route
 * 
 * @description Manual trigger for AI classification and auto-approval
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
