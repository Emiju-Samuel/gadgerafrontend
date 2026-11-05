import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Headphones,
  RotateCcw,
  Send,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react'
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { toast } from 'sonner'

const TRUST = [
  { icon: Truck, title: 'Free delivery', text: 'On orders over $99' },
  { icon: ShieldCheck, title: 'Secure payments', text: 'Encrypted checkout' },
  { icon: RotateCcw, title: '7-day returns', text: 'No questions asked' },
  { icon: Headphones, title: '24/7 support', text: 'We are always here' },
]

const SOCIALS = [
  { icon: FaFacebookF, label: 'Facebook' },
  { icon: FaInstagram, label: 'Instagram' },
  { icon: FaXTwitter, label: 'X' },
  { icon: FaYoutube, label: 'YouTube' },
]

const SHOP_LINKS = [
  { to: '/products', label: 'All products' },
  { to: '/track-order', label: 'Track your order' },
  { to: '/cart', label: 'Your cart' },
  { to: '/wishlist', label: 'Wishlist' },
]

const ACCOUNT_LINKS = [
  { to: '/login', label: 'Sign in' },
  { to: '/register', label: 'Create account' },
  { to: '/orders', label: 'My orders' },
  { to: '/profile', label: 'My profile' },
]

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    toast.success('You are on the list! Watch your inbox for deals.')
    setEmail('')
  }

  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <Zap className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">Gadgera</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Your destination for premium gadgets — phones, audio, wearables and more,
              delivered with care and backed by real support.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-muted transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-ink">Shop</h3>
            <ul className="mt-4 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-ink">Account</h3>
            <ul className="mt-4 space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold text-ink">Stay in the loop</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Join our newsletter for early access to drops and member-only deals.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-canvas p-1.5 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-10 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-slate-200/70 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="block text-xs text-muted">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm text-muted sm:flex-row sm:px-8">
          <p>&copy; {new Date().getFullYear()} Gadgera. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Secure payments powered by Gadgera Pay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
