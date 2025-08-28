'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CLIENT_MESSAGES } from '@/lib/message-constants';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email(CLIENT_MESSAGES.EMAIL_INVALID).min(1, CLIENT_MESSAGES.EMAIL_REQUIRED),
  password: z.string().min(1, CLIENT_MESSAGES.PASSWORD_REQUIRED),
});

const passwordResetSchema = z.object({
  email: z.string().email(CLIENT_MESSAGES.EMAIL_INVALID).min(1, CLIENT_MESSAGES.EMAIL_REQUIRED),
});

type LoginFormData = z.infer<typeof loginSchema>;
type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form hooks
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordResetForm = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    // Check for auth required message
    const message = searchParams.get('message');
    if (message === 'auth-required') {
      setGeneralError('Por favor, faça login para enviar solicitações LGPD');
    }
  }, [searchParams]);

  const handleLoginSubmit = async (data: LoginFormData) => {
    setGeneralError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      // Extract JWT token from Authorization header
      const authHeader = response.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '') || null;

      if (response.ok) {
        if (responseData.code === 'LOGIN_SUCCESS') {
          // Store login state and JWT token from header
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', data.email);
          if (token) {
            localStorage.setItem('authToken', token);
          } else {
            console.warn('Login successful but no token found in Authorization header');
          }
          router.push('/dashboard');
        }
      } else if (responseData.code) {
        const errorMsg = ERROR_MESSAGES[responseData.code] || 'Erro desconhecido';
        setGeneralError(errorMsg);
      } else {
        setGeneralError('Erro no login');
      }
    } catch {
      setGeneralError(CLIENT_MESSAGES.CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (data: PasswordResetFormData) => {
    setGeneralError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.code === 'PASSWORD_RESET_REQUESTED') {
        const successMsg = SUCCESS_MESSAGES[responseData.code];
        setSuccessMessage(successMsg);
      } else if (responseData.code) {
        const errorMsg = ERROR_MESSAGES[responseData.code] || 'Erro desconhecido';
        setGeneralError(errorMsg);
      } else {
        setGeneralError('Erro ao solicitar reset');
      }
    } catch {
      setGeneralError(CLIENT_MESSAGES.CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetClick = () => {
    setIsPasswordResetMode(true);
    setGeneralError('');
    setSuccessMessage('');
    loginForm.reset();
  };

  const handleBackToLogin = () => {
    setIsPasswordResetMode(false);
    setGeneralError('');
    setSuccessMessage('');
    passwordResetForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isPasswordResetMode ? 'Recuperar Senha' : 'Entrar'}
          </CardTitle>
          <CardDescription className="text-center">
            {isPasswordResetMode 
              ? 'Digite seu e-mail para receber instruções de recuperação'
              : 'Acesse sua conta de conformidade LGPD'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {!isPasswordResetMode ? (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={passwordResetForm.handleSubmit(handlePasswordResetSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-mail</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...passwordResetForm.register('email')}
                />
                {passwordResetForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {passwordResetForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Reset'}
              </Button>
            </form>
          )}

          <div className="space-y-4 pt-4">
            {!isPasswordResetMode ? (
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={handlePasswordResetClick}
                  className="p-0 h-auto"
                >
                  Esqueci minha senha
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={handleBackToLogin}
                  className="p-0 h-auto"
                >
                  Voltar ao Acesso
                </Button>
              </div>
            )}
            
            <div className="text-center text-sm text-muted-foreground">
              {!isPasswordResetMode ? (
                <>
                  Não tem uma conta?{' '}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="/register">Cadastre-se</a>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}