import {
  generateKeyPair,
  encryptSealedBox,
  decryptSealedBox,
  encryptBox,
  decryptBox,
  generateNonce,
  hashData,
  getKeyFingerprint,
  getOrGenerateDemoPublicKey,
  DEMO_COMPANY_PUBLIC_KEY
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

  describe('demo public key management', () => {
    it('should generate demo public key', async () => {
      const publicKey = await getOrGenerateDemoPublicKey();
      
      expect(publicKey).toBeDefined();
      expect(typeof publicKey).toBe('string');
      expect(publicKey.length).toBeGreaterThan(0);
      expect(DEMO_COMPANY_PUBLIC_KEY.key).toBe(publicKey);
      expect(DEMO_COMPANY_PUBLIC_KEY.fingerprint).toBeDefined();
    });

    it('should return same public key on subsequent calls', async () => {
      const publicKey1 = await getOrGenerateDemoPublicKey();
      const publicKey2 = await getOrGenerateDemoPublicKey();
      
      expect(publicKey1).toBe(publicKey2);
    });
  });

  describe('integration test - client-side company flow', () => {
    it('should demonstrate secure encryption flow', async () => {
      // Get company public key (server-side safe)
      const companyPublicKey = await getOrGenerateDemoPublicKey();
      
      // Note: In production, company saves private key in password manager
      
      // Data subject encrypts their LGPD request using company's public key
      const lgpdRequest = JSON.stringify({
        type: 'DATA_ACCESS',
        reason: 'I want to see my personal data',
        details: 'Please provide all data you have about me',
        cpf: '123.456.789-00',
        timestamp: new Date().toISOString()
      });
      
      
      // Company decrypts using their private key (client-side only)
      // Note: This requires the company's actual private key matching the public key
      // For this test, we'll use a matching key pair
      const testKeys = await generateKeyPair();
      const testEncrypted = await encryptSealedBox(lgpdRequest, testKeys.publicKey);
      
      const decrypted = await decryptSealedBox(
        testEncrypted,
        testKeys.publicKey,
        testKeys.secretKey
      );
      
      const decryptedRequest = JSON.parse(decrypted);
      
      expect(decryptedRequest.type).toBe('DATA_ACCESS');
      expect(decryptedRequest.cpf).toBe('123.456.789-00');
      expect(decryptedRequest.reason).toBe('I want to see my personal data');
    });
  });
});
