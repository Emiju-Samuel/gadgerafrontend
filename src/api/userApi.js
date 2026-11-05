import api from './axios'
import { CUSTOMER_ENDPOINTS } from '../utils/constants'

/**
 * Customer account endpoints. The profile `img` travels as a base64 string
 * (matching how the backend serialises images elsewhere).
 */
export const getProfile = (userId) => api.get(`${CUSTOMER_ENDPOINTS.PROFILE}/${userId}`)

export const updateProfile = (userId, { name, img }) =>
  api.put(`${CUSTOMER_ENDPOINTS.PROFILE}/${userId}`, buildProfilePayload({ name, img }))

export const changePassword = (userId, { currentPassword, newPassword }) =>
  api.put(`${CUSTOMER_ENDPOINTS.CHANGE_PASSWORD}/${userId}`, { currentPassword, newPassword })

// `img` is only sent when it is provided: a string replaces the avatar, an
// empty string clears it, and `undefined` leaves the current avatar untouched.
const buildProfilePayload = ({ name, img }) => {
  const payload = { name }
  if (img !== undefined) payload.img = img
  return payload
}
