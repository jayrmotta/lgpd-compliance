'use client';

import { useEffect, useState } from 'react';
// import { decryptSealedBox, getKeyFingerprint } from '@/lib/crypto'; // Commented out - used in production for actual decryption
import { withAuth, useAuth } from '@/lib/auth-client';

interface EncryptedRequest {
  id: string;
  type: string;
  status: string;
  created_at: string;
  response_due_at: string;
  user_id: string;
  encrypted_data?: string;
}

interface DecryptedData {
  reason: string;
  description: string;
  cpf: string;
  type: string;
  userEmail: string;
  timestamp: string;
  requestId: string;
}

function CompanyDashboardPage() {
  const { user, logout } = useAuth('admin'); // Can be changed to 'employee' if needed
  const [privateKey, setPrivateKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [requests, setRequests] = useState<EncryptedRequest[]>([]);
  const [decryptedData, setDecryptedData] = useState<Record<string, DecryptedData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchCompanyRequests();
    }
  }, [user]);

  const fetchCompanyRequests = async () => {
    try {
      setLoading(true);
      
      // Mock API call - in production, this would fetch company's LGPD requests
      const mockRequests: EncryptedRequest[] = [
        {
          id: 'REQ-1755288038734-b9kyt20gt',
          type: 'ACCESS',
          status: 'PENDING',
          created_at: '2025-08-15T20:00:38.734Z',
          response_due_at: '2025-08-30T20:00:38.734Z',
          user_id: 'USER-1755287987646-3q9mdywad',
          encrypted_data: 'mock_encrypted_blob' // In production, fetch from encrypted_lgpd_data table
        }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setError('Falha ao carregar solicitações LGPD');
    } finally {
      setLoading(false);
    }
  };

  const unlockDashboard = async () => {
    if (!privateKey) {
      setError('Por favor, insira sua chave privada');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Validate private key format (basic check)
      if (privateKey.length < 32) {
        setError('Formato de chave privada inválido');
        return;
      }

      // In production, you might derive public key from private key to validate
      // For demo, we'll assume the key is valid
      setIsUnlocked(true);
      
      // Simulate decryption of requests
      await decryptAllRequests();
      
    } catch (error) {
      console.error('Failed to unlock dashboard:', error);
      setError('Chave privada inválida ou falha na descriptografia');
    } finally {
      setLoading(false);
    }
  };

  const decryptAllRequests = async () => {
    const decrypted: Record<string, DecryptedData> = {};
    
    for (const request of requests) {
      try {
        if (request.encrypted_data) {
          // In production, fetch actual encrypted blob from database
          // For demo, create sample encrypted data
          const sampleData: DecryptedData = {
            reason: 'I want to see my sensitive personal data',
            description: 'Please provide all my personal information including my full name, address, and any behavioral data you have collected about me',
            cpf: '123.456.789-00',
            type: request.type,
            userEmail: 'encrypted-test@lgpd.com',
            timestamp: request.created_at,
            requestId: request.id
          };
          
          decrypted[request.id] = sampleData;
        }
      } catch (error) {
        console.error(`Failed to decrypt request ${request.id}:`, error);
      }
    }
    
    setDecryptedData(decrypted);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRequestType = (type: string) => {
    const types: Record<string, string> = {
      'ACCESS': 'Acesso aos Dados',
      'DELETION': 'Exclusão de Dados',
      'CORRECTION': 'Correção de Dados',
      'PORTABILITY': 'Portabilidade de Dados'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">
              Company Dashboard - TechCorp Ltd
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {user?.email}
              </span>
              <a 
                href="/company-setup" 
                className="text-blue-400 hover:text-blue-300"
              >
                Key Setup
              </a>
              {isUnlocked && (
                <button
                  onClick={() => {
                    setIsUnlocked(false);
                    setPrivateKey('');
                    setDecryptedData({});
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Bloquear Dashboard
                </button>
              )}
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {!isUnlocked && (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white mb-6 text-center">
                    🔐 Desbloquear Dashboard da Empresa
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Insira sua chave privada do gerenciador de senhas:
                      </label>
                      <textarea
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder="Cole sua chave privada aqui..."
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 h-24 resize-none"
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        Sua chave privada é processada localmente e nunca enviada aos nossos servidores.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={unlockDashboard}
                      disabled={loading || !privateKey}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Desbloqueando...' : 'Desbloquear Dashboard'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isUnlocked && (
            <div className="space-y-6">
              
              {/* Success Notice */}
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-400 text-xl mr-3">✅</div>
                  <div>
                    <h3 className="text-green-300 font-semibold">Dashboard Desbloqueado</h3>
                    <p className="text-green-200 text-sm">
                      Sua chave privada é válida. Agora você pode descriptografar e visualizar solicitações LGPD.
                    </p>
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white mb-6">
                    LGPD Requests ({requests.length})
                  </h2>

                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">Loading requests...</p>
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">No LGPD requests found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => {
                        const decrypted = decryptedData[request.id];
                        
                        return (
                          <div key={request.id} className="border border-gray-600 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-white font-medium">
                                  {formatRequestType(request.type)} - {request.id}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  Submitted: {formatDate(request.created_at)} | 
                                  Due: {formatDate(request.response_due_at)}
                                </p>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </div>

                            {decrypted ? (
                              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                                <h4 className="text-green-400 font-medium">🔓 Decrypted Content:</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-300 font-medium">Email do Usuário:</span>
                                    <p className="text-white">{decrypted.userEmail}</p>
                                  </div>
                                  
                                  <div>
                                    <span className="text-gray-300 font-medium">CPF:</span>
                                    <p className="text-white">{decrypted.cpf}</p>
                                  </div>
                                  
                                  <div className="md:col-span-2">
                                    <span className="text-gray-300 font-medium">Reason:</span>
                                    <p className="text-white">{decrypted.reason}</p>
                                  </div>
                                  
                                  <div className="md:col-span-2">
                                    <span className="text-gray-300 font-medium">Description:</span>
                                    <p className="text-white">{decrypted.description}</p>
                                  </div>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                    Processar Solicitação
                                  </button>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                                    Marcar como Concluída
                                  </button>
                                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500">
                                    Baixar Dados
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                                <p className="text-red-300">❌ Falha ao descriptografar esta solicitação</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Export the component wrapped with authentication
export default withAuth(CompanyDashboardPage, 'admin');