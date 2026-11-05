import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgePercent,
  Boxes,
  ChartColumn,
  CircleQuestionMark,
  PackageSearch,
  ShoppingCart,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { formatDisplayName } from '../../utils/helpers'

const MODULES = [
  { icon: Boxes, title: 'Categories', text: 'Organise your catalogue.', to: '/admin/categories' },
  {
    icon: PackageSearch,
    title: 'Products',
    text: 'Create and manage inventory.',
    to: '/admin/products',
  },
  { icon: ShoppingCart, title: 'Orders', text: 'Update delivery status.', to: '/admin/orders' },
  { icon: BadgePercent, title: 'Coupons', text: 'Run promotions.', to: '/admin/coupons' },
  {
    icon: CircleQuestionMark,
    title: 'FAQs',
    text: 'Answer common questions.',
    to: '/admin/faqs',
  },
  { icon: ChartColumn, title: 'Analytics', text: 'Track sales and orders.', to: '/admin/analytics' },
]

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Welcome, {formatDisplayName(user)}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Here is a quick overview of everything you can manage.
        </p>
      </motion.div>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ icon: Icon, title, text, to }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: 'easeOut' }}
          >
            <Link
              to={to}
              className="flex items-start gap-4 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

export default Dashboard
