import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Eye, ShoppingCart } from 'lucide-react'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import { useAdminOrders } from '../../../hooks/useOrders'
import { cn } from '../../../utils/helpers'
import { formatCurrency, formatDateTime } from '../../../utils/formatters'

const PAGE_SIZE = 8
const STATUS_FILTERS = ['All', 'Placed', 'Shipped', 'Delivered']

const OrderList = () => {
  const { orders, isLoading, error } = useAdminOrders()
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter
      const matchesSearch =
        !term ||
        String(order.id).includes(term) ||
        order.userName?.toLowerCase().includes(term) ||
        String(order.trackingId ?? '')
          .toLowerCase()
          .includes(term)
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilter = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Orders</h2>
        <p className="mt-1 text-sm text-muted">Review orders and keep customers updated.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-slate-200/70 bg-white p-1 shadow-soft">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleFilter(status)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full lg:max-w-xs">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search by order, customer..."
            size="sm"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="hidden px-6 py-4 font-semibold sm:table-cell">Customer</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-28" />
                  </td>
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="ml-auto h-9 w-16" />
                  </td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4">
                  <EmptyState
                    icon={ShoppingCart}
                    title={
                      orders.length === 0 ? 'No orders yet' : 'No orders match your filters'
                    }
                    description={
                      orders.length === 0
                        ? 'Orders placed by customers will appear here.'
                        : 'Try a different status or search term.'
                    }
                    action={
                      orders.length > 0 ? (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            handleFilter('All')
                            handleSearch('')
                          }}
                        >
                          Reset filters
                        </Button>
                      ) : null
                    }
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {visible.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-ink transition-colors hover:text-brand-600"
                      >
                        #{order.id}
                      </Link>
                      <p className="text-xs text-muted">{formatDateTime(order.date)}</p>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted sm:table-cell">
                      {order.userName || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-ink">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          aria-label={`View order ${order.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && filtered.length > PAGE_SIZE ? (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            showSummary
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      ) : null}
    </div>
  )
}

export default OrderList
