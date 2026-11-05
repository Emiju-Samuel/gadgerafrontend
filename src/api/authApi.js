import api from './axios'
import { AUTH_ENDPOINTS } from '../utils/constants'

/**
 * Authenticates a user.
 * The backend expects { username, password } where username is the email.
 * The JWT is returned in the `Authorization` response header.
 */
export const loginRequest = ({ email, password }) =>
  api.post(AUTH_ENDPOINTS.LOGIN, { username: email, password })

/**
 * Registers a customer account.
 * The backend expects { name, email, password } and returns the created user.
 */
export const registerRequest = ({ name, email, password }) =>
  api.post(AUTH_ENDPOINTS.REGISTER, { name, email, password })

/**
 * Exchanges a Google ID token for a Gadgera JWT.
 * The backend verifies the token, then returns the JWT in the
 * `Authorization` response header, exactly like password sign-in.
 */
export const googleAuthRequest = (credential) =>
  api.post(AUTH_ENDPOINTS.GOOGLE, { credential })
