// Utility for making authenticated API requests with JWT in headers

export interface AuthenticatedFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Wrapper around fetch that automatically includes JWT token in Authorization header
 */
export async function authenticatedFetch(
  url: string, 
  options: AuthenticatedFetchOptions = {}
): Promise<Response> {
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Check if user has a valid token
 */
export function hasAuthToken(): boolean {
  const token = localStorage.getItem('authToken');
  return !!token;
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Clear all auth data
 */
export function clearAuthData(): void {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('authToken');
}