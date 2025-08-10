import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'computer-accessories', // Organize images in a folder
          public_id: `product-${Date.now()}`, // Unique filename
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })

    // Return the Cloudinary URL
    return NextResponse.json({ 
      imageUrl: (uploadResponse as { secure_url: string; public_id: string }).secure_url,
      publicId: (uploadResponse as { secure_url: string; public_id: string }).public_id
    })

  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload image', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}