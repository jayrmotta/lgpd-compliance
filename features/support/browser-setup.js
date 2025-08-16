const { Before, After } = require('@cucumber/cucumber');

// Global browser health check
Before({ tags: '@browser-health' }, async function () {
  if (!global.browser || !global.page) {
    throw new Error('Browser not properly initialized');
  }
  
  try {
    // Test browser is responsive
    await global.page.evaluate(() => 'browser-check');
    console.log('Browser health check passed');
  } catch (error) {
    throw new Error(`Browser health check failed: ${error.message}`);
  }
});