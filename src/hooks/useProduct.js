import { useCallback, useEffect, useState } from 'react'
import { getCatalogProductById, getCatalogProducts } from '../api/catalogApi'
import { getProducts, searchProducts } from '../api/productApi'
import { getErrorMessage } from '../utils/helpers'

/**
 * Loads the admin product catalogue. When `searchTerm` is provided the backend
 * search endpoint is used, otherwise the full list is fetched.
 */
export const useAdminProducts = (searchTerm = '') => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async (term) => {
    try {
      const trimmed = (term ?? '').trim()
      const { data } = trimmed ? await searchProducts(trimmed) : await getProducts()
      setProducts(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load products.'))
      setProducts([])
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const run = async () => {
      await loadProducts(searchTerm)
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [searchTerm, loadProducts])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadProducts(searchTerm).finally(() => setIsLoading(false))
  }, [loadProducts, searchTerm])

  return { products, isLoading, error, refetch }
}

/**
 * Loads the public storefront catalogue. Works for guests and signed-in users
 * alike, so the product list stays browseable without authentication.
 */
export const useCatalogProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await getCatalogProducts()
      setProducts(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load products.'))
      setProducts([])
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const run = async () => {
      await loadProducts()
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [loadProducts])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadProducts().finally(() => setIsLoading(false))
  }, [loadProducts])

  return { products, isLoading, error, refetch }
}

/**
 * Loads a single product together with its FAQs and reviews from the public
 * catalogue. A missing product resolves to `notFound` rather than an error.
 */
export const useCatalogProduct = (productId) => {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [faqs, setFaqs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  const loadProduct = useCallback(async (id) => {
    try {
      const { data } = await getCatalogProductById(id)
      setProduct(data?.productDto ?? null)
      setReviews(Array.isArray(data?.reviewDtoList) ? data.reviewDtoList : [])
      setFaqs(Array.isArray(data?.faqDtoList) ? data.faqDtoList : [])
      setNotFound(!data?.productDto)
      setError('')
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true)
        setError('')
      } else {
        setError(getErrorMessage(err, 'Unable to load this product.'))
      }
      setProduct(null)
      setReviews([])
      setFaqs([])
    }
  }, [])

  useEffect(() => {
    if (!productId) return undefined
    let isActive = true
    const run = async () => {
      await loadProduct(productId)
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [productId, loadProduct])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadProduct(productId).finally(() => setIsLoading(false))
  }, [loadProduct, productId])

  return { product, reviews, faqs, isLoading, notFound, error, refetch }
}

export default useAdminProducts
