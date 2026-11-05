import api from './axios'
import { CUSTOMER_ENDPOINTS } from '../utils/constants'

/**
 * Customer cart + checkout endpoints. The cart lives on the server only for
 * signed-in customers; guests keep a local cart that is pushed here at checkout.
 *
 * `addProductToCart` adds a single unit and replies 409 when the product is
 * already in the cart, while the quantity endpoints adjust an existing line.
 */
export const addProductToCart = ({ userId, productId }) =>
  api.post(CUSTOMER_ENDPOINTS.CART, { userId, productId })

export const getCartByUserId = (userId) => api.get(`${CUSTOMER_ENDPOINTS.CART}/${userId}`)

export const clearServerCart = (userId) => api.delete(`${CUSTOMER_ENDPOINTS.CART}/${userId}`)

export const increaseProductQuantity = ({ userId, productId }) =>
  api.post(CUSTOMER_ENDPOINTS.CART_ADDITION, { userId, productId })

export const decreaseProductQuantity = ({ userId, productId }) =>
  api.post(CUSTOMER_ENDPOINTS.CART_DEDUCTION, { userId, productId })

export const applyCoupon = (userId, code) =>
  api.get(`${CUSTOMER_ENDPOINTS.COUPON}/${userId}/${encodeURIComponent(code)}`)

export const placeOrder = ({ userId, address, orderDescription, payment }) =>
  api.post(CUSTOMER_ENDPOINTS.PLACE_ORDER, { userId, address, orderDescription, payment })

export const getMyOrders = (userId) => api.get(`${CUSTOMER_ENDPOINTS.MY_ORDERS}/${userId}`)
