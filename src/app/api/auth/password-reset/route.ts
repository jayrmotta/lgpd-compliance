import { NextRequest, NextResponse } from 'next/server';

interface PasswordResetRequest {
  email: string;
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
    let body: PasswordResetRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }
    const { email } = body;

    // Validate required fields
    if (!email) {
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

    // Security-safe response: Always return success regardless of whether email exists
    // This prevents email enumeration attacks
    return NextResponse.json(
      { code: 'PASSWORD_RESET_REQUESTED' } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}