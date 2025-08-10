import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({ where })
    
    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      include: {
        images: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const totalPages = Math.ceil(totalProducts / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage,
        hasPrevPage,
        limit
      }
    })
  } catch (error) {
    console.error('Fetch products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image, images, category, inStock } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        inStock: inStock ?? true,
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
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 })
  }
}