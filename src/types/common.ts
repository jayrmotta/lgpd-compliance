// Common types used across the application

export interface APIResponse<T = unknown> {
  code: string;
  data?: T;
  message?: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: 'data_subject' | 'super_admin' | 'admin' | 'employee';
}

export interface LoginResponse {
  user: AuthUser;
}

export interface ErrorResponse {
  code: string;
  message?: string;
}

// Role hierarchy for authorization checks
export const ROLE_HIERARCHY = {
  'super_admin': 4,
  'admin': 3,
  'employee': 2,
  'data_subject': 1
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isCompanyUser(role: UserRole): boolean {
  return ['admin', 'employee'].includes(role);
}