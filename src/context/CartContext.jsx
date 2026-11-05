import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CartContext } from '../hooks/useCart'
import { CART_CLEAR_EVENT } from '../utils/constants'
import { getStoredCart, removeStoredCart, setStoredCart } from '../utils/storage'

const CART_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  CLEAR: 'CLEAR',
  SET_COUPON: 'SET_COUPON',
  CLEAR_COUPON: 'CLEAR_COUPON',
}

const EMPTY_CART = { items: [], couponCode: null }

const clampQuantity = (quantity, available) => {
  const desired = Math.max(1, Math.floor(Number(quantity) || 1))
  if (available == null) return desired
  return Math.min(desired, Math.max(1, Number(available)))
}

const sameProduct = (a, b) => a != null && b != null && String(a) === String(b)

const toCartItem = (product, quantity) => ({
  productId: product.id,
  name: product.name ?? '',
  price: Number(product.price ?? 0),
  image: product.byteImg ?? null,
  availableQuantity: product.quantity == null ? null : Number(product.quantity),
  quantity,
})

const normalizeStored = (item) => ({
  productId: item.productId,
  name: item.name ?? '',
  price: Number(item.price ?? 0),
  image: item.image ?? null,
  availableQuantity: item.availableQuantity == null ? null : Number(item.availableQuantity),
  quantity: Math.max(1, Number(item.quantity) || 1),
})

const initCartState = (userId = null) => {
  const stored = getStoredCart()
  if (!stored || !Array.isArray(stored.items)) return EMPTY_CART

  // Never restore a cart that belonged to a different account. A guest cart
  // (no owner) is kept so it survives signing in, as required at checkout.
  if (stored.ownerId != null && String(stored.ownerId) !== String(userId)) {
    return EMPTY_CART
  }

  return {
    items: stored.items.filter((item) => item && item.productId != null).map(normalizeStored),
    couponCode: stored.couponCode ?? null,
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const { product, quantity } = action.payload
      const existing = state.items.find((item) => sameProduct(item.productId, product.id))
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            sameProduct(item.productId, product.id)
              ? {
                  ...item,
                  quantity: clampQuantity(item.quantity + quantity, item.availableQuantity),
                }
              : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, toCartItem(product, clampQuantity(quantity, product.quantity))],
      }
    }

    case CART_ACTIONS.REMOVE:
      return {
        ...state,
        items: state.items.filter(
          (item) => !sameProduct(item.productId, action.payload.productId),
        ),
      }

    case CART_ACTIONS.INCREMENT:
      return {
        ...state,
        items: state.items.map((item) =>
          sameProduct(item.productId, action.payload.productId)
            ? { ...item, quantity: clampQuantity(item.quantity + 1, item.availableQuantity) }
            : item,
        ),
      }

    case CART_ACTIONS.DECREMENT:
      return {
        ...state,
        items: state.items
          .map((item) =>
            sameProduct(item.productId, action.payload.productId)
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case CART_ACTIONS.CLEAR:
      return EMPTY_CART

    case CART_ACTIONS.SET_COUPON:
      return { ...state, couponCode: action.payload.couponCode }

    case CART_ACTIONS.CLEAR_COUPON:
      return { ...state, couponCode: null }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [state, dispatch] = useReducer(cartReducer, userId, initCartState)
  const previousUserIdRef = useRef(userId)

  // Drop the previous shopper's cart when a signed-in user signs out or a
  // different account takes over. Guest carts are preserved across login.
  useEffect(() => {
    const previousUserId = previousUserIdRef.current
    if (previousUserId !== null && previousUserId !== userId) {
      dispatch({ type: CART_ACTIONS.CLEAR })
      removeStoredCart()
    }
    previousUserIdRef.current = userId
  }, [userId])

  // Logout (and an expired session) also broadcasts this event so the in-memory
  // cart is emptied even if the auth state was already cleared elsewhere.
  useEffect(() => {
    const handleClearCart = () => {
      dispatch({ type: CART_ACTIONS.CLEAR })
      removeStoredCart()
    }
    window.addEventListener(CART_CLEAR_EVENT, handleClearCart)
    return () => window.removeEventListener(CART_CLEAR_EVENT, handleClearCart)
  }, [])

  useEffect(() => {
    setStoredCart({ items: state.items, couponCode: state.couponCode, ownerId: userId })
  }, [state.items, state.couponCode, userId])

  const addItem = useCallback(
    (product, quantity = 1) => {
      if (!product?.id) return
      dispatch({ type: CART_ACTIONS.ADD, payload: { product, quantity } })
    },
    [],
  )

  const removeItem = useCallback(
    (productId) => dispatch({ type: CART_ACTIONS.REMOVE, payload: { productId } }),
    [],
  )

  const increment = useCallback(
    (productId) => dispatch({ type: CART_ACTIONS.INCREMENT, payload: { productId } }),
    [],
  )

  const decrement = useCallback(
    (productId) => dispatch({ type: CART_ACTIONS.DECREMENT, payload: { productId } }),
    [],
  )

  const clearCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), [])

  const setCouponCode = useCallback(
    (couponCode) => dispatch({ type: CART_ACTIONS.SET_COUPON, payload: { couponCode } }),
    [],
  )

  const clearCoupon = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR_COUPON }), [])

  const value = useMemo(() => {
    // Count distinct cart lines, not the sum of units, so adding several units
    // of one product still reads as a single item in the cart.
    const itemCount = state.items.length
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      items: state.items,
      couponCode: state.couponCode,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      increment,
      decrement,
      clearCart,
      setCouponCode,
      clearCoupon,
    }
  }, [
    state.items,
    state.couponCode,
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    setCouponCode,
    clearCoupon,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
