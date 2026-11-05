import api from './axios'
import { ADMIN_ENDPOINTS } from '../utils/constants'

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } }

/**
 * The backend receives products as multipart form data (it stores the image
 * as a binary column), so every create/update is sent as FormData.
 */
export const buildProductFormData = ({ name, price, description, categoryId, quantity, image }) => {
  const formData = new FormData()
  formData.append('name', name ?? '')
  formData.append('price', price ?? '')
  formData.append('description', description ?? '')
  formData.append('categoryId', categoryId ?? '')
  formData.append('quantity', quantity ?? '')
  if (image) formData.append('img', image)
  return formData
}

export const getProducts = () => api.get(ADMIN_ENDPOINTS.PRODUCTS)

export const getProductById = (productId) => api.get(`${ADMIN_ENDPOINTS.PRODUCT}/${productId}`)

export const searchProducts = (name) =>
  api.get(`${ADMIN_ENDPOINTS.PRODUCT_SEARCH}/${encodeURIComponent(name)}`)

export const createProduct = (payload) =>
  api.post(ADMIN_ENDPOINTS.PRODUCT, buildProductFormData(payload), multipartConfig)

export const updateProduct = (productId, payload) =>
  api.put(`${ADMIN_ENDPOINTS.PRODUCT}/${productId}`, buildProductFormData(payload), multipartConfig)

export const deleteProduct = (productId) =>
  api.delete(`${ADMIN_ENDPOINTS.PRODUCT}/${productId}`)
