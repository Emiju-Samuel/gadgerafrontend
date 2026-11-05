import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'

/**
 * Guards a route by authentication and, optionally, role.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={[ROLES.ADMIN]}> <AdminLayout /> </ProtectedRoute>
 *   <Route element={<ProtectedRoute />}> ...child routes... </Route>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    const fallback = user?.role === ROLES.ADMIN ? '/admin' : '/'
    return <Navigate to={fallback} replace />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
