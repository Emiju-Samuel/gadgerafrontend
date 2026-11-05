import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { cn, formatDisplayName, getInitials } from '../../utils/helpers'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/track-order', label: 'Track order' },
]

const linkClasses = ({ isActive }) =>
  cn(
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-slate-100 text-ink' : 'text-muted hover:bg-slate-50 hover:text-ink',
  )

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef(null)

  const closeMenus = () => {
    setMenuOpen(false)
    setMobileOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleSearch = (event) => {
    event.preventDefault()
    const term = search.trim()
    navigate(term ? `/products?search=${encodeURIComponent(term)}` : '/products')
    setSearch('')
    closeMenus()
  }

  const handleLogout = () => {
    closeMenus()
    logout()
    toast.success('You have been signed out.')
  }

  const accountLinks = isAdmin
    ? [{ to: '/admin', label: 'Admin dashboard', icon: LayoutDashboard }]
    : [
        { to: '/profile', label: 'My profile', icon: UserRound },
        { to: '/orders', label: 'My orders', icon: Package },
        { to: '/wishlist', label: 'Wishlist', icon: Heart },
      ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-5 sm:px-8">
        <Link to="/" onClick={closeMenus} className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">Gadgera</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenus}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-xs flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search gadgets..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            to="/wishlist"
            onClick={closeMenus}
            aria-label="Wishlist"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-slate-100 hover:text-ink sm:flex"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            onClick={closeMenus}
            aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 ? (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white shadow-lg shadow-brand-600/25"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {getInitials(user?.name || user?.email)}
                </span>
                <span className="hidden text-sm font-medium text-ink sm:block">
                  {formatDisplayName(user)}
                </span>
                <ChevronDown
                  className={cn(
                    'hidden h-4 w-4 text-muted transition-transform sm:block',
                    menuOpen && 'rotate-180',
                  )}
                />
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-1.5 shadow-lift"
                  >
                    <div className="border-b border-slate-100 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink">
                        {formatDisplayName(user)}
                      </p>
                      <p className="truncate text-xs text-muted">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {accountLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={closeMenus}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink transition-colors hover:bg-slate-50"
                          role="menuitem"
                        >
                          <Icon className="h-4 w-4 text-muted" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" onClick={closeMenus}>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register" onClick={closeMenus}>
                <Button size="sm">Create account</Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-slate-100 hover:text-ink lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-slate-200/70 bg-canvas lg:hidden"
          >
            <div className="space-y-2 px-5 py-5 sm:px-8">
              <form onSubmit={handleSearch} className="lg:hidden">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search gadgets..."
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </form>

              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-slate-100',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <div className="space-y-2 border-t border-slate-200/70 pt-3">
                  {accountLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-100"
                    >
                      <Icon className="h-4 w-4 text-muted" />
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 border-t border-slate-200/70 pt-3">
                  <Link to="/login" onClick={closeMenus}>
                    <Button variant="secondary" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenus}>
                    <Button className="w-full">Create account</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
