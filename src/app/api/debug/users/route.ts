import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/user-storage';

export async function GET() {
  const users = await getAllUsers();
  
  return NextResponse.json({
    count: users.length,
    users: users.map(user => ({
      id: user.id,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
      hasPassword: !!user.passwordHash
    }))
  });
}