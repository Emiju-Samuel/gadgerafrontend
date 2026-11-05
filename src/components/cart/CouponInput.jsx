import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Ticket, X } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import { getErrorMessage } from '../../utils/helpers'

const CouponInput = ({
  appliedCoupon,
  onApply,
  onRemove,
  disabled = false,
  helperText,
  placeholder = 'Coupon code',
}) => {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState('')

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"
      >
        <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-emerald-700">
          <Check className="h-4 w-4 shrink-0" />
          <span className="truncate">{appliedCoupon.name || appliedCoupon.code} applied</span>
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove coupon"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const value = code.trim()
    if (!value) {
      setError('Enter a coupon code')
      return
    }
    setIsApplying(true)
    setError('')
    try {
      await onApply(value)
      setCode('')
    } catch (err) {
      setError(getErrorMessage(err, 'This coupon could not be applied.'))
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            icon={Ticket}
            placeholder={placeholder}
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            disabled={disabled || isApplying}
            className="uppercase placeholder:normal-case"
            autoComplete="off"
            aria-label="Coupon code"
          />
        </div>
        <Button type="submit" variant="secondary" isLoading={isApplying} disabled={disabled}>
          Apply
        </Button>
      </div>

      {error ? (
        <p className="mt-2 text-xs font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-muted">{helperText}</p>
      ) : null}
    </form>
  )
}

export default CouponInput
