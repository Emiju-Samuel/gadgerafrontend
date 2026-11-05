import { cn } from '../../utils/helpers'

const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-2xl bg-slate-200/70', className)} aria-hidden="true" />
)

export default Skeleton
