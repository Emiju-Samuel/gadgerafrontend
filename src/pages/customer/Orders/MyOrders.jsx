import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ImageOff,
  MapPin,
  Package,
  PackageSearch,
  Star,
  Truck,
} from 'lucide-react'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import OrderTimeline from '../../../components/orders/OrderTimeline'
import { useAuth } from '../../../hooks/useAuth'
import { useMyOrders } from '../../../hooks/useOrders'
import { formatCurrency, formatDate, formatDateTime, getProductImageUrl } from '../../../utils/formatters'

const orderItemCount = (order) =>
  (order?.cartItems ?? []).reduce((sum, item) => sum + Number(item.quantity ?? 0), 0)

const orderItemImages = (order) => (order?.cartItems ?? []).slice(0, 3)

const ListSkeleton = () => (
  <div className="space-y-4">
    {[0, 1, 2].map((key) => (
      <Skeleton key={key} className="h-28 rounded-3xl" />
    ))}
  </div>
)

const OrderCard = ({ order, index }) => {
  const thumbnails = orderItemImages(order)
  const itemCount = orderItemCount(order)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
    >
      <Link
        to={`/orders/${order.id}`}
        className="group flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-4">
          <div className="flex -space-x-3">
            {thumbnails.map((item) => {
              const imageUrl = getProductImageUrl(item.returnedImg)
              return (
                <span
                  key={item.id}
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-slate-100 text-slate-300"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff className="h-5 w-5" />
                  )}
                </span>
              )
            })}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold tracking-tight text-ink">Order #{order.id}</span>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="mt-1 text-xs text-muted">
              {formatDate(order.date)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-base font-semibold tracking-tight text-ink">
            {formatCurrency(order.amount)}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-muted transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

const OrderDetail = ({ order }) => {
  const items = order.cartItems ?? []

  return (
    <div>
      <Link
        to="/orders"
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Order #{order.id}</h1>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="text-sm text-muted">Placed on {formatDateTime(order.date)}</p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-sm font-semibold text-ink">Delivery progress</h2>
          <div className="mt-6 overflow-x-auto pb-1">
            <OrderTimeline status={order.orderStatus} className="min-w-[520px]" />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-semibold text-ink">Items ({items.length})</h2>
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
                        {order.orderStatus === 'Delivered' && item.productId ? (
                          <Link
                            to={`/products/${item.productId}/review?orderId=${order.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                          >
                            <Star className="h-3.5 w-3.5" />
                            Review
                          </Link>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
              <h2 className="text-sm font-semibold text-ink">Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-medium text-ink">{formatCurrency(order.totalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">
                    Discount{order.couponName ? ` (${order.couponName})` : ''}
                  </dt>
                  <dd className="font-medium text-emerald-600">
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
              <h2 className="text-sm font-semibold text-ink">Delivery</h2>
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
              {order.trackingId ? (
                <div className="mt-5 rounded-2xl bg-canvas px-4 py-3">
                  <p className="text-xs text-muted">Tracking ID</p>
                  <p className="mt-1 break-all text-xs font-medium text-ink">{order.trackingId}</p>
                  <Link
                    to={`/track-order/${order.trackingId}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Live tracking
                  </Link>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const MyOrders = () => {
  const { user } = useAuth()
  const { orderId } = useParams()
  const { orders, isLoading, error, refetch } = useMyOrders(user?.id)

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  )

  if (orderId) {
    if (isLoading) {
      return (
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
          <Skeleton className="h-10 w-40 rounded-2xl" />
          <Skeleton className="mt-8 h-40 rounded-3xl" />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-3xl lg:col-span-2" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      )
    }

    const order = orders.find((item) => String(item.id) === String(orderId))
    if (!order) {
      return (
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <EmptyState
            icon={PackageSearch}
            title="Order not found"
            description="We couldn't find that order in your account."
            action={
              <Link to="/orders">
                <Button variant="secondary">Back to orders</Button>
              </Link>
            }
          />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <OrderDetail order={order} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">My orders</h1>
          <p className="mt-2 text-sm text-muted">
            {isLoading
              ? 'Loading your orders…'
              : `${sortedOrders.length} ${sortedOrders.length === 1 ? 'order' : 'orders'} placed.`}
          </p>
        </div>
        <Link
          to="/track-order"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          <Truck className="h-4 w-4" />
          Track an order
        </Link>
      </motion.header>

      <div className="mt-8">
        {isLoading ? (
          <ListSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-100 bg-rose-50/60 px-6 py-10 text-center">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="secondary" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : sortedOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will show up here with live tracking."
            action={
              <Link to="/products">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Browse products</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {sortedOrders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
