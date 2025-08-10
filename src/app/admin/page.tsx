'use client'

import { useState, useEffect } from 'react'

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

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    image: string | null
  }
}

interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
  status: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

interface OrdersResponse {
  orders: Order[]
  pagination: {
    currentPage: number
    totalPages: number
    totalOrders: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersPagination, setOrdersPagination] = useState<{ currentPage: number; totalPages: number; totalOrders: number; hasNextPage: boolean; hasPrevPage: boolean; limit: number } | null>(null)
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    images: [] as string[],
    category: '',
    inStock: true
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [currentOrdersPage])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=1000') // Get all products for admin
      const data = await response.json()
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products)
      } else if (Array.isArray(data)) {
        // Fallback for old API format
        setProducts(data)
      } else {
        console.error('API returned unexpected data:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?page=${currentOrdersPage}&limit=10`)
      const data: OrdersResponse = await response.json()
      setOrders(data.orders || [])
      setOrdersPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        fetchOrders() // Refresh orders list
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const deleteOrder = async (orderId: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
        if (response.ok) {
          fetchOrders()
        }
      } catch (error) {
        console.error('Failed to delete order:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', description: '', price: '', image: '', images: [], category: '', inStock: true })
        setIsFormOpen(false)
        setEditingProduct(null)
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ 
          ...formData, 
          images: [...formData.images, data.imageUrl],
          image: formData.images.length === 0 ? data.imageUrl : formData.image
        })
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ 
      ...formData, 
      images: newImages,
      image: newImages[0] || ''
    })
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    const imageUrls = product.images?.map(img => img.url) || []
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || imageUrls[0] || '',
      images: imageUrls,
      category: product.category,
      inStock: product.inStock
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent tracking-wider">DARIMAC TECHNOLOGIES - Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setIsFormOpen(true)
                setEditingProduct(null)
                setFormData({ name: '', description: '', price: '', image: '', images: [], category: '', inStock: true })
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/20 hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-slate-700/50 text-blue-300 border-2 border-blue-500/30 hover:bg-slate-600/70'
              }`}
              disabled={activeTab !== 'products'}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg border-2 border-blue-500/20">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-blue-300 hover:text-cyan-300 hover:bg-slate-700/50'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-blue-300 hover:text-cyan-300 hover:bg-slate-700/50'
            }`}
          >
            Orders ({ordersPagination?.totalOrders || 0})
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-blue-500/30 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl shadow-blue-500/20">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-3">Product Images</label>
                  <div className="space-y-3">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-blue-500/30 bg-slate-700/50 rounded-lg p-4 text-center hover:border-cyan-400/50 transition-all duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          files.forEach(file => handleFileUpload(file))
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-300">
                            {uploading ? 'Uploading...' : 'Upload Images'}
                          </p>
                          <p className="text-xs text-blue-400/70">
                            Click to browse or drag multiple files
                          </p>
                        </div>
                      </label>
                      {uploading && (
                        <div className="mt-2">
                          <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Grid */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={imageUrl} 
                              alt={`Product image ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg border-2 border-blue-500/30"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500/80 backdrop-blur-sm border border-red-400/50 text-white rounded-full p-1 hover:bg-red-600/90 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded border border-cyan-400/50">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                  >
                    <option value="">Select Category</option>
                    <option value="mouse">Mouse</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="monitor">Monitor</option>
                    <option value="headset">Headset</option>
                    <option value="cable">Cable</option>
                    <option value="storage">Storage</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="flex items-center text-blue-300">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="mr-2 accent-cyan-400"
                    />
                    In Stock
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-blue-300 border-2 border-blue-500/30 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/20 transition-all duration-300"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'products' ? (
          <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-blue-500/20 rounded-lg shadow-xl shadow-blue-500/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-500/20">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/40 divide-y divide-blue-500/20">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {(product.image || (product.images && product.images[0])) && (
                            <img
                              className="h-10 w-10 rounded object-cover mr-4"
                              src={product.image || product.images[0]?.url}
                              alt={product.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-blue-200/70 truncate max-w-xs">
                                {product.description.length > 50 
                                  ? `${product.description.substring(0, 50)}...` 
                                  : product.description
                                }
                              </div>
                            )}
                            {product.images && product.images.length > 1 && (
                              <div className="text-xs text-cyan-400">+{product.images.length - 1} more images</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">
                        Rs. {product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          product.inStock ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-cyan-400 hover:text-cyan-300 mr-4 font-medium transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-blue-500/20 rounded-lg shadow-xl shadow-blue-500/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-500/20">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/40 divide-y divide-blue-500/20">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{order.customerName}</div>
                          <div className="text-sm text-blue-200/70">{order.customerEmail}</div>
                          <div className="text-xs text-blue-300/60">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">
                          Rs. {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 text-xs font-semibold rounded-full border bg-slate-700 text-white border-blue-500/30 focus:outline-none focus:border-cyan-400/70"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200/70">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-cyan-400 hover:text-cyan-300 mr-4 font-medium transition-colors duration-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders Pagination */}
            {ordersPagination && ordersPagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentOrdersPage(prev => Math.max(1, prev - 1))}
                  disabled={!ordersPagination.hasPrevPage}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    ordersPagination.hasPrevPage
                      ? 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50'
                      : 'bg-slate-700/30 text-blue-500/50 cursor-not-allowed border-2 border-blue-500/10'
                  }`}
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-blue-300">
                  Page {ordersPagination.currentPage} of {ordersPagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentOrdersPage(prev => prev + 1)}
                  disabled={!ordersPagination.hasNextPage}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    ordersPagination.hasNextPage
                      ? 'bg-slate-800/50 text-blue-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:border-cyan-400/50'
                      : 'bg-slate-700/30 text-blue-500/50 cursor-not-allowed border-2 border-blue-500/10'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-blue-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl shadow-blue-500/20">
              <div className="p-6 border-b border-blue-500/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-cyan-300">Order #{selectedOrder.id}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-blue-300 hover:text-cyan-300 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200/70">Name:</span>
                      <div className="text-white font-medium">{selectedOrder.customerName}</div>
                    </div>
                    <div>
                      <span className="text-blue-200/70">Email:</span>
                      <div className="text-white font-medium">{selectedOrder.customerEmail}</div>
                    </div>
                    <div>
                      <span className="text-blue-200/70">Phone:</span>
                      <div className="text-white font-medium">{selectedOrder.customerPhone}</div>
                    </div>
                    <div>
                      <span className="text-blue-200/70">Status:</span>
                      <div className="text-cyan-400 font-medium capitalize">{selectedOrder.status}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-blue-200/70">Delivery Address:</span>
                    <div className="text-white font-medium whitespace-pre-wrap">{selectedOrder.customerAddress}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded border border-blue-500/30"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-white font-medium">{item.product.name}</div>
                          <div className="text-blue-200/70 text-sm">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-cyan-400 font-semibold">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-blue-500/20 mt-4 pt-4 flex justify-between font-semibold">
                    <span className="text-blue-300">Total Amount:</span>
                    <span className="text-cyan-400 text-lg">Rs. {selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">Order Timeline</h3>
                  <div className="text-sm text-blue-200/70">
                    <div>Order placed: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    <div>Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}