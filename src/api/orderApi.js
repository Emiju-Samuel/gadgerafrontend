import api from './axios'
import { ADMIN_ENDPOINTS, PUBLIC_ENDPOINTS } from '../utils/constants'

// Orders the admin can act on (the backend excludes in-progress "Pending" carts).
export const getPlacedOrders = () => api.get(ADMIN_ENDPOINTS.PLACED_ORDERS)

// Public guest tracking: resolves an order from its unguessable tracking id.
export const getOrderByTrackingId = (trackingId) =>
  api.get(`${PUBLIC_ENDPOINTS.TRACKING}/${trackingId}`)

export const getOrderById = (orderId) => api.get(`${ADMIN_ENDPOINTS.ORDER}/${orderId}`)

// The backend only accepts the literal strings "Shipped" and "Delivered".
export const updateOrderStatus = (orderId, status) =>
  api.put(`${ADMIN_ENDPOINTS.ORDER}/${orderId}/${status}`)
