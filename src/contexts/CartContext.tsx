'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        return calculateTotals({ ...state, items: newItems })
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return calculateTotals({ ...state, items: updatedItems })
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== action.payload.id)
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      }
    }
    
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalAmount: 0 }
    
    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload })
    
    default:
      return state
  }
}

const calculateTotals = (state: CartState): CartState => {
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return { ...state, totalItems, totalAmount }
}

interface CartContextType extends CartState {
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('darimac-cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: parsedCart })
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darimac-cart', JSON.stringify(state.items))
    }
  }, [state.items])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}