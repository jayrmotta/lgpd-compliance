'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }
  return (
    <div data-testid="dashboard" className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">Painel de Conformidade LGPD</h1>
            <button 
              data-testid="logout-button"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div data-testid="welcome-message" className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Bem-vindo ao Sistema de Conformidade LGPD
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                Logado como: {userEmail}
              </p>
              <p className="text-gray-300">
                Aqui você pode gerenciar suas solicitações LGPD de forma segura e eficiente.
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              data-testid="request-data-access"
              className="bg-gray-800 overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
              onClick={() => router.push('/lgpd-requests?type=data_access')}
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Solicitar Dados</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Solicite acesso aos seus dados pessoais armazenados.
                </p>
              </div>
            </div>
            
            <div 
              data-testid="request-data-deletion"
              className="bg-gray-800 overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
              onClick={() => router.push('/lgpd-requests?type=data_deletion')}
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Excluir Dados</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Solicite a exclusão dos seus dados pessoais.
                </p>
              </div>
            </div>
            
            <div 
              data-testid="request-data-correction"
              className="bg-gray-800 overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
              onClick={() => router.push('/lgpd-requests?type=data_correction')}
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Corrigir Dados</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Solicite a correção de dados pessoais incorretos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}