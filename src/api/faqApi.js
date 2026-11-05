import api from './axios'
import { ADMIN_ENDPOINTS } from '../utils/constants'

export const getFaqs = () => api.get(ADMIN_ENDPOINTS.FAQS)

export const createFaq = (productId, payload) =>
  api.post(`${ADMIN_ENDPOINTS.FAQ}/${productId}`, payload)

export const updateFaq = (faqId, payload) => api.put(`${ADMIN_ENDPOINTS.FAQ}/${faqId}`, payload)

export const deleteFaq = (faqId) => api.delete(`${ADMIN_ENDPOINTS.FAQ}/${faqId}`)
