/**
 * @jest-environment node
 */
import { POST, GET } from './route';
import { generateToken } from '@/lib/jwt';

// Mock NextRequest
function createMockRequest(authHeader?: string) {
  const headers = new Headers();
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  return {
    headers,
    json: jest.fn(),
  } as any;
}

describe('/api/auth/verify', () => {
  const mockUser = {
    userId: 'test-user-123',
    email: 'test@example.com',
    userType: 'data_subject' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/verify', () => {
    it('should verify valid JWT token', async () => {
      const token = generateToken(mockUser);
      const request = createMockRequest(`Bearer ${token}`);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.code).toBe('TOKEN_VALID');
      expect(responseData.data.user).toEqual({
        userId: mockUser.userId,
        email: mockUser.email,
        userType: mockUser.userType
      });
    });

    it('should reject request without authorization header', async () => {
      const request = createMockRequest();

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.code).toBe('AUTH_TOKEN_MISSING');
      expect(responseData.message).toBe('Authorization token is required');
    });

    it('should reject request with invalid token format', async () => {
      const request = createMockRequest('InvalidFormat token');

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.code).toBe('AUTH_TOKEN_MISSING');
    });

    it('should reject request with invalid JWT token', async () => {
      const request = createMockRequest('Bearer invalid.jwt.token');

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.code).toBe('AUTH_TOKEN_INVALID');
      expect(responseData.message).toBe('Invalid or expired token');
    });

    it('should reject request with malformed Bearer header', async () => {
      const request = createMockRequest('Bearer');

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.code).toBe('AUTH_TOKEN_MISSING');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should work the same as POST method', async () => {
      const token = generateToken(mockUser);
      const request = createMockRequest(`Bearer ${token}`);

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.code).toBe('TOKEN_VALID');
      expect(responseData.data.user).toEqual({
        userId: mockUser.userId,
        email: mockUser.email,
        userType: mockUser.userType
      });
    });
  });
});
