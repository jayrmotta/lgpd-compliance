import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lgpd-dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Environment validation - only run in production runtime, not during build
function validateJWTConfig() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    if (JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long in production');
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'data_subject' | 'super_admin' | 'admin' | 'employee';
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for authenticated user
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  // Validate JWT configuration in production
  validateJWTConfig();
  
  // Use type assertion to handle JWT library typing issues
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Validate JWT configuration in production
    validateJWTConfig();
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    // Only log in development - production should handle auth failures silently for security
    if (process.env.NODE_ENV === 'development') {
      console.error('JWT verification failed:', error);
    }
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Refresh token (generates a new token with updated expiration)
 */
export function refreshToken(currentToken: string): string | null {
  const payload = verifyToken(currentToken);
  if (!payload) {
    return null;
  }
  
  // Add a small delay to ensure the new token has a different issued time
  // Remove JWT-specific fields and generate new token
  // Remove JWT-specific fields and keep only user data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { iat: _iat, exp: _exp, ...userPayload } = payload;
  
  // In production, you might want to add additional validation here
  // like checking if the token is close to expiry, etc.
  return generateToken(userPayload);
}
