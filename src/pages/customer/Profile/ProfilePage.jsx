import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, KeyRound, Package, ShieldCheck, Truck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import Skeleton from '../../../components/common/Skeleton'
import StatusBadge from '../../../components/common/StatusBadge'
import ProfileForm from '../../../components/forms/ProfileForm'
import { getProfile, updateProfile } from '../../../api/userApi'
import { useAuth } from '../../../hooks/useAuth'
import { cn, getErrorMessage } from '../../../utils/helpers'

const QUICK_LINKS = [
  { to: '/orders', label: 'My orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/track-order', label: 'Track an order', icon: Truck },
]

const ProfilePage = () => {
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!user?.id) return undefined
    let isActive = true
    const run = async () => {
      try {
        const { data } = await getProfile(user.id)
        if (!isActive) return
        setProfile(data ?? null)
        setError('')
      } catch (err) {
        if (isActive) setError(getErrorMessage(err, 'Unable to load your profile.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    run()
    return () => {
      isActive = false
    }
  }, [user, reloadKey])

  const handleSave = async ({ name, img }) => {
    setIsSaving(true)
    try {
      const { data } = await updateProfile(user.id, { name, img })
      setProfile(data)
      updateUser({ name: data.name })
      toast.success('Your profile has been updated.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update your profile.'))
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  const handleRetry = () => {
    setError('')
    setIsLoading(true)
    setReloadKey((key) => key + 1)
  }

  const authProvider = profile?.authProvider ?? user?.authProvider
  const isGoogleAccount = authProvider === 'GOOGLE'

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Profile</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your personal details and account security.
        </p>
      </motion.header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-muted" />
            <h2 className="text-base font-semibold tracking-tight text-ink">Personal details</h2>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <Skeleton className="h-24 w-24 rounded-3xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="ml-auto h-14 w-40" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="text-sm text-rose-600">{error}</p>
                <Button variant="secondary" onClick={handleRetry}>
                  Try again
                </Button>
              </div>
            ) : (
              <ProfileForm profile={profile} onSave={handleSave} isSaving={isSaving} />
            )}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className="space-y-6"
        >
          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-muted" />
              Account
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Type</dt>
                <dd>
                  <StatusBadge status={profile?.userRole ?? user?.role} tone="brand" label="Customer" showDot={false} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Email</dt>
                <dd className="truncate font-medium text-ink">{profile?.email ?? user?.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Sign-in</dt>
                <dd className="font-medium text-ink">
                  {isGoogleAccount ? 'Google' : 'Email & password'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <KeyRound className="h-4 w-4 text-muted" />
              Security
            </h2>
            {isGoogleAccount ? (
              <p className="mt-2 text-xs leading-relaxed text-muted">
                This account signs in with Google. Your password and security settings are
                managed in your Google Account.
              </p>
            ) : (
              <>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Use a strong, unique password to keep your account safe.
                </p>
                <Link to="/profile/change-password" className="mt-4 block">
                  <Button variant="secondary" className="w-full">
                    Change password
                  </Button>
                </Link>
              </>
            )}
          </section>

          <nav className="rounded-3xl border border-slate-200/70 bg-white p-2 shadow-soft">
            {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50',
                )}
              >
                <Icon className="h-4 w-4 text-muted" />
                {label}
              </Link>
            ))}
          </nav>
        </motion.aside>
      </div>
    </div>
  )
}

export default ProfilePage
