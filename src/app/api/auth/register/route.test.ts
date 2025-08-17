/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123')
}));

describe('/api/auth/register', () => {

  const createMockRequest = (body: unknown): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest;
  };

  it('should successfully register a new user', async () => {
    const request = createMockRequest({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      userType: 'data_subject'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.code).toBe('REGISTRATION_SUCCESS');
  });

  it('should return validation error for missing fields', async () => {
    const request = createMockRequest({
      email: 'user@example.com'
      // Missing password and userType
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_REQUIRED_FIELDS_MISSING');
  });

  it('should return validation error for invalid email', async () => {
    const request = createMockRequest({
      email: 'invalid-email',
      password: 'SecurePassword123!',
      userType: 'data_subject'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_EMAIL_INVALID');
  });

  it('should return validation error for weak password', async () => {
    const request = createMockRequest({
      email: 'user@example.com',
      password: 'weak',
      userType: 'data_subject'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('PASSWORD_TOO_WEAK');
  });

  it('should return success even for existing email (security-safe)', async () => {
    // First registration
    const firstRequest = createMockRequest({
      email: 'existing@example.com',
      password: 'SecurePassword123!',
      userType: 'data_subject'
    });
    await POST(firstRequest);

    // Second registration with same email
    const secondRequest = createMockRequest({
      email: 'existing@example.com',
      password: 'AnotherPassword123!',
      userType: 'data_subject'
    });

    const response = await POST(secondRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.code).toBe('REGISTRATION_SUCCESS');
  });

  it('should validate password requirements correctly', async () => {
    const testCases = [
      { password: 'NoSpecial123', expectedCode: 'PASSWORD_TOO_WEAK' },
      { password: 'nouppcase123!', expectedCode: 'PASSWORD_TOO_WEAK' },
      { password: 'NOLOWERCASE123!', expectedCode: 'PASSWORD_TOO_WEAK' },
      { password: 'Short1!', expectedCode: 'PASSWORD_TOO_WEAK' }
    ];

    for (const testCase of testCases) {
      const request = createMockRequest({
        email: 'test@example.com',
        password: testCase.password,
        userType: 'data_subject'
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.code).toBe(testCase.expectedCode);
    }
  });

});