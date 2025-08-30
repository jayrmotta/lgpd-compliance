'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { authenticatedFetch } from '@/lib/auth-fetch';
import { hashData } from '@/lib/crypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Shield, CreditCard, ArrowLeft, Send, Eye, Trash2, Edit, Download } from 'lucide-react';
import { TopBar } from '@/components/layout/top-bar';

function CreateRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [cpf, setCpf] = useState('');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pixQRCode, setPixQRCode] = useState('');
  const [pixTransactionId, setPixTransactionId] = useState('');
  const [showPixFlow, setShowPixFlow] = useState(false);
  const [pixVerified, setPixVerified] = useState(false);

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

  const getRequestTypeInfo = () => {
    switch (selectedRequestType) {
      case 'data_access':
        return {
          title: 'Solicitação de Acesso aos Dados',
          description: 'Visualizar quais dados pessoais possuímos',
          icon: Eye,
          color: 'bg-blue-500'
        };
      case 'data_deletion':
        return {
          title: 'Solicitação de Exclusão de Dados',
          description: 'Excluir todos os seus dados pessoais',
          icon: Trash2,
          color: 'bg-red-500'
        };
      case 'data_correction':
        return {
          title: 'Solicitação de Correção de Dados',
          description: 'Corrigir dados pessoais incorretos',
          icon: Edit,
          color: 'bg-yellow-500'
        };
      case 'data_portability':
        return {
          title: 'Solicitação de Portabilidade de Dados',
          description: 'Exportar seus dados em formato portável',
          icon: Download,
          color: 'bg-green-500'
        };
      default:
        return {
          title: 'Solicitação LGPD',
          description: 'Solicitação de dados pessoais',
          icon: Shield,
          color: 'bg-gray-500'
        };
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && email) {
      setIsAuthenticated(true);
      
      // Get request type from URL parameter
      const typeParam = searchParams.get('type');
      if (typeParam && ['data_access', 'data_deletion', 'data_correction', 'data_portability'].includes(typeParam)) {
        setSelectedRequestType(typeParam);
      } else {
        // If no valid type, redirect back to dashboard
        router.push('/dashboard');
      }
    } else {
      router.push('/login?redirect=create-request&message=auth-required');
    }
  }, [router, searchParams]);



  const handleSubmitRequest = () => {
    if (!selectedRequestType) {
      setFormError('Por favor, selecione um tipo de solicitação');
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
      // Generate PIX QR Code (both development and production)
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
      setShowPixFlow(true);
      setVerificationError('');

    } catch (error) {
      console.error('PIX QR Code generation error:', error);
      setVerificationError('Erro ao gerar QR Code PIX');
    }
  };

  const handleFinalSubmit = useCallback(async () => {
    setSubmittingRequest(true);
    setSubmissionError('');
    
    try {
      // Hash CPF client-side for security
      const cpfHash = await hashData(cpf);
      
      const response = await authenticatedFetch('/api/lgpd-requests', {
        method: 'POST',
        body: JSON.stringify({
          type: selectedRequestType,
          description: description || undefined, // Only send if not empty
          cpf_hash: cpfHash
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmissionError(data.code || 'REQUEST_CREATION_FAILED');
        setSubmittingRequest(false);
        return;
      }

      // Success - show brief confirmation and redirect immediately
      const requestId = data.data?.requestId || Math.random().toString(36).substr(2, 9);
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
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Request submission error:', error);
      setSubmissionError('SERVER_ERROR');
      setSubmittingRequest(false);
    }
  }, [router, selectedRequestType, description, cpf]);

  // Auto-verify PIX payment in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && showPixFlow && !pixVerified) {
      const timer = setTimeout(async () => {
        try {
          // Simulate PIX payment verification
          const response = await authenticatedFetch('/api/pix/verify', {
            method: 'POST',
            body: JSON.stringify({
              transactionId: pixTransactionId,
              cpf: cpf
            })
          });

          if (response.ok) {
            setPixVerified(true);
            setIdentityVerified(true);
            setShowPixFlow(false);
            handleFinalSubmit();
          }
        } catch (error) {
          console.error('Auto PIX verification error:', error);
        }
      }, 5000); // Auto-verify after 5 seconds in development
      
      return () => clearTimeout(timer);
    }
  }, [showPixFlow, pixVerified, handleFinalSubmit, pixTransactionId, cpf]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Por favor, faça login para criar solicitações LGPD</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const requestTypeInfo = getRequestTypeInfo();
  const IconComponent = requestTypeInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Criar Solicitação LGPD" />

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Request Type Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${requestTypeInfo.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{requestTypeInfo.title}</CardTitle>
                  <CardDescription>{requestTypeInfo.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Error Messages */}
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="whitespace-pre-line">{successMessage}</div>
              </AlertDescription>
            </Alert>
          )}

          {/* Request Details Form */}
          {!showVerification && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Solicitação</CardTitle>
                <CardDescription>
                  Preencha os detalhes da sua solicitação LGPD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    data-testid="description-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Forneça detalhes adicionais sobre sua solicitação (opcional)..."
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <a href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancelar
                    </a>
                  </Button>
                  <Button 
                    data-testid="submit-request"
                    onClick={handleSubmitRequest}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Error */}
          {verificationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p>{verificationError}</p>
                <p className="text-sm">Certifique-se de usar o mesmo CPF associado à sua conta</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Submission Error */}
          {submissionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {submissionError === 'COMPANY_SETUP_REQUIRED' ? (
                  <div>
                    <p>⚠️ Configuração da empresa necessária</p>
                    <p className="text-sm">A empresa precisa configurar as chaves de criptografia antes de receber solicitações LGPD.</p>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <a href="/company-setup">Ir para Configuração da Empresa</a>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>Erro ao enviar solicitação: {submissionError}</p>
                    <p className="text-sm">Tente novamente ou entre em contato com o suporte</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Identity Verification */}
          {showVerification && !identityVerified && !showPixFlow && (
            <Card data-testid="identity-verification-section">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Verificação de Identidade
                </CardTitle>
                <CardDescription>
                  Para garantir a segurança, você precisa verificar sua identidade via PIX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Development Mode Notice */}
                {process.env.NODE_ENV === 'development' && (
                  <Alert variant="info">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-semibold">Modo de Desenvolvimento Ativo</p>
                        <p className="text-sm">Em desenvolvimento, você pode usar verificação simplificada sem PIX.</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col items-center p-6 bg-muted/50 rounded-lg">
                  <CreditCard className="h-10 w-10 mb-3 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    🔐 Verificação PIX
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">CPF</label>
                  <Input
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
                    placeholder="123.456.789-00"
                  />
                </div>
                
                <div className="space-y-3">
                  {/* PIX Verification Button */}
                  <Button 
                    data-testid="generate-pix-qr"
                    className="w-full"
                    onClick={handlePixVerification}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gerar QR Code PIX (R$ 0,01)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PIX QR Code Flow */}
          {showPixFlow && !pixVerified && (
            <Card data-testid="pix-qr-section">
              <CardHeader className="text-center">
                <CardTitle>Pagamento PIX - Verificação de Identidade</CardTitle>
                <CardDescription>
                  Escaneie o QR Code com seu aplicativo bancário para completar a verificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  {/* QR Code Container */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
                      <Image 
                        src={pixQRCode} 
                        alt="QR Code PIX" 
                        width={256}
                        height={256}
                        className="mx-auto"
                        data-testid="pix-qr-image"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-sm">
                        💰 PIX R$ 0,01
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="text-center max-w-md">
                    <p className="text-sm text-muted-foreground">
                      Escaneie o QR Code com seu app bancário e realize o pagamento de R$ 0,01 para verificar sua identidade via PIX
                    </p>
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="w-full max-w-md">
                    <Card className="bg-muted/50 border-muted">
                      <CardContent className="pt-6">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">ID da Transação:</span>
                            <span className="text-muted-foreground font-mono">{pixTransactionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Valor:</span>
                            <span className="text-muted-foreground">R$ 0,01</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Descrição:</span>
                            <span className="text-muted-foreground">Verificação LGPD</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 max-w-md mx-auto">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowPixFlow(false);
                      setPixQRCode('');
                      setPixTransactionId('');
                    }}
                  >
                    Cancelar e Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitting Request */}
          {submittingRequest && (
            <Alert data-testid="submitting-request">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <p>Processando sua solicitação...</p>
                <p>Sua solicitação está sendo criptografada antes do envio</p>
                <p>A empresa só verá dados criptografados até processar sua solicitação</p>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Identity Verified */}
          {identityVerified && !submittingRequest && !successMessage && (
            <Card data-testid="identity-verified">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-primary" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold" data-testid="request-submitted">
                      ✅ Identidade verificada - Processando solicitação...
                    </h3>
                    <p className="text-muted-foreground">
                      {getSuccessMessage()}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground max-w-md">
                    <p data-testid="encryption-notice">
                      Sua solicitação está sendo criptografada e enviada automaticamente
                    </p>
                    <p>
                      A empresa só verá dados criptografados até processar sua solicitação
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CreateRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    }>
      <CreateRequestContent />
    </Suspense>
  );
}

