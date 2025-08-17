import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { verifyToken } from '@/lib/jwt';

interface QRCodeRequestBody {
  amount?: number;
  description?: string;
}

interface APIResponse {
  code: string;
  data?: unknown;
}

// Generate mock PIX QR code for LGPD verification
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
    let body: QRCodeRequestBody = {};
    try {
      body = await request.json();
    } catch {
      // If no body, use defaults
    }

    const amount = body.amount || 0.01; // Default R$ 0,01 for LGPD verification
    const description = body.description || 'Verificação LGPD - Exercício de Direito';

    // Generate unique transaction ID
    const transactionId = `PIX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    

    // Create PIX string (mock format)
    const pixString = `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${amount.toFixed(2)}5802BR5913LGPD PLATFORM6009SAO PAULO61080131010062070503***6304`;

    // Generate QR code as base64 image
    const qrCodeDataURL = await QRCode.toDataURL(pixString, {
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Store transaction for verification (in production, this would be in database)
    const mockTransaction = {
      id: transactionId,
      userId: userPayload.userId,
      amount,
      description,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      pixString
    };

    return NextResponse.json(
      {
        code: 'QR_CODE_GENERATED',
        data: {
          qrCode: qrCodeDataURL,
          transactionId,
          amount,
          description,
          expiresAt: mockTransaction.expiresAt,
          pixString,
          instructions: 'Escaneie o QR Code com seu app bancário e realize o pagamento de R$ 0,01 para verificar sua identidade via PIX'
        }
      } as APIResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('PIX QR Code generation error:', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR' } as APIResponse,
      { status: 500 }
    );
  }
}