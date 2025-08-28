'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/lib/auth-fetch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertCircle, Plus, RefreshCw, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Request {
  id: string;
  type: string;
  status: string;
  reason: string;
  description: string;
  created_at: string;
  response_due_at: string;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && email) {
      setIsAuthenticated(true);
      loadRequests();
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadRequests = async () => {
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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
      case 'concluída':
      case 'concluida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'processando':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'completed':
      case 'concluída':
      case 'concluida':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'processando':
        return <RefreshCw className="h-4 w-4" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatRequestType = (type: string) => {
    const typeMap: Record<string, string> = {
      'ACCESS': 'Acesso',
      'DELETION': 'Exclusão',
      'CORRECTION': 'Correção',
      'PORTABILITY': 'Portabilidade'
    };
    return typeMap[type] || type;
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'COMPLETED': 'Concluída',
      'FAILED': 'Falhou'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Por favor, faça login para visualizar suas solicitações</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Minhas Solicitações</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/lgpd-requests">Nova Solicitação</a>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <h3 className="font-semibold">Criptografia Sealed Box Ativa</h3>
                <ul className="text-sm space-y-1">
                  <li>• Seus dados pessoais estão criptografados usando libsodium</li>
                  <li>• Apenas a empresa pode descriptografar suas solicitações</li>
                  <li>• A plataforma opera com conhecimento zero dos seus dados</li>
                  <li>• Máxima proteção da privacidade implementada</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Solicitações LGPD</CardTitle>
              <CardDescription>
                Visualize o status e histórico de todas as suas solicitações LGPD
              </CardDescription>
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
                      onClick={loadRequests}
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
                    <a href="/lgpd-requests">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova Solicitação
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID da Solicitação</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Submissão</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Criptografia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.id}
                          </TableCell>
                          <TableCell>
                            {formatRequestType(request.type)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(formatStatus(request.status))}
                              data-testid={`request-status-${request.status.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {getStatusIcon(formatStatus(request.status))}
                              <span className="ml-1">{formatStatus(request.status)}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(request.created_at)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.description}
                          </TableCell>
                          <TableCell>
                            {request.description.includes('[ENCRYPTED]') ? (
                              <Badge variant="secondary">
                                <Shield className="h-3 w-3 mr-1" />
                                Sealed Box
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                ⚠️ Plaintext
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button asChild size="lg">
              <a href="/lgpd-requests">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Solicitação LGPD
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}