import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { findUserByEmail, updateUser } from '@/lib/user-storage';
import { requireAuth } from '@/lib/auth-middleware';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    let body: ChangePasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { code: 'VALIDATION_PASSWORDS_DONT_MATCH' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json(
        { code: passwordError } as APIResponse,
        { status: 400 }
      );
    }

    // Get current user from database
    const currentUser = await findUserByEmail(user.email);
    if (!currentUser) {
      return NextResponse.json(
        { code: 'USER_NOT_FOUND' } as APIResponse,
        { status: 404 }
      );
    }

    // Verify current password
    const currentPasswordValid = await compare(currentPassword, currentUser.passwordHash);
    if (!currentPasswordValid) {
      return NextResponse.json(
        { code: 'INVALID_CURRENT_PASSWORD' } as APIResponse,
        { status: 400 }
      );
    }

    // Check that new password is different from current
    const samePassword = await compare(newPassword, currentUser.passwordHash);
    if (samePassword) {
      return NextResponse.json(
        { code: 'NEW_PASSWORD_SAME_AS_CURRENT' } as APIResponse,
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hash(newPassword, 12);

    // Update user password and remove temporary flag
    const updatedUser = {
      ...currentUser,
      passwordHash: newPasswordHash,
      passwordTemporary: false
    };

    // Update in database
    await updateUser(updatedUser);

    return NextResponse.json(
      { 
        code: 'PASSWORD_CHANGE_SUCCESS',
        data: {
          message: 'Password updated successfully'
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}