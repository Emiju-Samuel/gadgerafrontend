import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ROLES } from './constants'

export const cn = (...inputs) => twMerge(clsx(inputs))

/**
 * Normalises an Axios error into a human readable message.
 * The backend returns plain strings for validation errors and JSON for others.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response) {
    const { data } = error.response
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data.message === 'string' && data.message.trim()) return data.message
    return fallback
  }
  if (error?.request) return 'Unable to reach the server. Please check your connection.'
  return error?.message || fallback
}

export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export const formatDisplayName = (user) =>
  user?.name?.trim() || user?.email?.split('@')[0] || 'there'

/**
 * Decides where to send a user after (or while) being authenticated:
 * admin goes to the console, customers return to the page they came from
 * (e.g. checkout after guest browsing), otherwise the storefront home.
 */
export const resolvePostAuthRedirect = (user, from) => {
  const fallback = user?.role === ROLES.ADMIN ? '/admin' : '/'
  if (from?.pathname) {
    return `${from.pathname}${from.search ?? ''}`
  }
  return fallback
}
