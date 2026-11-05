import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Eye, ImageOff, PackageSearch, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import { useAdminProducts } from '../../../hooks/useProduct'
import { useDebounce } from '../../../hooks/useDebounce'
import { deleteProduct } from '../../../api/productApi'
import { getErrorMessage } from '../../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../../utils/formatters'

const PAGE_SIZE = 8

const StockBadge = ({ quantity }) => {
  if (quantity == null) return <span className="text-sm text-muted">—</span>
  const value = Number(quantity)
  if (value <= 0) return <StatusBadge status="out-of-stock" label="Out of stock" />
  if (value <= 5) return <StatusBadge status="low-stock" label={`Low · ${value}`} />
  return <StatusBadge status="in-stock" label={`In stock · ${value}`} />
}

const ProductList = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 350)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { products, isLoading, error, refetch } = useAdminProducts(debouncedSearch)

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      toast.success(`Deleted “${deleteTarget.name}”.`)
      setDeleteTarget(null)
      await refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete this product.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Products</h2>
          <p className="mt-1 text-sm text-muted">Create, edit and manage your inventory.</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')} leftIcon={<Plus className="h-4 w-4" />}>
          New product
        </Button>
      </div>

      <div className="mt-6 max-w-md">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search products by name..."
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
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="hidden px-6 py-4 font-semibold lg:table-cell">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="hidden px-6 py-4 font-semibold sm:table-cell">Stock</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </td>
                  <td className="hidden px-6 py-4 lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="ml-auto h-9 w-28" />
                  </td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4">
                  <EmptyState
                    icon={PackageSearch}
                    title={debouncedSearch ? 'No matching products' : 'No products yet'}
                    description={
                      debouncedSearch
                        ? 'Try a different search term or clear the search.'
                        : 'Create your first product to start selling.'
                    }
                    action={
                      debouncedSearch ? (
                        <Button variant="secondary" onClick={() => handleSearch('')}>
                          Clear search
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/admin/products/new')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          New product
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {visible.map((product) => {
                  const imageUrl = getProductImageUrl(product.byteImg)
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-300">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageOff className="h-5 w-5" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <Link
                              to={`/admin/products/${product.id}`}
                              className="line-clamp-1 font-medium text-ink transition-colors hover:text-brand-600"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-muted">ID #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 text-sm text-muted lg:table-cell">
                        {product.categoryName || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-ink">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <StockBadge quantity={product.quantity} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/products/${product.id}`}
                            aria-label={`View ${product.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            aria-label={`Edit ${product.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            aria-label={`Delete ${product.name}`}
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

      {!isLoading && products.length > PAGE_SIZE ? (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            showSummary
            totalItems={products.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => (isDeleting ? null : setDeleteTarget(null))}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete product?"
        description={
          deleteTarget ? `“${deleteTarget.name}” will be permanently removed.` : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default ProductList
