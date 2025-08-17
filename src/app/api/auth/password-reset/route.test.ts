/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('/api/auth/password-reset', () => {
  const createMockRequest = (body: unknown): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest;
  };

  it('should return success message for any email (security-safe)', async () => {
    const request = createMockRequest({
      email: 'any@example.com'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.code).toBe('PASSWORD_RESET_REQUESTED');
  });

  it('should return validation error for missing email', async () => {
    const request = createMockRequest({});

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_REQUIRED_FIELDS_MISSING');
  });

  it('should return validation error for invalid email format', async () => {
    const request = createMockRequest({
      email: 'invalid-email'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_EMAIL_INVALID');
  });
});