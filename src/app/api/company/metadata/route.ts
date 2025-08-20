import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { initializeDatabase, getCompanyMetadata } from '@/lib/database-v2';
import { getKeyFingerprint } from '@/lib/crypto';

interface APIResponse {
  code: string;
  message?: string;
  data?: unknown;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication - any authenticated user can view company metadata
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { code: 'AUTHENTICATION_REQUIRED', message: 'Authentication required' } as APIResponse,
        { status: 401 }
      );
    }

    const userPayload = verifyToken(token);
    if (!userPayload) {
      return NextResponse.json(
        { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } as APIResponse,
        { status: 401 }
      );
    }
    
    try {
      await initializeDatabase();
      
      // Get the company metadata
      const company = await getCompanyMetadata();
      
      if (!company) {
        return NextResponse.json(
          { code: 'COMPANY_NOT_CONFIGURED', message: 'No active company found' } as APIResponse,
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          code: 'COMPANY_METADATA_RETRIEVED',
          data: {
            id: company.id,
            name: company.name,
            publicKey: company.public_key,
            publicKeyFingerprint: getKeyFingerprint(company.public_key),
            createdAt: company.created_at
          }
        } as APIResponse,
        { status: 200 }
      );

    } catch (error) {
      console.error('Failed to retrieve company metadata:', error);
      return NextResponse.json(
        { code: 'SERVER_ERROR', message: 'Failed to retrieve company metadata' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Company metadata GET error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}
