const { When, Given } = require('@cucumber/cucumber');

// Missing step definitions identified from test failures

When('I reach the identity verification step', async function () {
  // Wait for identity verification section to appear
  await this.page.waitForSelector('[data-testid="identity-verification-section"]', { timeout: 5000 });
});

Given('I have completed identity verification', async function () {
  // Fill in CPF field
  const cpfInput = await this.page.locator('[data-testid="cpf-input"]');
  await cpfInput.fill('123.456.789-00');
  
  // Click verify identity button
  const verifyButton = await this.page.locator('[data-testid="verify-identity"]');
  await verifyButton.click();
  
  // Wait for verification success
  await this.page.waitForSelector('[data-testid="identity-verified"]', { timeout: 5000 });
});

When('my request is being submitted', async function () {
  // Click final submit button
  const submitButton = await this.page.locator('[data-testid="final-submit"]');
  await submitButton.click();
  
  // Wait for submitting state
  await this.page.waitForSelector('[data-testid="submitting-request"]', { timeout: 5000 });
});