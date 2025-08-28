// Translation system for server response codes
// This maps server-generated codes to user-friendly Portuguese messages

export interface TranslationMap {
  [key: string]: string;
}

// Server response codes to Portuguese translations
export const serverMessages: TranslationMap = {
  // Success codes
  'REQUESTS_RETRIEVED': 'Solicitações LGPD carregadas com sucesso',
  'STATUS_UPDATED': 'Status da solicitação atualizado com sucesso',
  'REGISTRATION_SUCCESS': 'Cadastro realizado com sucesso',
  'LOGIN_SUCCESS': 'Login realizado com sucesso',
  
  // Error codes
  'INSUFFICIENT_PERMISSIONS': 'Permissões insuficientes para esta operação',
  'SERVER_ERROR': 'Erro interno do servidor',
  'VALIDATION_INVALID_JSON': 'Formato JSON inválido',
  'VALIDATION_REQUIRED_FIELDS_MISSING': 'Campos obrigatórios não preenchidos',
  'VALIDATION_INVALID_STATUS': 'Status inválido fornecido',
  'UPDATE_FAILED': 'Falha ao atualizar dados',
  'VALIDATION_EMAIL_INVALID': 'Email inválido',
  'USER_ALREADY_EXISTS': 'Usuário já existe',
  'PASSWORD_TOO_WEAK': 'Senha muito fraca',
  
  // Request status translations
  'PENDING': 'Pendente',
  'PROCESSING': 'Em Processamento',
  'COMPLETED': 'Concluída',
  'FAILED': 'Falhou',
  
  // Request type translations
  'ACCESS': 'Acesso aos Dados',
  'DELETION': 'Exclusão de Dados',
  'CORRECTION': 'Correção de Dados',
  'PORTABILITY': 'Portabilidade de Dados',
};

// UI text translations (keeping only well-known English terms)
export const uiMessages: TranslationMap = {
  // Dashboard
  'dashboard_unlock_title': '🔐 Desbloquear Dashboard',
  'dashboard_unlock_subtitle': 'Insira sua chave privada do gerenciador de senhas:',
  'dashboard_unlock_placeholder': 'Cole sua chave privada aqui...',
  'dashboard_unlock_note': 'Sua chave privada é processada localmente e nunca enviada aos nossos servidores.',
  'dashboard_unlock_button': 'Desbloquear',
  'dashboard_unlocking': 'Desbloqueando...',
  'dashboard_unlocked_title': 'Dashboard Desbloqueado',
  'dashboard_unlocked_message': 'Sua chave privada é válida. Agora você pode descriptografar e visualizar solicitações LGPD.',
  
  // Requests
  'requests_title': 'Solicitações LGPD',
  'requests_loading': 'Carregando solicitações...',
  'requests_empty': 'Nenhuma solicitação LGPD encontrada.',
  'requests_submitted': 'Enviada',
  'requests_due': 'Prazo',
  'requests_decrypted_content': '🔓 Conteúdo Descriptografado:',
  'requests_user_email': 'Email do Usuário:',
  'requests_reason': 'Motivo:',
  'requests_description': 'Descrição:',
  'requests_process_button': 'Processar Solicitação',
  'requests_complete_button': 'Marcar como Concluída',
  'requests_decrypt_failed': '❌ Falha ao descriptografar esta solicitação',
  
  // Messages
  'message_success_processing': 'Solicitação marcada como em processamento com sucesso!',
  'message_success_completed': 'Solicitação marcada como concluída com sucesso!',
  'message_error_update': 'Erro ao atualizar status da solicitação:',

  
  // Validation errors
  'error_private_key_required': 'Por favor, insira sua chave privada',
  'error_private_key_invalid_format': 'Formato de chave privada inválido',
  'error_private_key_invalid_size': 'Formato de chave privada inválido - tamanho incorreto',
  'error_private_key_invalid_base64': 'Formato de chave privada inválido - não é uma chave base64 válida',
  'error_private_key_decrypt_failed': 'Chave privada inválida - não foi possível descriptografar os dados',
  'error_company_public_key_missing': 'Chave pública da empresa não encontrada. Por favor, recarregue a página.',
  'error_fetch_metadata': 'Falha ao carregar metadados da empresa',
  'error_fetch_requests': 'Falha ao carregar solicitações LGPD:',
};

// Function to get translation for server response codes
export function getServerMessage(code: string): string {
  return serverMessages[code] || code;
}

// Function to get translation for UI text
export function getUIMessage(key: string): string {
  return uiMessages[key] || key;
}

// Function to format request type
export function formatRequestType(type: string): string {
  return serverMessages[type] || type;
}

// Function to format request status
export function formatRequestStatus(status: string): string {
  return serverMessages[status] || status;
}
