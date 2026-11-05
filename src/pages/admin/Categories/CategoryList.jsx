import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Boxes, CircleAlert, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Skeleton from '../../../components/common/Skeleton'
import { deleteCategory, getCategories } from '../../../api/categoryApi'
import { getErrorMessage } from '../../../utils/helpers'

const PAGE_SIZE = 8

const CategoryList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
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
        const { data } = await getCategories()
        if (isActive) {
          setCategories(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (err) {
        if (isActive) {
          setError(getErrorMessage(err, 'Unable to load categories.'))
          setCategories([])
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
    if (!term) return categories
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term),
    )
  }, [categories, search])

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
      await deleteCategory(deleteTarget.id)
      setCategories((prev) => prev.filter((category) => category.id !== deleteTarget.id))
      toast.success(`Deleted “${deleteTarget.name}”.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete this category.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Categories</h2>
          <p className="mt-1 text-sm text-muted">
            Group your products into collections customers can browse.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/categories/new')} leftIcon={<Plus className="h-4 w-4" />}>
          New category
        </Button>
      </div>

      <div className="mt-6 max-w-md">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search categories..."
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
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="hidden px-6 py-4 font-semibold md:table-cell">Description</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    <Skeleton className="h-5 w-64" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="ml-auto h-9 w-24" />
                  </td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4">
                  <EmptyState
                    icon={Boxes}
                    title={search ? 'No matching categories' : 'No categories yet'}
                    description={
                      search
                        ? 'Try a different search term or clear the search.'
                        : 'Create your first category to start organising products.'
                    }
                    action={
                      search ? (
                        <Button variant="secondary" onClick={() => handleSearch('')}>
                          Clear search
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/admin/categories/new')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          New category
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {visible.map((category) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                          <Boxes className="h-5 w-5" />
                        </span>
                        <span className="font-medium text-ink">{category.name}</span>
                      </div>
                    </td>
                    <td className="hidden max-w-md px-6 py-4 text-sm text-muted md:table-cell">
                      <span className="line-clamp-2">{category.description || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/categories/${category.id}/edit`}
                          aria-label={`Edit ${category.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          aria-label={`Delete ${category.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => (isDeleting ? null : setDeleteTarget(null))}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete category?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” and all of its products will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default CategoryList
