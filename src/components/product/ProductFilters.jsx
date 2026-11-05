import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const PRICE_FIELD_CLASSES =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

const ProductFilters = ({ categories = [], value = {}, onChange, onReset }) => {
  const { categoryId = '', minPrice = '', maxPrice = '', inStockOnly = false } = value
  const hasActiveFilters =
    Boolean(categoryId) || minPrice !== '' || maxPrice !== '' || inStockOnly

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-muted" />
          Filters
        </h3>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Category</p>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange?.({ categoryId: '' })}
            className={cn(
              'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
              !categoryId
                ? 'bg-brand-50 font-semibold text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
            )}
          >
            <span>All products</span>
          </button>

          {categories.map((category) => {
            const isSelected = String(categoryId) === String(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChange?.({ categoryId: isSelected ? '' : String(category.id) })}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
                  isSelected
                    ? 'bg-brand-50 font-semibold text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                )}
              >
                <span className="truncate">{category.name}</span>
                {category.count != null ? (
                  <span
                    className={cn(
                      'shrink-0 text-xs',
                      isSelected ? 'text-brand-500' : 'text-muted',
                    )}
                  >
                    {category.count}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Price range</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(event) => onChange?.({ minPrice: event.target.value })}
            className={PRICE_FIELD_CLASSES}
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => onChange?.({ maxPrice: event.target.value })}
            className={PRICE_FIELD_CLASSES}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={() => onChange?.({ inStockOnly: !inStockOnly })}
          className="flex w-full items-center justify-between gap-3"
        >
          <span className="text-sm font-medium text-ink">In stock only</span>
          <span
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              inStockOnly ? 'bg-brand-600' : 'bg-slate-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                inStockOnly ? 'translate-x-5' : 'translate-x-0.5',
              )}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProductFilters
