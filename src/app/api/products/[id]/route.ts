import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        images: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, description, price, image, images, category, inStock } = body
    const resolvedParams = await params
    const productId = parseInt(resolvedParams.id)

    // Delete existing product images and create new ones
    await prisma.productImage.deleteMany({
      where: { productId }
    })

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        inStock,
        images: {
          create: (images || []).map((imageUrl: string) => ({
            url: imageUrl
          }))
        }
      },
      include: {
        images: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.product.delete({
      where: { id: parseInt(resolvedParams.id) }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}