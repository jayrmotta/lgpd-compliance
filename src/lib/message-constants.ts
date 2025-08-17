// Shared error and success message constants
// Used across authentication and API responses

export const ERROR_MESSAGES: Record<string, string> = {
  // Validation errors
  VALIDATION_REQUIRED_FIELDS_MISSING: 'Email e senha são obrigatórios',
  VALIDATION_EMAIL_INVALID: 'Formato de email inválido',
  VALIDATION_PASSWORD_WEAK: 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número',
  PASSWORD_TOO_WEAK: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e caractere especial',
  VALIDATION_USER_TYPE_INVALID: 'Tipo de usuário inválido',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  USER_ALREADY_EXISTS: 'Usuário já existe com este email',
  USER_NOT_FOUND: 'Usuário não encontrado',
  REGISTRATION_COMPANY_REPRESENTATIVES_NOT_ALLOWED: 'Representantes da empresa não podem se registrar. Entre em contato com o administrador da plataforma.',
  
  // Server errors
  SERVER_ERROR: 'Erro interno do servidor',
  DATABASE_ERROR: 'Erro na base de dados',
  
  // PIX payment errors
  PIX_PAYMENT_FAILED: 'Pagamento PIX falhou',
  PIX_VERIFICATION_FAILED: 'CPF verification failed',
  PIX_TIMEOUT: 'Payment verification timed out',
  PIX_INVALID_CPF: 'Please ensure you\'re using the same CPF associated with your account',
  PIX_RESTART_REQUEST: 'Please start a new request',
  
  // LGPD request errors
  REQUEST_CREATION_FAILED: 'Falha ao criar solicitação LGPD',
  REQUEST_NOT_FOUND: 'Solicitação não encontrada',
  VALIDATION_REQUEST_TYPE_INVALID: 'Tipo de solicitação inválido',
  VALIDATION_INVALID_JSON: 'Dados JSON inválidos',
  AUTHENTICATION_REQUIRED: 'Autenticação obrigatória',
  INVALID_TOKEN: 'Token de autenticação inválido',
};

export const SUCCESS_MESSAGES: Record<string, string> = {
  // Authentication success
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  REGISTRATION_SUCCESS: 'Cadastro realizado com sucesso',
  PASSWORD_RESET_REQUESTED: 'Se este email existe em nosso sistema, você receberá instruções para redefinir sua senha',
  
  // LGPD request success
  REQUEST_CREATED: 'Solicitação LGPD criada com sucesso',
  REQUEST_SUBMITTED: 'Solicitação enviada com sucesso',
  REQUESTS_RETRIEVED: 'Solicitações recuperadas com sucesso',
  PIX_PAYMENT_VERIFIED: 'Pagamento verificado com sucesso',
  PIX_PAYMENT_SUCCESS: 'Pagamento verificado com sucesso',
  SECURITY_PROCESSING_SUCCESS: '✓ Solicitação protegida com sucesso',
  SECURITY_READY_FOR_VERIFICATION: '✓ Pronto para verificação de identidade',
};

// Client-side validation messages (more user-friendly)
export const CLIENT_MESSAGES: Record<string, string> = {
  EMAIL_REQUIRED: 'Email é obrigatório',
  EMAIL_INVALID: 'Email inválido',
  PASSWORD_REQUIRED: 'Senha é obrigatória',
  PASSWORD_TOO_SHORT: 'Senha deve ter pelo menos 8 caracteres',
  PASSWORDS_DONT_MATCH: 'Senhas não coincidem',
  USER_TYPE_REQUIRED: 'Tipo de usuário é obrigatório',
  CONNECTION_ERROR: 'Erro de conexão. Tente novamente.',
};