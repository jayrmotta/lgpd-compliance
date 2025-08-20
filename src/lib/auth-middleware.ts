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
 * Check if user has required role
 */
export function requireRole(
  user: JWTPayload, 
  requiredRole: 'data_subject' | 'super_admin' | 'admin' | 'employee'
): NextResponse | null {
  if (user.role !== requiredRole) {
    return NextResponse.json(
      { 
        code: 'AUTH_INSUFFICIENT_PERMISSIONS', 
        message: `This endpoint requires ${requiredRole} access` 
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Check if user has admin/employee access (single company deployment)
 */
export function requireCompanyAccess(user: JWTPayload): NextResponse | null {
  if (!['admin', 'employee'].includes(user.role)) {
    return NextResponse.json(
      { 
        code: 'AUTH_INSUFFICIENT_PERMISSIONS', 
        message: 'This endpoint requires admin or employee access' 
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Check if user is super admin
 */
export function requireSuperAdmin(user: JWTPayload): NextResponse | null {
  if (user.role !== 'super_admin') {
    return NextResponse.json(
      { 
        code: 'AUTH_INSUFFICIENT_PERMISSIONS', 
        message: 'This endpoint requires super admin access' 
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
