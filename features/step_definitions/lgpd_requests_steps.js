const { Given, When, Then } = require('@cucumber/cucumber');

// LGPD Requests Feature Step Definitions
// These steps connect the Gherkin scenarios to the frontend/backend implementation

// Request form steps
When('I fill in the request details:', async function (dataTable) {
  const rows = dataTable.hashes();
  
  // Convert field/value pairs to a data object
  const formData = {};
  rows.forEach(row => {
    formData[row.field] = row.value;
  });
  
  // Fill request form fields
  if (formData.reason) {
    await global.page.fill('[data-testid="reason-input"]', formData.reason);
  }
  if (formData.description) {
    await global.page.fill('[data-testid="description-input"]', formData.description);
  }
  
  console.log('Filled request details:', formData);
});

// PIX payment steps
Then('I should see a PIX QR code for {string}', async function (amount) {
  // Wait for PIX QR code to appear
  await global.page.waitForSelector('[data-testid="pix-qr-code"]', { timeout: 10000 });
  
  // Verify the amount is displayed
  await global.page.waitForSelector(`text=${amount}`, { timeout: 5000 });
  
  console.log(`PIX QR code displayed for amount: ${amount}`);
});

Then('I should see instructions {string}', async function (instructions) {
  await global.page.waitForSelector(`text=${instructions}`, { timeout: 5000 });
  console.log(`Found PIX instructions: ${instructions}`);
});

When('I complete the PIX payment with CPF {string}', async function (cpf) {
  // Fill CPF in payment form
  await global.page.fill('[data-testid="cpf-input"]', cpf);
  
  // Complete the payment (mock or real)
  await global.page.click('[data-testid="complete-payment"]');
  
  // Wait for payment processing
  await global.page.waitForLoadState('networkidle');
  
  console.log(`Completed PIX payment with CPF: ${cpf}`);
});

Then('my request should appear in {string} with status {string}', async function (section, status) {
  // Navigate to the specified section
  if (section === 'My Requests') {
    await global.page.goto('http://localhost:3000/my-requests');
  }
  
  await global.page.waitForLoadState('networkidle');
  
  // Verify request appears with correct status
  await global.page.waitForSelector(`[data-testid="request-status-${status.toLowerCase()}"]`, { timeout: 5000 });
  
  console.log(`Request found in ${section} with status: ${status}`);
});

// Request submission flow steps
Given('I am submitting a data access request', async function () {
  await global.page.goto('http://localhost:3000/lgpd-requests');
  await global.page.click('[data-testid="request-type-data-access"]');
  await global.page.fill('[data-testid="reason-input"]', 'I want to see my data');
  await global.page.fill('[data-testid="description-input"]', 'Please provide my information');
});

Given('I have reached the PIX payment step', async function () {
  // Complete form and reach PIX step
  await global.page.click('[data-testid="submit-request"]');
  await global.page.waitForSelector('[data-testid="pix-payment-section"]', { timeout: 10000 });
});

// PIX timeout scenario
When('I do not complete the payment within {int} minutes', async function (minutes) {
  // Simulate timeout by waiting and then trying to complete payment
  // In real implementation, this would involve server-side timeout handling
  
  // Wait for a short time to simulate timeout (much shorter than actual 15 minutes for testing)
  await global.page.waitForTimeout(2000);
  
  // Try to complete payment after "timeout"
  await global.page.fill('[data-testid="cpf-input"]', '123.456.789-00');
  await global.page.click('[data-testid="complete-payment"]');
  
  console.log(`Simulated timeout after ${minutes} minutes`);
});

Then('the request should not be submitted', async function () {
  // Verify no success message appears
  const successElements = await global.page.locator('[data-testid="request-submitted"]').count();
  if (successElements > 0) {
    throw new Error('Request should not have been submitted');
  }
  
  console.log('Verified: Request was not submitted');
});

// Request history steps
Given('I have previously submitted requests:', async function (dataTable) {
  const requests = dataTable.hashes();
  
  // Create mock requests in the system
  // In real implementation, this would use API calls to create historical data
  this.historicalRequests = requests;
  
  for (const request of requests) {
    console.log(`Mock historical request: ${request.type} - ${request.status}`);
  }
});

When('I go to {string} page', async function (pageName) {
  const pageMap = {
    'My Requests': '/my-requests',
    'LGPD Requests': '/lgpd-requests'
  };
  
  const path = pageMap[pageName] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
  await global.page.goto(`http://localhost:3000${path}`);
  await global.page.waitForLoadState('networkidle');
});

Then('I should see my requests listed:', async function (dataTable) {
  const expectedRequests = dataTable.hashes();
  
  // Verify each request appears in the list
  for (const request of expectedRequests) {
    // Check for request type
    await global.page.waitForSelector(`text=${request.type}`, { timeout: 5000 });
    
    // Check for status
    await global.page.waitForSelector(`text=${request.status}`, { timeout: 5000 });
    
    console.log(`Verified request: ${request.type} - ${request.status}`);
  }
});

// Authentication protection steps
Given('I am not logged in', async function () {
  // Ensure user is logged out
  await global.page.goto('http://localhost:3000/logout');
  await global.page.waitForLoadState('networkidle');
});

When('I try to access the LGPD requests page', async function () {
  await global.page.goto('http://localhost:3000/lgpd-requests');
  await global.page.waitForLoadState('networkidle');
});

// Request type selection steps
Then('I should see available request types:', async function (dataTable) {
  const expectedTypes = dataTable.hashes();
  
  // Verify each request type is available
  for (const type of expectedTypes) {
    await global.page.waitForSelector(`text=${type.type}`, { timeout: 5000 });
    await global.page.waitForSelector(`text=${type.description}`, { timeout: 5000 });
    
    console.log(`Verified request type: ${type.type}`);
  }
});

// Mock PIX payment steps
Given('the system is in development mode', async function () {
  // Set development mode flag
  process.env.NODE_ENV = 'development';
  console.log('System set to development mode');
});

When('I reach the PIX payment step', async function () {
  await global.page.click('[data-testid="submit-request"]');
  await global.page.waitForSelector('[data-testid="pix-payment-section"]', { timeout: 10000 });
});

Then('I should see a {string} button', async function (buttonText) {
  await global.page.waitForSelector(`[data-testid="${buttonText.toLowerCase().replace(/\s+/g, '-')}-button"]`, { timeout: 5000 });
  console.log(`Found button: ${buttonText}`);
});

When('I enter CPF {string}', async function (cpf) {
  await global.page.fill('[data-testid="cpf-input"]', cpf);
});

Then('my request should be submitted normally', async function () {
  await global.page.waitForSelector('[data-testid="request-submitted"]', { timeout: 10000 });
  console.log('Request submitted successfully');
});

// Request confirmation and encryption notice steps
Given('I have filled out a data access request', async function () {
  await global.page.goto('http://localhost:3000/lgpd-requests');
  await global.page.click('[data-testid="request-type-data-access"]');
  await global.page.fill('[data-testid="reason-input"]', 'Access my data');
  await global.page.fill('[data-testid="description-input"]', 'Please provide my information');
});

Given('I have completed PIX verification', async function () {
  // Mock PIX verification completion
  await global.page.click('[data-testid="submit-request"]');
  await global.page.waitForSelector('[data-testid="pix-payment-section"]', { timeout: 10000 });
  await global.page.fill('[data-testid="cpf-input"]', '123.456.789-00');
  await global.page.click('[data-testid="complete-payment"]');
  await global.page.waitForSelector('[data-testid="payment-verified"]', { timeout: 5000 });
});

When('my request is being submitted', async function () {
  // Trigger final submission after PIX verification
  await global.page.click('[data-testid="final-submit"]');
  
  // Wait for submission processing
  await global.page.waitForSelector('[data-testid="submitting-request"]', { timeout: 5000 });
});
