import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET: Retrieve the binary image data and serve it as an image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the image data from the database
    const result = await query('SELECT data, name FROM images WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    const imageData = result.rows[0].data;
    const imageName = result.rows[0].name;
    
    // Determine content type based on file extension if available
    let contentType = 'image/jpeg'; // Default
    if (imageName.toLowerCase().endsWith('.png')) {
      contentType = 'image/png';
    } else if (imageName.toLowerCase().endsWith('.gif')) {
      contentType = 'image/gif';
    } else if (imageName.toLowerCase().endsWith('.webp')) {
      contentType = 'image/webp';
    }
    
    // Create a response with the binary data
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${imageName}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error fetching image data:', error);
    return NextResponse.json({ error: 'Failed to fetch image data' }, { status: 500 });
  }
}