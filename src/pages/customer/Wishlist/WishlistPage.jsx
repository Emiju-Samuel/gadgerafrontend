import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, ImageOff, ShoppingCart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import { useCart } from '../../../hooks/useCart'
import { useWishlist } from '../../../hooks/useWishlist'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const GridSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map((key) => (
      <div key={key} className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
        <Skeleton className="aspect-square rounded-none" />
        <div className="space-y-3 p-5">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    ))}
  </div>
)

const WishlistCard = ({ item, index, onAddToCart, onRemove, isRemoving }) => {
  const imageUrl = getProductImageUrl(item.returnedImg)
  const href = `/products/${item.productId}`

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft transition-shadow hover:shadow-lift"
    >
      <Link to={href} className="relative block aspect-square overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.productName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-10 w-10" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={href}
          className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors hover:text-brand-600"
        >
          {item.productName}
        </Link>

        {item.productDescription ? (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
            {item.productDescription}
          </p>
        ) : null}

        <p className="mt-4 text-lg font-semibold tracking-tight text-ink">
          {formatCurrency(item.price)}
        </p>

        <div className="mt-5 flex items-center gap-2">
          <Button
            className="flex-1"
            onClick={() => onAddToCart(item)}
            leftIcon={<ShoppingCart className="h-4 w-4" />}
          >
            Add to cart
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${item.productName} from wishlist`}
            onClick={() => onRemove(item.productId)}
            isLoading={isRemoving}
            className="text-muted hover:bg-rose-50 hover:text-rose-600"
          >
            {isRemoving ? null : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

const WishlistPage = () => {
  const { items, isLoading, error, refetch, remove, removingId } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (item) => {
    addItem({
      id: item.productId,
      name: item.productName,
      price: item.price,
      byteImg: item.returnedImg,
      quantity: null,
    })
    toast.success(`${item.productName} added to your cart.`)
  }

  const handleRemove = async (productId) => {
    try {
      await remove(productId)
      toast.success('Removed from your wishlist.')
    } catch {
      toast.error('Could not remove that item. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Wishlist</h1>
          <p className="mt-2 text-sm text-muted">
            {isLoading
              ? 'Loading your saved items…'
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved for later.`}
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Browse products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.header>

      <div className="mt-8">
        {isLoading ? (
          <GridSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-100 bg-rose-50/60 px-6 py-10 text-center">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="secondary" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart on any product to keep it here for later."
            action={
              <Link to="/products">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Explore the catalogue</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  index={index}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemove}
                  isRemoving={removingId === item.productId}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
