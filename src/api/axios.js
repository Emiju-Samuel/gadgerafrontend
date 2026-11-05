import axios from 'axios'
import { API_BASE_URL, AUTH_ENDPOINTS, AUTH_UNAUTHORIZED_EVENT } from '../utils/constants'
import { clearAuthStorage, getToken } from '../utils/storage'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

const isAuthEndpoint = (url = '') =>
  Object.values(AUTH_ENDPOINTS).some((endpoint) => url.includes(endpoint))

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url ?? ''

    // Expired / invalid token on a protected request: clear the session and let
    // AuthContext redirect to the login page (never a loop on /authenticate).
    if (status === 401 && !isAuthEndpoint(url) && getToken()) {
      clearAuthStorage()
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)

export default api
