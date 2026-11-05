import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgePercent, CircleAlert, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import { deleteCoupon, getCoupons } from '../../../api/couponApi'
import { getErrorMessage } from '../../../utils/helpers'
import { formatDate } from '../../../utils/formatters'

const PAGE_SIZE = 8
const EXPIRING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

const getCouponStatus = (expirationDate) => {
  if (!expirationDate) return { tone: 'success', label: 'Active' }
  const date = new Date(expirationDate)
  if (Number.isNaN(date.getTime())) return { tone: 'success', label: 'Active' }
  const diff = date.getTime() - Date.now()
  if (diff <= 0) return { tone: 'danger', label: 'Expired' }
  if (diff <= EXPIRING_WINDOW_MS) return { tone: 'warning', label: 'Expiring soon' }
  return { tone: 'success', label: 'Active' }
}

const CouponList = () => {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getCoupons()
        if (isActive) {
          setCoupons(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (err) {
        if (isActive) {
          setError(getErrorMessage(err, 'Unable to load coupons.'))
          setCoupons([])
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return coupons
    return coupons.filter(
      (coupon) =>
        coupon.code?.toLowerCase().includes(term) || coupon.name?.toLowerCase().includes(term),
    )
  }, [coupons, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCoupon(deleteTarget.id)
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== deleteTarget.id))
      toast.success(`Deleted coupon “${deleteTarget.code}”.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete this coupon.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Coupons</h2>
          <p className="mt-1 text-sm text-muted">Create promotional codes for your store.</p>
        </div>
        <Button onClick={() => navigate('/admin/coupons/new')} leftIcon={<Plus className="h-4 w-4" />}>
          New coupon
        </Button>
      </div>

      <div className="mt-6 max-w-md">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by code or name..."
          size="sm"
        />
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
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="hidden px-6 py-4 font-semibold md:table-cell">Name</th>
              <th className="px-6 py-4 font-semibold">Discount</th>
              <th className="hidden px-6 py-4 font-semibold sm:table-cell">Expires</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-12" />
                  </td>
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="ml-auto h-9 w-20" />
                  </td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4">
                  <EmptyState
                    icon={BadgePercent}
                    title={search ? 'No matching coupons' : 'No coupons yet'}
                    description={
                      search
                        ? 'Try a different search term or clear the search.'
                        : 'Create your first coupon to run a promotion.'
                    }
                    action={
                      search ? (
                        <Button variant="secondary" onClick={() => handleSearch('')}>
                          Clear search
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/admin/coupons/new')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          New coupon
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {visible.map((coupon) => {
                  const status = getCouponStatus(coupon.expirationDate)
                  return (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-brand-700">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 text-sm text-ink md:table-cell">
                        {coupon.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-ink">
                        {coupon.discount}%
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted">
                            {formatDate(coupon.expirationDate)}
                          </span>
                          <StatusBadge tone={status.tone} label={status.label} showDot={false} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/coupons/${coupon.id}/edit`}
                            aria-label={`Edit ${coupon.code}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(coupon)}
                            aria-label={`Delete ${coupon.code}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => (isDeleting ? null : setDeleteTarget(null))}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete coupon?"
        description={
          deleteTarget ? `Coupon “${deleteTarget.code}” will be permanently removed.` : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default CouponList
