import api from './axios'
import { CUSTOMER_ENDPOINTS } from '../utils/constants'

// Products a customer ordered for a given order (used to gate reviews).
export const getOrderedProductsByOrderId = (orderId) =>
  api.get(`${CUSTOMER_ENDPOINTS.ORDERED_PRODUCTS}/${orderId}`)

/**
 * Submits a review as multipart/form-data because the backend accepts an
 * optional image upload. Axios sets the correct multipart boundary itself.
 */
export const submitReview = ({ userId, productId, rating, description, image }) => {
  const formData = new FormData()
  formData.append('userId', userId)
  formData.append('productId', productId)
  formData.append('rating', rating)
  if (description) formData.append('description', description)
  if (image) formData.append('img', image)
  return api.post(CUSTOMER_ENDPOINTS.REVIEW, formData)
}
