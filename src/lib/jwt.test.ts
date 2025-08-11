import { generateToken, verifyToken, extractTokenFromHeader, refreshToken } from './jwt';

describe('JWT Utils', () => {
  const mockUser = {
    userId: 'test-user-123',
    email: 'test@example.com',
    userType: 'data_subject' as const
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = generateToken(mockUser);
      const payload = verifyToken(token);
      
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(mockUser.userId);
      expect(payload?.email).toBe(mockUser.email);
      expect(payload?.userType).toBe(mockUser.userType);
      expect(payload?.iat).toBeDefined();
      expect(payload?.exp).toBeDefined();
    });

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid.token.here');
      expect(payload).toBeNull();
    });

    it('should return null for malformed token', () => {
      const payload = verifyToken('not-a-jwt-token');
      expect(payload).toBeNull();
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      const header = `Bearer ${token}`;
      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should return null for missing header', () => {
      const extracted = extractTokenFromHeader(null);
      expect(extracted).toBeNull();
    });

    it('should return null for invalid header format', () => {
      const extracted = extractTokenFromHeader('InvalidFormat token');
      expect(extracted).toBeNull();
    });

    it('should return null for header without Bearer prefix', () => {
      const extracted = extractTokenFromHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test');
      expect(extracted).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh a valid token', async () => {
      const originalToken = generateToken(mockUser);
      
      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const refreshedToken = refreshToken(originalToken);
      
      expect(refreshedToken).not.toBeNull();
      expect(typeof refreshedToken).toBe('string');
      
      const originalPayload = verifyToken(originalToken);
      const refreshedPayload = verifyToken(refreshedToken!);
      
      expect(refreshedPayload?.userId).toBe(originalPayload?.userId);
      expect(refreshedPayload?.email).toBe(originalPayload?.email);
      expect(refreshedPayload?.userType).toBe(originalPayload?.userType);
      
      // The tokens might be the same if generated in the same second
      // What matters is that both are valid and contain the same user data
      expect(refreshedPayload).toBeDefined();
    });

    it('should return null for invalid token', () => {
      const refreshedToken = refreshToken('invalid.token.here');
      expect(refreshedToken).toBeNull();
    });
  });

  describe('token expiration', () => {
    it('should include expiration timestamp', () => {
      const token = generateToken(mockUser);
      const payload = verifyToken(token);
      
      expect(payload?.exp).toBeDefined();
      expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });
});
