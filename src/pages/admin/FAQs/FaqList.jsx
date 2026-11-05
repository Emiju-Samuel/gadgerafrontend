import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, CircleQuestionMark, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Skeleton from '../../../components/common/Skeleton'
import { deleteFaq, getFaqs } from '../../../api/faqApi'
import { getErrorMessage } from '../../../utils/helpers'

const PAGE_SIZE = 8

const FaqList = () => {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState([])
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
        const { data } = await getFaqs()
        if (isActive) {
          setFaqs(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (err) {
        if (isActive) {
          setError(getErrorMessage(err, 'Unable to load FAQs.'))
          setFaqs([])
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
    if (!term) return faqs
    return faqs.filter(
      (faq) =>
        faq.question?.toLowerCase().includes(term) ||
        faq.productName?.toLowerCase().includes(term),
    )
  }, [faqs, search])

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
      await deleteFaq(deleteTarget.id)
      setFaqs((prev) => prev.filter((faq) => faq.id !== deleteTarget.id))
      toast.success('FAQ deleted.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete this FAQ.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">FAQs</h2>
          <p className="mt-1 text-sm text-muted">
            Answer common questions customers have about your products.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/faqs/new')} leftIcon={<Plus className="h-4 w-4" />}>
          New FAQ
        </Button>
      </div>

      <div className="mt-6 max-w-md">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by question or product..."
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
              <th className="px-6 py-4 font-semibold">Question</th>
              <th className="hidden px-6 py-4 font-semibold lg:table-cell">Product</th>
              <th className="hidden px-6 py-4 font-semibold md:table-cell">Answer</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-56" />
                  </td>
                  <td className="hidden px-6 py-4 lg:table-cell">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    <Skeleton className="h-5 w-64" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="ml-auto h-9 w-20" />
                  </td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4">
                  <EmptyState
                    icon={CircleQuestionMark}
                    title={search ? 'No matching FAQs' : 'No FAQs yet'}
                    description={
                      search
                        ? 'Try a different search term or clear the search.'
                        : 'Add answers to the questions customers ask most.'
                    }
                    action={
                      search ? (
                        <Button variant="secondary" onClick={() => handleSearch('')}>
                          Clear search
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/admin/faqs/new')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          New FAQ
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {visible.map((faq) => (
                  <motion.tr
                    key={faq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 font-medium text-ink">{faq.question}</p>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted lg:table-cell">
                      {faq.productName || '—'}
                    </td>
                    <td className="hidden max-w-sm px-6 py-4 text-sm text-muted md:table-cell">
                      <span className="line-clamp-2">{faq.answer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/faqs/${faq.id}/edit`}
                          aria-label="Edit FAQ"
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(faq)}
                          aria-label="Delete FAQ"
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
        title="Delete FAQ?"
        description={deleteTarget ? `“${deleteTarget.question}” will be permanently removed.` : ''}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default FaqList
