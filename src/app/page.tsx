'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
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
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface ProductsResponse {
  products: Product[]
  pagination: Pagination
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('') // Separate input state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [allCategories, setAllCategories] = useState<string[]>(['all'])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems, addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchQuery])

  useEffect(() => {
    fetchCategories()
    fetchProducts(true) // Show loading only on initial load
  }, []) // Only fetch categories once on component mount

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 300) // 300ms delay

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const fetchProducts = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchQuery,
        category: selectedCategory
      })
      
      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      
      if (data.products && data.pagination) {
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        console.error('API returned unexpected data structure:', data)
        setProducts([])
        setPagination(null)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
      setPagination(null)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products?limit=1000')
      const data: ProductsResponse = await response.json()
      if (data.products) {
        const categories = ['all', ...Array.from(new Set(data.products.map(p => p.category)))]
        setAllCategories(categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent tracking-wider">
              DARIMAC TECHNOLOGIES
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-blue-300 hover:text-cyan-300 font-medium border border-blue-500/30 px-4 py-2 rounded-lg hover:border-cyan-400/50 transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
                </svg>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link 
                href="/admin" 
                className="text-sm text-blue-300 hover:text-cyan-300 font-medium border border-blue-500/30 px-4 py-2 rounded-lg hover:border-cyan-400/50 transition-all duration-300"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border-2 border-blue-500/30 rounded-lg leading-5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-blue-300/70 focus:outline-none focus:placeholder-blue-400/90 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-blue-300 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50 backdrop-blur-sm'
                }`}
              >
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {pagination && (
          <div className="mb-6 text-sm text-blue-300/80">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of {pagination.totalProducts} products
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-blue-300/70 text-lg">
              {searchQuery || selectedCategory !== 'all' ? 'No products found matching your criteria' : 'No products available'}
            </div>
            {!searchQuery && selectedCategory === 'all' && (
              <Link 
                href="/admin" 
                className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/20 transition-all duration-300"
              >
                Add Products
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="bg-slate-800/60 backdrop-blur-sm border-2 border-blue-500/20 rounded-lg shadow-lg shadow-blue-500/10 overflow-hidden hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
                >
                  {product.image || (product.images && product.images[0]) ? (
                    <img
                      src={product.image || product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-blue-200/80 text-sm mb-3 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-400">Rs. {product.price}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        product.inStock 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                        {product.category}
                      </span>
                      <span className="text-xs text-cyan-400 font-medium group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pagination.hasPrevPage
                      ? 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50 backdrop-blur-sm'
                      : 'bg-slate-700/30 text-blue-500/50 cursor-not-allowed border-2 border-blue-500/10'
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50 backdrop-blur-sm'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-3 py-2 text-blue-400/60">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pagination.hasNextPage
                      ? 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50 backdrop-blur-sm'
                      : 'bg-slate-700/30 text-blue-500/50 cursor-not-allowed border-2 border-blue-500/10'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer Section */}
      <footer className="bg-slate-900/90 border-t border-blue-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                DARIMAC TECHNOLOGIES
              </h3>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                Your trusted partner for quality computer accessories and technology solutions in Kurunegala.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DT</span>
                </div>
                <div className="text-blue-300/70 text-xs">
                  Quality • Innovation • Service
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-300">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-blue-200/80 text-sm">
                    <div>Kurunegala Road Polpithigama</div>
                    <div>Kurunegala Colony, Sri Lanka 60620</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:0764580193" className="text-blue-200/80 text-sm hover:text-cyan-300 transition-colors">
                    076 458 0193
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:darimacdigital@gmail.com" className="text-blue-200/80 text-sm hover:text-cyan-300 transition-colors">
                    darimacdigital@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-300">Business Hours</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-blue-200/80 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-green-300 font-medium">Open</span>
                      <span>⋅ Closes 6 PM</span>
                    </div>
                  </div>
                </div>
                <div className="text-blue-200/70 text-xs ml-8">
                  Monday - Saturday: 9:00 AM - 6:00 PM<br />
                  Sunday: Contact for availability
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <Link 
                  href="/admin"
                  className="block w-full text-center py-2 px-4 bg-slate-800/50 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all duration-300 text-sm"
                >
                  Admin Dashboard
                </Link>
                <a 
                  href="tel:0764580193"
                  className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-medium"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-blue-500/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-blue-200/60 text-sm">
                © 2024 DARIMAC TECHNOLOGIES. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-blue-200/60">
                <span className="hover:text-cyan-300 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-cyan-300 cursor-pointer transition-colors">Terms of Service</span>
                <span className="hover:text-cyan-300 cursor-pointer transition-colors">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
