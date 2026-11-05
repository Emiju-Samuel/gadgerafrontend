import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { formatDisplayName } from '../../utils/helpers'

const FEATURES = [
  {
    icon: ShoppingBag,
    title: 'Curated catalogue',
    text: 'Discover premium phones, audio, wearables and more.',
  },
  {
    icon: Truck,
    title: 'Order tracking',
    text: 'Follow every order with a public tracking link.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    text: 'Protected sessions with role-based access.',
  },
]

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-3xl pb-16 pt-16 text-center sm:pt-24"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" />
          The premium gadget store
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
          {isAuthenticated ? (
            <>
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                {formatDisplayName(user)}
              </span>
            </>
          ) : (
            <>
              Everything tech,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                beautifully delivered.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {isAuthenticated
            ? 'Your account is ready. Browse the catalogue, manage orders and check out in seconds.'
            : 'Browse as a guest, then sign in at checkout to complete your order in seconds.'}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/products">
            <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Browse products
            </Button>
          </Link>
          {isAdmin ? (
            <Link to="/admin">
              <Button size="lg" variant="secondary">
                Admin dashboard
              </Button>
            </Link>
          ) : !isAuthenticated ? (
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Create an account
              </Button>
            </Link>
          ) : null}
        </div>
      </motion.section>

      <section className="grid gap-6 pb-20 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

export default Home
