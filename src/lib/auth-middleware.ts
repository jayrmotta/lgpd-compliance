import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, type JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Authentication middleware for API routes
 * Returns the user payload if authentication is successful, or an error response
 */
export function requireAuth(request: NextRequest): { user: JWTPayload } | NextResponse {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return NextResponse.json(
      { code: 'AUTH_TOKEN_MISSING', message: 'Authorization token is required' },
      { status: 401 }
    );
  }
  
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json(
      { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  return { user };
}

/**
 * Check if user has required user type
 */
export function requireUserType(
  user: JWTPayload, 
  requiredType: 'data_subject' | 'company_representative'
): NextResponse | null {
  if (user.userType !== requiredType) {
    return NextResponse.json(
      { 
        code: 'AUTH_INSUFFICIENT_PERMISSIONS', 
        message: `This endpoint requires ${requiredType} access` 
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Optional authentication - returns user if token is valid, but doesn't fail if missing
 */
export function optionalAuth(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}
