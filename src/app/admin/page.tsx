'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ERROR_MESSAGES } from '@/lib/message-constants';
import { withAuth } from '@/lib/auth-client';
import { TopBar } from '@/components/layout/top-bar';

// Form validation schema
const createUserSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().optional(),
  role: z.enum(['admin', 'employee']),
  generatePassword: z.boolean(),
}).refine((data) => {
  // If not generating password, password is required
  if (!data.generatePassword && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Forneça uma senha temporária ou marque 'Gerar automaticamente'",
  path: ["password"]
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form hook
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'employee',
      generatePassword: true,
    },
  });

  const handleSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          email: data.email,
          password: data.generatePassword ? undefined : data.password,
          role: data.role,
          generatePassword: data.generatePassword
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        let successText = 'Usuário criado com sucesso!';
        if (responseData.data?.temporaryPassword) {
          successText += `\n\nSenha temporária: ${responseData.data.temporaryPassword}\n\nENVIE esta senha de forma segura para o usuário. Eles DEVEM alterar esta senha no primeiro login.`;
        }
        setMessage({ type: 'success', text: successText });
        form.reset();
      } else {
        const errorMessage = ERROR_MESSAGES[responseData.code] || responseData.code || 'Erro desconhecido';
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage({ type: 'error', text: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Configuração da Plataforma" />

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">

          {/* Create User Form */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Usuário Admin/Funcionário</CardTitle>
              <CardDescription>
                Crie novos representantes da empresa com acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="representante@empresa.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Tipo de Senha</Label>
                  <RadioGroup
                    value={form.watch('generatePassword') ? 'auto' : 'manual'}
                    onValueChange={(value) => {
                      form.setValue('generatePassword', value === 'auto');
                      if (value === 'auto') {
                        form.setValue('password', '');
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Gerar senha temporária automaticamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Criar senha temporária manualmente</Label>
                    </div>
                  </RadioGroup>
                </div>

                {!form.watch('generatePassword') && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha Temporária</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha forte: 8+ chars, maiúscula, minúscula, especial"
                      {...form.register('password')}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Esta senha será temporária. O usuário será obrigado a alterá-la no primeiro login.
                    </p>
                  </div>
                )}

                {form.watch('generatePassword') && (
                  <Alert>
                    <AlertDescription>
                      <div className="flex items-center">
                        <div className="text-lg mr-2">🎲</div>
                        <div>
                          <h4 className="font-medium">Geração Automática</h4>
                          <p className="text-sm">
                            Uma senha temporária segura será gerada automaticamente e exibida após a criação.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={form.watch('role')}
                    onValueChange={(value: 'admin' | 'employee') => form.setValue('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Administradores podem gerenciar outros representantes e criar funcionários. Funcionários só podem acessar funções da empresa.
                  </p>
                </div>

                {message && (
                  <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                    <AlertDescription className="whitespace-pre-line">
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Representante da Empresa'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Export the component - middleware handles super_admin authorization
export default withAuth(AdminPage);