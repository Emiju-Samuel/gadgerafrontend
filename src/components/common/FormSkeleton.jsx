import Skeleton from './Skeleton'
import { cn } from '../../utils/helpers'

const FormSkeleton = ({
  inputs = 1,
  columns = 1,
  textareaRows = 0,
  showMedia = false,
  label = 'Loading form…',
  className,
}) => {
  const textareaHeight = textareaRows >= 5 ? 'h-36' : 'h-28'

  return (
    <div role="status" aria-live="polite" className={cn('space-y-6', className)}>
      <span className="sr-only">{label}</span>

      <div className={cn(columns === 2 ? 'grid gap-6 sm:grid-cols-2' : 'space-y-6')}>
        {Array.from({ length: inputs }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>

      {textareaRows > 0 ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className={cn('w-full', textareaHeight)} />
        </div>
      ) : null}

      {showMedia ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Skeleton className="h-40 w-40 shrink-0 rounded-3xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Skeleton className="h-12 w-full sm:w-28" />
        <Skeleton className="h-12 w-full sm:w-36" />
      </div>
    </div>
  )
}

export default FormSkeleton
