import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT id, name, created_at, updated_at FROM images ORDER BY updated_at DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const file = formData.get('file') as File;

    if (!name || !file) {
      return NextResponse.json({ error: 'Name and file are required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await query(
      'INSERT INTO images (name, data) VALUES ($1, $2) RETURNING id, name, created_at, updated_at',
      [name, buffer]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}
