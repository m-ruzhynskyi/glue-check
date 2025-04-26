import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET: Retrieve a single image by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if the 'data' query parameter is present to determine if we should return the binary data
    const url = new URL(request.url);
    const includeData = url.searchParams.get('data') === 'true';
    
    let result;
    if (includeData) {
      // Return the full image data
      result = await query('SELECT id, name, data, created_at, updated_at FROM images WHERE id = $1', [id]);
    } else {
      // Return only metadata
      result = await query('SELECT id, name, created_at, updated_at FROM images WHERE id = $1', [id]);
    }
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}

// PUT: Update an image by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const file = formData.get('file') as File | null;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    let result;
    if (file) {
      // If a new file is provided, update both name and data
      const buffer = Buffer.from(await file.arrayBuffer());
      result = await query(
        'UPDATE images SET name = $1, data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, created_at, updated_at',
        [name, buffer, id]
      );
    } else {
      // If no new file is provided, update only the name
      result = await query(
        'UPDATE images SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, created_at, updated_at',
        [name, id]
      );
    }
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

// DELETE: Delete an image by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('DELETE FROM images WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}