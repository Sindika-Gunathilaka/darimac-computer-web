'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Cart from '@/components/Cart'

interface ProductImage {
  id: number
  url: string
  publicId: string | null
}

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
  images: ProductImage[]
  category: string
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems, addToCart } = useCart()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const text = await response.text()
        if (text) {
          const data = JSON.parse(text)
          setProduct(data)
        } else {
          setError('Product not found')
        }
      } else {
        setError('Product not found')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-blue-300">Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-300 mb-4">{error || 'Product not found'}</div>
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/20 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const allImages = product.images?.length > 0 
    ? product.images.map(img => img.url)
    : product.image 
      ? [product.image]
      : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]?.url)
      })
      // Show success message or open cart
      setIsCartOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link 
              href="/"
              className="text-blue-300 hover:text-cyan-300 font-medium mr-4 border border-blue-500/30 px-3 py-1 rounded-lg hover:border-cyan-400/50 transition-all duration-300"
            >
              ← Back to Products
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent tracking-wider">
              DARIMAC TECHNOLOGIES
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {allImages.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg border-2 border-blue-500/30 shadow-lg shadow-blue-500/20"
                  />
                  
                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm border border-blue-500/30 text-cyan-300 p-2 rounded-full hover:bg-slate-700/90 hover:border-cyan-400/50 transition-all duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm border border-blue-500/30 text-cyan-300 p-2 rounded-full hover:bg-slate-700/90 hover:border-cyan-400/50 transition-all duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-slate-800/80 backdrop-blur-sm border border-blue-500/30 text-cyan-300 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {allImages.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' 
                            : 'border-blue-500/30 hover:border-blue-400/60'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/30 flex items-center justify-center rounded-lg">
                <span className="text-blue-300/70 text-lg">No Images Available</span>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/30">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  product.inStock 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              <div className="text-4xl font-bold text-cyan-400 mb-6">Rs. {product.price}</div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-blue-300 mb-3">Description</h2>
                <p className="text-blue-100/80 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg border-2 transition-all duration-300 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-700/50 text-blue-500/50 cursor-not-allowed border-blue-500/20'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="w-full py-4 px-6 border-2 border-cyan-400/50 text-cyan-300 rounded-lg font-semibold text-lg hover:bg-slate-800/50 backdrop-blur-sm hover:border-cyan-400/70 transition-all duration-300">
                Contact for More Info
              </button>
            </div>

            <div className="border-t border-blue-500/30 pt-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Product Information</h3>
              <div className="space-y-2 text-sm text-blue-200/70">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span className="font-medium text-cyan-300">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium text-cyan-300">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-300' : 'text-red-300'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}