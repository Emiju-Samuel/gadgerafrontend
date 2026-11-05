import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
}) => {
  const panelRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = setTimeout(() => panelRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  const hasHeader = Boolean(title || description || showCloseButton)

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cn(
              'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl',
              SIZES[size] ?? SIZES.md,
              className,
            )}
          >
            {hasHeader ? (
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div className="min-w-0">
                  {title ? (
                    <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-muted">
                      {description}
                    </p>
                  ) : null}
                </div>
                {showCloseButton ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer ? (
              <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">{footer}</div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default Modal
