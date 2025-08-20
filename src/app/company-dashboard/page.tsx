'use client';

import { useEffect, useState } from 'react';
import { decryptSealedBox } from '@/lib/crypto';
import { withAuth, useAuth } from '@/lib/auth-client';
import { authenticatedFetch } from '@/lib/auth-fetch';
import { getUIMessage, formatRequestType, formatRequestStatus } from '@/lib/translations';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

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
        setError(getUIMessage('error_fetch_metadata'));
      }
    } catch (error) {
      console.error('Failed to fetch company metadata:', error);
      setError(getUIMessage('error_fetch_metadata'));
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
      setError(getUIMessage('error_fetch_requests') + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const unlockDashboard = async () => {
    if (!privateKey) {
      setError(getUIMessage('error_private_key_required'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Validate private key format (basic check)
      if (privateKey.length < 32) {
        setError(getUIMessage('error_private_key_invalid_format'));
        return;
      }

      // Make sure we have the company public key
      if (!companyPublicKey) {
        setError(getUIMessage('error_company_public_key_missing'));
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
            setError(getUIMessage('error_private_key_invalid_size') + ` (${buffer.length} bytes, esperado 32)`);
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
          setError(getUIMessage('error_private_key_invalid_size'));
          return;
        }
        
        // Key validation successful - ready for decryption
        
              } catch {
          setError(getUIMessage('error_private_key_invalid_base64'));
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
          setError(getUIMessage('error_private_key_decrypt_failed'));
          return;
        }
      } else {
        // No encrypted data to test, but private key format is valid
        setIsUnlocked(true);
      }
      
    } catch (error) {
      console.error('Failed to unlock dashboard:', error);
      setError(getUIMessage('error_private_key_decrypt_failed'));
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
      const statusMessage = newStatus === 'PROCESSING' ? getUIMessage('message_success_processing') : getUIMessage('message_success_completed');
      setMessage({ type: 'success', text: statusMessage });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update request status:', error);
      setMessage({ type: 'error', text: getUIMessage('message_error_update') + (error instanceof Error ? error.message : 'Unknown error') });
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
      setMessage({ type: 'error', text: getUIMessage('message_error_download') });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">
              {getUIMessage('company_dashboard')}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {user?.email}
              </span>
              <a 
                href="/company-setup" 
                className="text-blue-400 hover:text-blue-300"
              >
                {getUIMessage('key_setup')}
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
                    {getUIMessage('dashboard_locked_button')}
                  </button>
              )}
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                {getUIMessage('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-200' :
              message.type === 'error' ? 'bg-red-900/30 border-red-700 text-red-200' :
              'bg-blue-900/30 border-blue-700 text-blue-200'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span className="whitespace-pre-wrap">{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="ml-auto text-gray-400 hover:text-gray-200"
                >
                  {getUIMessage('close')}
                </button>
              </div>
            </div>
          )}

          {!isUnlocked && (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white mb-6 text-center">
                    {getUIMessage('dashboard_unlock_title')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {getUIMessage('dashboard_unlock_subtitle')}
                      </label>
                      <textarea
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder={getUIMessage('dashboard_unlock_placeholder')}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 h-24 resize-none"
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        {getUIMessage('dashboard_unlock_note')}
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
                      {loading ? getUIMessage('dashboard_unlocking') : getUIMessage('dashboard_unlock_button')}
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
                    <h3 className="text-green-300 font-semibold">{getUIMessage('dashboard_unlocked_title')}</h3>
                    <p className="text-green-200 text-sm">
                      {getUIMessage('dashboard_unlocked_message')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white mb-6">
                    {getUIMessage('requests_title')} ({requests.length})
                  </h2>

                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">{getUIMessage('requests_loading')}</p>
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">{getUIMessage('requests_empty')}</p>
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
                                  {getUIMessage('requests_submitted')}: {formatDate(request.created_at)} | 
                                  {getUIMessage('requests_due')}: {formatDate(request.response_due_at)}
                                </p>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                {formatRequestStatus(request.status)}
                              </span>
                            </div>

                            {decrypted ? (
                              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                                <h4 className="text-green-400 font-medium">{getUIMessage('requests_decrypted_content')}</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-300 font-medium">{getUIMessage('requests_user_email')}</span>
                                    <p className="text-white">{decrypted.userEmail}</p>
                                  </div>
                                  
                                  <div>
                                    <span className="text-gray-300 font-medium">CPF:</span>
                                    <p className="text-white">{decrypted.cpf}</p>
                                  </div>
                                  
                                  <div className="md:col-span-2">
                                    <span className="text-gray-300 font-medium">{getUIMessage('requests_reason')}</span>
                                    <p className="text-white">{decrypted.reason}</p>
                                  </div>
                                  
                                  <div className="md:col-span-2">
                                    <span className="text-gray-300 font-medium">{getUIMessage('requests_description')}</span>
                                    <p className="text-white">{decrypted.description}</p>
                                  </div>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                  {request.status === 'PENDING' && (
                                    <button 
                                      onClick={() => updateRequestStatus(request.id, 'PROCESSING')}
                                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                      {getUIMessage('requests_process_button')}
                                    </button>
                                  )}
                                  {request.status === 'PROCESSING' && (
                                    <button 
                                      onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                      {getUIMessage('requests_complete_button')}
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => downloadRequestData(request.id, decrypted)}
                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                                  >
                                    {getUIMessage('requests_download_button')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                                <p className="text-red-300">{getUIMessage('requests_decrypt_failed')}</p>
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