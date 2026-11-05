import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgePercent,
  Boxes,
  ChartColumn,
  CircleQuestionMark,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingCart,
  Store,
  X,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth'
import { cn, formatDisplayName, getInitials } from '../../utils/helpers'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: ChartColumn },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/admin/categories', label: 'Categories', icon: Boxes },
      { to: '/admin/products', label: 'Products', icon: PackageSearch },
      { to: '/admin/faqs', label: 'FAQs', icon: CircleQuestionMark },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/admin/coupons', label: 'Coupons', icon: BadgePercent },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/admin/profile', label: 'Profile', icon: CircleUserRound }],
  },
]

const SidebarContent = ({ onNavigate }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    onNavigate?.()
    logout()
    toast.success('Signed out of the admin console.')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-18 shrink-0 items-center justify-between px-6">
        <Link to="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
            <Zap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-ink">Gadgera</span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Admin
            </span>
          </span>
        </Link>
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-ink',
                        )}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200/70 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {getInitials(user?.name || user?.email)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">
              {formatDisplayName(user)}
            </span>
            <span className="block truncate text-xs text-muted">Administrator</span>
          </span>
        </div>

        <Link
          to="/"
          onClick={onNavigate}
          className="mt-3 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <Store className="h-5 w-5 text-slate-400" />
          View store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  )
}

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/70 bg-white lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/70 bg-white lg:hidden"
            >
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
