'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  })

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        alert(`Order placed successfully! Order ID: ${order.id}`)
        clearCart()
        setShowCheckout(false)
        onClose()
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: ''
        })
      } else {
        alert('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-blue-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl shadow-blue-500/20">
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-cyan-300">
              {showCheckout ? 'Checkout' : 'Shopping Cart'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-cyan-300 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showCheckout ? (
            <>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-blue-300/70 text-lg mb-4">Your cart is empty</div>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg border border-blue-500/20">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-blue-500/30"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-cyan-400 font-semibold">Rs. {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-slate-600 text-blue-300 hover:bg-slate-500 transition-colors duration-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-slate-600 text-blue-300 hover:bg-slate-500 transition-colors duration-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-blue-500/30 pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl font-semibold text-blue-300">Total:</span>
                      <span className="text-2xl font-bold text-cyan-400">Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => clearCart()}
                        className="flex-1 py-3 px-4 bg-slate-600 text-blue-300 rounded-lg hover:bg-slate-500 transition-all duration-300 font-medium"
                      >
                        Clear Cart
                      </button>
                      <button
                        onClick={() => setShowCheckout(true)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-blue-500/30 bg-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-400/70 transition-all duration-300"
                />
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-blue-200/70">{item.name} (x{item.quantity})</span>
                      <span className="text-cyan-400">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-blue-500/20 pt-3 flex justify-between font-semibold">
                  <span className="text-blue-300">Total:</span>
                  <span className="text-cyan-400 text-lg">Rs. {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-3 px-4 bg-slate-600 text-blue-300 rounded-lg hover:bg-slate-500 transition-all duration-300 font-medium"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}