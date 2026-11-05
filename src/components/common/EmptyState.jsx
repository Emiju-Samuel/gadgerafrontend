import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const EmptyState = ({ icon: Icon, title, description, action, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={cn(
      'flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-16 text-center',
      className,
    )}
  >
    {Icon ? (
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-500">
        <Icon className="h-7 w-7" />
      </span>
    ) : null}
    <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">{title}</h3>
    {description ? (
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
    ) : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </motion.div>
)

export default EmptyState
