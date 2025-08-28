'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Users, FileText, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsAuthenticated(isLoggedIn === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LGPD Platform</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4" variant="secondary">
          <Lock className="h-3 w-3 mr-1" />
          Criptografia Ponta-a-Ponta
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Conformidade LGPD
          <br />
          com Segurança Total
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Plataforma profissional para gestão de direitos de proteção de dados com criptografia de conhecimento zero e
          auditoria completa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated && (
            <>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Exercer Meus Direitos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/company-setup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Configurar Empresa
                </Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Ir para Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Seus Direitos LGPD</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exercite seus direitos fundamentais de proteção de dados de forma segura e transparente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Acesso a Dados</CardTitle>
              <CardDescription>Visualize todos os dados pessoais armazenados sobre você</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dados de perfil completos</li>
                <li>• Histórico de atividades</li>
                <li>• Metadados coletados</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Shield className="h-8 w-8 text-destructive mb-2" />
              <CardTitle>Exclusão de Dados</CardTitle>
              <CardDescription>Solicite a remoção completa dos seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Exclusão permanente</li>
                <li>• Confirmação auditável</li>
                <li>• Prazo de 15 dias</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Correção de Dados</CardTitle>
              <CardDescription>Atualize informações incorretas ou desatualizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Edição em tempo real</li>
                <li>• Validação automática</li>
                <li>• Histórico de mudanças</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Portabilidade</CardTitle>
              <CardDescription>Exporte seus dados em formato portável</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato JSON/CSV</li>
                <li>• Download seguro</li>
                <li>• Criptografia ponta-a-ponta</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Pronto para Garantir Conformidade LGPD?
        </h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Junte-se a empresas que já confiam na nossa plataforma para gerenciar dados pessoais com segurança.
        </p>
        {!isAuthenticated && (
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2025 LGPD Platform. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
