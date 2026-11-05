import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'Bank-grade security', text: 'JWT sessions with role-based access control.' },
  { icon: Truck, title: 'Fast, tracked delivery', text: 'Follow every order from cart to doorstep.' },
  { icon: BadgeCheck, title: 'Verified inventory', text: 'Only authentic, warranty-backed gadgets.' },
  { icon: Sparkles, title: 'Handpicked deals', text: 'Coupons and offers curated for you.' },
]

const AuthLayout = ({ children }) => {
  return (
    <main className="relative grid min-h-screen w-full lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Zap className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight">Gadgera</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative max-w-md text-white"
        >
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Premium gadgets, delivered with care.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Browse, compare and order the electronics you love — all from one beautifully simple store.
          </p>

          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-sm text-white/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-sm text-white/50">
          &copy; {new Date().getFullYear()} Gadgera. Elevating your tech experience.
        </p>
      </aside>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <Zap className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">Gadgera</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
