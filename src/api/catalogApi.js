import api from './axios'
import { CATALOG_ENDPOINTS } from '../utils/constants'

export const getCatalogProducts = () => api.get(CATALOG_ENDPOINTS.PRODUCTS)

export const searchCatalogProducts = (name) =>
  api.get(`${CATALOG_ENDPOINTS.SEARCH}/${encodeURIComponent(name)}`)

export const getCatalogProductById = (productId) =>
  api.get(`${CATALOG_ENDPOINTS.PRODUCTS}/${productId}`)
