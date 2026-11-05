import { useRoutes } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import CustomerLayout from '../components/layout/CustomerLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound'
import adminRoutes from './AdminRoutes'
import customerRoutes from './CustomerRoutes'
import { ROLES } from '../utils/constants'

const AppRoutes = () => {
  return useRoutes([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },

    {
      element: <CustomerLayout />,
      children: customerRoutes,
    },

    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: adminRoutes,
    },

    { path: '*', element: <NotFound /> },
  ])
}

export default AppRoutes
