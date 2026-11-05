import { cn } from '../../utils/helpers'
import { formatStatusLabel } from '../../utils/formatters'

const TONES = {
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  danger: 'bg-rose-50 text-rose-700 ring-rose-100',
}

const DOT_TONES = {
  neutral: 'bg-slate-400',
  brand: 'bg-brand-500',
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
}

const STATUS_TONES = {
  pending: 'warning',
  placed: 'info',
  processing: 'info',
  confirmed: 'info',
  shipped: 'brand',
  outfordelivery: 'brand',
  delivered: 'success',
  completed: 'success',
  paid: 'success',
  active: 'success',
  'in-stock': 'success',
  instock: 'success',
  cancelled: 'danger',
  canceled: 'danger',
  failed: 'danger',
  rejected: 'danger',
  refunded: 'danger',
  'out-of-stock': 'danger',
  outofstock: 'danger',
  'low-stock': 'warning',
  lowstock: 'warning',
  inactive: 'neutral',
  draft: 'neutral',
}

const StatusBadge = ({ status, label, tone, showDot = true, className }) => {
  const key = status == null ? '' : String(status).toLowerCase().replace(/[\s_]+/g, '-')
  const resolvedTone = tone ?? STATUS_TONES[key] ?? STATUS_TONES[key.replace(/-/g, '')] ?? 'neutral'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        TONES[resolvedTone] ?? TONES.neutral,
        className,
      )}
    >
      {showDot ? (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            DOT_TONES[resolvedTone] ?? DOT_TONES.neutral,
          )}
        />
      ) : null}
      {label ?? formatStatusLabel(status)}
    </span>
  )
}

export default StatusBadge
