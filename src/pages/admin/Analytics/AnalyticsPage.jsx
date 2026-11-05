import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CircleAlert,
  ClipboardList,
  DollarSign,
  PackageCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { getAnalytics } from '../../../api/analytics'
import Skeleton from '../../../components/common/Skeleton'
import { cn, getErrorMessage } from '../../../utils/helpers'
import { formatCurrency } from '../../../utils/formatters'

const STATUS_CARDS = [
  { key: 'placed', label: 'Placed', icon: ClipboardList, tone: 'bg-sky-50 text-sky-600' },
  { key: 'shipped', label: 'Shipped', icon: Truck, tone: 'bg-brand-50 text-brand-600' },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: PackageCheck,
    tone: 'bg-emerald-50 text-emerald-600',
  },
]

const percentChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 100)
}

const DeltaPill = ({ delta }) => {
  if (delta === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
        <TrendingUp className="h-3.5 w-3.5" />
        New
      </span>
    )
  }
  if (delta === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        No change
      </span>
    )
  }
  const positive = delta > 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
      )}
    >
      {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {positive ? '+' : ''}
      {delta}%
    </span>
  )
}

const MonthlyCard = ({ title, icon: Icon, current, previous, format, index }) => {
  const delta = percentChange(current, previous)
  const max = Math.max(current, previous, 1)
  const bars = [
    { label: 'This month', value: current, highlight: true },
    { label: 'Last month', value: previous, highlight: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
      className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
        </div>
        <DeltaPill delta={delta} />
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">{format(current)}</p>
      <p className="mt-1 text-xs text-muted">vs {format(previous)} last month</p>

      <div className="mt-6 space-y-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted">{bar.label}</span>
              <span className="font-medium text-ink">{format(bar.value)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(bar.value / max) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 + index * 0.08 }}
                className={cn(
                  'h-full rounded-full',
                  bar.highlight ? 'bg-brand-600' : 'bg-slate-300',
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        const { data } = await getAnalytics()
        if (isActive) {
          setAnalytics(data ?? null)
          setError('')
        }
      } catch (err) {
        if (isActive) setError(getErrorMessage(err, 'Unable to load analytics.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-7 w-52" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-3xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{error}</p>
      </div>
    )
  }

  const data = analytics ?? {}

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Analytics</h2>
        <p className="mt-1 text-sm text-muted">
          Track order flow and compare sales month over month.
        </p>
      </div>

      <section className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Orders by status
        </h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {STATUS_CARDS.map(({ key, label, icon: Icon, tone }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
              className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft"
            >
              <span
                className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', tone)}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                {data[key] ?? 0}
              </p>
              <p className="mt-1 text-sm text-muted">{label} orders</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Monthly performance
        </h3>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <MonthlyCard
            title="Orders"
            icon={ShoppingCart}
            current={data.currentMonthOrders ?? 0}
            previous={data.previousMonthOrders ?? 0}
            format={(value) => String(value)}
            index={0}
          />
          <MonthlyCard
            title="Sales (delivered)"
            icon={DollarSign}
            current={data.currentMonthEarnings ?? 0}
            previous={data.previousMonthEarnings ?? 0}
            format={formatCurrency}
            index={1}
          />
        </div>
      </section>
    </div>
  )
}

export default AnalyticsPage
