# LGPD Compliance Platform

A comprehensive Next.js application for managing LGPD (Lei Geral de Proteção de Dados) compliance requests, built with TypeScript, Tailwind CSS, and following TDD/BDD practices.

## 🚀 Features

- **User Authentication**: Secure login/registration for data subjects and company representatives
- **LGPD Request Management**: Create, track, and manage different types of LGPD requests:
  - Data Access Requests
  - Data Deletion Requests  
  - Data Correction Requests
  - Data Portability Requests
- **PIX Payment Integration**: Secure payment verification for request processing
- **End-to-End Encryption**: Client-side encryption for sensitive data
- **Request History**: Track status and progress of all submitted requests
- **Multi-language Support**: Portuguese localization for Brazilian users

## 🛠 Tech Stack

- **Frontend**: Next.js 15.4+, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: SQLite3 with promisified interface
- **Authentication**: JWT tokens with secure middleware
- **Encryption**: libsodium for end-to-end encryption
- **Testing**: Jest (unit), Cucumber (BDD), Playwright (E2E)
- **Code Quality**: ESLint, TypeScript strict mode

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd lgpd-compliance
npm install
```

### 2. Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration values.

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint code analysis |
| `npm test` | Run unit tests with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:cucumber` | Run BDD scenarios with Cucumber |

## 🧪 Testing Strategy

### Unit Tests (Jest)
- **69 tests** covering core business logic
- **API routes**, **authentication**, **encryption**, **database operations**
- Run with: `npm test`
- Coverage reports in `/coverage/`

### BDD Tests (Cucumber + Playwright)
- **26 scenarios** covering user journeys
- **Authentication flows**, **LGPD request workflows**, **PIX payments**
- Run with: `npm run test:cucumber`
- Requires development server running on port 3000

### Test Architecture
```
Browser Tests (Cucumber/Playwright)
      ↓
Integration Tests (API + DB)
      ↓  
Unit Tests (Jest)
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # User dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page  
│   ├── lgpd-requests/     # LGPD request creation
│   ├── my-requests/       # Request history
│   └── logout/            # Logout page
├── lib/                   # Core utilities
│   ├── auth-middleware.ts # JWT authentication
│   ├── crypto.ts          # End-to-end encryption
│   ├── database-v2.ts     # Database operations
│   ├── jwt.ts             # Token management
│   ├── pix-mock.ts        # PIX payment simulation
│   ├── message-constants.ts # Error/success messages
│   └── auth-utils.ts      # Authentication helpers

features/                  # BDD scenarios (Gherkin)
├── step_definitions/      # Cucumber step implementations
│   ├── authentication_steps.js
│   ├── lgpd_requests_steps.js
│   └── data_encryption_steps.js
└── support/              # Test configuration
    ├── timeout.js        # Test timeout settings
    └── browser-setup.js  # Playwright configuration

tests/                    # Unit tests (Jest)
reports/                  # Test coverage and reports
```

## Development Approach

This project follows **Behavior-Driven Development (BDD)** and **Test-Driven Development (TDD)** practices:

1. **Gherkin First**: Features are defined using Gherkin scenarios
2. **Red-Green-Refactor**: Write failing tests, make them pass, then refactor
3. **Clean Code**: Following SOLID principles and meaningful naming
4. **Security First**: Zero-trust security model with environment-based configuration

## LGPD Compliance Features

- **Article 18 Rights**: Right to information, access, correction, anonymization, portability, deletion
- **Consent Management**: Granular consent tracking and withdrawal mechanisms
- **Data Processing Records**: Article 37 processing activity documentation
- **Incident Response**: Data breach notification workflows
- **Privacy by Design**: Built-in privacy controls and data minimization

## 🔧 Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

#### Cucumber Tests Timing Out
```bash
# Ensure dev server is running first
npm run dev

# Wait for "Ready" message, then run tests
npm run test:cucumber
```

#### Database Permission Issues
```bash
# Ensure SQLite file is writable
chmod 644 lgpd_compliance.db

# Or delete and recreate
rm lgpd_compliance.db
# Database will be recreated on first API call
```

#### Browser Launch Issues (Playwright)
```bash
# Install Playwright browsers
npx playwright install chromium

# Or install system dependencies
npx playwright install-deps
```

For more detailed troubleshooting, see [TESTING.md](./TESTING.md).

## 🤝 Contributing

1. **Gherkin First**: Features must start with Gherkin scenarios
2. **Test Coverage**: All code must have passing tests
3. **Code Standards**: Follow established conventions and linting rules
4. **Security First**: Zero-trust approach to all implementations
5. **Documentation**: Update docs for any architectural changes

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Write Gherkin scenarios
# Edit files in features/

# 3. Implement with TDD
npm run test:watch

# 4. Verify BDD scenarios
npm run test:cucumber

# 5. Run full test suite
npm test && npm run test:cucumber
```

## 📚 Documentation

- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[CLAUDE.md](./CLAUDE.md)** - Project-specific AI development rules
- **API Documentation** - Available at `/api/docs` (when running)

## 🔗 Resources

- **LGPD**: [Law Text](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) | [ANPD Guidelines](https://www.gov.br/anpd/pt-br)
- **Tech Stack**: [Next.js](https://nextjs.org/docs) | [Tailwind CSS](https://tailwindcss.com/docs) | [Jest](https://jestjs.io/) | [Cucumber](https://cucumber.io/)
- **Deployment**: [AWS Amplify Guide](https://docs.amplify.aws/) for Next.js full-stack apps
