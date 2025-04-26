import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET: Retrieve all images (metadata only, not the binary data)
export async function GET() {
  try {
    const result = await query('SELECT id, name, created_at, updated_at FROM images ORDER BY updated_at DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST: Create a new image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const file = formData.get('file') as File;
    
    if (!name || !file) {
      return NextResponse.json({ error: 'Name and file are required' }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Insert into database
    const result = await query(
      'INSERT INTO images (name, data) VALUES ($1, $2) RETURNING id, name, created_at, updated_at',
      [name, buffer]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}