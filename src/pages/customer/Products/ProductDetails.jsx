import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Heart,
  PackageSearch,
  Pencil,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from 'lucide-react'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import ProductImageGallery from '../../../components/product/ProductImageGallery'
import { useCatalogProduct } from '../../../hooks/useProduct'
import { useProductActions } from '../../../hooks/useProductActions'
import { cn, getInitials } from '../../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const TRUST = [
  { icon: Truck, title: 'Free delivery', text: 'On orders over $99' },
  { icon: ShieldCheck, title: '2-year warranty', text: 'Covered by Gadgera' },
  { icon: Zap, title: 'Fast dispatch', text: 'Ships within 24 hours' },
]

const StarRating = ({ rating = 0, size = 'md', className }) => {
  const value = Math.max(0, Math.min(5, Number(rating) || 0))
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            dimension,
            star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300',
          )}
        />
      ))}
    </span>
  )
}

const FaqAccordionItem = ({ faq }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink">{faq.question}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 pr-8 text-sm leading-relaxed text-muted">{faq.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

const ReviewCard = ({ review }) => {
  const name = review.username || 'Anonymous'
  const imageUrl = getProductImageUrl(review.returnedImg)
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {getInitials(name)}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{name}</p>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>
      {review.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{review.description}</p>
      ) : null}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Review by ${name}`}
          className="mt-3 h-24 w-24 rounded-2xl object-cover"
        />
      ) : null}
    </div>
  )
}

const RatingSummary = ({ reviews }) => {
  const total = reviews.length
  const average = total
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / total
    : 0
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => Math.round(Number(review.rating)) === star).length,
  }))

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
      <div className="text-center sm:w-40">
        <p className="text-4xl font-semibold tracking-tight text-ink">{average.toFixed(1)}</p>
        <StarRating rating={average} className="mt-2 justify-center" />
        <p className="mt-1 text-xs text-muted">
          {total} {total === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="flex-1 space-y-2">
        {distribution.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            <span className="w-8 text-xs text-muted">{star}★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <span
                className="block h-full rounded-full bg-amber-400"
                style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
              />
            </span>
            <span className="w-6 text-right text-xs text-muted">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DetailSkeleton = () => (
  <div className="grid gap-10 lg:grid-cols-2">
    <Skeleton className="aspect-square rounded-3xl" />
    <div className="space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  </div>
)

const ProductDetails = () => {
  const { productId } = useParams()
  const { product, reviews, faqs, isLoading, notFound, error, refetch } =
    useCatalogProduct(productId)
  const { wishlistIds, justAddedId, wishlistPendingId, addToCart, toggleWishlist } =
    useProductActions()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <DetailSkeleton />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          description="This product may have been removed, or the link is incorrect."
          action={
            <Link to="/products">
              <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to catalogue
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-left text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error || 'Unable to load this product.'}</p>
          </div>
          <Button variant="secondary" onClick={refetch}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  const imageUrl = getProductImageUrl(product.byteImg)
  const stock = product.quantity == null ? null : Number(product.quantity)
  const inStock = stock == null ? true : stock > 0
  const lowStock = inStock && stock !== null && stock <= 5
  const isWishlisted = wishlistIds.has(product.id)
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
    : 0

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link to="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="transition-colors hover:text-ink">
          Products
        </Link>
        <span>/</span>
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductImageGallery images={[imageUrl]} alt={product.name} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {product.categoryName ? (
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {product.categoryName}
            </span>
          ) : null}

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          {reviews.length ? (
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2">
              <StarRating rating={averageRating} size="sm" />
              <span className="text-sm text-muted">
                {averageRating.toFixed(1)} · {reviews.length}{' '}
                {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </a>
          ) : null}

          <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
            {formatCurrency(product.price)}
          </p>

          <p
            className={cn(
              'mt-2 text-sm font-medium',
              !inStock ? 'text-rose-500' : lowStock ? 'text-amber-600' : 'text-emerald-600',
            )}
          >
            {!inStock
              ? 'Out of stock'
              : lowStock
                ? `Only ${stock} left in stock`
                : 'In stock and ready to ship'}
          </p>

          {product.description ? (
            <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="sm:flex-1"
              disabled={!inStock}
              onClick={() => addToCart(product)}
              leftIcon={
                justAddedId === product.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )
              }
            >
              {justAddedId === product.id ? 'Added to cart' : inStock ? 'Add to cart' : 'Unavailable'}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => toggleWishlist(product)}
              isLoading={wishlistPendingId === product.id}
              leftIcon={
                <Heart className={cn('h-5 w-5', isWishlisted && 'fill-rose-500 text-rose-500')} />
              }
            >
              {isWishlisted ? 'Saved' : 'Wishlist'}
            </Button>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="text-xs text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {faqs.length ? (
        <section className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Everything buyers usually want to know before checkout.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-white px-6 shadow-soft">
            {faqs.map((faq) => (
              <FaqAccordionItem key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="reviews" className="mt-14 scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Customer reviews</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Hear from people who already own this product.
            </p>
          </div>
          <Link to={`/products/${product.id}/review`}>
            <Button variant="secondary" leftIcon={<Pencil className="h-4 w-4" />}>
              Write a review
            </Button>
          </Link>
        </div>

        {reviews.length ? (
          <>
            <div className="mt-6">
              <RatingSummary reviews={reviews} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="Be the first to share your experience with this product."
              action={
                <Link to={`/products/${product.id}/review`}>
                  <Button leftIcon={<Pencil className="h-4 w-4" />}>Write a review</Button>
                </Link>
              }
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default ProductDetails
