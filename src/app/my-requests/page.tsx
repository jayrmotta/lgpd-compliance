'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/lib/auth-fetch';

interface Request {
  id: string;
  type: string;
  status: string;
  reason: string;
  description: string;
  created_at: string;
  response_due_at: string;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && email) {
      setIsAuthenticated(true);
      loadRequests();
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authenticatedFetch('/api/lgpd-requests');
      const data = await response.json();

      if (!response.ok) {
        setError(data.code || 'SERVER_ERROR');
        return;
      }

      setRequests(data.data?.requests || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setError('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'concluída':
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'processando':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRequestType = (type: string) => {
    const typeMap: Record<string, string> = {
      'ACCESS': 'Acesso',
      'DELETION': 'Exclusão',
      'CORRECTION': 'Correção',
      'PORTABILITY': 'Portabilidade'
    };
    return typeMap[type] || type;
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'COMPLETED': 'Concluída',
      'FAILED': 'Falhou'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div>Por favor, faça login para visualizar suas solicitações</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">Minhas Solicitações</h1>
            <div className="flex items-center gap-4">
              <a 
                href="/dashboard" 
                className="text-blue-400 hover:text-blue-300"
              >
                Dashboard
              </a>
              <a 
                href="/lgpd-requests" 
                className="text-blue-400 hover:text-blue-300"
              >
                Nova Solicitação
              </a>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-400 text-2xl mr-3">🔒</div>
              <div>
                <h3 className="text-blue-300 font-semibold">Criptografia Sealed Box Ativa</h3>
                <p className="text-blue-200 text-sm mt-1">• Seus dados pessoais estão criptografados usando libsodium</p>
                <p className="text-blue-200 text-sm">• Apenas a empresa pode descriptografar suas solicitações</p>
                <p className="text-blue-200 text-sm">• A plataforma opera com conhecimento zero dos seus dados</p>
                <p className="text-blue-200 text-sm">• Máxima proteção da privacidade implementada</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-white mb-6">
                Histórico de Solicitações LGPD
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>Erro ao carregar solicitações: {error}</p>
                  <button 
                    onClick={loadRequests}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">Carregando suas solicitações...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">Você ainda não fez nenhuma solicitação LGPD.</p>
                  <a 
                    href="/lgpd-requests"
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Criar Nova Solicitação
                  </a>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          ID da Solicitação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Data de Submissão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Criptografia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-600">
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {request.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {formatRequestType(request.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(formatStatus(request.status))}`}
                              data-testid={`request-status-${request.status.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {formatStatus(request.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {formatDate(request.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {request.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.description.includes('[ENCRYPTED]') ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                🔒 Sealed Box
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                ⚠️ Plaintext
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/lgpd-requests"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
            >
              Criar Nova Solicitação LGPD
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}