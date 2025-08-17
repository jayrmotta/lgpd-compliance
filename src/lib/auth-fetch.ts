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

