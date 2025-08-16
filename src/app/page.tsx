'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsAuthenticated(isLoggedIn === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Conformidade LGPD</h1>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Conformidade LGPD
            <span className="block text-blue-400">Simples e Segura</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Plataforma completa para gerenciar solicitações de dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link 
                  href="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Começar Agora
                </Link>
                <Link 
                  href="/login"
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Fazer Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link 
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ir para Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Problemas que Resolvemos</h3>
            <p className="text-gray-300 text-lg">A conformidade com LGPD pode ser complexa. Simplificamos o processo.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Processos Manuais</h4>
              <p className="text-gray-300">
                Gerenciar solicitações LGPD manualmente é demorado e propenso a erros, criando riscos de não conformidade.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔓</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Dados Não Seguros</h4>
              <p className="text-gray-300">
                Informações pessoais expostas durante o processo de solicitação aumentam o risco de vazamentos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Falta de Rastreabilidade</h4>
              <p className="text-gray-300">
                Sem um sistema centralizado, é difícil acompanhar o status e histórico das solicitações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Como Solucionamos</h3>
            <p className="text-gray-300 text-lg">Tecnologia avançada para simplificar a conformidade LGPD.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Automação Completa</h4>
              <p className="text-gray-300">
                Plataforma digital que automatiza todo o processo de solicitação, desde o envio até a resposta.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Segurança Avançada</h4>
              <p className="text-gray-300">
                Criptografia de ponta a ponta e verificação de identidade para proteger dados pessoais.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Dashboard Centralizado</h4>
              <p className="text-gray-300">
                Acompanhe todas as solicitações em tempo real com relatórios detalhados e histórico completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Funcionalidades Principais</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">📝</div>
              <h4 className="font-semibold text-white mb-2">Solicitação de Acesso</h4>
              <p className="text-gray-300 text-sm">Visualize todos os dados pessoais armazenados</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🗑️</div>
              <h4 className="font-semibold text-white mb-2">Exclusão de Dados</h4>
              <p className="text-gray-300 text-sm">Solicite a remoção completa dos seus dados</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">✏️</div>
              <h4 className="font-semibold text-white mb-2">Correção de Dados</h4>
              <p className="text-gray-300 text-sm">Atualize informações incorretas ou desatualizadas</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">📤</div>
              <h4 className="font-semibold text-white mb-2">Portabilidade</h4>
              <p className="text-gray-300 text-sm">Exporte seus dados em formato portável</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para Garantir Conformidade LGPD?
          </h3>
          <p className="text-gray-300 text-lg mb-8">
            Junte-se a empresas que já confiam na nossa plataforma para gerenciar dados pessoais com segurança.
          </p>
          {!isAuthenticated && (
            <Link 
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Criar Conta Gratuita
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2025 LGPD Compliance Platform. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
