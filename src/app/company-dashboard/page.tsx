'use client';

import { useEffect, useState } from 'react';
import { decryptSealedBox } from '@/lib/crypto';
import { withAuth, useAuth } from '@/lib/auth-client';
import { authenticatedFetch } from '@/lib/auth-fetch';
import { getUIMessage, formatRequestType, formatRequestStatus } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Download, Lock, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-foreground">
              {getUIMessage('company_dashboard')}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">
                {user?.email}
              </span>
              <Button variant="ghost" asChild>
                <a href="/company-setup">
                  {getUIMessage('key_setup')}
                </a>
              </Button>
              {isUnlocked && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsUnlocked(false);
                    setPrivateKey('');
                    setDecryptedData({});
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {getUIMessage('dashboard_locked_button')}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                {getUIMessage('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">

          {/* Message Display */}
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 
                             message.type === 'error' ? 'border-red-200 bg-red-50' : 
                             'border-blue-200 bg-blue-50'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  )}
                  <AlertDescription className="text-sm">
                    {message.text}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessage(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          {!isUnlocked && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {getUIMessage('dashboard_unlock_title')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {getUIMessage('dashboard_unlock_subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder={getUIMessage('dashboard_unlock_placeholder')}
                      className="min-h-[96px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {getUIMessage('dashboard_unlock_note')}
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={unlockDashboard}
                    disabled={loading || !privateKey}
                    className="w-full"
                  >
                    {loading ? getUIMessage('dashboard_unlocking') : getUIMessage('dashboard_unlock_button')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {isUnlocked && (
            <div className="space-y-6">
              
              {/* Success Notice */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <span className="font-semibold">{getUIMessage('dashboard_unlocked_title')}</span>
                  <br />
                  {getUIMessage('dashboard_unlocked_message')}
                </AlertDescription>
              </Alert>

              {/* Requests Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getUIMessage('requests_title')} ({requests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{getUIMessage('requests_loading')}</p>
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{getUIMessage('requests_empty')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => {
                        const decrypted = decryptedData[request.id];
                        
                        return (
                          <Card key={request.id} className="border">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">
                                    {formatRequestType(request.type)} - {request.id}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    {getUIMessage('requests_submitted')}: {formatDate(request.created_at)} | 
                                    {getUIMessage('requests_due')}: {formatDate(request.response_due_at)}
                                  </CardDescription>
                                </div>
                                <Badge variant={
                                  request.status === 'PENDING' ? 'secondary' :
                                  request.status === 'PROCESSING' ? 'default' :
                                  request.status === 'COMPLETED' ? 'default' :
                                  'destructive'
                                }>
                                  {formatRequestStatus(request.status)}
                                </Badge>
                              </div>
                            </CardHeader>

                            {decrypted ? (
                              <CardContent className="pt-0">
                                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                    <span className="font-medium text-sm">{getUIMessage('requests_decrypted_content')}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground font-medium">{getUIMessage('requests_user_email')}</span>
                                      <p className="font-medium">{decrypted.userEmail}</p>
                                    </div>
                                    
                                    <div>
                                      <span className="text-muted-foreground font-medium">CPF:</span>
                                      <p className="font-medium">{decrypted.cpf}</p>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                      <span className="text-muted-foreground font-medium">{getUIMessage('requests_reason')}</span>
                                      <p className="font-medium">{decrypted.reason}</p>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                      <span className="text-muted-foreground font-medium">{getUIMessage('requests_description')}</span>
                                      <p className="font-medium">{decrypted.description}</p>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="flex flex-wrap gap-2">
                                    {request.status === 'PENDING' && (
                                      <Button 
                                        size="sm"
                                        onClick={() => updateRequestStatus(request.id, 'PROCESSING')}
                                      >
                                        {getUIMessage('requests_process_button')}
                                      </Button>
                                    )}
                                    {request.status === 'PROCESSING' && (
                                      <Button 
                                        size="sm"
                                        variant="default"
                                        onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                                      >
                                        {getUIMessage('requests_complete_button')}
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={() => downloadRequestData(request.id, decrypted)}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      {getUIMessage('requests_download_button')}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            ) : (
                              <CardContent className="pt-0">
                                <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    {getUIMessage('requests_decrypt_failed')}
                                  </AlertDescription>
                                </Alert>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Export the component - middleware handles admin/employee authorization
export default withAuth(CompanyDashboardPage);