import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        cs.id, 
        cs.image_id, 
        cs.length_meters, 
        cs.created_at, 
        cs.expires_at,
        i.name as image_name
      FROM 
        consultant_submissions cs
      JOIN 
        images i ON cs.image_id = i.id
      WHERE 
        cs.expires_at > CURRENT_TIMESTAMP
      ORDER BY 
        cs.created_at DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_id, length_meters } = body;

    if (!image_id || !length_meters) {
      return NextResponse.json({ error: 'Image ID and length are required' }, { status: 400 });
    }

    const imageCheck = await query('SELECT id FROM images WHERE id = $1', [image_id]);
    if (imageCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO consultant_submissions 
        (image_id, length_meters) 
       VALUES 
        ($1, $2) 
       RETURNING 
        id, image_id, length_meters, created_at, expires_at`,
      [image_id, length_meters]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const result = await query(
      'DELETE FROM consultant_submissions WHERE expires_at <= CURRENT_TIMESTAMP RETURNING id'
    );

    return NextResponse.json({ 
      message: 'Expired submissions cleaned up', 
      count: result.rows.length 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clean up submissions' }, { status: 500 });
  }
}
