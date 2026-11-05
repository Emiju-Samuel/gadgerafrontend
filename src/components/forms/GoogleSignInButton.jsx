import { useCallback, useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../../utils/constants'
import { cn } from '../../utils/helpers'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let googleScriptPromise = null

const loadGoogleIdentity = () => {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (googleScriptPromise) return googleScriptPromise

  googleScriptPromise = new Promise((resolve, reject) => {
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      resolve(window.google)
    }

    const fail = () => {
      if (settled) return
      settled = true
      googleScriptPromise = null
      reject(new Error('We could not load Google sign-in. Please try again.'))
    }

    const script =
      document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`) ??
      document.createElement('script')

    script.addEventListener('load', finish, { once: true })
    script.addEventListener('error', fail, { once: true })

    if (!script.parentNode) {
      script.src = GOOGLE_SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    const startedAt = Date.now()
    const poll = () => {
      if (window.google?.accounts?.id) return finish()
      if (Date.now() - startedAt > 15000) return fail()
      window.setTimeout(poll, 100)
    }
    poll()
  })

  return googleScriptPromise
}

/**
 * Renders the official Google Identity Services button.
 * The page supplies `onCredential`, which receives a Google ID token that the
 * backend can verify. Administrators are rejected server side.
 */
const GoogleSignInButton = ({
  onCredential,
  onError,
  disabled = false,
  text = 'continue_with',
}) => {
  const containerRef = useRef(null)
  const credentialHandlerRef = useRef(onCredential)
  const errorHandlerRef = useRef(onError)

  const [isReady, setIsReady] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const handleCredential = useCallback((credential) => {
    credentialHandlerRef.current?.(credential)
  }, [])

  const handleError = useCallback((error) => {
    errorHandlerRef.current?.(error)
  }, [])

  useEffect(() => {
    credentialHandlerRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    errorHandlerRef.current = onError
  }, [onError])

  useEffect(() => {
    let isActive = true

    const setup = async () => {
      try {
        const google = await loadGoogleIdentity()
        if (!isActive) return

        if (!GOOGLE_CLIENT_ID) {
          throw new Error(
            'Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to the frontend environment.',
          )
        }

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              handleCredential(response.credential)
            } else {
              handleError(new Error('Google did not return a sign-in credential.'))
            }
          },
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        if (!containerRef.current) return

        containerRef.current.innerHTML = ''
        const width = Math.min(Math.max(containerRef.current.clientWidth, 220), 400)
        google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'pill',
          logo_alignment: 'center',
          width,
        })

        setIsReady(true)
        setHasFailed(false)
      } catch (error) {
        if (!isActive) return
        setHasFailed(true)
        handleError(error)
      }
    }

    setup()

    return () => {
      isActive = false
    }
  }, [handleCredential, handleError, text])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          or continue with
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div
        aria-busy={!isReady}
        className={cn(
          'flex min-h-11 justify-center transition-opacity',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <div ref={containerRef} className="flex w-full justify-center" />
      </div>

      {hasFailed ? (
        <p className="text-center text-xs text-muted">
          Google sign-in is unavailable right now. You can still use your email and password.
        </p>
      ) : null}
    </div>
  )
}

export default GoogleSignInButton
