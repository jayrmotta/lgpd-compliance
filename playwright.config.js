// Playwright configuration for E2E tests
module.exports = {
  // Global timeout for all operations
  timeout: 30000, // 30 seconds
  
  // Timeout for individual expect calls
  expect: {
    timeout: 10000 // 10 seconds
  },
  
  // Browser launch options
  use: {
    // Timeout for actions like click, fill, etc.
    actionTimeout: 10000, // 10 seconds
    
    // Timeout for navigation
    navigationTimeout: 20000, // 20 seconds
    
    // Headless mode for CI/CD
    headless: true,
    
    // Browser viewport
    viewport: { width: 1280, height: 720 },
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },
  
  // Projects configuration
  projects: [
    {
      name: 'chromium',
      use: { ...require('playwright').devices['Desktop Chrome'] },
    },
  ],
};