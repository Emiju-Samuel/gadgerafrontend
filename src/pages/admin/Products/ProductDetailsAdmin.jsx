import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ImageOff, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import { deleteProduct, getProductById } from '../../../api/productApi'
import { getErrorMessage } from '../../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const ProductDetailsSkeleton = () => (
  <div role="status" aria-live="polite" className="mx-auto max-w-5xl">
    <span className="sr-only">Loading product…</span>
    <Skeleton className="h-4 w-32" />
    <div className="mt-5 grid gap-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="flex flex-col">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-7 w-3/4" />
        <Skeleton className="mt-5 h-8 w-32" />
        <Skeleton className="mt-6 h-32 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-3 w-20" />
        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <Skeleton className="h-12 w-40 rounded-2xl" />
          <Skeleton className="h-12 w-28 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
)

const ProductDetailsAdmin = () => {
  const navigate = useNavigate()
  const { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getProductById(productId)
        if (isActive) setProduct(data ?? null)
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this product.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [productId])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      toast.success('Product deleted.')
      navigate('/admin/products')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete this product.'))
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <ProductDetailsSkeleton />
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed."
        action={
          <Button variant="secondary" onClick={() => navigate('/admin/products')}>
            Back to products
          </Button>
        }
      />
    )
  }

  const imageUrl = getProductImageUrl(product.byteImg)
  const stock = product.quantity == null ? null : Number(product.quantity)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-5 grid gap-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-2"
      >
        <div className="flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-72 w-full items-center justify-center text-slate-300">
              <ImageOff className="h-10 w-10" />
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            {product.categoryName || 'Uncategorised'}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{product.name}</h2>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-semibold tracking-tight text-ink">
              {formatCurrency(product.price)}
            </span>
            {stock == null ? null : stock <= 0 ? (
              <StatusBadge status="out-of-stock" label="Out of stock" />
            ) : stock <= 5 ? (
              <StatusBadge status="low-stock" label={`Low stock · ${stock}`} />
            ) : (
              <StatusBadge status="in-stock" label={`In stock · ${stock}`} />
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-canvas p-5">
            <h3 className="text-sm font-semibold text-ink">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
              {product.description || 'No description provided.'}
            </p>
          </div>

          <p className="mt-4 text-xs text-muted">Product ID #{product.id}</p>

          <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
            <Button
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
              leftIcon={<Pencil className="h-4 w-4" />}
            >
              Edit product
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-rose-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => (isDeleting ? null : setIsDeleteOpen(false))}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete product?"
        description={`“${product.name}” will be permanently removed.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default ProductDetailsAdmin
