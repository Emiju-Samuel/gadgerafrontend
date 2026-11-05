import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, Menu, Store } from 'lucide-react'
import { toast } from 'sonner'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { formatDisplayName, getInitials } from '../../utils/helpers'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  categories: 'Categories',
  products: 'Products',
  orders: 'Orders',
  coupons: 'Coupons',
  faqs: 'FAQs',
  profile: 'Profile',
}

const AdminLayout = () => {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const section = pathname.split('/')[2] || 'dashboard'
  const title = PAGE_TITLES[section] ?? 'Dashboard'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const handleNotifications = () => toast.info('No new notifications right now.')

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
          <div className="flex h-18 items-center gap-4 px-5 sm:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-slate-100 hover:text-ink lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-ink">{title}</h1>
              <p className="hidden text-xs text-muted sm:block">
                Manage your Gadgera store from one place.
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/"
                className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
              >
                <Store className="h-4 w-4 text-muted" />
                View store
              </Link>
              <button
                type="button"
                onClick={handleNotifications}
                aria-label="Notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
              </button>
              <Link
                to="/admin/profile"
                className="flex items-center gap-2.5 rounded-2xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-slate-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {getInitials(user?.name || user?.email)}
                </span>
                <span className="hidden text-sm font-medium text-ink sm:block">
                  {formatDisplayName(user)}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200/70 px-5 py-6 sm:px-8">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Gadgera Admin Console. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
