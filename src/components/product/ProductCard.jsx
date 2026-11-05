import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Heart, ImageOff, LoaderCircle, ShoppingCart } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../utils/formatters'

const ProductCard = ({
  product,
  to,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  isAddingToCart = false,
  justAdded = false,
  index = 0,
  className,
}) => {
  if (!product) return null

  const { id, name, price, categoryName, quantity } = product
  const href = to ?? `/products/${id}`
  const imageUrl = getProductImageUrl(product.byteImg)
  const stock = quantity == null ? null : Number(quantity)
  const inStock = stock == null ? true : stock > 0
  const lowStock = inStock && stock !== null && stock <= 5

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
        ease: 'easeOut',
      }}
      whileHover={{ y: -6 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={href} aria-label={name} className="block h-full w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageOff className="h-10 w-10" />
            </span>
          )}
        </Link>

        {categoryName ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm backdrop-blur">
            {categoryName}
          </span>
        ) : null}

        {onToggleWishlist ? (
          <motion.button
            type="button"
            onClick={() => onToggleWishlist(product)}
            whileTap={{ scale: 0.85 }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-rose-500"
          >
            <Heart className={cn('h-5 w-5', isWishlisted && 'fill-rose-500 text-rose-500')} />
          </motion.button>
        ) : null}

        {!inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink/85 px-4 py-1.5 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={href}
          className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors hover:text-brand-600"
        >
          {name}
        </Link>

        <p className="mt-2 text-xs font-medium">
          {lowStock ? (
            <span className="text-amber-600">Only {stock} left</span>
          ) : inStock ? (
            <span className="text-emerald-600">In stock</span>
          ) : (
            <span className="text-rose-500">Unavailable</span>
          )}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="text-lg font-semibold tracking-tight text-ink">
            {formatCurrency(price)}
          </span>

          {onAddToCart ? (
            <motion.button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={!inStock || isAddingToCart}
              whileTap={inStock ? { scale: 0.95 } : undefined}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors',
                inStock
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400',
              )}
            >
              {isAddingToCart ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : justAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              <span>{justAdded ? 'Added' : 'Add'}</span>
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
