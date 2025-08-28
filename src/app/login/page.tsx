"use client"

import type React from "react"
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ERROR_MESSAGES, CLIENT_MESSAGES } from '@/lib/message-constants';
import Link from "next/link"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email(CLIENT_MESSAGES.EMAIL_INVALID).min(1, CLIENT_MESSAGES.EMAIL_REQUIRED),
  password: z.string().min(1, CLIENT_MESSAGES.PASSWORD_REQUIRED),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  // Form hooks
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Check for auth required message
    const message = searchParams.get('message');
    if (message === 'auth-required') {
      setGeneralError('Por favor, faça login para enviar solicitações LGPD');
    }
  }, [searchParams]);

  const handleSubmit = async (data: LoginFormData) => {
    setGeneralError('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Shield className="h-12 w-12 text-primary mr-3" />
          <span className="text-2xl font-bold">LGPD Platform</span>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar na Plataforma</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar dados e solicitações LGPD</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    {...loginForm.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao início
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
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