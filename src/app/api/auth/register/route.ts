import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { findUserByEmail, addUser } from '@/lib/user-storage';

interface RegisterRequest {
  email: string;
  password: string;
  userType: 'data_subject' | 'company_representative' | 'super_admin';
}

interface APIResponse {
  code: string;
  data?: unknown;
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[A-Z]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[a-z]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  return null;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function POST(request: NextRequest) {
  try {
    let body: RegisterRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }
    const { email, password, userType } = body;

    // Validate required fields
    if (!email || !password || !userType) {
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

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { code: passwordError } as APIResponse,
        { status: 400 }
      );
    }

    // Validate userType
    if (!['data_subject', 'company_representative', 'super_admin'].includes(userType)) {
      return NextResponse.json(
        { code: 'VALIDATION_USER_TYPE_INVALID' } as APIResponse,
        { status: 400 }
      );
    }

    // Prevent self-registration for company representatives and super admins
    // These roles must be created by authorized personnel only
    if (userType === 'company_representative' || userType === 'super_admin') {
      return NextResponse.json(
        { code: 'REGISTRATION_COMPANY_REPRESENTATIVES_NOT_ALLOWED' } as APIResponse,
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      // Security-safe response: Don't reveal if email exists
      // This prevents email enumeration attacks
      return NextResponse.json(
        { code: 'REGISTRATION_SUCCESS' } as APIResponse,
        { status: 200 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create new user (only data_subject can self-register)
    const newUser = {
      email: email.toLowerCase(),
      passwordHash,
      role: 'data_subject' as const
    };

    await addUser(newUser);

    return NextResponse.json(
      { code: 'REGISTRATION_SUCCESS' } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}

