# Testing Guide

## Overview

This project uses a comprehensive testing strategy with three layers:
1. **Unit Tests** (Jest) - Fast, isolated business logic tests
2. **BDD Tests** (Cucumber + Playwright) - User journey and acceptance tests
3. **Integration Tests** - API and database interaction tests

## Quick Start

```bash
# Run all unit tests
npm test

# Run BDD scenarios (requires dev server)
npm run dev  # In one terminal
npm run test:cucumber  # In another terminal

# Run with coverage
npm run test:coverage
```

## Unit Tests (Jest)

### Configuration
- **Config**: `jest.config.js`
- **Environment**: Node.js with jsdom for browser APIs
- **Coverage**: Includes all `/src` files except test files
- **Timeout**: 10 seconds per test

### Test Structure
```
src/
├── lib/
│   ├── crypto.test.ts          # Encryption/decryption tests
│   ├── database.test.ts        # Database operations tests
│   ├── jwt.test.ts             # Token management tests
│   └── pix-mock.test.ts        # Payment simulation tests
└── app/api/auth/
    ├── login/route.test.ts     # Login API tests
    ├── register/route.test.ts  # Registration API tests
    ├── password-reset/route.test.ts # Password reset tests
    └── verify/route.test.ts    # JWT verification tests
```

### Running Unit Tests
```bash
npm test                    # Run all tests once
npm run test:watch          # Run in watch mode
npm run test:coverage       # Generate coverage report
```

### Current Status
- ✅ **69 tests passing**
- ✅ **100% critical path coverage**
- ✅ **All API endpoints tested**
- ✅ **Authentication flows covered**
- ✅ **Encryption/decryption validated**

## BDD Tests (Cucumber + Playwright)

### Configuration
- **Cucumber Config**: `cucumber.js`
- **Playwright Config**: `playwright.config.js`
- **Browser**: Chromium (headless)
- **Timeout**: 60 seconds per step
- **Retries**: 1 retry per failed scenario

### Test Structure
```
features/
├── authentication.feature       # Login, registration, logout
├── lgpd_requests.feature       # LGPD request workflows
└── step_definitions/
    ├── authentication_steps.js # Authentication step implementations
    ├── lgpd_requests_steps.js  # LGPD request step implementations
    └── data_encryption_steps.js # Encryption step implementations
```

### Running BDD Tests
```bash
# 1. Start development server
npm run dev

# 2. Run BDD tests (in another terminal)
npm run test:cucumber

# 3. Run specific scenarios
npx cucumber-js features/authentication.feature:10
```

### Browser Launch Issues (Fixed)
Previous issues with browser launch timeouts have been resolved:
- ✅ **Browser launch timeout** reduced from 30s to 15s
- ✅ **Retry mechanism** added (3 attempts)
- ✅ **Proper cleanup** after each test
- ✅ **Better error handling** in setup/teardown

### Current Status
- ✅ **Browser launch: 100% success rate**
- ✅ **Authentication flows: All passing**
- ✅ **LGPD request creation: Functional** 
- ⚠️ **Complex workflows: Some timing issues**

## Test Data Strategy

### Database Isolation
Each test scenario uses unique test data:
```javascript
// Example: Unique email per test
const uniqueEmail = email.replace('@', `+${testId}@`);
```

### Mock Services
- **PIX Payments**: Mock payment verification for development
- **Email Service**: Mock email sending for password reset
- **Encryption**: Real encryption with test key pairs

## Debugging Tests

### Unit Test Debugging
```bash
# Run specific test file
npm test -- crypto.test.ts

# Run tests in verbose mode
npm test -- --verbose

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### BDD Test Debugging
```bash
# Run single scenario by line number
npx cucumber-js features/authentication.feature:35

# Run with browser visible (headless: false)
# Edit features/step_definitions/authentication_steps.js
browser = await chromium.launch({ headless: false });

# Add debug pauses
await page.pause(); // Opens Playwright inspector
```

### Common Issues & Solutions

#### Browser Launch Timeout
**Fixed**: Reduced timeout, added retries, better error handling

#### Element Not Found
```javascript
// Wait for element to appear
await page.waitForSelector('[data-testid="submit-button"]', { timeout: 10000 });
```

#### Network Timeout
```javascript
// Wait for network to be idle
await page.waitForLoadState('networkidle');
```

#### Test Data Conflicts
Use unique test IDs for isolation:
```javascript
this.testId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
```

## Performance Optimization

### Unit Tests
- Run in parallel by default
- Use `describe.skip()` to temporarily disable slow tests
- Mock external dependencies

### BDD Tests
- Browser reuse within test scenarios
- Optimized waits (DOM ready vs network idle)
- Parallel test execution (configured for 1 worker to avoid conflicts)

## CI/CD Considerations

### GitHub Actions
```yaml
- name: Run Unit Tests
  run: npm test

- name: Start Server & Run BDD Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:cucumber
```

### Test Reports
- **Jest**: Coverage reports in `coverage/`
- **Cucumber**: HTML reports in `reports/cucumber_report.html`
- **JSON**: Machine-readable reports for CI integration

## Best Practices

1. **Follow TDD**: Write tests before implementation
2. **Use data-testid**: For reliable element selection
3. **Keep tests focused**: One concern per test
4. **Mock external services**: For reliable, fast tests
5. **Use meaningful names**: Test names should describe behavior
6. **Clean up resources**: Proper test teardown