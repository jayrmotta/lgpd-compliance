'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CLIENT_MESSAGES } from '@/lib/message-constants';

// Form validation schema
const registerSchema = z.object({
  email: z.string().email(CLIENT_MESSAGES.EMAIL_INVALID).min(1, CLIENT_MESSAGES.EMAIL_REQUIRED),
  password: z.string()
    .min(1, CLIENT_MESSAGES.PASSWORD_REQUIRED)
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial'),
  userType: z.literal('data_subject'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form hook
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'data_subject',
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setGeneralError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        setGeneralError(errorMsg);
      } else {
        setGeneralError('Erro no cadastro');
      }
    } catch {
      setGeneralError(CLIENT_MESSAGES.CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Cadastro Realizado!</CardTitle>
            <CardDescription className="text-center">
              Sua conta foi criada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription data-testid="success-message">
                {successMessage}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">
              Redirecionando para login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
          <CardDescription className="text-center">
            Crie sua conta de conformidade LGPD
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertDescription data-testid="error-message">
                {generalError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                data-testid="email-input"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                data-testid="password-input"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e caractere especial
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
              <a href="/login">Faça login</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}