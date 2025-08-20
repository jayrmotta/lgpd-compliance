import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { createCompany, initializeDatabase } from '@/lib/database-v2';

interface CompanySetupRequest {
  companyName: string;
  publicKey: string;
}

interface APIResponse {
  code: string;
  message?: string;
  data?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    const { user } = authResult;
    
    // Only admins/employees can set up company
    if (!['admin', 'employee'].includes(user.role)) {
      return NextResponse.json(
        { code: 'INSUFFICIENT_PERMISSIONS', message: 'Only admin or employee users can set up company' } as APIResponse,
        { status: 403 }
      );
    }
    
    let body: CompanySetupRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON', message: 'Invalid JSON format' } as APIResponse,
        { status: 400 }
      );
    }

    const { companyName, publicKey } = body;

    // Validate required fields
    if (!companyName || !publicKey) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING', message: 'Company name and public key are required' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate company name
    if (companyName.trim().length < 2) {
      return NextResponse.json(
        { code: 'VALIDATION_COMPANY_NAME_TOO_SHORT', message: 'Company name must be at least 2 characters' } as APIResponse,
        { status: 400 }
      );
    }

    if (companyName.trim().length > 100) {
      return NextResponse.json(
        { code: 'VALIDATION_COMPANY_NAME_TOO_LONG', message: 'Company name must be less than 100 characters' } as APIResponse,
        { status: 400 }
      );
    }

    // Initialize database and create company
    try {
      await initializeDatabase();
      const companyId = await createCompany(companyName.trim(), publicKey);
      
      return NextResponse.json(
        { 
          code: 'COMPANY_SETUP_SUCCESS',
          message: `Company "${companyName}" has been successfully configured`,
          data: {
            companyId,
            companyName: companyName.trim()
          }
        } as APIResponse,
        { status: 201 }
      );

    } catch (error) {
      console.error('Company setup error:', error);
      return NextResponse.json(
        { code: 'COMPANY_SETUP_FAILED', message: 'Failed to set up company' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Company setup error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}