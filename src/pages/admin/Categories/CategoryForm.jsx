import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import CategoryForm from '../../../components/forms/CategoryForm'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import FormSkeleton from '../../../components/common/FormSkeleton'
import { createCategory, getCategories, updateCategory } from '../../../api/categoryApi'
import { getErrorMessage } from '../../../utils/helpers'

const CategoryFormPage = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const isEdit = Boolean(categoryId)

  const [defaultValues, setDefaultValues] = useState({ name: '', description: '' })
  const [isFetching, setIsFetching] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEdit) return undefined
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getCategories()
        const category = (Array.isArray(data) ? data : []).find(
          (item) => String(item.id) === String(categoryId),
        )
        if (isActive) {
          if (category) {
            setDefaultValues({
              name: category.name ?? '',
              description: category.description ?? '',
            })
          } else {
            setNotFound(true)
          }
        }
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this category.'))
      } finally {
        if (isActive) setIsFetching(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [categoryId, isEdit])

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() ?? '',
      }
      if (isEdit) {
        await updateCategory(categoryId, payload)
        toast.success('Category updated.')
      } else {
        await createCategory(payload)
        toast.success('Category created.')
      }
      navigate('/admin/categories')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save this category.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/categories"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {isEdit ? 'Edit category' : 'New category'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isEdit
            ? 'Update the details of this category.'
            : 'Add a new category to organise your catalogue.'}
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          {isFetching ? (
            <FormSkeleton inputs={1} textareaRows={4} label="Loading category…" />
          ) : notFound ? (
            <EmptyState
              title="Category not found"
              description="This category may have been removed."
              action={
                <Button variant="secondary" onClick={() => navigate('/admin/categories')}>
                  Back to categories
                </Button>
              }
            />
          ) : (
            <CategoryForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/admin/categories')}
              submitLabel={isEdit ? 'Save changes' : 'Create category'}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CategoryFormPage
