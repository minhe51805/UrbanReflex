/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 27-11-2025
 * Update at: 03-12-2025
 * Description: Test route to verify API keys endpoint is working
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API keys route is working!' });
}

