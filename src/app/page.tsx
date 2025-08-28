'use client';

import { Shield, Users, FileText, Lock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/lib/auth-client";
import { TopBar } from "@/components/layout/top-bar";
import { getIconBorderColor } from "@/lib/utils";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Top Bar */}
      <TopBar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-[1.1] py-2">
          Seus Dados,
          <br />
          Seu Controle
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Exerça seus direitos LGPD de forma fácil e segura. <br/> 
          Veja, corrija ou exclua seus dados pessoais quando quiser.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={user ? "/dashboard" : "/register"}>
            <Button size="lg" className="w-full sm:w-auto">
              {user ? "Acessar Dashboard" : "Exercer Meus Direitos"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Seus Direitos LGPD</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exercite seus direitos fundamentais de proteção de dados de forma segura e transparente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`border-2 transition-colors ${getIconBorderColor('text-primary')}`}>
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

          <Card className={`border-2 transition-colors ${getIconBorderColor('text-destructive')}`}>
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

          <Card className={`border-2 transition-colors ${getIconBorderColor('text-accent')}`}>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Correção de Dados</CardTitle>
              <CardDescription>Atualize informações incorretas ou desatualizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Correção imediata</li>
                <li>• Validação de identidade</li>
                <li>• Histórico de alterações</li>
              </ul>
            </CardContent>
          </Card>

          <Card className={`border-2 transition-colors ${getIconBorderColor('text-chart-4')}`}>
            <CardHeader>
              <Users className="h-8 w-8 text-chart-4 mb-2" />
              <CardTitle>Portabilidade</CardTitle>
              <CardDescription>Exporte seus dados em formato portável e estruturado</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato JSON/CSV</li>
                <li>• Download seguro</li>
                <li>• Dados estruturados</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Segurança em Primeiro Lugar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa arquitetura de conhecimento zero garante que apenas você e a empresa têm acesso aos seus dados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Criptografia Ponta-a-Ponta</h3>
              <p className="text-muted-foreground">
                Seus dados são criptografados no navegador antes de serem enviados
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conhecimento Zero</h3>
              <p className="text-muted-foreground">A plataforma não pode acessar o conteúdo das suas solicitações</p>
            </div>

            <div className="text-center">
              <div className="bg-chart-4/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auditoria Completa</h3>
              <p className="text-muted-foreground">Todas as ações são registradas para conformidade e transparência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Prisma. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Desenvolvido com foco em privacidade e conformidade LGPD</p>
        </div>
      </footer>
    </div>
  )
}
