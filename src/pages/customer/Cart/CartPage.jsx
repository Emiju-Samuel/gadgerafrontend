import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import CartItem from '../../../components/cart/CartItem'
import CartSummary from '../../../components/cart/CartSummary'
import CouponInput from '../../../components/cart/CouponInput'
import { useCart } from '../../../hooks/useCart'

const TRUST = [
  { icon: Truck, label: 'Free delivery over $99' },
  { icon: ShieldCheck, label: 'Secure, protected checkout' },
]

const CartPage = () => {
  const {
    items,
    itemCount,
    subtotal,
    couponCode,
    setCouponCode,
    clearCoupon,
    clearCart,
    increment,
    decrement,
    removeItem,
  } = useCart()

  const handleApplyCoupon = async (code) => {
    setCouponCode(code)
    toast.success(`Coupon “${code}” saved — we'll apply it at checkout.`)
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Your cart has been cleared.')
  }

  const handleRemove = (productId) => {
    removeItem(productId)
    toast.success('Item removed from your cart.')
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the catalogue and add a few gadgets to get started."
          action={
            <Link to="/products">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Browse products</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-muted">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </motion.header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <CartItem
                key={item.productId}
                item={item}
                index={index}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={handleClearCart}
              className="text-sm font-medium text-muted transition-colors hover:text-rose-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary
            itemCount={itemCount}
            subtotal={subtotal}
            total={subtotal}
            action={
              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Proceed to checkout
                </Button>
              </Link>
            }
          >
            <CouponInput
              appliedCoupon={couponCode ? { code: couponCode } : null}
              onApply={handleApplyCoupon}
              onRemove={clearCoupon}
              helperText="Have a coupon? Apply it here or at checkout."
            />
          </CartSummary>

          <div className="mt-4 space-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-muted shadow-soft"
              >
                <Icon className="h-4 w-4 text-brand-600" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
