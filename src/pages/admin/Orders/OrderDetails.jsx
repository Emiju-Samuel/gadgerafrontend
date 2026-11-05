import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ClipboardList,
  CreditCard,
  ImageOff,
  MapPin,
  PackageCheck,
  Truck,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import { getOrderById, updateOrderStatus } from '../../../api/orderApi'
import { cn, getErrorMessage } from '../../../utils/helpers'
import { formatCurrency, formatDateTime, getProductImageUrl } from '../../../utils/formatters'

const TIMELINE = [
  { key: 'Placed', label: 'Placed', icon: ClipboardList },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck },
]

const nextStatusFor = (status) => {
  if (status === 'Placed') return 'Shipped'
  if (status === 'Shipped') return 'Delivered'
  return null
}

const OrderDetailsSkeleton = () => (
  <div role="status" aria-live="polite" className="mx-auto max-w-5xl">
    <span className="sr-only">Loading order…</span>
    <Skeleton className="h-4 w-32" />
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-52" />
      </div>
      <Skeleton className="h-12 w-40 rounded-2xl" />
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-60 w-full rounded-3xl" />
        <Skeleton className="h-60 w-full rounded-3xl" />
      </div>
    </div>
  </div>
)

const OrderDetails = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [confirmStatus, setConfirmStatus] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getOrderById(orderId)
        if (isActive) setOrder(data ?? null)
      } catch (err) {
        if (isActive) toast.error(getErrorMessage(err, 'Unable to load this order.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [orderId])

  const handleStatusChange = async () => {
    if (!order || !confirmStatus) return
    setIsUpdating(true)
    try {
      const { data } = await updateOrderStatus(order.id, confirmStatus)
      setOrder(data)
      toast.success(`Order marked as ${confirmStatus.toLowerCase()}.`)
      setConfirmStatus(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update the order status.'))
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may have been removed."
        action={
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>
            Back to orders
          </Button>
        }
      />
    )
  }

  const items = order.cartItems ?? []
  const activeIndex = TIMELINE.findIndex((step) => step.key === order.orderStatus)
  const nextStatus = nextStatusFor(order.orderStatus)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Order #{order.id}</h2>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="mt-1 text-sm text-muted">Placed on {formatDateTime(order.date)}</p>
          </div>

          {nextStatus ? (
            <Button onClick={() => setConfirmStatus(nextStatus)}>
              Mark as {nextStatus.toLowerCase()}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              <Check className="h-4 w-4" />
              Order completed
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-ink">Status</h3>
              <div className="mt-5 flex items-center">
                {TIMELINE.map((step, index) => {
                  const isReached = activeIndex >= 0 && index <= activeIndex
                  const Icon = step.icon
                  return (
                    <div key={step.key} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-2xl transition-colors',
                            isReached
                              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                              : 'bg-slate-100 text-slate-400',
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span
                          className={cn(
                            'text-xs font-medium',
                            isReached ? 'text-ink' : 'text-muted',
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < TIMELINE.length - 1 ? (
                        <span
                          className={cn(
                            'mx-3 mb-5 h-0.5 flex-1 rounded-full',
                            index < activeIndex ? 'bg-brand-500' : 'bg-slate-200',
                          )}
                        />
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-semibold text-ink">
                  Items ({items.length})
                </h3>
              </div>
              {items.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-muted">
                  No line items recorded for this order.
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
          </div>

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
                  <dd className="font-medium text-rose-500">
                    -{formatCurrency(order.discount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-semibold text-ink">{formatCurrency(order.amount)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-ink">Customer &amp; delivery</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-ink">{order.userName || '—'}</span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-ink">{order.address || '—'}</span>
                </li>
                <li className="flex gap-3">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-ink">{order.payment || '—'}</span>
                </li>
              </ul>
              {order.trackingId ? (
                <p className="mt-5 break-all rounded-2xl bg-canvas px-4 py-3 text-xs text-muted">
                  Tracking ID: <span className="font-medium text-ink">{order.trackingId}</span>
                </p>
              ) : null}
            </section>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={Boolean(confirmStatus)}
        onClose={() => (isUpdating ? null : setConfirmStatus(null))}
        onConfirm={handleStatusChange}
        isLoading={isUpdating}
        title={confirmStatus ? `Mark as ${confirmStatus.toLowerCase()}?` : ''}
        description={
          confirmStatus === 'Shipped'
            ? 'The customer will see this order as shipped.'
            : 'The customer will see this order as delivered.'
        }
        confirmLabel="Confirm"
        variant="info"
      />
    </div>
  )
}

export default OrderDetails
