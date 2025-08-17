import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  userId: string;
  email: string;
  role: 'data_subject' | 'super_admin' | 'admin' | 'employee';
}

export function useAuth(requiredRole?: 'data_subject' | 'super_admin' | 'admin' | 'employee') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token in localStorage or cookies
        const token = localStorage.getItem('auth-token') || getCookie('auth-token');
        
        if (!token) {
          if (requiredRole) {
            router.push('/login?error=AUTH_REQUIRED&returnTo=' + encodeURIComponent(window.location.pathname));
            return;
          }
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
          localStorage.removeItem('auth-token');
          document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          if (requiredRole) {
            router.push('/login?error=AUTH_INVALID');
            return;
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        const userData = data.data;

        // Check role if required
        if (requiredRole && userData.role !== requiredRole) {
          setError('INSUFFICIENT_PERMISSIONS');
          router.push('/dashboard?error=INSUFFICIENT_PERMISSIONS');
          return;
        }

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
    };

    checkAuth();
  }, [requiredRole, router]);

  const logout = () => {
    localStorage.removeItem('auth-token');
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    router.push('/login');
  };

  return { user, loading, error, logout };
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Verificando autenticação...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-red-400">Erro de autenticação: {error}</div>
        </div>
      );
    }

    if (!user && requiredRole) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Redirecionando para login...</div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}