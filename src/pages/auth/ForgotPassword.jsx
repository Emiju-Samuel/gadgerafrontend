import { Link } from 'react-router-dom'
import { ArrowLeft, KeyRound } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div className="mb-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <KeyRound className="h-6 w-6" />
        </span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
          Reset your password
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Password recovery is not available yet. If you have lost access to your
          account, please contact our support team and we will help you get back in.
        </p>
      </div>

      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </AuthLayout>
  )
}

export default ForgotPassword
