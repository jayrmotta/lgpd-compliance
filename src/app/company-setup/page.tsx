'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateKeyPair, getKeyFingerprint } from '@/lib/crypto';
import { withAuth, useAuth } from '@/lib/auth-client';

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
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">Configuração da Empresa - Chaves de Criptografia</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {user?.email}
              </span>
              <a 
                href="/company-dashboard" 
                className="text-blue-400 hover:text-blue-300"
              >
                Voltar ao Dashboard
              </a>
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* Security Notice */}
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 text-2xl mr-3">🔐</div>
              <div>
                <h3 className="text-red-300 font-semibold">Critical Security Information</h3>
                <ul className="text-red-200 text-sm mt-2 space-y-1">
                  <li>• Private keys are generated in your browser and NEVER sent to our servers</li>
                  <li>• You must save your private key securely (password manager recommended)</li>
                  <li>• If you lose your private key, encrypted data cannot be recovered</li>
                  <li>• Never share your private key or store it on company servers</li>
                </ul>
              </div>
            </div>
          </div>

          {!keyPair && (
            <div className="bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">
                  Configuração da Empresa
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      placeholder="Ex: TechCorp Ltda, Acme Solutions Inc."
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Este nome será usado em toda a plataforma e nos arquivos de chaves.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-300 mb-6">
                      Após informar o nome da empresa, clique abaixo para gerar o par de chaves de criptografia.
                      Isso criará uma chave pública (para receber solicitações LGPD criptografadas)
                      e uma chave privada (para descriptografar solicitações).
                    </p>
                    
                    <button
                      onClick={generateCompanyKeys}
                      disabled={isGenerating || !companyName.trim()}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isGenerating ? 'Gerando Chaves...' : 'Gerar Chaves de Criptografia'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {keyPair && (
            <div className="space-y-6">
              
              {/* Generated Keys */}
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white mb-6">
                    🎉 Chaves de Criptografia Geradas com Sucesso
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Fingerprint (for identification)
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-700 text-green-400 px-3 py-2 rounded flex-1">
                          {getKeyFingerprint(keyPair.publicKey)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(getKeyFingerprint(keyPair.publicKey), 'Fingerprint')}
                          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Public Key (safe to share)
                      </label>
                      <div className="flex items-center space-x-2">
                        <textarea
                          readOnly
                          value={keyPair.publicKey}
                          className="bg-gray-700 text-gray-100 px-3 py-2 rounded flex-1 h-20 resize-none"
                        />
                        <button
                          onClick={() => copyToClipboard(keyPair.publicKey, 'Public Key')}
                          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-300 mb-2">
                        🔒 Private Key (KEEP SECRET - Save in Password Manager)
                      </label>
                      <div className="flex items-center space-x-2">
                        <textarea
                          readOnly
                          value={keyPair.secretKey}
                          className="bg-red-900/20 border border-red-700 text-red-200 px-3 py-2 rounded flex-1 h-20 resize-none"
                        />
                        <button
                          onClick={() => copyToClipboard(keyPair.secretKey, 'Private Key')}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ This is your only chance to save the private key. It will not be shown again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {showInstructions && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-blue-300 font-semibold mb-4">📝 Próximos Passos</h3>
                    <ol className="text-blue-200 space-y-2">
                      <li>1. <strong>Salvar Chave Privada:</strong> Copie a chave privada e salve em seu gerenciador de senhas</li>
                      <li>2. <strong>Baixar Backup:</strong> Baixe o arquivo de chaves como backup</li>
                      <li>3. <strong>Registrar Chave Pública:</strong> Registre a chave pública na plataforma</li>
                      <li>4. <strong>Acessar Dashboard:</strong> Use sua chave privada para descriptografar solicitações LGPD</li>
                    </ol>
                    
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={downloadKeys}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        📁 Download Key File
                      </button>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={keySaved}
                          onChange={(e) => setKeySaved(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-blue-200 text-sm">
                          I have saved my private key securely
                        </span>
                      </label>
                    </div>
                    
                    {keySaved && (
                      <button
                        onClick={registerPublicKey}
                        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 mt-4"
                      >
                        ✅ Register Public Key & Continue
                      </button>
                    )}
                  </div>
                </div>
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