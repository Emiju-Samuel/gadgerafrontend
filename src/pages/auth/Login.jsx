import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import GoogleSignInButton from '../../components/forms/GoogleSignInButton'
import LoginForm from '../../components/forms/LoginForm'
import AuthLayout from '../../components/layout/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import { formatDisplayName, getErrorMessage, resolvePostAuthRedirect } from '../../utils/helpers'

const Login = () => {
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const from = location.state?.from
  const redirectTo = useMemo(() => resolvePostAuthRedirect(user, from), [user, from])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  const handleSubmit = async ({ email, password }) => {
    setIsSubmitting(true)
    try {
      const loggedInUser = await login(email, password)
      toast.success(`Welcome back, ${formatDisplayName(loggedInUser)}!`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Invalid email or password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleCredential = async (credential) => {
    setIsGoogleLoading(true)
    try {
      const loggedInUser = await loginWithGoogle(credential)
      toast.success(`Welcome back, ${formatDisplayName(loggedInUser)}!`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Google sign-in failed. Please try again.'))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Welcome back</h2>
        <p className="mt-2 text-sm text-muted">
          Sign in to continue to your Gadgera account.
        </p>
      </div>

      <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting || isGoogleLoading} />

      <div className="mt-6">
        <GoogleSignInButton
          onCredential={handleGoogleCredential}
          onError={(error) => toast.error(error.message)}
          disabled={isSubmitting || isGoogleLoading}
        />
      </div>

      <div className="mt-4 text-right">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Forgot password?
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        New to Gadgera?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
