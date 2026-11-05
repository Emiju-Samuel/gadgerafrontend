import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import FaqForm from '../../../components/forms/FaqForm'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import FormSkeleton from '../../../components/common/FormSkeleton'
import { getProducts } from '../../../api/productApi'
import { createFaq, getFaqs, updateFaq } from '../../../api/faqApi'
import { getErrorMessage } from '../../../utils/helpers'

const FaqFormPage = () => {
  const navigate = useNavigate()
  const { faqId } = useParams()
  const isEdit = Boolean(faqId)

  const [products, setProducts] = useState([])
  const [defaultValues, setDefaultValues] = useState({ productId: '', question: '', answer: '' })
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const [productsResponse, faqsResponse] = await Promise.all([
          getProducts(),
          isEdit ? getFaqs() : Promise.resolve(null),
        ])
        if (!isActive) return

        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : [])

        if (isEdit) {
          const faq = (Array.isArray(faqsResponse.data) ? faqsResponse.data : []).find(
            (item) => String(item.id) === String(faqId),
          )
          if (faq) {
            setDefaultValues({
              productId: faq.productId ?? '',
              question: faq.question ?? '',
              answer: faq.answer ?? '',
            })
          } else {
            setNotFound(true)
          }
        }
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this FAQ.'))
      } finally {
        if (isActive) setIsFetching(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [faqId, isEdit])

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const payload = { question: values.question.trim(), answer: values.answer.trim() }
      if (isEdit) {
        await updateFaq(faqId, { ...payload, productId: Number(values.productId) })
        toast.success('FAQ updated.')
      } else {
        await createFaq(Number(values.productId), payload)
        toast.success('FAQ created.')
      }
      navigate('/admin/faqs')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save this FAQ.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/faqs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to FAQs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {isEdit ? 'Edit FAQ' : 'New FAQ'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isEdit ? 'Update this question and answer.' : 'Add a question and answer for a product.'}
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          {isFetching ? (
            <FormSkeleton inputs={2} textareaRows={5} label="Loading FAQ…" />
          ) : notFound ? (
            <EmptyState
              title="FAQ not found"
              description="This FAQ may have been removed."
              action={
                <Button variant="secondary" onClick={() => navigate('/admin/faqs')}>
                  Back to FAQs
                </Button>
              }
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="Create a product first"
              description="FAQs are attached to a product. Add one before creating an FAQ."
              action={
                <Button onClick={() => navigate('/admin/products/new')}>New product</Button>
              }
            />
          ) : (
            <FaqForm
              products={products}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/admin/faqs')}
              submitLabel={isEdit ? 'Save changes' : 'Create FAQ'}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default FaqFormPage
