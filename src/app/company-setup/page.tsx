'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateKeyPair, getKeyFingerprint } from '@/lib/crypto';
import { withAuth, useAuth } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle, Copy, Download, Key, Building2, ArrowLeft, Save } from 'lucide-react';

function CompanySetupPage() {
  const { user, logout } = useAuth();
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
      setMessage({ type: 'error', text: 'Failed to generate encryption keys. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: `${label} copied to clipboard!` });
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const downloadKeys = () => {
    if (!keyPair) return;

    const keyData = {
      companyName: companyName.trim(),
      publicKey: keyPair.publicKey,
      privateKey: keyPair.secretKey,
      fingerprint: getKeyFingerprint(keyPair.publicKey),
      generatedAt: new Date().toISOString(),
      instructions: 'Save the private key in your password manager. NEVER share it or store it on servers.'
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = companyName.trim() 
      ? `${companyName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-encryption-keys-${Date.now()}.json`
      : `company-encryption-keys-${Date.now()}.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Configuração da Empresa - Chaves de Criptografia</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost" asChild>
                <a href="/company-dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </a>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Message Display */}
          {message && (
            <Alert className={
              message.type === 'success' ? 'border-green-200 bg-green-50' :
              message.type === 'error' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : message.type === 'error' ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <Shield className="h-4 w-4 text-blue-600" />
              )}
              <AlertDescription className={
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }>
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
          
          {/* Security Notice */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold">Critical Security Information</h3>
                <ul className="text-sm space-y-1">
                  <li>• Private keys are generated in your browser and NEVER sent to our servers</li>
                  <li>• You must save your private key securely (password manager recommended)</li>
                  <li>• If you lose your private key, encrypted data cannot be recovered</li>
                  <li>• Never share your private key or store it on company servers</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

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
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Chaves de Criptografia Geradas com Sucesso
                  </CardTitle>
                  <CardDescription>
                    Suas chaves foram geradas localmente no seu navegador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Key Fingerprint (for identification)</Label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-3 py-2 rounded flex-1 font-mono text-sm">
                        {getKeyFingerprint(keyPair.publicKey)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(getKeyFingerprint(keyPair.publicKey), 'Fingerprint')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Public Key (safe to share)</Label>
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
                        onClick={() => copyToClipboard(keyPair.publicKey, 'Public Key')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-red-600 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Private Key (KEEP SECRET - Save in Password Manager)
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Textarea
                        readOnly
                        value={keyPair.secretKey}
                        className="font-mono text-sm border-red-200 bg-red-50"
                        rows={3}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => copyToClipboard(keyPair.secretKey, 'Private Key')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-red-600">
                      ⚠️ This is your only chance to save the private key. It will not be shown again.
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
                  <CardContent className="space-y-4">
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                        <span><strong>Salvar Chave Privada:</strong> Copie a chave privada e salve em seu gerenciador de senhas</span>
                      </li>
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                        <span><strong>Baixar Backup:</strong> Baixe o arquivo de chaves como backup</span>
                      </li>
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                        <span><strong>Registrar Chave Pública:</strong> Registre a chave pública na plataforma</span>
                      </li>
                      <li className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">4</Badge>
                        <span><strong>Acessar Dashboard:</strong> Use sua chave privada para descriptografar solicitações LGPD</span>
                      </li>
                    </ol>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        onClick={downloadKeys}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Key File
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="key-saved"
                          checked={keySaved}
                          onCheckedChange={(checked) => setKeySaved(checked as boolean)}
                        />
                        <Label htmlFor="key-saved" className="text-sm">
                          I have saved my private key securely
                        </Label>
                      </div>
                    </div>
                    
                    {keySaved && (
                      <Button
                        onClick={registerPublicKey}
                        className="w-full sm:w-auto"
                        size="lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Register Public Key & Continue
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