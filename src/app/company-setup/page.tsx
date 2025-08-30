'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateKeyPair } from '@/lib/crypto';
import { withAuth } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle, Copy, Key, Building2, Save } from 'lucide-react';
import { TopBar } from '@/components/layout/top-bar';
import { getUIMessage } from '@/lib/translations';

function CompanySetupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [keyPair, setKeyPair] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const generateCompanyKeys = async () => {
    setIsGenerating(true);
    
    try {
      const keys = await generateKeyPair();
      setKeyPair(keys);
      setShowInstructions(true);
    } catch (error) {
      console.error('Failed to generate keys:', error);
      setMessage({ type: 'error', text: getUIMessage('setup_error_generate_keys') });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: `${label} ${getUIMessage('setup_success_copied')}` });
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };



  const registerPublicKey = async () => {
    if (!keyPair || !companyName.trim()) return;

    try {
      // Call API to register the company with public key
      const response = await fetch('/api/company/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          publicKey: keyPair.publicKey
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Empresa "${companyName}" configurada com sucesso! Redirecionando para o dashboard...` });
        setTimeout(() => {
          router.push('/company-dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        console.error('Company registration failed:', response.status, error);
        setMessage({ type: 'error', text: `Erro ao configurar empresa: ${error.message || 'Erro desconhecido'}` });
      }
    } catch (error) {
      console.error('Failed to register company:', error);
      setMessage({ type: 'error', text: 'Falha ao registrar empresa. Tente novamente.' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Configuração da Empresa" />

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Message Display */}
          {message && (
            <Alert variant={
              message.type === 'success' ? 'success' :
              message.type === 'error' ? 'destructive' :
              'info'
            }>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : message.type === 'error' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span className="whitespace-pre-wrap">{message.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(null)}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          


          {!keyPair && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Configuração da Empresa
                </CardTitle>
                <CardDescription>
                  Configure sua empresa para receber solicitações LGPD criptografadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa *</Label>
                  <Input
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Ex: TechCorp Ltda, Acme Solutions Inc."
                  />
                  <p className="text-xs text-muted-foreground">
                    Este nome será usado em toda a plataforma e nos arquivos de chaves.
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Após informar o nome da empresa, clique abaixo para gerar o par de chaves de criptografia.
                    Isso criará uma chave pública (para receber solicitações LGPD criptografadas)
                    e uma chave privada (para descriptografar solicitações).
                  </p>
                  
                  <Button
                    onClick={generateCompanyKeys}
                    disabled={isGenerating || !companyName.trim()}
                    size="lg"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Gerando Chaves...' : 'Gerar Chaves de Criptografia'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {keyPair && (
            <div className="space-y-6">
              
              {/* Generated Keys */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Chaves de Criptografia Geradas com Sucesso
                  </CardTitle>
                  <CardDescription>
                    Suas chaves foram geradas localmente no seu navegador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{getUIMessage('setup_public_key_label')}</Label>
                    <div className="flex items-center space-x-2">
                      <Textarea
                        readOnly
                        value={keyPair.publicKey}
                        className="font-mono text-sm"
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(keyPair.publicKey, getUIMessage('setup_copy_public_key'))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-destructive flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      {getUIMessage('setup_private_key_label')}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Textarea
                        readOnly
                        value={keyPair.secretKey}
                        className="font-mono text-sm border-destructive/50 bg-destructive/10"
                        rows={3}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => copyToClipboard(keyPair.secretKey, getUIMessage('setup_copy_private_key'))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-destructive">
                      {getUIMessage('setup_only_chance_warning')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              {showInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Save className="h-5 w-5 mr-2" />
                      Próximos Passos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                        <span><strong>Salvar Chave Privada:</strong> Copie a chave privada e salve em seu gerenciador de senhas</span>
                      </li>
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                        <span><strong>Registrar Chave Pública:</strong> Registre a chave pública na plataforma</span>
                      </li>
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                        <span><strong>Acessar Dashboard:</strong> Use sua chave privada para descriptografar solicitações LGPD</span>
                      </li>
                    </ol>
                    
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox
                        id="key-saved"
                        checked={keySaved}
                        onCheckedChange={(checked) => setKeySaved(checked as boolean)}
                      />
                      <Label htmlFor="key-saved" className="text-sm">
                        Salvei minha chave privada de forma segura
                      </Label>
                    </div>
                    
                    {keySaved && (
                      <Button
                        onClick={registerPublicKey}
                        className="w-full sm:w-auto"
                        size="lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Registrar Chave Pública e Continuar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Export the component - middleware handles admin/employee authorization
export default withAuth(CompanySetupPage);