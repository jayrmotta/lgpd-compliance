import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';

interface APIResponse {
  code: string;
  data?: unknown;
  message?: string;
}

/**
 * Verify JWT token endpoint - useful for checking if user is still authenticated
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    // If authResult is a NextResponse, it means authentication failed
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    return NextResponse.json(
      { 
        code: 'TOKEN_VALID',
        data: {
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
    console.error('Token verification error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}

/**
 * GET method for browser-friendly token verification
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
