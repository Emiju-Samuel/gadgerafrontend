import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { formatCurrency, getProductImageUrl } from '../../utils/formatters'

const CartItem = ({ item, index = 0, onIncrement, onDecrement, onRemove }) => {
  const imageUrl = getProductImageUrl(item.image)
  const available = item.availableQuantity
  const atMax = available != null && item.quantity >= available
  const lineTotal = item.price * item.quantity

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.04, 0.2),
        ease: 'easeOut',
      }}
      className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-soft transition-shadow hover:shadow-lift sm:p-5"
    >
      <Link
        to={`/products/${item.productId}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50 sm:h-28 sm:w-28"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-6 w-6" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${item.productId}`}
              className="line-clamp-2 text-sm font-semibold text-ink transition-colors hover:text-brand-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-muted">{formatCurrency(item.price)} each</p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Remove ${item.name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <motion.button
              type="button"
              onClick={() => onDecrement(item.productId)}
              whileTap={{ scale: 0.9 }}
              aria-label="Decrease quantity"
              className="flex h-10 w-10 items-center justify-center rounded-l-2xl text-muted transition-colors hover:bg-slate-50 hover:text-ink"
            >
              <Minus className="h-4 w-4" />
            </motion.button>

            <span className="w-10 text-center text-sm font-semibold tabular-nums text-ink">
              {item.quantity}
            </span>

            <motion.button
              type="button"
              onClick={() => onIncrement(item.productId)}
              disabled={atMax}
              whileTap={atMax ? undefined : { scale: 0.9 }}
              aria-label="Increase quantity"
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-r-2xl transition-colors',
                atMax
                  ? 'cursor-not-allowed text-slate-300'
                  : 'text-muted hover:bg-slate-50 hover:text-ink',
              )}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="text-right">
            <motion.p
              key={lineTotal}
              initial={{ opacity: 0.4, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="text-base font-semibold tracking-tight text-ink"
            >
              {formatCurrency(lineTotal)}
            </motion.p>
            {atMax ? <p className="text-xs text-amber-600">Max available</p> : null}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem
