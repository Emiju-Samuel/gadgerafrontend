import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/helpers'

const LoadingSpinner = ({ label, fullScreen = false, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen ? 'min-h-screen bg-canvas' : 'py-16',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-brand-500/15" />
        <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
      </span>
      {label ? <p className="text-sm font-medium text-muted">{label}</p> : null}
    </div>
  )
}

export default LoadingSpinner
