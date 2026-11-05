import api from './axios'
import { ADMIN_ENDPOINTS } from '../utils/constants'

export const getAnalytics = () => api.get(ADMIN_ENDPOINTS.ANALYTICS)
