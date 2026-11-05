import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'
import { formatCurrency } from '../../utils/formatters'

const CartSummary = ({
  itemCount = 0,
  subtotal = 0,
  discount = 0,
  total = 0,
  children,
  action,
  note,
  className,
}) => {
  const hasDiscount = Number(discount) > 0

  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft',
        className,
      )}
    >
      <h2 className="text-base font-semibold tracking-tight text-ink">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">
            Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </dt>
          <dd className="font-medium text-ink">{formatCurrency(subtotal)}</dd>
        </div>

        {hasDiscount ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-between text-emerald-600"
          >
            <dt>Discount</dt>
            <dd className="font-medium">−{formatCurrency(discount)}</dd>
          </motion.div>
        ) : null}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <dt className="text-base font-semibold text-ink">Total</dt>
          <dd className="text-base font-semibold tracking-tight text-ink">
            {formatCurrency(total)}
          </dd>
        </div>
      </dl>

      {children ? <div className="mt-5">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
      {note ? <p className="mt-4 text-xs leading-relaxed text-muted">{note}</p> : null}
    </div>
  )
}

export default CartSummary
