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
import bcrypt from 'bcryptjs';

// Mock database - In production, use PostgreSQL
let users: any[] = [
  {
    id: '1',
    email: 'admin@urbanreflex.org',
    password: '$2a$10$rOzJqCZQNEVJQvXVXvXvXeXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX', // hashed "admin123"
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$rOzJqCZQNEVJQvXVXvXvXeXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX', // hashed "user123"
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

// POST - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'user' } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and name are required'
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email already registered'
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role === 'admin' ? 'admin' : 'user', // Only allow admin if explicitly set
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token: `mock_token_${newUser.id}` // In production, generate JWT
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

// GET - Get all users (admin only, for development)
export async function GET(request: NextRequest) {
  // In production, check admin authentication
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  
  return NextResponse.json({
    success: true,
    data: usersWithoutPasswords
  });
}

