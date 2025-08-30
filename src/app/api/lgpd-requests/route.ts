import { NextRequest, NextResponse } from 'next/server';
import { 
  createLGPDRequest, 
  getUserLGPDRequests, 
  getCompanyPublicKey,
  storeEncryptedLGPDData,
  updateRequestStatus,
  initializeDatabase,
  type LGPDRequestType 
} from '@/lib/database-v2';
import { encryptSealedBox } from '@/lib/crypto';
import { verifyToken } from '@/lib/jwt';

interface LGPDRequestBody {
  type: LGPDRequestType;
  description?: string; // Optional description from user
  cpf_hash: string; // CPF already hashed client-side
}

interface APIResponse {
  code: string;
  data?: unknown;
}

const VALID_REQUEST_TYPES: LGPDRequestType[] = ['ACCESS', 'DELETION', 'CORRECTION', 'PORTABILITY'];

const mapFrontendTypeToDB = (frontendType: string): LGPDRequestType | null => {
  const typeMap: Record<string, LGPDRequestType> = {
    'data_access': 'ACCESS',
    'data_deletion': 'DELETION', 
    'data_correction': 'CORRECTION',
    'data_portability': 'PORTABILITY'
  };
  return typeMap[frontendType] || null;
};



export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { code: 'AUTHENTICATION_REQUIRED' } as APIResponse,
        { status: 401 }
      );
    }

    const userPayload = verifyToken(token);
    if (!userPayload) {
      return NextResponse.json(
        { code: 'INVALID_TOKEN' } as APIResponse,
        { status: 401 }
      );
    }

    // Parse request body
    let body: LGPDRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }

    const { type, description, cpf_hash } = body;

    // Validate required fields
    if (!type || !cpf_hash) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING' } as APIResponse,
        { status: 400 }
      );
    }

    // Map frontend type to database type
    const dbType = mapFrontendTypeToDB(type as string);
    if (!dbType || !VALID_REQUEST_TYPES.includes(dbType)) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUEST_TYPE_INVALID' } as APIResponse,
        { status: 400 }
      );
    }



    // Initialize database and check for properly configured company
    let companyPublicKey: string;
    try {
      await initializeDatabase();
      
      // Get the single company's public key (single-company deployment)
      companyPublicKey = await getCompanyPublicKey();
      
      // Validate that company is properly configured
      if (!companyPublicKey) {
        return NextResponse.json(
          { code: 'COMPANY_SETUP_REQUIRED' } as APIResponse,
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Company setup validation failed:', error);
      return NextResponse.json(
        { code: 'COMPANY_SETUP_REQUIRED' } as APIResponse,
        { status: 400 }
      );
    }

    // Create LGPD request (metadata only - no sensitive data)
    let requestId: string;
    try {
      requestId = await createLGPDRequest({
        user_id: userPayload.userId,
        type: dbType,
        status: 'PENDING',
        description,
        cpf_hash: cpf_hash
      });
    } catch (error) {
      console.error('Failed to create LGPD request:', error);
      return NextResponse.json(
        { code: 'REQUEST_CREATION_FAILED' } as APIResponse,
        { status: 500 }
      );
    }

    // Encrypt sensitive data with sealed box
    try {
      const sensitiveData = {
        description,
        cpf_hash: cpf_hash,
        type: dbType,
        userEmail: userPayload.email,
        timestamp: new Date().toISOString(),
        requestId
      };

      const encryptedBlob = await encryptSealedBox(
        JSON.stringify(sensitiveData),
        companyPublicKey
      );

      // Store encrypted data (encryptedBlob is already URL-safe base64 from libsodium)
      await storeEncryptedLGPDData(
        requestId,
        Buffer.from(encryptedBlob, 'base64url') // Use base64url to handle URL-safe format
      );

      return NextResponse.json(
        {
          code: 'REQUEST_CREATED',
          data: { 
            requestId,
            encrypted: true
          }
        } as APIResponse,
        { status: 201 }
      );

    } catch (error) {
      console.error('Failed to encrypt and store sensitive data:', error);
      // Clean up the request since encryption failed
      try {
        await updateRequestStatus(requestId, 'FAILED');
        console.warn('Request marked as failed due to encryption error:', requestId);
      } catch (cleanupError) {
        console.error('Failed to mark request as failed:', cleanupError);
      }
      
      return NextResponse.json(
        { code: 'REQUEST_CREATION_FAILED' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('LGPD request API error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { code: 'AUTHENTICATION_REQUIRED' } as APIResponse,
        { status: 401 }
      );
    }

    const userPayload = verifyToken(token);
    if (!userPayload) {
      return NextResponse.json(
        { code: 'INVALID_TOKEN' } as APIResponse,
        { status: 401 }
      );
    }

    // Initialize database and get user's LGPD requests
    try {
      await initializeDatabase();
      const requests = await getUserLGPDRequests(userPayload.userId);
      
      return NextResponse.json(
        {
          code: 'REQUESTS_RETRIEVED',
          data: { requests }
        } as APIResponse,
        { status: 200 }
      );

    } catch (error) {
      console.error('Failed to retrieve LGPD requests:', error);
      return NextResponse.json(
        { code: 'SERVER_ERROR' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('LGPD requests GET API error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}