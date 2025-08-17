'use client';

import { useState } from 'react';
import { ERROR_MESSAGES } from '@/lib/message-constants';

interface CreateCompanyRepForm {
  email: string;
  password: string;
  confirmPassword: string;
  companyId: string;
  role: 'admin' | 'employee';
}

export default function AdminPage() {
  const [form, setForm] = useState<CreateCompanyRepForm>({
    email: '',
    password: '',
    confirmPassword: '',
    companyId: 'techcorp-ltd',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Senhas não coincidem' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/company-representatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          companyId: form.companyId,
          role: form.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Representante da empresa criado com sucesso!' });
        setForm({
          email: '',
          password: '',
          confirmPassword: '',
          companyId: 'techcorp-ltd',
          role: 'employee'
        });
      } else {
        const errorMessage = ERROR_MESSAGES[data.code] || data.code || 'Erro desconhecido';
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      console.error('Error creating company representative:', error);
      setMessage({ type: 'error', text: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">
              Admin Panel - LGPD Platform
            </h1>
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard" 
                className="text-blue-400 hover:text-blue-300"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Warning Notice */}
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-400 text-2xl mr-3">⚠️</div>
              <div>
                <h3 className="text-yellow-300 font-semibold">Acesso de Administrador Obrigatório</h3>
                <p className="text-yellow-200 text-sm mt-1">
                  Esta página é apenas para operadores da plataforma. Representantes da empresa devem ser criados através desta interface.
                </p>
              </div>
            </div>
          </div>

          {/* Create Company Representative Form */}
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-white mb-6">
                Criar Representante da Empresa
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    placeholder="representante@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    placeholder="Senha forte com pelo menos 8 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    placeholder="Confirme a senha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company ID
                  </label>
                  <input
                    type="text"
                    name="companyId"
                    value={form.companyId}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    placeholder="techcorp-ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Função
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="employee">Funcionário</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <p className="text-gray-400 text-xs mt-1">
                    Administradores podem gerenciar outros representantes e criar funcionários. Funcionários só podem acessar funções da empresa.
                  </p>
                </div>

                {message && (
                  <div className={`px-4 py-3 rounded ${
                    message.type === 'success' 
                      ? 'bg-green-900/30 border border-green-700 text-green-200' 
                      : 'bg-red-900/30 border border-red-700 text-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Representante da Empresa'}
                </button>
              </form>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-blue-300 font-semibold mb-4">Instruções</h3>
              <ol className="text-blue-200 space-y-2 text-sm">
                <li>1. Crie representantes da empresa usando este formulário</li>
                <li>2. Envie as credenciais de login para o representante de forma segura</li>
                <li>3. O representante pode então acessar /company-setup para gerar chaves de criptografia</li>
                <li>4. O representante usa /company-dashboard para processar solicitações LGPD</li>
                <li>5. Administradores podem criar funcionários adicionais através de sua própria interface</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}