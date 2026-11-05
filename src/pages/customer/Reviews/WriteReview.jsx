import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Camera,
  CircleAlert,
  ImageOff,
  PackageSearch,
  Star,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import Textarea from '../../../components/common/Textarea'
import { getCatalogProductById } from '../../../api/catalogApi'
import { getOrderedProductsByOrderId, submitReview } from '../../../api/reviewApi'
import { useAuth } from '../../../hooks/useAuth'
import { useMyOrders } from '../../../hooks/useOrders'
import { cn, getErrorMessage } from '../../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']

const PageSkeleton = () => (
  <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
    <Skeleton className="h-5 w-32 rounded-2xl" />
    <div className="mt-6 grid gap-6 sm:grid-cols-[160px_1fr]">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  </div>
)

const RatingInput = ({ value, onChange, disabled }) => (
  <div className="flex items-center gap-3" role="radiogroup" aria-label="Your rating">
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded-xl p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Star
            className={cn(
              'h-9 w-9 transition-colors',
              star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300',
            )}
          />
        </button>
      ))}
    </div>
    {value > 0 ? (
      <span className="text-sm font-medium text-ink">{RATING_LABELS[value - 1]}</span>
    ) : null}
  </div>
)

const ProductPreview = ({ product, productId }) => {
  const imageUrl = getProductImageUrl(product?.byteImg)
  return (
    <div className="sm:w-40">
      <span className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-slate-50 text-slate-300">
        {imageUrl ? (
          <img src={imageUrl} alt={product?.name ?? 'Product'} className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-8 w-8" />
        )}
      </span>
      <Link
        to={`/products/${productId}`}
        className="mt-3 block text-sm font-semibold text-ink transition-colors hover:text-brand-600"
      >
        {product?.name ?? 'Product'}
      </Link>
      {product?.price != null ? (
        <p className="text-xs text-muted">{formatCurrency(product.price)}</p>
      ) : null}
    </div>
  )
}

const WriteReview = () => {
  const { user } = useAuth()
  const { productId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderIdParam = searchParams.get('orderId')

  const { orders, isLoading: ordersLoading, error: ordersError, refetch } = useMyOrders(user?.id)

  const [context, setContext] = useState(null)
  const [contextError, setContextError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const targetOrder = useMemo(() => {
    const delivered = orders.filter((order) => order.orderStatus === 'Delivered')
    const containsProduct = (order) =>
      (order.cartItems ?? []).some((item) => String(item.productId) === String(productId))
    if (orderIdParam) {
      const explicit = delivered.find((order) => String(order.id) === String(orderIdParam))
      if (explicit && containsProduct(explicit)) return explicit
    }
    return delivered.find(containsProduct) ?? null
  }, [orders, orderIdParam, productId])

  useEffect(() => {
    if (!targetOrder || !user?.id) return undefined
    let isActive = true
    const run = async () => {
      try {
        const [{ data: ordered }, { data: detail }] = await Promise.all([
          getOrderedProductsByOrderId(targetOrder.id),
          getCatalogProductById(productId),
        ])
        if (!isActive) return
        const orderedProduct =
          (ordered?.productDtoList ?? []).find((p) => String(p.id) === String(productId)) ?? null
        const existingReview =
          (detail?.reviewDtoList ?? []).find((r) => String(r.userId) === String(user.id)) ?? null
        setContext({ orderedProduct, existingReview })
        setContextError('')
      } catch (err) {
        if (isActive) setContextError(getErrorMessage(err, 'Unable to load this product.'))
      }
    }
    run()
    return () => {
      isActive = false
    }
  }, [targetOrder, productId, user, reloadKey])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Image must be 5MB or smaller.')
      return
    }
    const reader = new FileReader()
    reader.onload = () =>
      setImage({ file, preview: typeof reader.result === 'string' ? reader.result : null })
    reader.readAsDataURL(file)
  }

  const handleRetry = () => {
    refetch()
    setContextError('')
    setReloadKey((key) => key + 1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!rating) nextErrors.rating = 'Choose a rating'
    const trimmed = description.trim()
    if (trimmed.length < 10) nextErrors.description = 'Tell us a little more (at least 10 characters)'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    try {
      await submitReview({
        userId: user.id,
        productId,
        rating,
        description: trimmed,
        image: image?.file,
      })
      toast.success('Thanks! Your review has been published.')
      navigate(`/products/${productId}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to submit your review.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ordersLoading) return <PageSkeleton />

  if (ordersError) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{ordersError}</p>
          </div>
          <Button variant="secondary" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (!targetOrder) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <EmptyState
          icon={PackageSearch}
          title="This product isn't ready for review"
          description="You can only review products from orders that have been delivered to you."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/orders">
                <Button variant="secondary">View my orders</Button>
              </Link>
              <Link to={`/products/${productId}`}>
                <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to product</Button>
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  if (context === null && !contextError) return <PageSkeleton />

  if (contextError) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{contextError}</p>
          </div>
          <Button variant="secondary" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
      <Link
        to={`/products/${productId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to product
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-6"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Write a review</h1>
        <p className="mt-2 text-sm text-muted">
          Share your experience to help other shoppers. Reviewing order #{targetOrder.id}.
        </p>

        {context.existingReview ? (
          <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-soft">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
              <Star className="h-6 w-6 fill-emerald-500 text-emerald-500" />
            </span>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">
              You've already reviewed this product
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Thanks for sharing your thoughts — your review is already live on the product page.
            </p>
            <div className="mt-6">
              <Link to={`/products/${productId}`}>
                <Button variant="secondary">View your review</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <ProductPreview product={context.orderedProduct} productId={productId} />

              <form onSubmit={handleSubmit} className="flex-1 space-y-6" noValidate>
                <div>
                  <span className="mb-2 block text-sm font-medium text-ink">Your rating</span>
                  <RatingInput value={rating} onChange={setRating} disabled={isSubmitting} />
                  {errors.rating ? (
                    <p className="mt-2 text-xs font-medium text-rose-500">{errors.rating}</p>
                  ) : null}
                </div>

                <Textarea
                  label="Your review"
                  rows={5}
                  placeholder="What did you like or dislike? How does it perform day to day?"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  error={errors.description}
                />

                <div>
                  <span className="mb-2 block text-sm font-medium text-ink">Add a photo (optional)</span>
                  {image?.preview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={image.preview}
                        alt="Review attachment preview"
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => setImage(null)}
                        disabled={isSubmitting}
                      >
                        Remove photo
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-muted transition-colors hover:border-brand-300 hover:text-ink disabled:cursor-not-allowed"
                    >
                      <Camera className="h-5 w-5" />
                      Upload a photo of the product
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" isLoading={isSubmitting}>
                    Publish review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default WriteReview
