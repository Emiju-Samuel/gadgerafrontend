import { Search, X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const SIZES = {
  sm: 'h-10 text-sm',
  md: 'h-12 text-sm',
  lg: 'h-14 text-base',
}

const SearchBar = ({
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search...',
  size = 'md',
  disabled = false,
  autoFocus = false,
  icon: Icon = Search,
  className,
  inputClassName,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(value)
  }

  const handleClear = () => {
    onChange?.('')
    onClear?.()
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('w-full', className)}>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

        <input
          type="search"
          value={value ?? ''}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            'w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-50',
            SIZES[size] ?? SIZES.md,
            inputClassName,
          )}
        />

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default SearchBar
