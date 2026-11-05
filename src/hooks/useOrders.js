import { useCallback, useEffect, useState } from 'react'
import { getMyOrders } from '../api/cartApi'
import { getOrderByTrackingId, getPlacedOrders } from '../api/orderApi'
import { getErrorMessage } from '../utils/helpers'

/** Loads the orders an admin can manage (Placed / Shipped / Delivered). */
export const useAdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      const { data } = await getPlacedOrders()
      setOrders(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load orders.'))
      setOrders([])
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const run = async () => {
      await loadOrders()
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [loadOrders])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadOrders().finally(() => setIsLoading(false))
  }, [loadOrders])

  return { orders, isLoading, error, refetch }
}

/** Loads the signed-in customer's own placed orders. */
export const useMyOrders = (userId) => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    if (!userId) return
    try {
      const { data } = await getMyOrders(userId)
      setOrders(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load your orders.'))
      setOrders([])
    }
  }, [userId])

  useEffect(() => {
    let isActive = true
    const run = async () => {
      await loadOrders()
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [loadOrders])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadOrders().finally(() => setIsLoading(false))
  }, [loadOrders])

  return { orders, isLoading, error, refetch }
}

/**
 * Resolves a public order from its tracking id. `attempt` lets the caller
 * re-run the lookup (e.g. a "try again" action) for the same id.
 */
export const useOrderTracking = (trackingId, attempt = 0) => {
  const [result, setResult] = useState({ key: null, order: null, notFound: false, error: '' })
  const key = trackingId ? `${trackingId}#${attempt}` : null

  useEffect(() => {
    if (!key || !trackingId) return undefined
    let isActive = true
    const run = async () => {
      try {
        const { data } = await getOrderByTrackingId(trackingId)
        if (!isActive) return
        setResult({ key, order: data ?? null, notFound: !data, error: '' })
      } catch (err) {
        if (!isActive) return
        if (err?.response?.status === 404) {
          setResult({ key, order: null, notFound: true, error: '' })
        } else {
          setResult({
            key,
            order: null,
            notFound: false,
            error: getErrorMessage(err, 'Unable to track this order right now.'),
          })
        }
      }
    }
    run()
    return () => {
      isActive = false
    }
  }, [key, trackingId])

  const isCurrent = Boolean(key) && result.key === key

  return {
    order: isCurrent ? result.order : null,
    notFound: isCurrent ? result.notFound : false,
    error: isCurrent ? result.error : '',
    isLoading: Boolean(key) && !isCurrent,
  }
}

export default useAdminOrders
