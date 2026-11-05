import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/helpers'

const VARIANTS = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 focus-visible:ring-brand-500/50',
  secondary:
    'border border-slate-200 bg-white text-ink shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300/60',
  ghost:
    'bg-transparent text-ink hover:bg-slate-100 focus-visible:ring-slate-300/60',
  danger:
    'bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 focus-visible:ring-rose-400/50',
}

const SIZES = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
  icon: 'h-11 w-11 p-0',
}

const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = 'button',
    ...props
  },
  ref,
) {
  const isInert = disabled || isLoading

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isInert}
      whileHover={isInert ? undefined : { y: -2 }}
      whileTap={isInert ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-2xl font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  )
})

export default Button
