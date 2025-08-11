'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Error code translations
const errorMessages: Record<string, string> = {
  VALIDATION_REQUIRED_FIELDS_MISSING: 'Email e senha são obrigatórios',
  VALIDATION_EMAIL_INVALID: 'Formato de email inválido',
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  SERVER_ERROR: 'Erro interno do servidor',
};

const successMessages: Record<string, string> = {
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  PASSWORD_RESET_REQUESTED: 'Se este email existe em nosso sistema, você receberá instruções para redefinir sua senha',
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setIsLoading(true);

    // Client-side validation
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isPasswordResetMode && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
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

      if (response.ok) {
        if (responseData.code === 'LOGIN_SUCCESS') {
          // Store login state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', formData.email);
          router.push('/dashboard');
        } else if (responseData.code === 'PASSWORD_RESET_REQUESTED') {
          const successMsg = successMessages[responseData.code];
          setSuccessMessage(successMsg);
        }
      } else if (responseData.code) {
        const errorMsg = errorMessages[responseData.code] || 'Erro desconhecido';
        setErrors({ general: errorMsg });
      } else {
        setErrors({ general: isPasswordResetMode ? 'Erro ao solicitar reset' : 'Erro no login' });
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão. Tente novamente.' });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isPasswordResetMode ? 'Recuperar Senha - LGPD Compliance' : 'Login - LGPD Compliance'}
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              data-testid="email-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {!isPasswordResetMode && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                data-testid="password-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Voltar ao Login
              </button>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-600">
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