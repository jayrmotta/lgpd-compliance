'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div>Carregando...</div>;
  }
  return (
    <div data-testid="dashboard" className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">LGPD Compliance Dashboard</h1>
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
          <div data-testid="welcome-message" className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bem-vindo ao Sistema de Conformidade LGPD
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Logado como: {userEmail}
              </p>
              <p className="text-gray-600">
                Aqui você pode gerenciar suas solicitações LGPD de forma segura e eficiente.
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Solicitar Dados</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Solicite acesso aos seus dados pessoais armazenados.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Excluir Dados</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Solicite a exclusão dos seus dados pessoais.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Corrigir Dados</h3>
                <p className="mt-2 text-sm text-gray-600">
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