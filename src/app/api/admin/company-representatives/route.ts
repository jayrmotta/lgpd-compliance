import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { addUser, findUserByEmail } from '@/lib/user-storage';
import { requireAuth, requireRole } from '@/lib/auth-middleware';

interface CreateCompanyRepRequest {
  email: string;
  password: string;
  companyId?: string;
  role?: 'admin' | 'employee';
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    const { user } = authResult;
    
    // Only super admins can create company representatives
    const roleCheck = requireRole(user, 'super_admin');
    if (roleCheck) {
      return roleCheck;
    }
    
    let body: CreateCompanyRepRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }

    const { email, password, companyId, role = 'employee' } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { code: 'VALIDATION_EMAIL_INVALID' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { code: passwordError } as APIResponse,
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
    const passwordHash = await hash(password, 12);

    // Create new company representative
    const newUser = {
      email: email.toLowerCase(),
      passwordHash,
      role: role as 'admin' | 'employee',
      companyId
    };

    await addUser(newUser);

    return NextResponse.json(
      { 
        code: 'COMPANY_REPRESENTATIVE_CREATED_SUCCESS',
        data: {
          email: newUser.email,
          role: newUser.role,
          companyId: newUser.companyId
        }
      } as APIResponse,
      { status: 201 }
    );

  } catch (error) {
    console.error('Company representative creation error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}

// Get list of company representatives (for management purposes)
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
        code: 'COMPANY_REPRESENTATIVES_RETRIEVED',
        data: {
          message: 'Company representatives list - to be implemented with database integration'
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving company representatives:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}