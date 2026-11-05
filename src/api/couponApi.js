import api from './axios'
import { ADMIN_ENDPOINTS } from '../utils/constants'

export const getCoupons = () => api.get(ADMIN_ENDPOINTS.COUPONS)

export const createCoupon = (payload) => api.post(ADMIN_ENDPOINTS.COUPONS, payload)

export const updateCoupon = (couponId, payload) =>
  api.put(`${ADMIN_ENDPOINTS.COUPONS}/${couponId}`, payload)

export const deleteCoupon = (couponId) => api.delete(`${ADMIN_ENDPOINTS.COUPONS}/${couponId}`)
