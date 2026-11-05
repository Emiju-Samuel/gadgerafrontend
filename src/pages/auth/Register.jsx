import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import GoogleSignInButton from '../../components/forms/GoogleSignInButton'
import RegisterForm from '../../components/forms/RegisterForm'
import AuthLayout from '../../components/layout/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import { formatDisplayName, getErrorMessage, resolvePostAuthRedirect } from '../../utils/helpers'

const Register = () => {
  const { register: registerUser, loginWithGoogle, isAuthenticated, user } = useAuth()
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

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await registerUser(values)
      toast.success('Your account is ready. Welcome to Gadgera!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'We could not create your account.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleCredential = async (credential) => {
    setIsGoogleLoading(true)
    try {
      const loggedInUser = await loginWithGoogle(credential)
      toast.success(`Welcome to Gadgera, ${formatDisplayName(loggedInUser)}!`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Google sign-up failed. Please try again.'))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Create your account</h2>
        <p className="mt-2 text-sm text-muted">
          Join Gadgera and start discovering premium gadgets.
        </p>
      </div>

      <RegisterForm onSubmit={handleSubmit} isSubmitting={isSubmitting || isGoogleLoading} />

      <div className="mt-6">
        <GoogleSignInButton
          onCredential={handleGoogleCredential}
          onError={(error) => toast.error(error.message)}
          disabled={isSubmitting || isGoogleLoading}
          text="signup_with"
        />
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
