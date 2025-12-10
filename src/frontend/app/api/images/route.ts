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
 * Image Upload API
 * 
 * POST /api/images - Upload image to Python backend (MongoDB)
 * 
 * @module app/api/images/route
 * @author WAG
 * @created 2025-12-07
 * @description Proxy API to forward image uploads to Python backend
 */

import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pulsar-ai.site';

/**
 * POST - Upload image to backend
 * 
 * Accepts FormData with 'file' field and forwards to Python backend
 * Returns: { url, hash, filename }
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        console.log('[Image API] Uploading image to backend...');

        // Forward to Python backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);

        const response = await fetch(`${PYTHON_BACKEND_URL}/api/images`, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Image API] Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Backend error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[Image API] Upload successful:', data);

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('[Image API] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to upload image',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
