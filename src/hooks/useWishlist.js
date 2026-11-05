import { useCallback, useEffect, useMemo, useState } from 'react'
import { getWishlistByUserId, removeProductFromWishlist } from '../api/wishlistApi'
import { useAuth } from './useAuth'
import { getErrorMessage } from '../utils/helpers'

/** Loads and mutates the signed-in customer's wishlist. */
export const useWishlist = () => {
  const { user, isCustomer } = useAuth()

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  const loadWishlist = useCallback(async () => {
    if (!isCustomer || !user?.id) return
    try {
      const { data } = await getWishlistByUserId(user.id)
      setItems(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load your wishlist.'))
      setItems([])
    }
  }, [isCustomer, user])

  useEffect(() => {
    let isActive = true
    const run = async () => {
      await loadWishlist()
      if (isActive) setIsLoading(false)
    }
    run()
    return () => {
      isActive = false
    }
  }, [loadWishlist])

  const refetch = useCallback(() => {
    setIsLoading(true)
    return loadWishlist().finally(() => setIsLoading(false))
  }, [loadWishlist])

  const remove = useCallback(
    async (productId) => {
      if (!user?.id) return
      setRemovingId(productId)
      try {
        await removeProductFromWishlist(user.id, productId)
        setItems((prev) => prev.filter((item) => item.productId !== productId))
      } finally {
        setRemovingId(null)
      }
    },
    [user],
  )

  const productIds = useMemo(() => new Set(items.map((item) => item.productId)), [items])

  return { items, productIds, isLoading, error, refetch, remove, removingId }
}

export default useWishlist
