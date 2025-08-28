# Plataforma de Conformidade LGPD

Uma aplicação Next.js abrangente para gerenciar solicitações de conformidade LGPD (Lei Geral de Proteção de Dados), construída com TypeScript, Tailwind CSS, e seguindo práticas TDD.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Login/registro seguro para titulares de dados e representantes de empresa
- **Gestão de Solicitações LGPD**: Criar, acompanhar e gerenciar diferentes tipos de solicitações LGPD:
  - Solicitações de Acesso a Dados
  - Solicitações de Exclusão de Dados  
  - Solicitações de Correção de Dados
  - Solicitações de Portabilidade de Dados
- **Integração de Pagamento PIX**: Verificação de pagamento segura para processamento de solicitações
- **Criptografia Ponta a Ponta**: Criptografia do lado do cliente para dados sensíveis
- **Histórico de Solicitações**: Acompanhar status e progresso de todas as solicitações enviadas
- **Suporte Multi-idioma**: Localização em português para usuários brasileiros

## 🛠 Stack Tecnológica

- **Frontend**: Next.js 15.4+, React 19, TypeScript 5
- **Estilo**: Tailwind CSS 4
- **Banco de Dados**: SQLite3 com interface promisificada
- **Autenticação**: Tokens JWT com middleware seguro
- **Criptografia**: libsodium para criptografia ponta a ponta
- **Testes**: Jest (unidade), Playwright (E2E)
- **Qualidade de Código**: ESLint, TypeScript modo estrito

## 📋 Pré-requisitos

- Node.js 18.17 ou posterior
- npm, yarn, ou pnpm
- Git

## 🚀 Primeiros Passos

### 1. Clonar e Instalar

```bash
git clone <repository-url>
cd lgpd-compliance
npm install
```

### 2. Configuração do Ambiente

1. Copie o arquivo de exemplo do ambiente:
   ```bash
   cp .env.example .env
   ```

2. Atualize o arquivo `.env` com seus valores de configuração.

### 3. Criar Conta de Super Administrador

**⚠️ IMPORTANTE:** Antes de usar a plataforma, você deve criar a conta inicial do operador da plataforma (super admin).

```bash
# Método 1: Com argumentos de linha de comando (recomendado)
npm run create-super-admin -- --email admin@yourplatform.com --password YourSecurePass123!

# Método 2: Modo interativo (solicita entrada)
npm run create-super-admin

# Ver ajuda
npm run create-super-admin -- --help
```

**Requisitos de Senha:**
- Mínimo 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula  
- Pelo menos um caractere especial

**Recursos de Segurança:**
- ✅ Apenas um super admin permitido por sistema
- ✅ Senhas são hasheadas com bcrypt (salt rounds: 12)
- ✅ Validação rigorosa de entrada
- ✅ Credenciais nunca armazenadas permanentemente no script

### 4. Servidor de Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

### 4. Build para Produção

```bash
npm run build
npm start
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run create-super-admin` | **Criar conta de super administrador inicial** |
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Construir a aplicação para produção |
| `npm run start` | Iniciar o servidor de produção |
| `npm run lint` | Executar análise de código ESLint |
| `npm test` | Executar testes unitários com Jest |
| `npm run test:watch` | Executar testes em modo watch |
| `npm run test:coverage` | Executar testes com relatório de cobertura |


## 🎭 História Completa da Jornada LGPD

### **Capítulo 1: O Administrador da Plataforma (Super Admin) Configura o Sistema**

Maria, operadora da plataforma LGPD, inicia a configuração do sistema executando o comando de criação do super administrador:

```bash
npm run create-super-admin -- --email maria@lgpdplatform.com --password SecureAdmin123!
```

O sistema cria sua conta com o mais alto nível de acesso. Agora ela pode fazer login no **painel administrativo** (`/admin`) e precisa configurar uma nova empresa na plataforma.

Maria navega para a interface administrativa onde vê um aviso crítico: "Esta página é apenas para operadores da plataforma. Representantes da empresa devem ser criados através desta interface." Ela preenche o formulário de criação de representante da empresa para a TechCorp Ltd, inserindo:
- Email: admin@techcorp.com  
- Company ID: techcorp-ltd
- Função: admin
- Seleciona "Gerar senha temporária automaticamente"

Quando ela clica em "Criar Representante da Empresa", o sistema chama `/api/admin/company-representatives` e gera uma senha temporária automaticamente que deve ser enviada de forma segura para João.

### **Capítulo 2: Representante da Empresa Configura a Criptografia**

João, o recém-criado administrador da TechCorp Ltd, recebe suas credenciais de login de forma segura. Ele visita a plataforma e faz login em `/login` usando o sistema de autenticação. Após login bem-sucedido, ele é direcionado para `/company-setup`.

João vê um aviso crítico de segurança: "Private keys are generated in your browser and NEVER sent to our servers". Ele clica em "Gerar Chaves de Criptografia", que aciona a função de geração de chaves.

O sistema gera um par de chaves de criptografia:
- Chave pública (para receber solicitações LGPD criptografadas)
- Chave privada (para descriptografar solicitações - permanece no navegador)

João salva sua chave privada no gerenciador de senhas, baixa o backup usando "📁 Download Key File", marca "I have saved my private key securely" e clica em "✅ Register Public Key & Continue". O sistema registra a chave pública da empresa no banco de dados.

### **Capítulo 3: Titular de Dados Descobre Seus Direitos**

Ana, uma cidadã comum, visita a página inicial da plataforma (`/`) e lê sobre conformidade LGPD. Ela aprende sobre seus direitos através dos cartões de funcionalidades:
- 📝 Acesso a Dados ("Visualize todos os dados pessoais armazenados")
- 🗑️ Exclusão de Dados ("Solicite a remoção completa dos seus dados")  
- ✏️ Correção de Dados ("Atualize informações incorretas")
- 📤 Portabilidade de Dados ("Exporte seus dados em formato portável")

Impressionada com a abordagem de segurança primeiro descrita, Ana clica em "Criar Conta".

### **Capítulo 4: Registro do Titular de Dados**

Ana preenche o formulário de registro em `/register` com seu email e uma senha forte. O sistema valida que sua senha atende aos requisitos: 8+ caracteres, maiúscula, minúscula e caracteres especiais.

Quando ela submete, o endpoint da API `/api/auth/register` processa sua solicitação:
1. Valida formato do email
2. Faz hash de sua senha com bcrypt
3. Cria sua conta com função 'data_subject'
4. Retorna código de sucesso 'REGISTRATION_SUCCESS'

### **Capítulo 5: Login e Acesso ao Dashboard do Titular de Dados**

Ana faz login em `/login` usando suas credenciais. O sistema verifica sua senha, gera um token JWT, e a redireciona para `/dashboard`.

Em seu dashboard, Ana vê uma mensagem de boas-vindas e três opções principais:
- "Solicitar Dados" (acesso a dados)
- "Excluir Dados" (exclusão de dados)  
- "Corrigir Dados" (correção de dados)

### **Capítulo 6: Criando uma Solicitação LGPD**

Ana clica em "Solicitar Dados" que a leva para `/lgpd-requests?type=data_access`. O sistema primeiro realiza uma verificação de compatibilidade do navegador e mostra "✓ Seu navegador é compatível".

Ana preenche sua solicitação:
- **Motivo**: "Quero verificar meus dados pessoais" 
- **Descrição**: "Por favor, forneça todos os meus dados pessoais incluindo nome completo, endereço e dados comportamentais coletados sobre mim"

Quando ela preenche o formulário e procede, o sistema automaticamente inicia o processo de verificação de identidade via PIX.

### **Capítulo 7: Verificação de Identidade**

O sistema agora requer verificação de identidade via PIX. Ana vê o formulário onde insere seu CPF: "123.456.789-00".

Ela clica em "🔐 Gerar QR Code PIX (R$ 0,01)", que gera um QR code PIX para pagamento de R$ 0,01. Após simular o pagamento com "✅ Simular Pagamento Realizado", sua identidade é verificada.

### **Capítulo 8: Submissão da Solicitação Criptografada**

Com a identidade verificada, Ana vê a tela de confirmação mostrando "✅ Identidade verificada - Processando solicitação..." e "Sua solicitação está sendo criptografada e enviada automaticamente".

O sistema automaticamente aciona o processo de criptografia em `/api/lgpd-requests`:

1. Verifica autenticação e valida os dados
2. Busca a chave pública da TechCorp
3. Criptografa os dados sensíveis usando criptografia sealed box
4. Armazena apenas metadados e o blob criptografado no banco de dados

O sistema responde com sucesso e confirmação de criptografia:
```
✅ Solicitação LGPD criada com sucesso!
🔒 DADOS CRIPTOGRAFADOS COM SEGURANÇA
• Apenas a empresa pode descriptografar
• A plataforma NÃO pode ver seus dados pessoais
• Operador com conhecimento zero implementado
```

### **Capítulo 9: Empresa Processa a Solicitação**

João da TechCorp recebe uma notificação sobre a nova solicitação LGPD. Ele faz login em `/company-dashboard` mas primeiro deve desbloquear o dashboard com sua chave privada.

João insere sua chave privada de seu gerenciador de senhas. O sistema valida o formato da chave e desbloqueia o dashboard, mostrando "Dashboard Desbloqueado".

O dashboard exibe a solicitação de Ana:
- **Tipo de Solicitação**: "Acesso aos Dados - 1755288038734-b9kyt20gt"
- **Status**: "PENDING" 
- **Criada**: "15/08/2025 às 20:00"
- **Prazo**: "30/08/2025 às 20:00" (15 dias)

João clica na solicitação para descriptografá-la. O sistema usa sua chave privada para descriptografar o sealed box, revelando os dados originais de Ana:
- **Email**: ana@email.com
- **CPF**: 123.456.789-00
- **Motivo**: "Quero verificar meus dados pessoais"  
- **Descrição**: "Por favor, forneça todos os meus dados..."

### **Capítulo 10: Processamento e Resposta da Solicitação**

João revisa a solicitação descriptografada de Ana e clica em "Processar Solicitação". Ele coleta os dados de Ana dos sistemas da TechCorp:
- Dados de perfil (nome, email, endereço)
- Dados comportamentais (histórico de compras, preferências)
- Dados técnicos (endereços IP, informações do dispositivo)

João compila uma resposta abrangente e clica em "Marcar como Concluída". O sistema atualiza o status da solicitação para 'COMPLETED' com timestamp de conclusão.

### **Capítulo 11: Titular de Dados Recebe Resposta**

Ana faz login novamente na plataforma e visita `/my-requests` para verificar o status de sua solicitação. Ela vê que sua solicitação agora está marcada como "COMPLETED" com um indicador de status verde.

A TechCorp envia a Ana sua exportação completa de dados através de um canal seguro (separado da plataforma), cumprindo sua solicitação de acesso LGPD dentro do prazo obrigatório de 15 dias.

### **Capítulo 12: Conformidade Alcançada**

O sistema mantém trilha de auditoria completa com metadados e timestamps, garantindo conformidade LGPD:

- **Ana** exerceu seu direito de acesso a dados
- **TechCorp** respondeu dentro dos prazos legais  
- **Plataforma** facilitou transferência segura com conhecimento zero
- **Super Admin** manteve integridade sem acessar dados pessoais

Isso demonstra o fluxo completo de conformidade LGPD com criptografia ponta a ponta, onde dados sensíveis permanecem acessíveis apenas aos representantes da empresa.

## 🧪 Estratégia de Testes

### Testes Unitários (Jest)
- Cobrindo lógica de negócio principal
- **Rotas de API**, **autenticação**, **criptografia**, **operações de banco de dados**
- Executar com: `npm test`
- Relatórios de cobertura em `/coverage/`

### Testes E2E (Playwright)
- Cobrindo jornadas do usuário
- **Fluxos de autenticação**, **fluxos de trabalho de solicitação LGPD**, **pagamentos PIX**
- Executar com: `npx playwright test`
- Requer servidor de desenvolvimento rodando na porta 3000

### Arquitetura de Testes
```
Testes de Navegador (Playwright)
      ↓
Testes de Integração (API + DB)
      ↓  
Testes Unitários (Jest)
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Rotas de API de autenticação
│   ├── api/lgpd-requests/ # API de solicitações LGPD
│   ├── api/admin/         # API administrativa
│   ├── api/pix/           # API de pagamento PIX
│   ├── dashboard/         # Página do dashboard do usuário
│   ├── company-dashboard/ # Dashboard da empresa
│   ├── company-setup/     # Configuração de empresa
│   ├── admin/             # Painel administrativo
│   ├── login/             # Página de login
│   ├── register/          # Página de registro  
│   ├── lgpd-requests/     # Criação de solicitação LGPD
│   ├── my-requests/       # Histórico de solicitações
│   └── logout/            # Página de logout
├── lib/                   # Utilitários principais
│   ├── auth-middleware.ts # Autenticação JWT
│   ├── crypto.ts          # Criptografia ponta a ponta
│   ├── database-v2.ts     # Operações de banco de dados
│   ├── jwt.ts             # Gerenciamento de tokens
│   ├── message-constants.ts # Mensagens de erro/sucesso
│   ├── identity-verification.ts # Verificação de identidade
│   ├── auth-client.tsx    # Cliente de autenticação
│   ├── auth-fetch.ts      # Utilitários de fetch autenticado
│   └── user-storage.ts    # Armazenamento de usuário
├── scripts/               # Scripts utilitários
│   └── create-super-admin.ts # Criação de super admin
└── types/                 # Definições de tipos TypeScript

features/                  # Arquivos de especificação de funcionalidades

coverage/                 # Relatórios de cobertura de testes
```

## Abordagem de Desenvolvimento

Este projeto segue práticas de **Desenvolvimento Orientado por Testes (TDD)**:

1. **Teste Primeiro**: Escrever testes que falham, fazer passar, então refatorar
2. **Código Limpo**: Seguindo princípios SOLID e nomenclatura significativa
3. **Segurança Primeiro**: Modelo de segurança zero-trust com configuração baseada em ambiente
4. **Especificação por Funcionalidades**: Funcionalidades são definidas usando arquivos de especificação

## Funcionalidades de Conformidade LGPD

- **Direitos do Artigo 18**: Direito à informação, acesso, correção, anonimização, portabilidade, exclusão
- **Gestão de Consentimento**: Rastreamento granular de consentimento e mecanismos de retirada
- **Registros de Processamento de Dados**: Documentação de atividades de processamento do Artigo 37
- **Resposta a Incidentes**: Fluxos de trabalho de notificação de violação de dados
- **Privacidade por Design**: Controles de privacidade embutidos e minimização de dados

## 🔧 Solução de Problemas

### Problemas Comuns

#### Porta 3000 Já em Uso
```bash
# Matar processo usando porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar porta diferente
npm run dev -- -p 3001
```

#### Testes E2E com Timeout
```bash
# Garantir que servidor dev está rodando primeiro
npm run dev

# Aguardar mensagem "Ready", então executar testes
npx playwright test
```

#### Problemas de Permissão do Banco de Dados
```bash
# Garantir que arquivo SQLite é gravável
chmod 644 lgpd_compliance.db

# Ou deletar e recriar
rm lgpd_compliance.db
# Banco de dados será recriado na primeira chamada da API
```

#### Problemas de Lançamento do Navegador (Playwright)
```bash
# Instalar navegadores Playwright
npx playwright install chromium

# Ou instalar dependências do sistema
npx playwright install-deps
```

Para solução de problemas mais detalhada, consulte a documentação inline neste README.

## 🤝 Contribuindo

1. **Especificação Primeiro**: Funcionalidades devem começar com arquivos de especificação
2. **Cobertura de Testes**: Todo código deve ter testes passando
3. **Padrões de Código**: Seguir convenções estabelecidas e regras de linting
4. **Segurança Primeiro**: Abordagem zero-trust para todas as implementações

### Fluxo de Trabalho de Desenvolvimento
```bash
# 1. Criar branch de funcionalidade
git checkout -b feature/nome-da-sua-funcionalidade

# 2. Escrever especificações de funcionalidades
# Editar arquivos em features/

# 3. Implementar com TDD
npm run test:watch

# 4. Verificar testes E2E
npx playwright test

# 5. Executar suite completa de testes
npm test && npx playwright test
```

## 📚 Documentação

- **[CLAUDE.md](./CLAUDE.md)** - Regras de desenvolvimento de IA específicas do projeto

## 🔗 Recursos

- **LGPD**: [Texto da Lei](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) | [Diretrizes ANPD](https://www.gov.br/anpd/pt-br)
- **Stack Tecnológica**: [Next.js](https://nextjs.org/docs) | [Tailwind CSS](https://tailwindcss.com/docs) | [Jest](https://jestjs.io/) | [Playwright](https://playwright.dev/)
- **Implantação**: [Guia AWS Amplify](https://docs.amplify.aws/) para aplicações Next.js full-stack