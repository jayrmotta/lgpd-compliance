import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { 
  getAllLGPDRequests, 
  getEncryptedLGPDData,
  updateRequestStatus,
  initializeDatabase,
  type LGPDRequestStatus 
} from '@/lib/database-v2';

interface APIResponse {
  code: string;
  message?: string;
  data?: unknown;
}

interface UpdateStatusRequest {
  requestId: string;
  status: LGPDRequestStatus;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    const { user } = authResult;
    
    // Only admins/employees can view company LGPD requests
    if (!['admin', 'employee'].includes(user.role)) {
      return NextResponse.json(
        { code: 'INSUFFICIENT_PERMISSIONS', message: 'Only admin or employee users can view company LGPD requests' } as APIResponse,
        { status: 403 }
      );
    }
    
    try {
      await initializeDatabase();
      
      // Get all LGPD requests (for the single company deployment)
      const requests = await getAllLGPDRequests();
      
      // For each request, also fetch the encrypted data
      const requestsWithEncryptedData = await Promise.all(
        requests.map(async (request) => {
          const encryptedData = await getEncryptedLGPDData(request.id);
          return {
            ...request,
            encrypted_data: encryptedData ? encryptedData.encrypted_blob.toString('base64url') : null
          };
        })
      );
      
      return NextResponse.json(
        {
          code: 'REQUESTS_RETRIEVED',
          data: { requests: requestsWithEncryptedData }
        } as APIResponse,
        { status: 200 }
      );

    } catch (error) {
      console.error('Failed to retrieve company LGPD requests:', error);
      return NextResponse.json(
        { code: 'SERVER_ERROR', message: 'Failed to retrieve LGPD requests' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Company LGPD requests GET error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    const { user } = authResult;
    
    // Only admins/employees can update request status
    if (!['admin', 'employee'].includes(user.role)) {
      return NextResponse.json(
        { code: 'INSUFFICIENT_PERMISSIONS', message: 'Only admin or employee users can update request status' } as APIResponse,
        { status: 403 }
      );
    }
    
    let body: UpdateStatusRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON', message: 'Invalid JSON format' } as APIResponse,
        { status: 400 }
      );
    }

    const { requestId, status } = body;

    // Validate required fields
    if (!requestId || !status) {
      return NextResponse.json(
        { code: 'VALIDATION_REQUIRED_FIELDS_MISSING', message: 'Request ID and status are required' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: LGPDRequestStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_STATUS', message: `Status must be one of: ${validStatuses.join(', ')}` } as APIResponse,
        { status: 400 }
      );
    }

    try {
      await initializeDatabase();
      
      const completedAt = status === 'COMPLETED' ? new Date() : undefined;
      await updateRequestStatus(requestId, status, completedAt);
      
      return NextResponse.json(
        { 
          code: 'STATUS_UPDATED',
          message: `Request ${requestId} status updated to ${status}`,
          data: { requestId, status, completedAt }
        } as APIResponse,
        { status: 200 }
      );

    } catch (error) {
      console.error('Failed to update request status:', error);
      return NextResponse.json(
        { code: 'UPDATE_FAILED', message: 'Failed to update request status' } as APIResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Company LGPD requests PATCH error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' } as APIResponse,
      { status: 500 }
    );
  }
}
