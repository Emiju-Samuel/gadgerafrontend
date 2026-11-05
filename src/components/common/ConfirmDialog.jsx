import { CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'
import { cn } from '../../utils/helpers'

const VARIANTS = {
  danger: {
    icon: CircleAlert,
    iconClass: 'bg-rose-50 text-rose-600',
    confirmVariant: 'danger',
  },
  warning: {
    icon: TriangleAlert,
    iconClass: 'bg-amber-50 text-amber-600',
    confirmVariant: 'primary',
  },
  info: {
    icon: Info,
    iconClass: 'bg-brand-50 text-brand-600',
    confirmVariant: 'primary',
  },
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  children,
}) => {
  const config = VARIANTS[variant] ?? VARIANTS.danger
  const Icon = config.icon

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center px-2 pt-4 text-center">
        <span
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl',
            config.iconClass,
          )}
        >
          <Icon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
        {children ? <div className="mt-4 w-full">{children}</div> : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={config.confirmVariant} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
