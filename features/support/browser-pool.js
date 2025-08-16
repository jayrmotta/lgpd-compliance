const { chromium } = require('playwright');

class BrowserPool {
  constructor() {
    this.browser = null;
    this.contexts = new Map();
  }

  async getBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true,
        timeout: 10000, // Reduced timeout
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
    }
    return this.browser;
  }

  async getContext(testId) {
    const browser = await this.getBrowser();
    
    if (!this.contexts.has(testId)) {
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        viewport: { width: 1280, height: 720 }
      });
      this.contexts.set(testId, context);
    }
    
    return this.contexts.get(testId);
  }

  async getPage(testId) {
    const context = await this.getContext(testId);
    const page = await context.newPage();
    
    // Set reasonable timeouts for slow initial page loads (compilation is slow)
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    
    return page;
  }

  async cleanup(testId) {
    const context = this.contexts.get(testId);
    if (context) {
      await context.close();
      this.contexts.delete(testId);
    }
  }

  async closeAll() {
    for (const [testId, context] of this.contexts) {
      try {
        await context.close();
      } catch (error) {
        console.log(`Error closing context ${testId}:`, error.message);
      }
    }
    this.contexts.clear();
    
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        console.log('Error closing browser:', error.message);
      }
      this.browser = null;
    }
  }
}

// Export singleton instance
module.exports = new BrowserPool();