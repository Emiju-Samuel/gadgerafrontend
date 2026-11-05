import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { googleAuthRequest, loginRequest, registerRequest } from '../api/authApi'
import { AuthContext } from '../hooks/useAuth'
import { AUTH_UNAUTHORIZED_EVENT, CART_CLEAR_EVENT, ROLES } from '../utils/constants'
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  removeStoredCart,
  setStoredUser,
  setToken,
} from '../utils/storage'

const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
}

const initialState = {
  user: null,
  token: null,
}

const initAuthState = () => {
  const token = getToken()
  const user = getStoredUser()
  if (token && user) return { user, token }
  return initialState
}

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return { user: action.payload.user, token: action.payload.token }
    case AUTH_ACTIONS.LOGOUT:
      return initialState
    case AUTH_ACTIONS.UPDATE_USER:
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state
    default:
      return state
  }
}

const extractToken = (headers = {}) => {
  const raw = headers.authorization || headers.Authorization || ''
  return raw.startsWith('Bearer ') ? raw.slice(7) : raw
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, undefined, initAuthState)
  const navigate = useNavigate()

  const persistSession = useCallback((user, token) => {
    setToken(token)
    setStoredUser(user)
    dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user, token } })
  }, [])

  const login = useCallback(
    async (email, password, extraUser = {}) => {
      const response = await loginRequest({ email, password })
      const token = extractToken(response.headers)

      if (!token) {
        throw new Error('Authentication token missing from server response.')
      }

      const { userId, role, name, email: responseEmail, authProvider } = response.data ?? {}
      const user = {
        id: userId ?? extraUser.id ?? null,
        email: responseEmail ?? email,
        role: role ?? extraUser.role ?? null,
        name: name ?? extraUser.name ?? null,
        authProvider: authProvider ?? extraUser.authProvider ?? 'LOCAL',
      }

      persistSession(user, token)
      return user
    },
    [persistSession],
  )

  const loginWithGoogle = useCallback(
    async (credential) => {
      const response = await googleAuthRequest(credential)
      const token = extractToken(response.headers)

      if (!token) {
        throw new Error('Authentication token missing from server response.')
      }

      const { userId, role, name, email, authProvider } = response.data ?? {}
      const user = {
        id: userId ?? null,
        email: email ?? null,
        role: role ?? null,
        name: name ?? null,
        authProvider: authProvider ?? 'GOOGLE',
      }

      persistSession(user, token)
      return user
    },
    [persistSession],
  )

  const register = useCallback(
    async ({ name, email, password }) => {
      const response = await registerRequest({ name, email, password })
      const created = response.data ?? {}
      // Sign-up does not return a token, so we log the new customer in right away.
      return login(email, password, {
        id: created.id,
        name: created.name ?? name,
        role: created.userRole,
        authProvider: created.authProvider,
      })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearAuthStorage()
    removeStoredCart()
    window.dispatchEvent(new Event(CART_CLEAR_EVENT))
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
    navigate('/login', { replace: true })
  }, [navigate])

  // Keep the persisted profile (e.g. an updated display name) in sync.
  const updateUser = useCallback((patch) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: patch })
  }, [])

  useEffect(() => {
    if (state.user) setStoredUser(state.user)
  }, [state.user])

  useEffect(() => {
    const handleUnauthorized = () => {
      removeStoredCart()
      window.dispatchEvent(new Event(CART_CLEAR_EVENT))
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.error('Your session has expired. Please sign in again.')
      navigate('/login', { replace: true })
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate])

  const value = useMemo(() => {
    const isAuthenticated = Boolean(state.token && state.user)
    return {
      user: state.user,
      token: state.token,
      isAuthenticated,
      isAdmin: state.user?.role === ROLES.ADMIN,
      isCustomer: state.user?.role === ROLES.CUSTOMER,
      login,
      loginWithGoogle,
      register,
      logout,
      updateUser,
    }
  }, [state.user, state.token, login, loginWithGoogle, register, logout, updateUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
