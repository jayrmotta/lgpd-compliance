'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      if (isLoggedIn === 'true' && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
      } else {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuth();
    
    // Check authentication on window focus (prevents access after logout in another tab)
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [router]);

  // Check authentication on every page visit
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      setIsAuthenticated(false);
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserEmail('');
    router.push('/logout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard" className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-foreground">
              Painel de Conformidade LGPD
            </h1>
            <Button 
              data-testid="logout-button"
              variant="destructive"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card data-testid="welcome-message" className="mb-6">
            <CardHeader>
              <CardTitle>Bem-vindo ao Sistema de Conformidade LGPD</CardTitle>
              <CardDescription>
                Logado como: {userEmail}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aqui você pode gerenciar suas solicitações LGPD de forma segura e eficiente.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card 
              data-testid="request-data-access"
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-accent/50"
              onClick={() => router.push('/lgpd-requests?type=data_access')}
            >
              <CardHeader>
                <CardTitle>Solicitar Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Solicite acesso aos seus dados pessoais armazenados.
                </p>
              </CardContent>
            </Card>
            
            <Card 
              data-testid="request-data-deletion"
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-accent/50"
              onClick={() => router.push('/lgpd-requests?type=data_deletion')}
            >
              <CardHeader>
                <CardTitle>Excluir Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Solicite a exclusão dos seus dados pessoais.
                </p>
              </CardContent>
            </Card>
            
            <Card 
              data-testid="request-data-correction"
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-accent/50"
              onClick={() => router.push('/lgpd-requests?type=data_correction')}
            >
              <CardHeader>
                <CardTitle>Corrigir Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Solicite a correção de dados pessoais incorretos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}