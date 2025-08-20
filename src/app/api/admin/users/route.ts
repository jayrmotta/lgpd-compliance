import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { addUser, findUserByEmail } from '@/lib/user-storage';
import { requireAuth, requireRole } from '@/lib/auth-middleware';

interface CreateUserRequest {
  email: string;
  password?: string; // Optional - will auto-generate if not provided
  role?: 'admin' | 'employee';
  generatePassword?: boolean; // Generate vs. manual entry - both are temporary
}

interface APIResponse {
  code: string;
  data?: unknown;
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[A-Z]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[a-z]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'PASSWORD_TOO_WEAK';
  }
  return null;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateTemporaryPassword = (): string => {
  // Generate a secure temporary password: 4 random words + numbers
  const words = ['Secure', 'Access', 'Login', 'Account', 'Portal', 'System', 'Admin', 'User'];
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  const numbers = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const special = ['!', '@', '#', '$'][Math.floor(Math.random() * 4)];
  
  return `${word1}${word2}${numbers}${special}`;
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    const { user } = authResult;
    
    // Only super admins can create admin/employee users
    const roleCheck = requireRole(user, 'super_admin');
    if (roleCheck) {
      return roleCheck;
    }
    
    let body: CreateUserRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }

    const { email, password, role = 'employee', generatePassword } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { code: 'VALIDATION_EMAIL_REQUIRED' } as APIResponse,
        { status: 400 }
      );
    }

    // All passwords created by admins are temporary by default
    let finalPassword: string;

    if (generatePassword || !password) {
      // Auto-generate temporary password
      finalPassword = generateTemporaryPassword();
    } else {
      // Use provided password (admin-entered, but still temporary)
      finalPassword = password;
      // Temporary passwords must follow the same strength rules as regular passwords
      const passwordError = validatePassword(finalPassword);
      if (passwordError) {
        return NextResponse.json(
          { code: passwordError } as APIResponse,
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { code: 'VALIDATION_EMAIL_INVALID' } as APIResponse,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { code: 'USER_ALREADY_EXISTS' } as APIResponse,
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(finalPassword, 12);

    // Create new user (all admin-created accounts have temporary passwords)
    const newUser = {
      email: email.toLowerCase(),
      passwordHash,
      role: role as 'admin' | 'employee',
      passwordTemporary: true // Always true for admin-created accounts
    };

    await addUser(newUser);

    return NextResponse.json(
      { 
        code: 'USER_CREATED_SUCCESS',
        data: {
          email: newUser.email,
          role: newUser.role,
          temporaryPassword: finalPassword, // Always return the temporary password
          passwordTemporary: true
        }
      } as APIResponse,
      { status: 201 }
    );

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}

// Get list of users (for management purposes)
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    // Only allow super admins to view this list
    const roleCheck = requireRole(user, 'super_admin');
    if (roleCheck) {
      return roleCheck;
    }

    // In a full implementation, this would query the database
    // For now, return a placeholder response
    return NextResponse.json(
      { 
        code: 'USERS_RETRIEVED',
        data: {
          message: 'Users list - to be implemented with database integration'
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}
