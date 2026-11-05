import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CreditCard,
  ImageOff,
  MapPin,
  PackageSearch,
  Search,
  Truck,
} from 'lucide-react'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Input from '../../../components/common/Input'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import OrderTimeline from '../../../components/orders/OrderTimeline'
import { useOrderTracking } from '../../../hooks/useOrders'
import { formatCurrency, formatDateTime, getProductImageUrl } from '../../../utils/formatters'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const TrackingResultSkeleton = () => (
  <div className="mt-6 space-y-6">
    <Skeleton className="h-40 rounded-3xl" />
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-64 rounded-3xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  </div>
)

const TrackingResult = ({ order }) => {
  const items = order.cartItems ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-6 space-y-6"
    >
      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-ink">Order #{order.id}</h2>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="mt-1 text-sm text-muted">Placed on {formatDateTime(order.date)}</p>
          </div>
          <span className="text-sm text-muted">For {order.userName || 'you'}</span>
        </div>

        <div className="mt-8 overflow-x-auto pb-1">
          <OrderTimeline status={order.orderStatus} className="min-w-[520px]" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-ink">Items ({items.length})</h3>
          </div>
          {items.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted">
              No line items were recorded for this order.
            </p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {items.map((item) => {
                const imageUrl = getProductImageUrl(item.returnedImg)
                const quantity = Number(item.quantity ?? 0)
                const lineTotal = Number(item.price ?? 0) * quantity
                return (
                  <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-300">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageOff className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{item.productName}</p>
                      <p className="text-xs text-muted">
                        Qty {quantity} · {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      {formatCurrency(lineTotal)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-ink">Summary</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatCurrency(order.totalAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">
                  Discount{order.couponName ? ` (${order.couponName})` : ''}
                </dt>
                <dd className="font-medium text-emerald-600">-{formatCurrency(order.discount)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-semibold text-ink">{formatCurrency(order.amount)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-ink">Delivery</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <span className="text-ink">{order.address || '—'}</span>
              </li>
              <li className="flex gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <span className="text-ink">{order.payment || '—'}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  )
}

const OrderTracking = () => {
  const { trackingId } = useParams()
  const navigate = useNavigate()

  const [input, setInput] = useState(trackingId ?? '')
  const [formError, setFormError] = useState('')
  const [attempt, setAttempt] = useState(0)

  const { order, isLoading, notFound, error } = useOrderTracking(trackingId, attempt)

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (!UUID_PATTERN.test(value)) {
      setFormError('Enter a valid tracking ID (a UUID from your order confirmation).')
      return
    }
    setFormError('')
    if (value.toLowerCase() === (trackingId ?? '').toLowerCase()) {
      setAttempt((count) => count + 1)
    } else {
      navigate(`/track-order/${value}`)
    }
  }

  const hasQuery = Boolean(trackingId)

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
          <Truck className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Track your order
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Enter the tracking ID from your order confirmation email to see live delivery progress —
          no sign-in required.
        </p>
      </motion.header>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
        className="mx-auto mt-8 max-w-2xl"
        noValidate
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            icon={Search}
            placeholder="e.g. 3f1a9c2e-0b4d-4f6a-9c1e-2d7b8a5f0e11"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            containerClassName="flex-1"
            aria-label="Tracking ID"
            autoComplete="off"
            error={formError}
          />
          <Button type="submit" size="lg" isLoading={isLoading} className="sm:w-auto">
            Track order
          </Button>
        </div>
      </motion.form>

      {!hasQuery ? (
        <div className="mx-auto mt-12 max-w-2xl">
          <EmptyState
            icon={PackageSearch}
            title="Ready when you are"
            description="Paste your tracking ID above and we'll show you exactly where your order is."
          />
        </div>
      ) : isLoading ? (
        <TrackingResultSkeleton />
      ) : error ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-rose-100 bg-rose-50/60 px-6 py-10 text-center">
          <p className="text-sm text-rose-700">{error}</p>
          <Button variant="secondary" onClick={() => setAttempt((count) => count + 1)}>
            Try again
          </Button>
        </div>
      ) : notFound ? (
        <div className="mx-auto mt-12 max-w-2xl">
          <EmptyState
            icon={PackageSearch}
            title="No order found"
            description="We couldn't find an order with that tracking ID. Double-check the ID and try again."
          />
        </div>
      ) : order ? (
        <TrackingResult order={order} />
      ) : null}
    </div>
  )
}

export default OrderTracking
