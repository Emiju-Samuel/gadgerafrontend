import { forwardRef, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    type = 'text',
    id,
    name,
    className,
    containerClassName,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id || name || generatedId
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-ink"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        ) : null}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-50',
            Icon && 'pl-11',
            isPassword && 'pr-11',
            error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10',
            className,
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            id={`${inputId}-error`}
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

export default Input
