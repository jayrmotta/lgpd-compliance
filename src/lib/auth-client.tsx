import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, AlertCircle } from 'lucide-react';

export interface User {
  userId: string;
  email: string;
  role: 'data_subject' | 'super_admin' | 'admin' | 'employee';
}

// Cache for user data to avoid repeated API calls
let userCache: User | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAuth(requiredRole?: 'data_subject' | 'super_admin' | 'admin' | 'employee') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      // Check if we have a token in localStorage or cookies
      const token = localStorage.getItem('authToken') || getCookie('authToken');
      
      if (!token) {
        if (requiredRole) {
          router.push('/login?error=AUTH_REQUIRED&returnTo=' + encodeURIComponent(window.location.pathname));
          return;
        }
        setLoading(false);
        return;
      }

      // Check cache first
      const now = Date.now();
      if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
        const cachedUser = userCache;
        
        // Check role if required
        if (requiredRole && cachedUser?.role !== requiredRole) {
          setError('INSUFFICIENT_PERMISSIONS');
          router.push('/dashboard?error=INSUFFICIENT_PERMISSIONS');
          return;
        }
        
        setUser(cachedUser);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Invalid token
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        userCache = null;
        cacheTimestamp = 0;
        
        if (requiredRole) {
          router.push('/login?error=AUTH_INVALID');
          return;
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      const userData = data.data?.user;

      // Check role if required
      if (requiredRole && userData?.role !== requiredRole) {
        setError('INSUFFICIENT_PERMISSIONS');
        router.push('/dashboard?error=INSUFFICIENT_PERMISSIONS');
        return;
      }

      // Update cache
      userCache = userData;
      cacheTimestamp = now;
      
      setUser(userData);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('AUTH_CHECK_FAILED');
      
      if (requiredRole) {
        router.push('/login?error=AUTH_CHECK_FAILED');
      }
    } finally {
      setLoading(false);
    }
  }, [requiredRole, router]);

  useEffect(() => {
    // Start auth check immediately
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    userCache = null;
    cacheTimestamp = 0;
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, loading, error, logout, checkAuth };
}

// Helper function to get cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Higher-order component for protecting pages
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole?: 'data_subject' | 'super_admin' | 'admin' | 'employee'
): React.ComponentType<T> {
  return function AuthenticatedComponent(props: T) {
    const { user, loading, error } = useAuth(requiredRole);

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Verificando autenticação...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">Erro de autenticação: {error}</p>
          </div>
        </div>
      );
    }

    if (!user && requiredRole) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Redirecionando para login...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}