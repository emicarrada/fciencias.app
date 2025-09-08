import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

export async function GET() {
  try {
    const db = await initializePrisma();
    
    // Test database connection
    const userCount = await db.user.count();
    
    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      database: 'Disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
