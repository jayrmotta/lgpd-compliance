'use client';

import { useEffect, useState } from 'react';
import { decryptSealedBox } from '@/lib/crypto';
import { withAuth, useAuth } from '@/lib/auth-client';
import { authenticatedFetch } from '@/lib/auth-fetch';

interface EncryptedRequest {
  id: string;
  type: string;
  status: string;
  created_at: string;
  response_due_at: string;
  user_id: string;
  encrypted_data?: string;
  reason?: string;
  description?: string;
  cpf_hash?: string;
  pix_transaction_hash?: string;
  completed_at?: string;
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
  const { user, logout } = useAuth(); // Middleware handles admin/employee authorization
  const [privateKey, setPrivateKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [requests, setRequests] = useState<EncryptedRequest[]>([]);
  const [decryptedData, setDecryptedData] = useState<Record<string, DecryptedData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyPublicKey, setCompanyPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCompanyMetadata();
      fetchCompanyRequests();
    }
  }, [user]);

  const fetchCompanyMetadata = async () => {
    try {
      const response = await authenticatedFetch('/api/company/metadata');
      if (response.ok) {
        const data = await response.json();
        setCompanyPublicKey(data.data.publicKey);
      } else {
        console.error('Failed to fetch company metadata:', response.status);
        setError('Falha ao carregar metadados da empresa');
      }
    } catch (error) {
      console.error('Failed to fetch company metadata:', error);
      setError('Falha ao carregar metadados da empresa');
    }
  };

  const fetchCompanyRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch real company LGPD requests from API
      const response = await authenticatedFetch('/api/company/lgpd-requests');
      
      if (!response.ok) {
        const data = await response.json();
        console.error('Failed to fetch requests:', response.status, data);
        throw new Error(data.message || 'Failed to fetch requests');
      }
      
      const data = await response.json();
      const requests = data.data.requests || [];
      
      setRequests(requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setError('Falha ao carregar solicitações LGPD: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

      // Make sure we have the company public key
      if (!companyPublicKey) {
        setError('Chave pública da empresa não encontrada. Por favor, recarregue a página.');
        return;
      }

      // Validate and convert private key format
      let convertedPrivateKey: string;
      let secretKeyUint8: Uint8Array;
      try {
        // Import the sodium library for validation
        const { default: sodium } = await import('libsodium-wrappers');
        await sodium.ready;
        
        // Convert URL-safe base64 to standard base64 if needed
        convertedPrivateKey = convertUrlSafeBase64ToStandard(privateKey.trim());
        

        
        // Test if the private key is valid base64 using native JavaScript first
        try {
          const buffer = Buffer.from(convertedPrivateKey, 'base64');
          if (buffer.length !== 32) {
            setError(`Formato de chave privada inválido - tamanho incorreto (${buffer.length} bytes, esperado 32)`);
            return;
          }
          // Convert Buffer to Uint8Array for libsodium
          secretKeyUint8 = new Uint8Array(buffer);

        } catch (bufferError) {
          console.error('Failed to decode with Buffer:', bufferError);
          // Fallback to libsodium
          try {
            secretKeyUint8 = sodium.from_base64(convertedPrivateKey);

          } catch (sodiumError) {
            console.error('Failed to decode with libsodium:', sodiumError);
            setError('Formato de chave privada inválido - não é uma chave base64 válida');
            return;
          }
        }
        if (secretKeyUint8.length !== sodium.crypto_box_SECRETKEYBYTES) {
          setError('Formato de chave privada inválido - tamanho incorreto');
          return;
        }
        
        // Key validation successful - ready for decryption
        
              } catch {
          setError('Formato de chave privada inválido - não é uma chave base64 válida');
          return;
        }

      // Try to decrypt one request to validate the key (if requests exist)
      const testRequest = requests.find(r => r.encrypted_data);
      
      if (testRequest && testRequest.encrypted_data) {
        try {
          const decryptedTestData = await decryptSealedBox(
            testRequest.encrypted_data,
            companyPublicKey,
            secretKeyUint8
          );
          
          // Try to parse the decrypted data to ensure it's valid JSON
          try {
            JSON.parse(decryptedTestData);
          } catch (parseError) {
            console.warn('Decrypted data is not valid JSON:', parseError);
          }
          
          // If successful, mark dashboard as unlocked
          setIsUnlocked(true);
          
          // Decrypt all requests using the validated key
          await decryptAllRequests(secretKeyUint8);
        } catch {
          setError('Chave privada inválida - não foi possível descriptografar os dados');
          return;
        }
      } else {
        // No encrypted data to test, but private key format is valid
        setIsUnlocked(true);
      }
      
    } catch (error) {
      console.error('Failed to unlock dashboard:', error);
      setError('Chave privada inválida ou falha na descriptografia');
    } finally {
      setLoading(false);
    }
  };

  const decryptAllRequests = async (validatedPrivateKey: Uint8Array) => {
    const decrypted: Record<string, DecryptedData> = {};
    
    for (const request of requests) {
      try {
        if (request.encrypted_data) {
          // Decrypt the sealed box data
          // Note: We need the public key that was used for encryption
          // This should be retrieved from the company setup or stored configuration
          
          try {
            // Use the company public key we fetched earlier
            if (!companyPublicKey) {
              throw new Error('Company public key not available');
            }
            
            // Use the validated key that was passed to this function
            const decryptedJson = await decryptSealedBox(
              request.encrypted_data,
              companyPublicKey,
              validatedPrivateKey // Use the validated Uint8Array key
            );
            
            const decryptedData = JSON.parse(decryptedJson) as DecryptedData;
            decrypted[request.id] = decryptedData;
          } catch (decryptError) {
            console.error(`Decryption failed for request ${request.id}:`, decryptError);
            // Continue with other requests
          }
        }
      } catch (error) {
        console.error(`Failed to process request ${request.id}:`, error);
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

  const convertUrlSafeBase64ToStandard = (urlSafeBase64: string): string => {
    // Clean the input - remove any whitespace and non-base64 characters
    const cleaned = urlSafeBase64.trim().replace(/\s/g, '');
    
    // Convert URL-safe base64 to standard base64
    let standardBase64 = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = standardBase64.length % 4;
    if (padding > 0) {
      standardBase64 += '='.repeat(4 - padding);
    }
    
    return standardBase64;
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await authenticatedFetch('/api/company/lgpd-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          status: newStatus
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update status');
      }

      // Refresh the requests list
      await fetchCompanyRequests();
      
      // Show success message
      const statusMessage = newStatus === 'PROCESSING' ? 'em processamento' : 'concluída';
      alert(`Solicitação marcada como ${statusMessage} com sucesso!`);
    } catch (error) {
      console.error('Failed to update request status:', error);
      alert('Erro ao atualizar status da solicitação: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const downloadRequestData = (requestId: string, data: DecryptedData) => {
    try {
      // Create a formatted text file with the decrypted data
      const content = `LGPD Request Data
==================
Request ID: ${data.requestId}
Type: ${formatRequestType(data.type)}
Date: ${formatDate(data.timestamp)}
User Email: ${data.userEmail}
CPF: ${data.cpf}

Reason:
${data.reason}

Description:
${data.description}
`;

      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lgpd-request-${requestId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download request data:', error);
      alert('Erro ao baixar dados da solicitação');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">
              Company Dashboard
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
                                  {request.status === 'PENDING' && (
                                    <button 
                                      onClick={() => updateRequestStatus(request.id, 'PROCESSING')}
                                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                      Processar Solicitação
                                    </button>
                                  )}
                                  {request.status === 'PROCESSING' && (
                                    <button 
                                      onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                      Marcar como Concluída
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => downloadRequestData(request.id, decrypted)}
                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                                  >
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

// Export the component - middleware handles admin/employee authorization
export default withAuth(CompanyDashboardPage);