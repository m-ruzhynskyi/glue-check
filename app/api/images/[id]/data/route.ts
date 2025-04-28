// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Missing image ID' }, { status: 400 })
  }

  try {
    const result = await query(
      'SELECT data, name FROM images WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const imageData: Buffer = result.rows[0].data
    const imageName: string = result.rows[0].name

    let contentType = 'image/jpeg'
    const lowerName = imageName.toLowerCase()

    if (lowerName.endsWith('.png')) {
      contentType = 'image/png'
    } else if (lowerName.endsWith('.gif')) {
      contentType = 'image/gif'
    } else if (lowerName.endsWith('.webp')) {
      contentType = 'image/webp'
    }

    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${imageName}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Failed to fetch image data for id=', id, error)
    return NextResponse.json(
      { error: 'Failed to fetch image data' },
      { status: 500 }
    )
  }
}
