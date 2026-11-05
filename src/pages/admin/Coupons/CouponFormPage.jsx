import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import CouponForm from '../../../components/forms/CouponForm'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import FormSkeleton from '../../../components/common/FormSkeleton'
import { createCoupon, getCoupons, updateCoupon } from '../../../api/couponApi'
import { getErrorMessage } from '../../../utils/helpers'

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const CouponFormPage = () => {
  const navigate = useNavigate()
  const { couponId } = useParams()
  const isEdit = Boolean(couponId)

  const [defaultValues, setDefaultValues] = useState({
    name: '',
    code: '',
    discount: '',
    expirationDate: '',
  })
  const [isFetching, setIsFetching] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEdit) return undefined
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getCoupons()
        const coupon = (Array.isArray(data) ? data : []).find(
          (item) => String(item.id) === String(couponId),
        )
        if (isActive) {
          if (coupon) {
            setDefaultValues({
              name: coupon.name ?? '',
              code: coupon.code ?? '',
              discount: coupon.discount ?? '',
              expirationDate: toDateInputValue(coupon.expirationDate),
            })
          } else {
            setNotFound(true)
          }
        }
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this coupon.'))
      } finally {
        if (isActive) setIsFetching(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [couponId, isEdit])

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
        discount: Number(values.discount),
        expirationDate: new Date(values.expirationDate).toISOString(),
      }
      if (isEdit) {
        await updateCoupon(couponId, payload)
        toast.success('Coupon updated.')
      } else {
        await createCoupon(payload)
        toast.success('Coupon created.')
      }
      navigate('/admin/coupons')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save this coupon.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/coupons"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to coupons
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {isEdit ? 'Edit coupon' : 'New coupon'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isEdit ? 'Update this promotional code.' : 'Create a new promotional code.'}
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          {isFetching ? (
            <FormSkeleton inputs={4} columns={2} label="Loading coupon…" />
          ) : notFound ? (
            <EmptyState
              title="Coupon not found"
              description="This coupon may have been removed."
              action={
                <Button variant="secondary" onClick={() => navigate('/admin/coupons')}>
                  Back to coupons
                </Button>
              }
            />
          ) : (
            <CouponForm
              defaultValues={defaultValues}
              allowPast={isEdit}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/admin/coupons')}
              submitLabel={isEdit ? 'Save changes' : 'Create coupon'}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CouponFormPage
