import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import { cn } from '../../utils/helpers'

const range = (start, end) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index)

const getPageItems = (currentPage, totalPages, siblingCount) => {
  const totalNumbers = siblingCount * 2 + 5

  if (totalPages <= totalNumbers) return range(1, totalPages)

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    return [...range(1, leftItemCount), 'right-ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    return [1, 'left-ellipsis', ...range(totalPages - rightItemCount + 1, totalPages)]
  }

  return [
    1,
    'left-ellipsis',
    ...range(leftSibling, rightSibling),
    'right-ellipsis',
    totalPages,
  ]
}

const navButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showSummary = false,
  totalItems,
  pageSize,
  className,
}) => {
  if (!totalPages || totalPages <= 1) return null

  const pageItems = getPageItems(currentPage, totalPages, siblingCount)
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page)
    }
  }

  const firstItem =
    showSummary && totalItems != null && pageSize ? (currentPage - 1) * pageSize + 1 : null
  const lastItem =
    showSummary && totalItems != null && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className,
      )}
    >
      {showSummary && totalItems != null ? (
        <p className="text-sm text-muted">
          Showing <span className="font-medium text-ink">{firstItem}</span>–
          <span className="font-medium text-ink">{lastItem}</span> of{' '}
          <span className="font-medium text-ink">{totalItems}</span>
        </p>
      ) : (
        <span className="hidden sm:block" />
      )}

      <nav className="flex items-center gap-1.5" aria-label="Pagination">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={navButtonClass}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageItems.map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              className={cn(
                'flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors',
                item === currentPage
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              className="flex h-10 w-10 items-center justify-center text-slate-400"
            >
              <Ellipsis className="h-4 w-4" />
            </span>
          ),
        )}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={navButtonClass}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
