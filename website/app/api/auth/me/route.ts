import { NextRequest, NextResponse } from 'next/server';

// Mock users database
const users = [
  {
    id: '1',
    email: 'admin@urbanreflex.org',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

// GET - Get current user
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }

    // In production, verify JWT and get user ID
    // For now, extract user ID from mock token
    const userId = token.split('_')[2];
    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get user'
    }, { status: 500 });
  }
}

