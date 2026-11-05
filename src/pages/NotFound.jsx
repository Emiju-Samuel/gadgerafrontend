import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Home as HomeIcon } from 'lucide-react'
import Button from '../components/common/Button'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-7 w-7" />
        </span>
        <p className="mt-6 text-6xl font-semibold tracking-tight text-ink">404</p>
        <h1 className="mt-3 text-xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button size="lg" leftIcon={<HomeIcon className="h-5 w-5" />}>
            Back to store
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
