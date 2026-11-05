import { forwardRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/helpers'

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    placeholder,
    id,
    name,
    className,
    containerClassName,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const selectId = id || name || generatedId

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            'h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-11 text-sm text-ink shadow-sm outline-none transition-all hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-50',
            error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10',
            className,
          )}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            id={`${selectId}-error`}
            className="mt-2 text-xs font-medium text-rose-500"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p className="mt-2 text-xs text-muted">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

export default Select
