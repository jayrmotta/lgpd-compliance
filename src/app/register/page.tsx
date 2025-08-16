'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CLIENT_MESSAGES } from '@/lib/message-constants';

interface FormData {
  email: string;
  password: string;
  userType: 'data_subject' | 'company_representative';
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    userType: 'data_subject'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Client-side validation
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = CLIENT_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = CLIENT_MESSAGES.EMAIL_INVALID;
    }

    if (!formData.password) {
      newErrors.password = CLIENT_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 8 || 
               !/[A-Z]/.test(formData.password) || 
               !/[a-z]/.test(formData.password) || 
               !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e caractere especial';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.code) {
        const successMsg = SUCCESS_MESSAGES[responseData.code] || 'Operação realizada com sucesso';
        setSuccessMessage(successMsg);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (responseData.code) {
        const errorMsg = ERROR_MESSAGES[responseData.code] || 'Erro desconhecido';
        setErrors({ general: errorMsg });
      } else {
        setErrors({ general: 'Erro no cadastro' });
      }
    } catch {
      setErrors({ general: CLIENT_MESSAGES.CONNECTION_ERROR });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
          <div data-testid="success-message" className="text-green-400 text-center mb-4">
            {successMessage}
          </div>
          <p className="text-center text-gray-300">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Cadastro - LGPD Compliance</h1>
        
        {errors.general && (
          <div data-testid="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
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

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Usuário
            </label>
            <select
              data-testid="userType-select"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="data_subject">Titular de Dados</option>
              <option value="company_representative">Representante da Empresa</option>
            </select>
          </div>

          <button
            data-testid="submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Já tem uma conta?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}