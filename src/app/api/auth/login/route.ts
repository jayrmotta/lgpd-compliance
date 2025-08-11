import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { findUserByEmail } from '@/lib/user-storage';
import { generateToken } from '@/lib/jwt';

interface LoginRequest {
  email: string;
  password: string;
}

interface APIResponse {
  code: string;
  data?: unknown;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function POST(request: NextRequest) {
  try {
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { code: 'VALIDATION_EMAIL_INVALID' } as APIResponse,
        { status: 400 }
      );
    }

    // Find user by email
    const user = findUserByEmail(email);
    
    if (!user) {
      // Generic error message to prevent email enumeration
      return NextResponse.json(
        { code: 'INVALID_CREDENTIALS' } as APIResponse,
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { code: 'INVALID_CREDENTIALS' } as APIResponse,
        { status: 401 }
      );
    }

    // Generate JWT token for authenticated user
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType
    });

    return NextResponse.json(
      { 
        code: 'LOGIN_SUCCESS',
        data: {
          token,
          user: {
            userId: user.id,
            email: user.email,
            userType: user.userType
          }
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}