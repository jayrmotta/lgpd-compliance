# Plataforma de Conformidade LGPD

Uma aplicação Next.js abrangente para gerenciar solicitações de conformidade LGPD (Lei Geral de Proteção de Dados), construída com TypeScript, Tailwind CSS, e seguindo práticas TDD/BDD.

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
- **Testes**: Jest (unidade), Cucumber (BDD), Playwright (E2E)
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
| `npm run test:cucumber` | Executar cenários BDD com Cucumber |

## 🎭 História Completa da Jornada LGPD

### **Capítulo 1: O Administrador da Plataforma (Super Admin) Configura o Sistema**

Maria, operadora da plataforma LGPD, inicia a configuração do sistema executando o comando de criação do super administrador:

```bash
npm run create-super-admin -- --email maria@lgpdplatform.com --password SecureAdmin123!
```

O sistema cria sua conta com o mais alto nível de acesso (`ROLE_HIERARCHY.super_admin: 4` em `common.ts:26`). Agora ela pode fazer login no **painel administrativo** (`/admin/page.tsx:15`) e precisa configurar uma nova empresa na plataforma.

Maria navega para a interface administrativa onde vê um aviso crítico: "Esta página é apenas para operadores da plataforma" (`admin/page.tsx:110`). Ela preenche o formulário de criação de representante da empresa para a TechCorp Ltd, inserindo:
- Email: admin@techcorp.com  
- Senha: SecurePass123!
- ID da Empresa: techcorp-ltd
- Função: admin

Quando ela clica em "Criar Representante da Empresa" (`admin/page.tsx:217`), o sistema chama `/api/admin/company-representatives` que valida seus privilégios de super admin e cria a conta do representante da empresa com função 'admin' (`database-v2.ts:44`).

### **Capítulo 2: Representante da Empresa Configura a Criptografia**

João, o recém-criado administrador da TechCorp Ltd, recebe suas credenciais de login de forma segura. Ele visita a plataforma e faz login em `/login` usando o sistema de autenticação (`auth/login/route.ts:1`). Após login bem-sucedido, ele é direcionado para `/company-setup` (`company-setup/page.tsx:8`).

João vê um aviso crítico de segurança: "Chaves privadas são geradas em seu navegador e NUNCA enviadas aos nossos servidores" (`company-setup/page.tsx:117`). Ele clica em "Gerar Chaves de Criptografia" (`company-setup/page.tsx:145`), que aciona a função `generateKeyPair()` (`crypto.ts` - referenciado em `company-setup/page.tsx:19`).

O sistema gera:
- Uma chave pública (para receber solicitações LGPD criptografadas)
- Uma chave privada (para descriptografar solicitações - nunca sai de seu navegador)
- Uma impressão digital da chave para identificação (`company-setup/page.tsx:169`)

João cuidadosamente copia sua chave privada para seu gerenciador de senhas, baixa o arquivo de backup das chaves (`company-setup/page.tsx:54`), marca "Salvei minha chave privada com segurança" (`company-setup/page.tsx:252`), e clica em "Registrar Chave Pública e Continuar" (`company-setup/page.tsx:262`). O sistema registra a chave pública de sua empresa no banco de dados (`database-v2.ts:344`).

### **Capítulo 3: Titular de Dados Descobre Seus Direitos**

Ana, uma cidadã comum, visita a página inicial da plataforma (`page.tsx:6`) e lê sobre conformidade LGPD. Ela aprende sobre seus direitos através dos cartões de funcionalidades (`page.tsx:183`):
- 📝 Acesso a Dados ("Visualize todos os dados pessoais armazenados")
- 🗑️ Exclusão de Dados ("Solicite a remoção completa dos seus dados")  
- ✏️ Correção de Dados ("Atualize informações incorretas")
- 📤 Portabilidade de Dados ("Exporte seus dados em formato portável")

Impressionada com a abordagem de segurança primeiro descrita, Ana clica em "Criar Conta" (`page.tsx:44`).

### **Capítulo 4: Registro do Titular de Dados**

Ana preenche o formulário de registro em `/register` com seu email e uma senha forte. O sistema valida que sua senha atende aos requisitos: 8+ caracteres, maiúscula, minúscula e caracteres especiais (`auth/register/route.ts:16-30`).

Quando ela submete, o endpoint da API `/api/auth/register` (`auth/register/route.ts:37`) processa sua solicitação:
1. Valida formato do email (`auth/register/route.ts:32`)
2. Faz hash de sua senha com bcrypt (`auth/register/route.ts:105`)
3. Cria sua conta com função 'data_subject' (`auth/register/route.ts:111`)
4. Retorna código de sucesso 'REGISTRATION_SUCCESS' (`auth/register/route.ts:117`)

### **Capítulo 5: Login e Acesso ao Dashboard do Titular de Dados**

Ana faz login em `/login` usando suas credenciais. O sistema verifica sua senha, gera um token JWT (`jwt.ts` - referenciado no login), e a redireciona para `/dashboard` (`dashboard/page.tsx:6`).

Em seu dashboard, Ana vê uma mensagem de boas-vindas e três opções principais (`dashboard/page.tsx:96-134`):
- "Solicitar Dados" (acesso a dados)
- "Excluir Dados" (exclusão de dados)  
- "Corrigir Dados" (correção de dados)

### **Capítulo 6: Criando uma Solicitação LGPD**

Ana clica em "Solicitar Dados" que a leva para `/lgpd-requests?type=data_access` (`dashboard/page.tsx:99`). O sistema primeiro realiza uma verificação de compatibilidade do navegador (`lgpd-requests/page.tsx:49`) e mostra ✅ "Seu navegador é compatível" (`lgpd-requests/page.tsx:257`).

Ana preenche sua solicitação (`lgpd-requests/page.tsx:307-332`):
- **Motivo**: "Quero verificar meus dados pessoais" 
- **Descrição**: "Por favor, forneça todos os meus dados pessoais incluindo nome completo, endereço e dados comportamentais coletados sobre mim"

Quando ela clica em "Enviar Solicitação" (`lgpd-requests/page.tsx:347`), o sistema mostra uma mensagem de processamento de segurança: "Sua solicitação está sendo protegida" (`lgpd-requests/page.tsx:264`).

### **Capítulo 7: Verificação de Identidade**

O sistema agora requer verificação de identidade (`lgpd-requests/page.tsx:369`). Ana vê o formulário de verificação onde insere seu CPF: "123.456.789-00" (`lgpd-requests/page.tsx:396`).

Ela clica em "Verificar Identidade" (`lgpd-requests/page.tsx:415`), que valida o formato do CPF (`lgpd-requests/page.tsx:153-160`) e define `identityVerified = true`.

### **Capítulo 8: Submissão da Solicitação Criptografada**

Com a identidade verificada, Ana vê a tela de confirmação final (`lgpd-requests/page.tsx:431`) mostrando "Identidade verificada com sucesso" e "Sua solicitação está sendo criptografada antes do envio" (`lgpd-requests/page.tsx:441`).

Ela clica em "Finalizar Solicitação" (`lgpd-requests/page.tsx:454`), que aciona o processo crítico de criptografia em `/api/lgpd-requests` (`lgpd-requests/route.ts:55`):

1. **Verificação de Autenticação**: Verifica o token JWT de Ana (`lgpd-requests/route.ts:58-74`)
2. **Validação de Dados**: Valida tipo de solicitação, motivo, descrição e CPF (`lgpd-requests/route.ts:88-112`)
3. **Configuração da Empresa**: Garante que a chave pública da TechCorp existe (`lgpd-requests/route.ts:118`)
4. **Criação de Metadados**: Cria registro de solicitação apenas com CPF hasheado (`lgpd-requests/route.ts:142-157`)
5. **Criptografia**: Os dados sensíveis de Ana são criptografados usando criptografia sealed box (`lgpd-requests/route.ts:161-181`):
   ```javascript
   const sensitiveData = {
     reason: "Quero verificar meus dados pessoais",
     description: "Por favor, forneça todos os meus dados...",
     cpf: "123.456.789-00",
     type: "ACCESS",
     userEmail: "ana@email.com",
     timestamp: "2025-08-17T...",
     requestId: "REQ-1755288038734-b9kyt20gt"
   }
   ```
6. **Armazenamento**: Blob criptografado armazenado no banco de dados (`lgpd-requests/route.ts:177-181`)

O sistema responde com sucesso e confirmação de criptografia (`lgpd-requests/route.ts:183-193`):
```
✅ Solicitação LGPD criada com sucesso!
🔒 DADOS CRIPTOGRAFADOS COM SEGURANÇA
• Apenas a empresa pode descriptografar
• A plataforma NÃO pode ver seus dados pessoais
• Operador com conhecimento zero implementado
```

### **Capítulo 9: Empresa Processa a Solicitação**

João da TechCorp recebe uma notificação sobre a nova solicitação LGPD. Ele faz login em `/company-dashboard` (`company-dashboard/page.tsx:27`) mas primeiro deve desbloquear o dashboard com sua chave privada.

João insere sua chave privada de seu gerenciador de senhas (`company-dashboard/page.tsx:214-218`). O sistema valida o formato da chave (`company-dashboard/page.tsx:79`) e desbloqueia o dashboard, mostrando "Dashboard Desbloqueado" (`company-dashboard/page.tsx:252`).

O dashboard exibe a solicitação de Ana (`company-dashboard/page.tsx:277`):
- **Tipo de Solicitação**: "Acesso aos Dados - REQ-1755288038734-b9kyt20gt"
- **Status**: "PENDING" 
- **Criada**: "15/08/2025 às 20:00"
- **Prazo**: "30/08/2025 às 20:00" (15 dias, conforme `database-v2.ts:152`)

João clica na solicitação para descriptografá-la. O sistema usa sua chave privada para descriptografar o sealed box (`company-dashboard/page.tsx:99-125`), revelando os dados originais de Ana:
- **Email**: ana@email.com
- **CPF**: 123.456.789-00
- **Motivo**: "Quero verificar meus dados pessoais"  
- **Descrição**: "Por favor, forneça todos os meus dados..."

### **Capítulo 10: Processamento e Resposta da Solicitação**

João revisa a solicitação descriptografada de Ana e clica em "Processar Solicitação" (`company-dashboard/page.tsx:324`). Ele coleta os dados de Ana dos sistemas da TechCorp:
- Dados de perfil (nome, email, endereço)
- Dados comportamentais (histórico de compras, preferências)
- Dados técnicos (endereços IP, informações do dispositivo)

João compila uma resposta abrangente e clica em "Marcar como Concluída" (`company-dashboard/page.tsx:328`). O sistema atualiza o status da solicitação para 'COMPLETED' com timestamp de conclusão (`database-v2.ts:260-272`).

### **Capítulo 11: Titular de Dados Recebe Resposta**

Ana faz login novamente na plataforma e visita `/my-requests` para verificar o status de sua solicitação. Ela vê que sua solicitação agora está marcada como "COMPLETED" com um indicador de status verde.

A TechCorp envia a Ana sua exportação completa de dados através de um canal seguro (separado da plataforma), cumprindo sua solicitação de acesso LGPD dentro do prazo obrigatório de 15 dias.

### **Capítulo 12: Conformidade Contínua**

O sistema mantém uma trilha de auditoria de todas as ações:
- Metadados da solicitação de Ana (com dados sensíveis criptografados)
- Timestamps de processamento e mudanças de status
- Rastreamento de conformidade de resposta da empresa
- Prova de conhecimento zero de que o operador da plataforma nunca viu os dados pessoais de Ana

Todas as partes cumpriram suas obrigações LGPD:
- **Ana** exerceu seu direito de acesso a dados
- **TechCorp** respondeu dentro dos prazos legais  
- **Plataforma** facilitou transferência de dados segura e conforme
- **Super Admin** mantém integridade do sistema sem acessar dados pessoais

Isso demonstra o fluxo completo ponta a ponta de conformidade LGPD onde dados pessoais sensíveis permanecem criptografados e acessíveis apenas aos representantes apropriados da empresa, enquanto o operador da plataforma mantém conhecimento zero do conteúdo real dos dados pessoais.

## 🧪 Estratégia de Testes

### Testes Unitários (Jest)
- **69 testes** cobrindo lógica de negócio principal
- **Rotas de API**, **autenticação**, **criptografia**, **operações de banco de dados**
- Executar com: `npm test`
- Relatórios de cobertura em `/coverage/`

### Testes BDD (Cucumber + Playwright)
- **26 cenários** cobrindo jornadas do usuário
- **Fluxos de autenticação**, **fluxos de trabalho de solicitação LGPD**, **pagamentos PIX**
- Executar com: `npm run test:cucumber`
- Requer servidor de desenvolvimento rodando na porta 3000

### Arquitetura de Testes
```
Testes de Navegador (Cucumber/Playwright)
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
│   ├── dashboard/         # Página do dashboard do usuário
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
│   ├── pix-mock.ts        # Simulação de pagamento PIX
│   ├── message-constants.ts # Mensagens de erro/sucesso
│   └── auth-utils.ts      # Auxiliares de autenticação

features/                  # Cenários BDD (Gherkin)
├── step_definitions/      # Implementações de passos Cucumber
│   ├── authentication_steps.js
│   ├── lgpd_requests_steps.js
│   └── data_encryption_steps.js
└── support/              # Configuração de teste
    ├── timeout.js        # Configurações de timeout de teste
    └── browser-setup.js  # Configuração do Playwright

tests/                    # Testes unitários (Jest)
reports/                  # Cobertura de testes e relatórios
```

## Abordagem de Desenvolvimento

Este projeto segue práticas de **Desenvolvimento Orientado por Comportamento (BDD)** e **Desenvolvimento Orientado por Testes (TDD)**:

1. **Gherkin Primeiro**: Funcionalidades são definidas usando cenários Gherkin
2. **Vermelho-Verde-Refatorar**: Escrever testes que falham, fazer passar, então refatorar
3. **Código Limpo**: Seguindo princípios SOLID e nomenclatura significativa
4. **Segurança Primeiro**: Modelo de segurança zero-trust com configuração baseada em ambiente

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

#### Testes Cucumber com Timeout
```bash
# Garantir que servidor dev está rodando primeiro
npm run dev

# Aguardar mensagem "Ready", então executar testes
npm run test:cucumber
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

Para solução de problemas mais detalhada, veja [TESTING.md](./TESTING.md).

## 🤝 Contribuindo

1. **Gherkin Primeiro**: Funcionalidades devem começar com cenários Gherkin
2. **Cobertura de Testes**: Todo código deve ter testes passando
3. **Padrões de Código**: Seguir convenções estabelecidas e regras de linting
4. **Segurança Primeiro**: Abordagem zero-trust para todas as implementações
5. **Documentação**: Atualizar docs para quaisquer mudanças arquiteturais

### Fluxo de Trabalho de Desenvolvimento
```bash
# 1. Criar branch de funcionalidade
git checkout -b feature/nome-da-sua-funcionalidade

# 2. Escrever cenários Gherkin
# Editar arquivos em features/

# 3. Implementar com TDD
npm run test:watch

# 4. Verificar cenários BDD
npm run test:cucumber

# 5. Executar suite completa de testes
npm test && npm run test:cucumber
```

## 📚 Documentação

- **[TESTING.md](./TESTING.md)** - Guia abrangente de testes
- **[CLAUDE.md](./CLAUDE.md)** - Regras de desenvolvimento de IA específicas do projeto
- **Documentação da API** - Disponível em `/api/docs` (quando rodando)

## 🔗 Recursos

- **LGPD**: [Texto da Lei](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) | [Diretrizes ANPD](https://www.gov.br/anpd/pt-br)
- **Stack Tecnológica**: [Next.js](https://nextjs.org/docs) | [Tailwind CSS](https://tailwindcss.com/docs) | [Jest](https://jestjs.io/) | [Cucumber](https://cucumber.io/)
- **Implantação**: [Guia AWS Amplify](https://docs.amplify.aws/) para aplicações Next.js full-stack