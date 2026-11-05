import { motion } from 'framer-motion'
import { ClipboardList, PackageCheck, Truck } from 'lucide-react'
import { cn } from '../../utils/helpers'

const ORDER_STEPS = [
  { key: 'Placed', label: 'Order placed', description: 'We received your order', icon: ClipboardList },
  { key: 'Shipped', label: 'Shipped', description: 'On the way to you', icon: Truck },
  { key: 'Delivered', label: 'Delivered', description: 'Enjoy your gadget', icon: PackageCheck },
]

/** Horizontal progress stepper shared by My Orders and public order tracking. */
const OrderTimeline = ({ status, className }) => {
  const activeIndex = Math.max(
    ORDER_STEPS.findIndex((step) => step.key === status),
    0,
  )

  return (
    <ol className={cn('flex items-start', className)}>
      {ORDER_STEPS.map((step, index) => {
        const isReached = index <= activeIndex
        const isLast = index === ORDER_STEPS.length - 1
        const Icon = step.icon
        return (
          <li
            key={step.key}
            className={cn('flex items-start', isLast ? 'flex-none' : 'flex-1')}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <motion.span
                initial={false}
                animate={isReached ? { scale: 1 } : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                  isReached
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-slate-100 text-slate-400',
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <span
                className={cn(
                  'text-xs font-semibold sm:text-sm',
                  isReached ? 'text-ink' : 'text-muted',
                )}
              >
                {step.label}
              </span>
              <span className="hidden text-xs text-muted sm:block">{step.description}</span>
            </div>

            {!isLast ? (
              <span className="mx-2 mt-6 h-0.5 flex-1 rounded-full bg-slate-200">
                <motion.span
                  initial={false}
                  animate={{ scaleX: index < activeIndex ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="block h-full rounded-full bg-brand-500"
                />
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export default OrderTimeline
