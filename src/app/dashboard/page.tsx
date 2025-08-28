"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { Shield, FileText, Trash2, Edit, Download, Plus, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { authenticatedFetch } from "@/lib/auth-fetch"

interface LGPDRequest {
  id: string;
  type: string;
  status: string;
  reason: string;
  description: string;
  created_at: string;
  response_due_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [requests, setRequests] = useState<LGPDRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      if (isLoggedIn === 'true' && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
        loadUserRequests();
      } else {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuth();
    
    // Check authentication on window focus (prevents access after logout in another tab)
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [router]);

  const loadUserRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authenticatedFetch('/api/lgpd-requests');
      const data = await response.json();

      if (!response.ok) {
        setError(data.code || 'SERVER_ERROR');
        return;
      }

      setRequests(data.data?.requests || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setError('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on every page visit
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      setIsAuthenticated(false);
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserEmail('');
    router.push('/logout');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "concluída":
      case "concluida":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "pending":
      case "pendente":
        return <Clock className="h-4 w-4 text-accent" />
      case "processing":
      case "processando":
        return <RefreshCw className="h-4 w-4 text-accent" />
      case "rejected":
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "concluída":
      case "concluida":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Concluída</Badge>
      case "pending":
      case "pendente":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Pendente</Badge>
      case "processing":
      case "processando":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processando</Badge>
      case "rejected":
      case "failed":
        return <Badge variant="destructive">Rejeitada</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const formatRequestType = (type: string) => {
    const typeMap: Record<string, string> = {
      'ACCESS': 'Acesso aos Dados',
      'DELETION': 'Exclusão de Dados',
      'CORRECTION': 'Correção de Dados',
      'PORTABILITY': 'Portabilidade de Dados'
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Prisma</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Link href="/my-requests">
              <Button variant="outline" size="sm">
                Minhas Solicitações
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Gerencie suas solicitações da Lei Geral de Proteção de Dados e exercite seus direitos de proteção de dados.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/lgpd-requests?type=data_access">
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Solicitar Dados</CardTitle>
                <CardDescription>Visualize todos os seus dados pessoais armazenados</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/lgpd-requests?type=data_deletion">
            <Card className="border-2 hover:border-destructive/50 transition-colors cursor-pointer">
              <CardHeader>
                <Trash2 className="h-8 w-8 text-destructive mb-2" />
                <CardTitle>Excluir Dados</CardTitle>
                <CardDescription>Solicite a remoção completa dos seus dados pessoais</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/lgpd-requests?type=data_correction">
            <Card className="border-2 hover:border-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <Edit className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Corrigir Dados</CardTitle>
                <CardDescription>Atualize informações incorretas ou desatualizadas</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Minhas Solicitações</CardTitle>
              <CardDescription>
                Acompanhe o status das suas solicitações da Lei Geral de Proteção de Dados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadUserRequests}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Link href="/lgpd-requests">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Solicitação
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p>Erro ao carregar solicitações: {error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadUserRequests}
                    className="mt-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Carregando suas solicitações...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Você ainda não fez nenhuma solicitação LGPD.</p>
                <Link href="/lgpd-requests">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Solicitação
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID da Solicitação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>{formatRequestType(request.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>{formatDate(request.response_due_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {request.status.toLowerCase() === "completed" || 
                           request.status.toLowerCase() === "concluída" || 
                           request.status.toLowerCase() === "concluida" ? (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}