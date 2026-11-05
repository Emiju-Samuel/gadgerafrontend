import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { changePassword } from '../../../api/userApi'
import { useAuth } from '../../../hooks/useAuth'
import { getErrorMessage } from '../../../utils/helpers'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters')
      .max(72, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

const TIPS = [
  'At least 8 characters long',
  'A mix of letters, numbers and symbols',
  'Different from your current password',
]

const ChangePassword = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isGoogleAccount = user?.authProvider === 'GOOGLE'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await changePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
      toast.success('Your password has been changed.')
      navigate('/profile')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to change your password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      {isGoogleAccount ? (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-6 max-w-2xl rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-ink">Signed in with Google</h1>
              <p className="text-sm text-muted">There is no Gadgera password for this account.</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            This account was created with Google, so your credentials are managed by Google.
            To update your password or security settings, visit your Google Account.
          </p>

          <div className="mt-6">
            <Link to="/profile">
              <Button variant="secondary">Back to profile</Button>
            </Link>
          </div>
        </motion.section>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]"
      >
        <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-ink">Change password</h1>
              <p className="text-sm text-muted">Update the password you use to sign in.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <Input
              label="Current password"
              type="password"
              placeholder="Enter your current password"
              icon={Lock}
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <Input
              label="New password"
              type="password"
              placeholder="Create a new password"
              icon={Lock}
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="Repeat your new password"
              icon={Lock}
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex justify-end pt-1">
              <Button type="submit" size="lg" isLoading={isSubmitting}>
                Update password
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-muted" />
              Password tips
            </h2>
            <ul className="mt-4 space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </motion.div>
      )}
    </div>
  )
}

export default ChangePassword
