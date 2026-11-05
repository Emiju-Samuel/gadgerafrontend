import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CircleAlert,
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Skeleton from '../../../components/common/Skeleton'
import Textarea from '../../../components/common/Textarea'
import CartSummary from '../../../components/cart/CartSummary'
import CouponInput from '../../../components/cart/CouponInput'
import {
  addProductToCart,
  applyCoupon,
  clearServerCart,
  getCartByUserId,
  increaseProductQuantity,
  placeOrder,
} from '../../../api/cartApi'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import { cn, getErrorMessage } from '../../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const CHECKOUT_STEPS = ['Cart', 'Details', 'Confirmation']

const PAYMENT_OPTIONS = [
  {
    value: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Wallet,
  },
  {
    value: 'Card',
    label: 'Card',
    description: 'Pay securely by card',
    icon: CreditCard,
  },
]

const TRUST = [
  { icon: Truck, label: 'Free delivery over $99' },
  { icon: ShieldCheck, label: 'Secure, encrypted checkout' },
]

const checkoutSchema = z.object({
  address: z
    .string()
    .trim()
    .min(10, 'Please enter your full delivery address')
    .max(300, 'Address is a little too long'),
  orderDescription: z.string().trim().max(300, 'Keep the note under 300 characters'),
  payment: z.enum(['Cash on Delivery', 'Card']),
})

const CheckoutProgress = ({ current }) => (
  <ol className="flex items-center gap-2 sm:gap-4">
    {CHECKOUT_STEPS.map((label, index) => {
      const step = index + 1
      const isDone = step < current
      const isActive = step === current
      return (
        <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                isDone
                  ? 'bg-brand-600 text-white'
                  : isActive
                    ? 'bg-brand-50 text-brand-700 ring-2 ring-brand-500'
                    : 'bg-slate-100 text-muted',
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : step}
            </span>
            <span
              className={cn(
                'hidden text-sm font-medium sm:block',
                isActive ? 'text-ink' : 'text-muted',
              )}
            >
              {label}
            </span>
          </div>
          {index < CHECKOUT_STEPS.length - 1 ? (
            <span className={cn('h-px flex-1', isDone ? 'bg-brand-500' : 'bg-slate-200')} />
          ) : null}
        </li>
      )
    })}
  </ol>
)

const CheckoutForm = ({
  items,
  summary,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { address: '', orderDescription: '', payment: 'Cash on Delivery' },
    mode: 'onTouched',
  })

  const payment = useWatch({ control, name: 'payment' })
  const itemCount = items.length
  const subtotal = Number(summary?.totalAmount ?? 0)
  const discount = Number(summary?.discount ?? 0)
  const total = Number(summary?.amount ?? subtotal)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
      noValidate
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-ink">
            <MapPin className="h-4 w-4 text-muted" />
            Delivery details
          </h2>
          <div className="mt-5 space-y-5">
            <Textarea
              label="Delivery address"
              rows={3}
              placeholder="House, street, city, postal code"
              error={errors.address?.message}
              {...register('address')}
            />
            <Input
              label="Order note (optional)"
              placeholder="Gate code, delivery instructions…"
              error={errors.orderDescription?.message}
              {...register('orderDescription')}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-ink">
            <Wallet className="h-4 w-4 text-muted" />
            Payment method
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = payment === option.value
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                    isSelected
                      ? 'border-brand-500 bg-brand-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300',
                  )}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register('payment')}
                  />
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-muted',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="block text-xs text-muted">{option.description}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-ink">
            <ShoppingBag className="h-4 w-4 text-muted" />
            Order items
          </h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {items.map((item) => {
              const imageUrl = getProductImageUrl(item.image)
              return (
                <li key={item.productId} className="flex items-center gap-3 py-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="h-5 w-5 text-slate-300" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-xs text-muted">Qty {item.quantity}</span>
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary
          itemCount={itemCount}
          subtotal={subtotal}
          discount={discount}
          total={total}
          note="By placing your order you agree to our terms of service and privacy policy."
          action={
            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Place order
            </Button>
          }
        >
          <CouponInput
            appliedCoupon={couponCode ? { code: couponCode, name: summary?.couponName } : null}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            helperText="Have a code? Enter it to unlock a discount."
          />
        </CartSummary>

        <div className="mt-4 space-y-3">
          {TRUST.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-muted shadow-soft"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

const PreparingSkeleton = () => (
  <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-40 rounded-3xl" />
    </div>
    <Skeleton className="h-80 rounded-3xl" />
  </div>
)

const CheckoutPage = () => {
  const { user } = useAuth()
  const { items, couponCode, clearCart, setCouponCode, clearCoupon } = useCart()
  const navigate = useNavigate()

  const [phase, setPhase] = useState('preparing')
  const [summary, setSummary] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const prepareStartedRef = useRef(false)
  const placedRef = useRef(false)

  const prepare = useCallback(
    async (cartItems, code) => {
      if (!user?.id) return
      try {
        // Mirror the local cart onto the server's active order, then read back
        // the authoritative totals (and the discount if a coupon applies).
        await clearServerCart(user.id)
        for (const item of cartItems) {
          try {
            await addProductToCart({ userId: user.id, productId: item.productId })
          } catch (error) {
            if (error?.response?.status !== 409) throw error
          }
          for (let i = 1; i < item.quantity; i += 1) {
            await increaseProductQuantity({ userId: user.id, productId: item.productId })
          }
        }

        let order = (await getCartByUserId(user.id)).data
        if (code) {
          try {
            order = (await applyCoupon(user.id, code)).data
          } catch {
            clearCoupon()
          }
        }
        setSummary(order)
        setPhase('ready')
      } catch (error) {
        setErrorMsg(getErrorMessage(error, 'We could not prepare your order. Please try again.'))
        setPhase('error')
      }
    },
    [user, clearCoupon],
  )

  useEffect(() => {
    if (placedRef.current) return
    if (!items.length) {
      navigate('/cart', { replace: true })
      return
    }
    if (!user?.id || prepareStartedRef.current) return
    prepareStartedRef.current = true
    prepare(items, couponCode)
  }, [items, couponCode, user, navigate, prepare])

  const handleApplyCoupon = async (code) => {
    const { data } = await applyCoupon(user.id, code)
    setSummary(data)
    setCouponCode(code)
    toast.success(`Coupon “${data.couponName ?? code}” applied.`)
  }

  const handleRemoveCoupon = () => {
    clearCoupon()
    setPhase('preparing')
    prepare(items, null)
  }

  const handleRetry = () => {
    setPhase('preparing')
    prepare(items, couponCode)
  }

  const handlePlaceOrder = async (values) => {
    setIsPlacing(true)
    try {
      const { data } = await placeOrder({
        userId: user.id,
        address: values.address,
        orderDescription: values.orderDescription,
        payment: values.payment,
      })
      placedRef.current = true
      setPlacedOrder(data)
      setPhase('placed')
      clearCart()
      toast.success('Your order has been placed.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not place your order. Please try again.'))
    } finally {
      setIsPlacing(false)
    }
  }

  if (phase === 'placed' && placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-soft sm:p-12"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          >
            <Check className="h-8 w-8" />
          </motion.span>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Thanks for your order
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            We've emailed your receipt and your gadgets are being prepared for dispatch.
          </p>

          <dl className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <dt className="text-xs text-muted">Order</dt>
              <dd className="text-sm font-semibold text-ink">#{placedOrder.id}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <dt className="text-xs text-muted">Total paid</dt>
              <dd className="text-sm font-semibold text-ink">
                {formatCurrency(placedOrder.amount)}
              </dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-50 px-4 py-3">
              <dt className="text-xs text-muted">Tracking ID</dt>
              <dd className="truncate text-sm font-medium text-ink">{placedOrder.trackingId}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {placedOrder.trackingId ? (
              <Link to={`/track-order/${placedOrder.trackingId}`}>
                <Button className="w-full sm:w-auto">Track your order</Button>
              </Link>
            ) : null}
            <Link to="/products">
              <Button variant="secondary" className="w-full sm:w-auto">
                Continue shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted">
          Review your items, add a delivery address and place your order.
        </p>
        <div className="mt-8 max-w-2xl">
          <CheckoutProgress current={2} />
        </div>
      </motion.header>

      {phase === 'preparing' ? <PreparingSkeleton /> : null}

      {phase === 'error' ? (
        <div className="mt-8">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-rose-100 bg-rose-50/60 px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <CircleAlert className="h-7 w-7" />
            </span>
            <p className="max-w-md text-sm text-rose-700">
              {errorMsg || 'We could not prepare your order. Please try again.'}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleRetry}>
                Try again
              </Button>
              <Link to="/cart">
                <Button variant="ghost">Back to cart</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {phase === 'ready' ? (
        <CheckoutForm
          items={items}
          summary={summary}
          couponCode={couponCode}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          onSubmit={handlePlaceOrder}
          isSubmitting={isPlacing}
        />
      ) : null}
    </div>
  )
}

export default CheckoutPage
