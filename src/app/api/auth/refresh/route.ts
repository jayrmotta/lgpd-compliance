import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { generateToken } from '@/lib/jwt';

interface APIResponse {
  code: string;
  data?: unknown;
  message?: string;
}

/**
 * Refresh JWT token endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    // If authResult is a NextResponse, it means authentication failed
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    // Generate new token with same user data
    const newToken = generateToken({
      userId: user.userId,
      email: user.email,
      userType: user.userType
    });
    
    return NextResponse.json(
      { 
        code: 'TOKEN_REFRESHED',
        data: {
          token: newToken,
          user: {
            userId: user.userId,
            email: user.email,
            userType: user.userType
          }
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}
