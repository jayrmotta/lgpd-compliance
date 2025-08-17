import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

interface VerifyRequestBody {
  transactionId: string;
  cpf?: string; // Optional CPF for mock verification
}

interface APIResponse {
  code: string;
  data?: unknown;
}

// Mock PIX payment verification
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value;
    
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
    let body: VerifyRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: 'VALIDATION_INVALID_JSON' } as APIResponse,
        { status: 400 }
      );
    }

    const { transactionId, cpf } = body;

    if (!transactionId) {
      return NextResponse.json(
        { code: 'VALIDATION_TRANSACTION_ID_REQUIRED' } as APIResponse,
        { status: 400 }
      );
    }

    // Mock verification logic
    // In production, this would check with PIX provider/webhook
    
    // Simulate different scenarios based on transaction ID pattern
    if (transactionId.includes('FAIL')) {
      return NextResponse.json(
        { code: 'PIX_VERIFICATION_FAILED' } as APIResponse,
        { status: 400 }
      );
    }

    if (transactionId.includes('TIMEOUT')) {
      return NextResponse.json(
        { code: 'PIX_VERIFICATION_TIMEOUT' } as APIResponse,
        { status: 408 }
      );
    }

    // Validate CPF if provided (for demo)
    if (cpf) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(cpf) || cpf === '000.000.000-00') {
        return NextResponse.json(
          { code: 'PIX_CPF_INVALID' } as APIResponse,
          { status: 400 }
        );
      }
    }

    // Mock successful verification
    const mockVerification = {
      transactionId,
      status: 'CONFIRMED',
      amount: 0.01,
      cpf: cpf || '***.***.***-**', // Masked CPF for privacy
      verifiedAt: new Date().toISOString(),
      bankName: 'Banco Demo',
      accountType: 'CHECKING'
    };

    return NextResponse.json(
      {
        code: 'PIX_VERIFICATION_SUCCESS',
        data: {
          verified: true,
          transactionId,
          cpfVerified: !!cpf,
          verifiedAt: mockVerification.verifiedAt,
          message: 'Identidade verificada com sucesso via PIX'
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('PIX verification error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}

// Get PIX transaction status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { code: 'VALIDATION_TRANSACTION_ID_REQUIRED' } as APIResponse,
        { status: 400 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value;
    
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

    // Mock status check
    // In production, this would query the PIX provider
    
    // Simulate payment timing - transactions older than 5 minutes are "paid"
    const transactionTime = parseInt(transactionId.split('-')[1] || '0');
    const isPaid = Date.now() - transactionTime > (5 * 60 * 1000); // 5 minutes for demo

    const status = isPaid ? 'CONFIRMED' : 'PENDING';

    return NextResponse.json(
      {
        code: 'TRANSACTION_STATUS_RETRIEVED',
        data: {
          transactionId,
          status,
          amount: 0.01,
          checkedAt: new Date().toISOString()
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('PIX status check error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}