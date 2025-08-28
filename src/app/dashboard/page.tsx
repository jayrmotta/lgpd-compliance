"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from 'next/navigation';
import { FileText, Trash2, Edit, Plus, Clock, CheckCircle, AlertCircle, RefreshCw, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticatedFetch } from "@/lib/auth-fetch"
import { TopBar } from "@/components/layout/top-bar"
import { useAuth } from "@/lib/auth-client"
import { getIconBorderColor } from "@/lib/utils"

interface LGPDRequest {
  id: string;
  type: string;
  status: string;
  reason: string;
  description: string;
  created_at: string;
  response_due_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<LGPDRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      loadUserRequests();
    }
  }, [user, authLoading]);

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

  // Request types for navigation
  const requestTypes = [
    {
      id: 'data_access',
      type: 'Solicitação de Acesso aos Dados',
      description: 'Visualizar quais dados pessoais possuímos',
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      id: 'data_deletion',
      type: 'Solicitação de Exclusão de Dados', 
      description: 'Excluir todos os seus dados pessoais',
      icon: Trash2,
      color: 'bg-red-500'
    },
    {
      id: 'data_correction',
      type: 'Solicitação de Correção de Dados',
      description: 'Corrigir dados pessoais incorretos',
      icon: Edit,
      color: 'bg-yellow-500'
    },
    {
      id: 'data_portability',
      type: 'Solicitação de Portabilidade de Dados',
      description: 'Exportar seus dados em formato portável',
      icon: FileText,
      color: 'bg-green-500'
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <TopBar title="Dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Gerencie suas solicitações da Lei Geral de Proteção de Dados e exercite seus direitos de proteção de dados.
          </p>
        </div>

        {/* Request Creation Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tipos de Solicitação LGPD</CardTitle>
            <CardDescription>
              Escolha o tipo de solicitação que deseja fazer conforme seus direitos LGPD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestTypes.map((request) => {
                const IconComponent = request.icon;
                return (
                  <Card 
                    key={request.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow border-2 ${getIconBorderColor(request.color)}`}
                    data-testid={`request-type-${request.id.replace('_', '-')}`}
                  >
                    <CardContent className="pt-6">
                      <a href={`/create-request?type=${request.id}`} className="block">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${request.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.type}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
                <Button asChild>
                  <a href="/create-request?type=data_access">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Solicitação
                  </a>
                </Button>
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}