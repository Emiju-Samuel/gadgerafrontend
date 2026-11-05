import { forwardRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, name, rows = 4, className, containerClassName, ...props },
  ref,
) {
  const generatedId = useId()
  const textareaId = id || name || generatedId

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={cn(
          'w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-50',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10',
          className,
        )}
        {...props}
      />

      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            id={`${textareaId}-error`}
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

export default Textarea
