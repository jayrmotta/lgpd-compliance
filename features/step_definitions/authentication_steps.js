const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

let browser;
let context;
let page;

// Setup and teardown hooks
Before(async function () {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
  
  // Make page accessible globally for other step definition files
  global.page = page;
  global.browser = browser;
  global.context = context;
  
  // Generate unique test ID for this scenario
  this.testId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  console.log(`Test ID: ${this.testId}`);
  
  // Add a small delay to ensure tests don't run too fast
  await new Promise(resolve => setTimeout(resolve, 200));
});

After(async function () {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});

// Background steps
Given('the LGPD platform is running', async function () {
  // Start at the home page to verify platform is running
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
});

Given('the database is clean', async function () {
  // Each test uses unique emails to avoid conflicts
  // Fresh browser context ensures isolated sessions
  console.log('Database is clean (using unique test data)');
});

// User registration steps
Given('I am on the registration page', async function () {
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');
});

When('I fill in the registration form with:', async function (dataTable) {
  const rows = dataTable.hashes();
  
  // Convert field/value pairs to a data object
  const formData = {};
  rows.forEach(row => {
    formData[row.field] = row.value;
  });
  
  // Make email unique for this test run to avoid conflicts
  if (formData.email) {
    // If this is the existing user scenario, use the pre-created unique email
    if (this.existingUserEmail && formData.email.includes('existing@example.com')) {
      formData.email = this.existingUserEmail;
    } else {
      formData.email = formData.email.replace('@', `+${this.testId}@`);
    }
  }
  
  console.log('Using unique form data:', formData);
  
  await page.fill('[data-testid="email-input"]', formData.email);
  await page.fill('[data-testid="password-input"]', formData.password);
  await page.selectOption('[data-testid="userType-select"]', formData.userType);
});

When('I submit the registration form', async function () {
  await page.click('[data-testid="submit-button"]');
  await page.waitForLoadState('networkidle');
});

Then('I should see a success message {string}', async function (expectedMessage) {
  // Wait for the success message to appear with a longer timeout
  await page.waitForSelector('[data-testid="success-message"]', { timeout: 10000 });
  const successMessage = await page.locator('[data-testid="success-message"]').textContent();
  console.log('Success message found:', successMessage);
  if (!successMessage.includes(expectedMessage)) {
    throw new Error(`Expected success message "${expectedMessage}" but got "${successMessage}"`);
  }
});

Then('I should be redirected to the login page', async function () {
  await page.waitForURL('**/login', { timeout: 5000 });
  const currentUrl = page.url();
  if (!currentUrl.includes('/login')) {
    throw new Error(`Expected to be redirected to login page but was on ${currentUrl}`);
  }
});

// Additional steps for existing user scenario
Given('a user already exists with email {string}', async function (email) {
  // Make the email unique for this test run
  const uniqueEmail = email.replace('@', `+${this.testId}@`);
  
  // Register the user first through the API
  const response = await page.request.post('http://localhost:3000/api/auth/register', {
    data: {
      email: uniqueEmail,
      password: 'ExistingUserPassword123!',
      userType: 'data_subject'
    }
  });
  console.log(`User with unique email ${uniqueEmail} created with status ${response.status()}`);
  
  // Store the unique email for later use in this scenario
  this.existingUserEmail = uniqueEmail;
});

// Login steps
Given('a user exists with email {string} and password {string}', async function (email, password) {
  // Register the user first through the API
  const response = await page.request.post('http://localhost:3000/api/auth/register', {
    data: {
      email: email,
      password: password,
      userType: 'data_subject'
    }
  });
  console.log(`User with email ${email} created with status ${response.status()}`);
});

Given('I am on the login page', async function () {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
});

When('I fill in the login form with:', async function (dataTable) {
  const rows = dataTable.hashes();
  
  // Convert field/value pairs to a data object
  const formData = {};
  rows.forEach(row => {
    formData[row.field] = row.value;
  });
  
  await page.fill('[data-testid="email-input"]', formData.email);
  await page.fill('[data-testid="password-input"]', formData.password);
});

When('I submit the login form', async function () {
  await page.click('[data-testid="submit-button"]');
  await page.waitForURL('**/dashboard', { timeout: 5000 });
  await page.waitForLoadState('networkidle');
});

Then('I should be logged in successfully', async function () {
  // Check for dashboard or success indicator
  await page.waitForSelector('[data-testid="dashboard"]', { timeout: 5000 });
});

Then('I should see the dashboard page', async function () {
  const currentUrl = page.url();
  if (!currentUrl.includes('/dashboard')) {
    throw new Error(`Expected to be on dashboard page but was on ${currentUrl}`);
  }
});

Then('I should see {string} message', async function (expectedMessage) {
  const welcomeMessage = await page.locator('[data-testid="welcome-message"]').textContent();
  if (!welcomeMessage.includes(expectedMessage)) {
    throw new Error(`Expected message "${expectedMessage}" but got "${welcomeMessage}"`);
  }
});

Then('I should see an error message {string}', async function (expectedMessage) {
  const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
  if (!errorMessage.includes(expectedMessage)) {
    throw new Error(`Expected error message "${expectedMessage}" but got "${errorMessage}"`);
  }
});

Then('I should remain on the login page', async function () {
  const currentUrl = page.url();
  if (!currentUrl.includes('/login')) {
    throw new Error(`Expected to remain on login page but was on ${currentUrl}`);
  }
});

Then('I should remain on the registration page', async function () {
  const currentUrl = page.url();
  if (!currentUrl.includes('/register')) {
    throw new Error(`Expected to remain on registration page but was on ${currentUrl}`);
  }
});

// Session and logout steps
Given('I am logged in as {string}', async function (email) {
  // First create the user
  const response = await page.request.post('http://localhost:3000/api/auth/register', {
    data: {
      email: email,
      password: 'SecurePassword123!',
      userType: 'data_subject'
    }
  });
  console.log(`User with email ${email} created with status ${response.status()}`);
  
  // Then login
  await page.goto('http://localhost:3000/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', 'SecurePassword123!');
  await page.click('[data-testid="submit-button"]');
  await page.waitForSelector('[data-testid="dashboard"]', { timeout: 5000 });
});

When('I refresh the page', async function () {
  await page.reload();
  await page.waitForLoadState('networkidle');
});

Then('I should still be logged in', async function () {
  await page.waitForSelector('[data-testid="dashboard"]', { timeout: 5000 });
});

Given('I am on the dashboard page', async function () {
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
});

When('I click the logout button', async function () {
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('**/login', { timeout: 5000 });
  await page.waitForLoadState('networkidle');
});

Then('I should be logged out', async function () {
  // Check that we're no longer on a protected page
  const currentUrl = page.url();
  if (currentUrl.includes('/dashboard')) {
    throw new Error('User should be logged out but still on dashboard');
  }
});

Then('I should not have access to protected pages', async function () {
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  const currentUrl = page.url();
  if (currentUrl.includes('/dashboard')) {
    throw new Error('User should not have access to protected pages');
  }
});

// Password reset steps
When('I click {string}', async function (linkText) {
  await page.click(`text=${linkText}`);
  await page.waitForLoadState('networkidle');
});

When('I enter email {string}', async function (email) {
  await page.fill('[data-testid="email-input"]', email);
});

When('I submit the password reset request', async function () {
  await page.click('[data-testid="reset-button"]');
  await page.waitForLoadState('networkidle');
});

Then('I should see a message {string}', async function (expectedMessage) {
  const message = await page.locator('[data-testid="message"]').textContent();
  if (!message.includes(expectedMessage)) {
    throw new Error(`Expected message "${expectedMessage}" but got "${message}"`);
  }
});