'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

import { ERROR_MESSAGES, SUCCESS_MESSAGES, CLIENT_MESSAGES } from '@/lib/message-constants';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for auth required message
    const message = searchParams.get('message');
    if (message === 'auth-required') {
      setErrors({ general: 'Por favor, faça login para enviar solicitações LGPD' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setIsLoading(true);

    // Client-side validation
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = CLIENT_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = CLIENT_MESSAGES.EMAIL_INVALID;
    }

    if (!isPasswordResetMode && !formData.password) {
      newErrors.password = CLIENT_MESSAGES.PASSWORD_REQUIRED;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isPasswordResetMode ? '/api/auth/password-reset' : '/api/auth/login';
      const body = isPasswordResetMode ? { email: formData.email } : formData;


      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      
      // Extract JWT token from Authorization header
      const authHeader = response.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '') || null;
      

      if (response.ok) {
        if (responseData.code === 'LOGIN_SUCCESS') {
          // Store login state and JWT token from header
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', formData.email);
          if (token) {
            localStorage.setItem('authToken', token);
            console.log('Login successful, token stored from header, redirecting to dashboard');
          } else {
            console.warn('Login successful but no token found in Authorization header');
          }
          router.push('/dashboard');
        } else if (responseData.code === 'PASSWORD_RESET_REQUESTED') {
          const successMsg = SUCCESS_MESSAGES[responseData.code];
          setSuccessMessage(successMsg);
        }
      } else if (responseData.code) {
        const errorMsg = ERROR_MESSAGES[responseData.code] || 'Erro desconhecido';
        setErrors({ general: errorMsg });
      } else {
        setErrors({ general: isPasswordResetMode ? 'Erro ao solicitar reset' : 'Erro no login' });
      }
    } catch {
      setErrors({ general: CLIENT_MESSAGES.CONNECTION_ERROR });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetClick = () => {
    setIsPasswordResetMode(true);
    setErrors({});
    setSuccessMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          {isPasswordResetMode ? 'Recuperar Senha - Conformidade LGPD' : 'Entrar - Conformidade LGPD'}
        </h1>
        
        {errors.general && (
          <div data-testid="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div data-testid="message" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <input
              data-testid="email-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {!isPasswordResetMode && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                data-testid="password-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          <button
            data-testid={isPasswordResetMode ? "reset-button" : "submit-button"}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (isPasswordResetMode ? 'Enviando...' : 'Entrando...') 
              : (isPasswordResetMode ? 'Enviar Reset' : 'Entrar')
            }
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {!isPasswordResetMode && (
            <div className="text-center">
              <button 
                type="button"
                onClick={handlePasswordResetClick}
                className="text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer underline-offset-2"
              >
                Esqueci minha senha
              </button>
            </div>
          )}
          
          {isPasswordResetMode && (
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setIsPasswordResetMode(false)}
                className="text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer underline-offset-2"
              >
                Voltar ao Acesso
              </button>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-300">
              Não tem uma conta?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Carregando...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}