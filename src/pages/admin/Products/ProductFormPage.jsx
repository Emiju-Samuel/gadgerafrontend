import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import ProductForm from '../../../components/forms/ProductForm'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import FormSkeleton from '../../../components/common/FormSkeleton'
import { getCategories } from '../../../api/categoryApi'
import { createProduct, getProductById, updateProduct } from '../../../api/productApi'
import { getErrorMessage } from '../../../utils/helpers'
import { getProductImageUrl } from '../../../utils/formatters'

const EMPTY_VALUES = { name: '', price: '', quantity: '', categoryId: '', description: '' }

const ProductFormPage = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const isEdit = Boolean(productId)

  const [categories, setCategories] = useState([])
  const [defaultValues, setDefaultValues] = useState(EMPTY_VALUES)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const [categoriesResponse, productResponse] = await Promise.all([
          getCategories(),
          isEdit ? getProductById(productId) : Promise.resolve(null),
        ])
        if (!isActive) return

        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [])

        if (isEdit) {
          const product = productResponse?.data
          if (product) {
            setDefaultValues({
              name: product.name ?? '',
              price: product.price ?? '',
              quantity: product.quantity ?? '',
              categoryId: product.categoryId ?? '',
              description: product.description ?? '',
            })
            setExistingImageUrl(getProductImageUrl(product.byteImg) ?? '')
          } else {
            setNotFound(true)
          }
        }
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this product.'))
      } finally {
        if (isActive) setIsFetching(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [isEdit, productId])

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(productId, values)
        toast.success('Product updated.')
      } else {
        await createProduct(values)
        toast.success('Product created.')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save this product.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
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
        className="mt-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {isEdit ? 'Edit product' : 'New product'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isEdit
            ? 'Update the details of this product.'
            : 'Add a new product to your catalogue.'}
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          {isFetching ? (
            <FormSkeleton
              inputs={4}
              columns={2}
              textareaRows={5}
              showMedia
              label="Loading product…"
            />
          ) : notFound ? (
            <EmptyState
              title="Product not found"
              description="This product may have been removed."
              action={
                <Button variant="secondary" onClick={() => navigate('/admin/products')}>
                  Back to products
                </Button>
              }
            />
          ) : categories.length === 0 ? (
            <EmptyState
              title="Create a category first"
              description="Products belong to a category. Add one before creating a product."
              action={
                <Button onClick={() => navigate('/admin/categories/new')}>
                  New category
                </Button>
              }
            />
          ) : (
            <ProductForm
              categories={categories}
              defaultValues={defaultValues}
              existingImageUrl={existingImageUrl}
              requireImage={!isEdit}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/admin/products')}
              submitLabel={isEdit ? 'Save changes' : 'Create product'}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ProductFormPage
