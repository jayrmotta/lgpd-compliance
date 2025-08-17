/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';
import { addUser, clearAllUsers } from '@/lib/user-storage';
import { hash } from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn()
}));

import { compare } from 'bcryptjs';

describe('/api/auth/login', () => {
  beforeEach(async () => {
    // Clear users before each test
    await clearAllUsers();
    // Reset mock
    (compare as jest.Mock).mockClear();
  });

  const createMockRequest = (body: unknown): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest;
  };

  it('should return validation error for missing fields', async () => {
    const request = createMockRequest({
      email: 'user@example.com'
      // Missing password
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_REQUIRED_FIELDS_MISSING');
  });

  it('should return validation error for invalid email', async () => {
    const request = createMockRequest({
      email: 'invalid-email',
      password: 'SecurePassword123!'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.code).toBe('VALIDATION_EMAIL_INVALID');
  });

  it('should return invalid credentials for non-existent user', async () => {
    const request = createMockRequest({
      email: 'nonexistent@example.com',
      password: 'SecurePassword123!'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData.code).toBe('INVALID_CREDENTIALS');
  });

  it('should return invalid credentials for wrong password', async () => {
    // Create a test user
    const hashedPassword = await hash('CorrectPassword123!', 12);
    await addUser({
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'data_subject'
    });

    // Mock bcrypt compare to return false (wrong password)
    (compare as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      email: 'user@example.com',
      password: 'WrongPassword123!'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData.code).toBe('INVALID_CREDENTIALS');
    expect(compare).toHaveBeenCalledWith('WrongPassword123!', hashedPassword);
  });

  it('should successfully login with valid credentials', async () => {
    // Create a test user
    const hashedPassword = await hash('CorrectPassword123!', 12);
    await addUser({
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'data_subject'
    });

    // Mock bcrypt compare to return true (correct password)
    (compare as jest.Mock).mockResolvedValue(true);

    const request = createMockRequest({
      email: 'user@example.com',
      password: 'CorrectPassword123!'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.code).toBe('LOGIN_SUCCESS');
    expect(responseData.data).toMatchObject({
      user: {
        userId: expect.any(String),
        email: 'user@example.com',
        role: 'data_subject'
      }
    });
    // Check that JWT token is in Authorization header
    expect(response.headers.get('Authorization')).toMatch(/^Bearer .+/);
    expect(compare).toHaveBeenCalledWith('CorrectPassword123!', hashedPassword);
  });

  it('should handle case-insensitive email matching', async () => {
    // Create user with lowercase email
    const hashedPassword = await hash('Password123!', 12);
    await addUser({
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'data_subject'
    });

    // Mock bcrypt compare to return true
    (compare as jest.Mock).mockResolvedValue(true);

    const request = createMockRequest({
      email: 'USER@EXAMPLE.COM', // Uppercase email
      password: 'Password123!'
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.code).toBe('LOGIN_SUCCESS');
  });

  it('should prevent email enumeration with same error message', async () => {
    // Test 1: Non-existent user
    const request1 = createMockRequest({
      email: 'nonexistent@example.com',
      password: 'SomePassword123!'
    });

    const response1 = await POST(request1);
    const responseData1 = await response1.json();

    // Test 2: Existing user with wrong password
    const hashedPassword = await hash('CorrectPassword123!', 12);
    await addUser({
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'data_subject'
    });

    (compare as jest.Mock).mockResolvedValue(false);

    const request2 = createMockRequest({
      email: 'user@example.com',
      password: 'WrongPassword123!'
    });

    const response2 = await POST(request2);
    const responseData2 = await response2.json();

    // Both should return the same error message and status
    expect(response1.status).toBe(401);
    expect(response2.status).toBe(401);
    expect(responseData1.code).toBe('INVALID_CREDENTIALS');
    expect(responseData2.code).toBe('INVALID_CREDENTIALS');
  });
});