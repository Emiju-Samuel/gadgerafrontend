// User roles as defined by the backend (UserRole enum).
export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
})

export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
})

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Google Identity Services client id (must match the backend client id).
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export const AUTH_ENDPOINTS = Object.freeze({
  LOGIN: '/authenticate',
  REGISTER: '/sign-up',
  GOOGLE: '/auth/google',
})

// Emitted by the Axios interceptor when the API rejects a request with 401.
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

// Emitted when a session ends so the cart context can drop the shopper's data.
export const CART_CLEAR_EVENT = 'cart:clear'

// Read-only storefront catalogue. Public: guests can browse without a JWT.
export const CATALOG_ENDPOINTS = Object.freeze({
  PRODUCTS: '/api/catalog/products',
  SEARCH: '/api/catalog/products/search',
})

// Public endpoints that never require a signed-in user.
export const PUBLIC_ENDPOINTS = Object.freeze({
  // Look up an order by its unguessable tracking id (guest tracking).
  TRACKING: '/order',
})

// Customer endpoints that require a signed-in CUSTOMER.
export const CUSTOMER_ENDPOINTS = Object.freeze({
  CART: '/api/customer/cart',
  CART_ADDITION: '/api/customer/addition',
  CART_DEDUCTION: '/api/customer/deduction',
  COUPON: '/api/customer/coupon',
  PLACE_ORDER: '/api/customer/placeOrder',
  MY_ORDERS: '/api/customer/myOrders',
  WISHLIST: '/api/customer/wishlist',
  PROFILE: '/api/customer/profile',
  CHANGE_PASSWORD: '/api/customer/changePassword',
  REVIEW: '/api/customer/review',
  ORDERED_PRODUCTS: '/api/customer/ordered-products',
})

// Admin management endpoints (all require an ADMIN JWT).
export const ADMIN_ENDPOINTS = Object.freeze({
  CATEGORIES: '/api/admin',
  CATEGORY: '/api/admin/category',
  PRODUCTS: '/api/admin/products',
  PRODUCT: '/api/admin/product',
  PRODUCT_SEARCH: '/api/admin/search',
  PLACED_ORDERS: '/api/admin/placedOrders',
  ORDER: '/api/admin/order',
  ANALYTICS: '/api/admin/order/analytics',
  COUPONS: '/api/admin/coupon',
  FAQS: '/api/admin/faqs',
  FAQ: '/api/admin/faq',
})
