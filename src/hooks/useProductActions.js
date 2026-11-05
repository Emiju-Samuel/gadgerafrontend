import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  addProductToWishlist,
  getWishlistByUserId,
  removeProductFromWishlist,
} from '../api/wishlistApi'
import { useAuth } from './useAuth'
import { useCart } from './useCart'
import { getErrorMessage } from '../utils/helpers'

const EMPTY_SET = new Set()
const FEEDBACK_TIMEOUT = 1600

const stockOf = (product) => (product?.quantity == null ? null : Number(product.quantity))

/**
 * Shared storefront behaviour for product surfaces.
 *
 * Adding to the cart works for guests (the cart is local until checkout), while
 * the wishlist is an authenticated customer feature.
 */
export const useProductActions = () => {
  const { isAuthenticated, isCustomer, user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [wishlist, setWishlist] = useState({ userId: null, ids: EMPTY_SET })
  const [justAddedId, setJustAddedId] = useState(null)
  const [wishlistPendingId, setWishlistPendingId] = useState(null)

  useEffect(() => {
    if (!isCustomer || !user?.id) return undefined
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getWishlistByUserId(user.id)
        if (!isActive) return
        setWishlist({
          userId: user.id,
          ids: new Set((data ?? []).map((item) => item.productId)),
        })
      } catch {
        // The wishlist indicator is a nice-to-have; ignore load failures.
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [isCustomer, user?.id])

  const wishlistIds = wishlist.userId === user?.id ? wishlist.ids : EMPTY_SET

  const requireCustomer = useCallback(() => {
    if (!isAuthenticated) {
      toast.info('Sign in to save items to your wishlist.')
      navigate('/login', { state: { from: location } })
      return false
    }
    if (!isCustomer) {
      toast.info('Sign in as a customer to use the wishlist.')
      return false
    }
    return true
  }, [isAuthenticated, isCustomer, navigate, location])

  const flashAdded = useCallback((productId) => {
    setJustAddedId(productId)
    window.setTimeout(
      () => setJustAddedId((prev) => (prev === productId ? null : prev)),
      FEEDBACK_TIMEOUT,
    )
  }, [])

  const addToCart = useCallback(
    (product) => {
      if (!product?.id) return
      const stock = stockOf(product)
      if (stock !== null && stock <= 0) {
        toast.error('This product is out of stock.')
        return
      }
      addItem(product)
      toast.success(`${product.name} added to your cart.`)
      flashAdded(product.id)
    },
    [addItem, flashAdded],
  )

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product?.id) return
      if (!requireCustomer()) return

      const isSaved = wishlistIds.has(product.id)
      setWishlistPendingId(product.id)
      try {
        if (isSaved) {
          await removeProductFromWishlist(user.id, product.id)
          setWishlist((prev) => {
            const next = new Set(prev.userId === user.id ? prev.ids : EMPTY_SET)
            next.delete(product.id)
            return { userId: user.id, ids: next }
          })
          toast.success(`${product.name} removed from your wishlist.`)
        } else {
          await addProductToWishlist({ userId: user.id, productId: product.id })
          setWishlist((prev) => {
            const next = new Set(prev.userId === user.id ? prev.ids : EMPTY_SET)
            next.add(product.id)
            return { userId: user.id, ids: next }
          })
          toast.success(`${product.name} saved to your wishlist.`)
        }
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            isSaved ? 'Could not remove that item.' : 'Could not update your wishlist.',
          ),
        )
      } finally {
        setWishlistPendingId(null)
      }
    },
    [requireCustomer, user, wishlistIds],
  )

  return {
    wishlistIds,
    justAddedId,
    wishlistPendingId,
    addToCart,
    toggleWishlist,
  }
}

export default useProductActions
