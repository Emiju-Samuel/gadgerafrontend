import { STORAGE_KEYS } from './constants'

const safeGet = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (private mode / quota). Non-fatal for the UI.
  }
}

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}

export const getToken = () => safeGet(STORAGE_KEYS.TOKEN)

export const setToken = (token) => safeSet(STORAGE_KEYS.TOKEN, token)

export const removeToken = () => safeRemove(STORAGE_KEYS.TOKEN)

export const getStoredUser = () => {
  const raw = safeGet(STORAGE_KEYS.USER)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setStoredUser = (user) => safeSet(STORAGE_KEYS.USER, JSON.stringify(user))

export const removeStoredUser = () => safeRemove(STORAGE_KEYS.USER)

export const clearAuthStorage = () => {
  removeToken()
  removeStoredUser()
}

// The cart is kept client side (localStorage) so guests can shop before
// signing in. It is reconciled with the server cart only at checkout.
export const getStoredCart = () => {
  const raw = safeGet(STORAGE_KEYS.CART)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setStoredCart = (cart) => safeSet(STORAGE_KEYS.CART, JSON.stringify(cart))

export const removeStoredCart = () => safeRemove(STORAGE_KEYS.CART)
