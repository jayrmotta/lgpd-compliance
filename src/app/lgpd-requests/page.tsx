'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { authenticatedFetch } from '@/lib/auth-fetch';

function LGPDRequestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [cpf, setCpf] = useState('');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [securityProcessing] = useState(false);
  const [securityError] = useState(false);
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const [verificationError, setVerificationError] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pixQRCode, setPixQRCode] = useState('');
  const [pixTransactionId, setPixTransactionId] = useState('');
  const [showPixFlow, setShowPixFlow] = useState(false);
  const [pixVerified, setPixVerified] = useState(false);
  const [pixInstructions, setPixInstructions] = useState('');

  const getSuccessMessage = () => {
    switch (selectedRequestType) {
      case 'data_access':
        return 'Sua solicitação foi enviada com segurança';
      case 'data_deletion':
        return 'Sua solicitação de exclusão foi enviada com segurança';
      case 'data_correction':
        return 'Sua solicitação de correção foi enviada com segurança';
      case 'data_portability':
        return 'Sua solicitação de portabilidade foi enviada com segurança';
      default:
        return 'Sua solicitação foi enviada com segurança';
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && email) {
      setIsAuthenticated(true);
      
      // Check browser compatibility
      const isCompatible = !!(window.crypto && window.crypto.subtle);
      setBrowserCompatible(isCompatible);
      
      // Pre-select request type from URL parameter
      const typeParam = searchParams.get('type');
      if (typeParam && ['data_access', 'data_deletion', 'data_correction', 'data_portability'].includes(typeParam)) {
        setSelectedRequestType(typeParam);
      }
    } else {
      router.push('/login?redirect=lgpd-requests&message=auth-required');
    }
  }, [router, searchParams]);


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const requestTypes = [
    {
      id: 'data_access',
      type: 'Solicitação de Acesso aos Dados',
      description: 'Visualizar quais dados pessoais possuímos'
    },
    {
      id: 'data_deletion',
      type: 'Solicitação de Exclusão de Dados', 
      description: 'Excluir todos os seus dados pessoais'
    },
    {
      id: 'data_correction',
      type: 'Solicitação de Correção de Dados',
      description: 'Corrigir dados pessoais incorretos'
    },
    {
      id: 'data_portability',
      type: 'Solicitação de Portabilidade de Dados',
      description: 'Exportar seus dados em formato portável'
    }
  ];

  const handleRequestTypeSelection = (typeId: string) => {
    setSelectedRequestType(typeId);
  };

  const handleSubmitRequest = () => {
    if (!selectedRequestType || !reason || !description) {
      setFormError('Por favor, preencha todos os campos');
      return;
    }
    
    setFormError('');
    
    // Proceed directly to verification without artificial delay
    setShowVerification(true);
  };

  
  const handlePixVerification = async () => {
    if (!cpf) {
      setVerificationError('Por favor, insira o CPF');
      return;
    }
    
    // Validate CPF format
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf) || cpf === '000.000.000-00') {
      setVerificationError('CPF inválido. Use o formato 123.456.789-00');
      return;
    }

    try {
      // Generate PIX QR Code
      const response = await authenticatedFetch('/api/pix/qr-code', {
        method: 'POST',
        body: JSON.stringify({
          amount: 0.01,
          description: 'Verificação LGPD - Exercício de Direito'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationError('Erro ao gerar QR Code PIX');
        return;
      }

      setPixQRCode(data.data.qrCode);
      setPixTransactionId(data.data.transactionId);
      setPixInstructions(data.data.instructions);
      setShowPixFlow(true);
      setVerificationError('');

    } catch (error) {
      console.error('PIX QR Code generation error:', error);
      setVerificationError('Erro ao gerar QR Code PIX');
    }
  };

  const handlePixPaymentSimulation = async () => {
    try {
      const response = await authenticatedFetch('/api/pix/verify', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: pixTransactionId,
          cpf: cpf
        })
      });

      if (!response.ok) {
        setVerificationError('Falha na verificação PIX');
        return;
      }

      setPixVerified(true);
      setIdentityVerified(true);
      setVerificationError('');
      
      // Automatically proceed to final submission after PIX verification
      setTimeout(() => {
        handleFinalSubmit();
      }, 1000); // Brief delay to show verification success

    } catch (error) {
      console.error('PIX verification error:', error);
      setVerificationError('Erro na verificação PIX');
    }
  };


  const handleFinalSubmit = async () => {
    setSubmittingRequest(true);
    setSubmissionError('');
    
    try {
      const response = await authenticatedFetch('/api/lgpd-requests', {
        method: 'POST',
        body: JSON.stringify({
          type: selectedRequestType,
          reason,
          description,
          cpf
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmissionError(data.code || 'REQUEST_CREATION_FAILED');
        setSubmittingRequest(false);
        return;
      }

      // Success - show brief confirmation and redirect immediately
      const requestId = data.data?.requestId || 'REQ-' + Date.now();
      const encrypted = data.data?.encrypted;
      
      let message = `✅ Solicitação LGPD criada com sucesso!\n\nID: ${requestId}\n\n`;
      
      if (encrypted) {
        message += `🔒 Dados criptografados com segurança - redirecionando...`;
      } else {
        message += `⚠️ Dados enviados sem criptografia - redirecionando...`;
      }
      
      setSuccessMessage(message);
      setSubmittingRequest(false);
      
      // Redirect quickly after success
      setTimeout(() => {
        router.push('/my-requests');
      }, 1500);

    } catch (error) {
      console.error('Request submission error:', error);
      setSubmissionError('SERVER_ERROR');
      setSubmittingRequest(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div>Por favor, faça login para enviar solicitações LGPD</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">Solicitações LGPD</h1>
            <div className="flex items-center gap-4">
              <a 
                href="/dashboard" 
                className="text-blue-400 hover:text-blue-300"
              >
                Dashboard
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!browserCompatible && (
            <div data-testid="browser-check" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>❌ Seu navegador precisa ser atualizado</p>
              <p className="text-sm">Use uma versão mais recente do Chrome, Firefox ou Safari</p>
            </div>
          )}
          
          {browserCompatible && (
            <div data-testid="browser-check" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>✓ Seu navegador é compatível</p>
            </div>
          )}
          
          {securityProcessing && (
            <div data-testid="security-processing" className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <p>Sua solicitação está sendo protegida</p>
              <p>✓ Dados protegidos com segurança</p>
              <p>Suas informações pessoais estão seguras</p>
            </div>
          )}
          
          {securityError && (
            <div data-testid="security-error" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>❌ Falha na proteção dos dados - solicitação não enviada</p>
              <p className="text-sm">Tente novamente ou entre em contato com o suporte</p>
            </div>
          )}
          {!selectedRequestType && (
            <div className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">
                  Selecione o tipo de solicitação LGPD
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {requestTypes.map((request) => (
                    <div 
                      key={request.id}
                      className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700 hover:border-blue-400"
                      data-testid={`request-type-${request.id.replace('_', '-')}`}
                      onClick={() => handleRequestTypeSelection(request.id)}
                    >
                      <h3 className="font-medium text-white">{request.type}</h3>
                      <p className="text-sm text-gray-300 mt-1">{request.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{formError}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="whitespace-pre-line">{successMessage}</div>
            </div>
          )}

          {selectedRequestType && !showVerification && (
            <div className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">
                  Detalhes da Solicitação
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Motivo da solicitação
                    </label>
                    <input
                      type="text"
                      data-testid="reason-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      placeholder="Ex: Quero verificar meus dados pessoais"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Descrição detalhada
                    </label>
                    <textarea
                      data-testid="description-input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      placeholder="Forneça mais detalhes sobre sua solicitação..."
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500"
                      onClick={() => setSelectedRequestType('')}
                    >
                      Voltar
                    </button>
                    <button 
                      data-testid="submit-request"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={handleSubmitRequest}
                    >
                      Enviar Solicitação
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {verificationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{verificationError}</p>
              <p className="text-sm">Certifique-se de usar o mesmo CPF associado à sua conta</p>
            </div>
          )}

          {submissionError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submissionError === 'COMPANY_SETUP_REQUIRED' ? (
                <div>
                  <p>⚠️ Configuração da empresa necessária</p>
                  <p className="text-sm">A empresa precisa configurar as chaves de criptografia antes de receber solicitações LGPD.</p>
                  <a 
                    href="/company-setup" 
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Ir para Configuração da Empresa
                  </a>
                </div>
              ) : (
                <div>
                  <p>Erro ao enviar solicitação: {submissionError}</p>
                  <p className="text-sm">Tente novamente ou entre em contato com o suporte</p>
                </div>
              )}
            </div>
          )}
          
          {showVerification && !identityVerified && !showPixFlow && (
            <div data-testid="identity-verification-section" className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">
                  Verificação de Identidade
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-blue-400 text-lg font-medium mb-4">
                    🔐 Verificação PIX
                  </div>
                  <p className="text-sm text-gray-300">
                    Para garantir a segurança, você precisa verificar sua identidade via PIX
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      CPF
                    </label>
                    <input
                      type="text"
                      data-testid="cpf-input"
                      value={cpf}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        let formatted = value;
                        
                        // Apply CPF mask: 000.000.000-00
                        if (value.length >= 3) {
                          formatted = value.slice(0, 3) + '.' + value.slice(3);
                        }
                        if (value.length >= 6) {
                          formatted = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
                        }
                        if (value.length >= 9) {
                          formatted = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9, 11);
                        }
                        
                        setCpf(formatted);
                      }}
                      maxLength={14}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      placeholder="123.456.789-00"
                    />
                  </div>
                  
                  <button 
                    data-testid="generate-pix-qr"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={handlePixVerification}
                  >
                    🔐 Gerar QR Code PIX (R$ 0,01)
                  </button>

                </div>
              </div>
            </div>
          )}

          {showPixFlow && !pixVerified && (
            <div data-testid="pix-qr-section" className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">
                  Pagamento PIX - Verificação de Identidade
                </h2>
                
                <div className="text-center mb-6">
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <Image 
                      src={pixQRCode} 
                      alt="QR Code PIX" 
                      width={256}
                      height={256}
                      className="mx-auto"
                      data-testid="pix-qr-image"
                    />
                  </div>
                  
                  <div className="text-green-400 text-lg font-medium mb-2">
                    💰 PIX R$ 0,01
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    {pixInstructions}
                  </p>
                  
                  <div className="bg-blue-900/30 border border-blue-600 text-blue-200 p-3 rounded text-sm">
                    <p><strong>ID da Transação:</strong> {pixTransactionId}</p>
                    <p><strong>Valor:</strong> R$ 0,01</p>
                    <p><strong>Descrição:</strong> Verificação LGPD</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    data-testid="simulate-pix-payment"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={handlePixPaymentSimulation}
                  >
                    ✅ Simular Pagamento Realizado
                  </button>
                  
                  <button 
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      setShowPixFlow(false);
                      setPixQRCode('');
                      setPixTransactionId('');
                    }}
                  >
                    Cancelar e Voltar
                  </button>
                </div>
              </div>
            </div>
          )}

          {submittingRequest && (
            <div data-testid="submitting-request" className="bg-blue-900/30 border border-blue-600 text-blue-200 px-4 py-3 rounded mb-4">
              <p>Processando sua solicitação...</p>
              <p>Sua solicitação está sendo criptografada antes do envio</p>
              <p>A empresa só verá dados criptografados até processar sua solicitação</p>
            </div>
          )}
          
          {identityVerified && !submittingRequest && !successMessage && (
            <div data-testid="identity-verified" className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center mb-6">
                  <div data-testid="request-submitted" className="text-green-400 text-xl font-semibold mb-4">
                    ✅ Identidade verificada - Processando solicitação...
                  </div>
                  <div className="text-blue-300 mb-2">
                    {getSuccessMessage()}
                  </div>
                  <div data-testid="encryption-notice" className="text-blue-400 text-sm">
                    Sua solicitação está sendo criptografada e enviada automaticamente
                  </div>
                  <div className="text-blue-400 text-sm">
                    A empresa só verá dados criptografados até processar sua solicitação
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function LGPDRequestsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Carregando...</div></div>}>
      <LGPDRequestsContent />
    </Suspense>
  );
}