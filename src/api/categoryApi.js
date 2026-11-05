import api from './axios'
import { ADMIN_ENDPOINTS } from '../utils/constants'

export const getCategories = () => api.get(ADMIN_ENDPOINTS.CATEGORIES)

export const createCategory = (payload) => api.post(ADMIN_ENDPOINTS.CATEGORY, payload)

export const updateCategory = (categoryId, payload) =>
  api.put(`${ADMIN_ENDPOINTS.CATEGORY}/${categoryId}`, payload)

export const deleteCategory = (categoryId) =>
  api.delete(`${ADMIN_ENDPOINTS.CATEGORY}/${categoryId}`)
