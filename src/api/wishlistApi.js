import api from './axios'
import { CUSTOMER_ENDPOINTS } from '../utils/constants'

export const addProductToWishlist = ({ userId, productId }) =>
  api.post(CUSTOMER_ENDPOINTS.WISHLIST, { userId, productId })

export const getWishlistByUserId = (userId) =>
  api.get(`${CUSTOMER_ENDPOINTS.WISHLIST}/${userId}`)

export const removeProductFromWishlist = (userId, productId) =>
  api.delete(`${CUSTOMER_ENDPOINTS.WISHLIST}/${userId}/${productId}`)
