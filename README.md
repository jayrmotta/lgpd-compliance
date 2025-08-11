# LGPD Compliance Application

A Next.js application for managing LGPD (Lei Geral de Proteção de Dados) compliance, built with TypeScript, Tailwind CSS, and following TDD/BDD practices.

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

## Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration values.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:cucumber` - Run BDD scenarios with Cucumber

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── features/            # Feature-specific code
├── lib/                 # Utility functions and configurations
└── types/               # TypeScript type definitions

features/                # BDD test scenarios (Gherkin)
├── step_definitions/    # Cucumber step implementations
└── support/             # Test setup and utilities

__tests__/               # Unit and integration tests
reports/                 # Test coverage and reports
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

## Contributing

1. Features must start with Gherkin scenarios
2. All code must have passing tests
3. Follow the established code conventions
4. Security-first approach to all implementations

## Resources

- [LGPD Law Text](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [ANPD Guidelines](https://www.gov.br/anpd/pt-br)
- [Next.js Documentation](https://nextjs.org/docs)
