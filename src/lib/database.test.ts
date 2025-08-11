import {
  initializeDatabase,
  createLGPDRequest,
  storeEncryptedLGPDData,
  getUserLGPDRequests,
  getCompanyLGPDRequests,
  getEncryptedLGPDData,
  updateRequestStatus,
  createDemoCompany,
  closeDatabase,
  DatabaseManager,
  type LGPDRequest,
  type LGPDRequestType,
  type LGPDRequestStatus
} from './database-v2';
import { hashData } from './crypto';
import { promises as fs } from 'fs';
import path from 'path';

// Use in-memory database for testing
process.env.DATABASE_PATH = ':memory:';

describe('Database Models - LGPD Compliance', () => {
  let dbManager: DatabaseManager;

  beforeEach(async () => {
    // Create fresh database instance for each test
    dbManager = new DatabaseManager();
    process.env.DATABASE_PATH = ':memory:';
    await dbManager.initialize();
    await dbManager.createDemoCompany();
  });

  afterEach(async () => {
    await dbManager.close();
  });

  describe('LGPD Request Creation - Based on Gherkin Scenarios', () => {
    it('should create data access request as described in Gherkin scenario', async () => {
      // Given: I am submitting a data access request (from lgpd_requests.feature)
      const cpfHash = await hashData('123.456.789-00');
      const requestData = {
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'ACCESS' as LGPDRequestType,
        status: 'PENDING' as LGPDRequestStatus,
        reason: 'I want to see what personal data you have',
        description: 'Please provide all my personal information',
        cpf_hash: cpfHash,
        pix_transaction_hash: 'PIX-123456789'
      };

      // When: I submit the request
      const requestId = await dbManager.createLGPDRequest(requestData);

      // Then: Request should be created with proper ID format
      expect(requestId).toMatch(/^REQ-\d{13}-[a-z0-9]{9}$/);
      
      // And: Request should appear in user's requests with correct status
      const userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests).toHaveLength(1);
      expect(userRequests[0].type).toBe('ACCESS');
      expect(userRequests[0].status).toBe('PENDING');
      expect(userRequests[0].reason).toBe('I want to see what personal data you have');
    });

    it('should create data deletion request as described in Gherkin scenario', async () => {
      // Given: I am submitting a data deletion request
      const cpfHash = await hashData('123.456.789-00');
      const requestData = {
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'DELETION' as LGPDRequestType,
        status: 'PENDING' as LGPDRequestStatus,
        reason: 'I no longer want to use the service',
        description: 'Please delete all my data completely',
        cpf_hash: cpfHash,
        pix_transaction_hash: 'PIX-DELETE-123'
      };

      // When: I submit the deletion request
      const requestId = await dbManager.createLGPDRequest(requestData);

      // Then: Request should be created
      expect(requestId).toBeDefined();
      
      // And: Should appear in user's requests as deletion type
      const userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests[0].type).toBe('DELETION');
      expect(userRequests[0].description).toBe('Please delete all my data completely');
    });

    it('should create data correction request as described in Gherkin scenario', async () => {
      // Given: I am submitting a data correction request
      const cpfHash = await hashData('123.456.789-00');
      const requestData = {
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'CORRECTION' as LGPDRequestType,
        status: 'PENDING' as LGPDRequestStatus,
        reason: 'My address information is incorrect',
        description: 'Please update my address to: New Street, 123',
        cpf_hash: cpfHash,
        pix_transaction_hash: 'PIX-CORRECTION-123'
      };

      // When: I submit the correction request
      const requestId = await dbManager.createLGPDRequest(requestData);

      // Then: Request should be created
      const userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests[0].type).toBe('CORRECTION');
      expect(userRequests[0].reason).toBe('My address information is incorrect');
    });

    it('should calculate response due date as 15 days from creation', async () => {
      // Given: LGPD law requires response within 15 days
      const cpfHash = await hashData('123.456.789-00');
      const requestData = {
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'ACCESS' as LGPDRequestType,
        status: 'PENDING' as LGPDRequestStatus,
        reason: 'Test request',
        description: 'Test description',
        cpf_hash: cpfHash
      };

      const before = new Date();
      
      // When: Request is created
      await dbManager.createLGPDRequest(requestData);
      
      const after = new Date();
      const userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      const request = userRequests[0];

      // Then: Response due date should be 15 days from creation
      const expectedDueDate = new Date(request.created_at.getTime() + (15 * 24 * 60 * 60 * 1000));
      const actualDueDate = request.response_due_at;
      
      // Allow 1 minute tolerance for test execution time
      const timeDiff = Math.abs(expectedDueDate.getTime() - actualDueDate.getTime());
      expect(timeDiff).toBeLessThan(60000); // Less than 1 minute difference
    });
  });

  describe('Request Status Management - Based on Gherkin Scenarios', () => {
    let requestId: string;

    beforeEach(async () => {
      const cpfHash = await hashData('123.456.789-00');
      requestId = await dbManager.createLGPDRequest({
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'ACCESS',
        status: 'PENDING',
        reason: 'Test request',
        description: 'Test description',
        cpf_hash: cpfHash
      });
    });

    it('should update request from PENDING to PROCESSING', async () => {
      // Given: Request is PENDING
      let userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests[0].status).toBe('PENDING');

      // When: Company starts processing
      await dbManager.updateRequestStatus(requestId, 'PROCESSING');

      // Then: Status should be PROCESSING
      userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests[0].status).toBe('PROCESSING');
    });

    it('should update request from PROCESSING to COMPLETED with completion date', async () => {
      // Given: Request is PROCESSING
      await dbManager.updateRequestStatus(requestId, 'PROCESSING');

      const completionDate = new Date();
      
      // When: Company completes the request
      await dbManager.updateRequestStatus(requestId, 'COMPLETED', completionDate);

      // Then: Status should be COMPLETED with completion date
      const userRequests = await dbManager.getUserLGPDRequests('user-subject@example.com');
      expect(userRequests[0].status).toBe('COMPLETED');
      expect(userRequests[0].completed_at).toBeDefined();
    });
  });

  describe('Encrypted Data Storage - Zero Knowledge Operator', () => {
    let requestId: string;

    beforeEach(async () => {
      const cpfHash = await hashData('123.456.789-00');
      requestId = await dbManager.createLGPDRequest({
        user_id: 'user-subject@example.com',
        company_id: 'COMPANY-DEMO-TECHCORP',
        type: 'ACCESS',
        status: 'PENDING',
        reason: 'Test request',
        description: 'Test description',
        cpf_hash: cpfHash
      });
    });

    it('should store encrypted LGPD data as opaque blob', async () => {
      // Given: Sensitive LGPD data needs to be encrypted
      const sensitiveData = JSON.stringify({
        fullName: 'João Silva',
        email: 'joao@example.com',
        phone: '+55 11 99999-9999',
        documents: ['CPF: 123.456.789-00']
      });
      const encryptedBlob = Buffer.from(sensitiveData, 'utf-8'); // In real app, this would be sealed box encrypted
      const publicKeyFingerprint = 'ABCD1234';

      // When: Encrypted data is stored
      const encryptedId = await dbManager.storeEncryptedLGPDData(
        requestId,
        encryptedBlob,
        publicKeyFingerprint
      );

      // Then: Encrypted data should be stored with proper ID
      expect(encryptedId).toMatch(/^ENC-\d{13}-[a-z0-9]{9}$/);

      // And: Encrypted data should be retrievable
      const retrievedData = await dbManager.getEncryptedLGPDData(requestId);
      expect(retrievedData).toBeDefined();
      expect(retrievedData!.public_key_fingerprint).toBe(publicKeyFingerprint);
    });

    it('should not expose sensitive data in request metadata', async () => {
      // Given: Request contains sensitive information
      const sensitiveData = Buffer.from('SENSITIVE_PERSONAL_DATA', 'utf-8');
      await dbManager.storeEncryptedLGPDData(requestId, sensitiveData, 'FINGERPRINT');

      // When: Company views requests list
      const companyRequests = await dbManager.getCompanyLGPDRequests('COMPANY-DEMO-TECHCORP');

      // Then: Metadata should not contain sensitive data
      const request = companyRequests[0];
      expect(request.reason).toBe('Test request'); // Only what user explicitly put in reason
      expect(request.description).toBe('Test description'); // Only description field
      
      // And: No direct access to encrypted content through metadata
      expect(request).not.toHaveProperty('personalData');
      expect(request).not.toHaveProperty('encryptedBlob');
    });
  });

  describe('Request History - Based on Gherkin Scenario', () => {
    it('should show requests history as described in Gherkin scenario', async () => {
      // Given: I have previously submitted requests (from lgpd_requests.feature line 70-74)
      const cpfHash = await hashData('123.456.789-00');
      const userId = 'user-subject@example.com';
      const companyId = 'COMPANY-DEMO-TECHCORP';

      // Create access request (2 days ago equivalent)
      const accessRequestId = await dbManager.createLGPDRequest({
        user_id: userId,
        company_id: companyId,
        type: 'ACCESS',
        status: 'PENDING',
        reason: 'Access request',
        description: 'Access description',
        cpf_hash: cpfHash
      });

      // Create deletion request 
      const deletionRequestId = await dbManager.createLGPDRequest({
        user_id: userId,
        company_id: companyId,
        type: 'DELETION',
        status: 'PROCESSING',
        reason: 'Deletion request',
        description: 'Deletion description',
        cpf_hash: cpfHash
      });

      // Create correction request
      const correctionRequestId = await dbManager.createLGPDRequest({
        user_id: userId,
        company_id: companyId,
        type: 'CORRECTION',
        status: 'COMPLETED',
        reason: 'Correction request',
        description: 'Correction description',
        cpf_hash: cpfHash
      });

      // When: I go to "My Requests" page
      const userRequests = await dbManager.getUserLGPDRequests(userId);

      // Then: I should see my requests listed
      expect(userRequests).toHaveLength(3);
      expect(userRequests.map(r => r.type)).toContain('ACCESS');
      expect(userRequests.map(r => r.type)).toContain('DELETION');
      expect(userRequests.map(r => r.type)).toContain('CORRECTION');
      
      // And: Requests should be ordered by creation date (newest first)
      expect(userRequests[0].created_at >= userRequests[1].created_at).toBe(true);
      expect(userRequests[1].created_at >= userRequests[2].created_at).toBe(true);
    });
  });

  describe('Demo Company Setup', () => {
    it('should create demo company as required for Gherkin scenarios', async () => {
      // Given: Gherkin scenarios reference "TechCorp Ltd"
      // When: Demo company is created
      const companyId = await dbManager.createDemoCompany();

      // Then: Company should exist
      expect(companyId).toBe('COMPANY-DEMO-TECHCORP');

      // And: Company should be able to receive requests
      const companyRequests = await dbManager.getCompanyLGPDRequests(companyId);
      expect(companyRequests).toBeDefined();
      expect(Array.isArray(companyRequests)).toBe(true);
    });
  });
});
