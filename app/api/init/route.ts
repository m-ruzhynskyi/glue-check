import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/app/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}
