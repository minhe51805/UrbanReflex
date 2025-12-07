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

/**
 * Image Retrieval API
 * 
 * GET /api/images/{hash} - Retrieve image from Python backend (MongoDB)
 * 
 * @module app/api/images/[hash]/route
 * @author WAG
 * @created 2025-12-07
 * @description Proxy API to retrieve images from Python backend by hash
 */

import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://163.61.183.90:8001';

/**
 * GET - Retrieve image by hash
 * 
 * @param request - NextRequest
 * @param params - Route params containing hash
 * @returns Image binary with correct Content-Type
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ hash: string }> }
) {
    try {
        const { hash } = await params;

        if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
            return NextResponse.json(
                { error: 'Invalid hash format. Expected 64 character hex string.' },
                { status: 400 }
            );
        }

        console.log(`[Image API] Retrieving image: ${hash}`);

        // Forward to Python backend
        const response = await fetch(`${PYTHON_BACKEND_URL}/api/images/${hash}`, {
            method: 'GET',
            cache: 'force-cache', // Cache images for performance
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`[Image API] Image not found: ${hash}`);
                return NextResponse.json(
                    { error: 'Image not found' },
                    { status: 404 }
                );
            }

            const errorText = await response.text();
            console.error('[Image API] Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Backend error: ${response.status}` },
                { status: response.status }
            );
        }

        // Get image data and content type
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        console.log(`[Image API] Image retrieved: ${hash} (${contentType}, ${imageBuffer.byteLength} bytes)`);

        // Return image with proper headers
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year (images are immutable by hash)
            },
        });

    } catch (error) {
        console.error('[Image API] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to retrieve image',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
