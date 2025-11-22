import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock database - In production, use PostgreSQL
const users = [
  {
    id: '1',
    email: 'admin@urbanreflex.org',
    password: '$2a$10$YourHashedPasswordHere', // "admin123"
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$YourHashedPasswordHere', // "user123"
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

// POST - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // For development: Simple password check (bypass bcrypt for demo)
    // In production, use: const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = 
      (email === 'admin@urbanreflex.org' && password === 'admin123') ||
      (email === 'user@example.com' && password === 'user123') ||
      await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Generate token (in production, use JWT)
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}

