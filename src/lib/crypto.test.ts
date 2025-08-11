import {
  generateKeyPair,
  encryptSealedBox,
  decryptSealedBox,
  encryptBox,
  decryptBox,
  generateNonce,
  hashData,
  getKeyFingerprint,
  initializeDemoKeys,
  DEMO_COMPANY_KEYS
} from './crypto';

describe('Crypto Utils', () => {
  const testData = 'This is sensitive LGPD data that needs encryption';
  let keyPair1: { publicKey: string; secretKey: string };
  let keyPair2: { publicKey: string; secretKey: string };

  beforeAll(async () => {
    // Generate test key pairs
    keyPair1 = await generateKeyPair();
    keyPair2 = await generateKeyPair();
  });

  describe('generateKeyPair', () => {
    it('should generate valid key pairs', async () => {
      const keys = await generateKeyPair();
      
      expect(keys.publicKey).toBeDefined();
      expect(keys.secretKey).toBeDefined();
      expect(typeof keys.publicKey).toBe('string');
      expect(typeof keys.secretKey).toBe('string');
      expect(keys.publicKey.length).toBeGreaterThan(0);
      expect(keys.secretKey.length).toBeGreaterThan(0);
    });

    it('should generate different keys each time', async () => {
      const keys1 = await generateKeyPair();
      const keys2 = await generateKeyPair();
      
      expect(keys1.publicKey).not.toBe(keys2.publicKey);
      expect(keys1.secretKey).not.toBe(keys2.secretKey);
    });
  });

  describe('sealed box encryption', () => {
    it('should encrypt and decrypt data successfully', async () => {
      const encrypted = await encryptSealedBox(testData, keyPair1.publicKey);
      const decrypted = await decryptSealedBox(
        encrypted,
        keyPair1.publicKey,
        keyPair1.secretKey
      );
      
      expect(decrypted).toBe(testData);
    });

    it('should produce different encrypted output each time', async () => {
      const encrypted1 = await encryptSealedBox(testData, keyPair1.publicKey);
      const encrypted2 = await encryptSealedBox(testData, keyPair1.publicKey);
      
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should fail to decrypt with wrong keys', async () => {
      const encrypted = await encryptSealedBox(testData, keyPair1.publicKey);
      
      await expect(
        decryptSealedBox(encrypted, keyPair2.publicKey, keyPair2.secretKey)
      ).rejects.toThrow();
    });

    it('should handle empty data', async () => {
      const encrypted = await encryptSealedBox('', keyPair1.publicKey);
      const decrypted = await decryptSealedBox(
        encrypted,
        keyPair1.publicKey,
        keyPair1.secretKey
      );
      
      expect(decrypted).toBe('');
    });
  });

  describe('regular box encryption', () => {
    it('should encrypt and decrypt with authentication', async () => {
      const result = await encryptBox(
        testData,
        keyPair2.publicKey,
        keyPair1.secretKey
      );
      
      const decrypted = await decryptBox(
        result.encrypted,
        result.nonce,
        keyPair1.publicKey,
        keyPair2.secretKey
      );
      
      expect(decrypted).toBe(testData);
    });

    it('should use provided nonce', async () => {
      const nonce = await generateNonce();
      const result = await encryptBox(
        testData,
        keyPair2.publicKey,
        keyPair1.secretKey,
        nonce
      );
      
      expect(result.nonce).toBe(nonce);
    });

    it('should generate nonce when not provided', async () => {
      const result = await encryptBox(
        testData,
        keyPair2.publicKey,
        keyPair1.secretKey
      );
      
      expect(result.nonce).toBeDefined();
      expect(result.nonce.length).toBeGreaterThan(0);
    });
  });

  describe('generateNonce', () => {
    it('should generate valid nonces', async () => {
      const nonce = await generateNonce();
      
      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
    });

    it('should generate different nonces', async () => {
      const nonce1 = await generateNonce();
      const nonce2 = await generateNonce();
      
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('hashData', () => {
    it('should generate consistent hashes', async () => {
      const hash1 = await hashData(testData);
      const hash2 = await hashData(testData);
      
      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('string');
      expect(hash1.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for different data', async () => {
      const hash1 = await hashData('data1');
      const hash2 = await hashData('data2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('getKeyFingerprint', () => {
    it('should return first 8 characters uppercase', () => {
      const testKey = 'abcdefghijklmnop';
      const fingerprint = getKeyFingerprint(testKey);
      
      expect(fingerprint).toBe('ABCDEFGH');
      expect(fingerprint.length).toBe(8);
    });
  });

  describe('demo keys', () => {
    it('should initialize demo keys', async () => {
      await initializeDemoKeys();
      
      expect(DEMO_COMPANY_KEYS.publicKey).toBeDefined();
      expect(DEMO_COMPANY_KEYS.secretKey).toBeDefined();
      expect(DEMO_COMPANY_KEYS.publicKey.length).toBeGreaterThan(0);
      expect(DEMO_COMPANY_KEYS.secretKey.length).toBeGreaterThan(0);
    });

    it('should not reinitialize keys on subsequent calls', async () => {
      await initializeDemoKeys();
      const originalPublicKey = DEMO_COMPANY_KEYS.publicKey;
      
      await initializeDemoKeys();
      
      expect(DEMO_COMPANY_KEYS.publicKey).toBe(originalPublicKey);
    });
  });

  describe('integration test - complete LGPD flow', () => {
    it('should simulate data subject encrypting request for company', async () => {
      // Initialize company keys
      await initializeDemoKeys();
      
      // Data subject encrypts their LGPD request
      const lgpdRequest = JSON.stringify({
        type: 'DATA_ACCESS',
        reason: 'I want to see my personal data',
        details: 'Please provide all data you have about me',
        cpf: '123.456.789-00',
        timestamp: new Date().toISOString()
      });
      
      const encrypted = await encryptSealedBox(
        lgpdRequest,
        DEMO_COMPANY_KEYS.publicKey
      );
      
      // Company receives and decrypts the request
      const decrypted = await decryptSealedBox(
        encrypted,
        DEMO_COMPANY_KEYS.publicKey,
        DEMO_COMPANY_KEYS.secretKey
      );
      
      const decryptedRequest = JSON.parse(decrypted);
      
      expect(decryptedRequest.type).toBe('DATA_ACCESS');
      expect(decryptedRequest.cpf).toBe('123.456.789-00');
      expect(decryptedRequest.reason).toBe('I want to see my personal data');
    });
  });
});
