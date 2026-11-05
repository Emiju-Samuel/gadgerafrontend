import AnalyticsPage from '../pages/admin/Analytics/AnalyticsPage'
import CategoryForm from '../pages/admin/Categories/CategoryForm'
import CategoryList from '../pages/admin/Categories/CategoryList'
import CouponFormPage from '../pages/admin/Coupons/CouponFormPage'
import CouponList from '../pages/admin/Coupons/CouponList'
import Dashboard from '../pages/admin/Dashboard'
import FaqFormPage from '../pages/admin/FAQs/FaqFormPage'
import FaqList from '../pages/admin/FAQs/FaqList'
import OrderDetails from '../pages/admin/Orders/OrderDetails'
import OrderList from '../pages/admin/Orders/OrderList'
import ProductDetailsAdmin from '../pages/admin/Products/ProductDetailsAdmin'
import ProductFormPage from '../pages/admin/Products/ProductFormPage'
import ProductList from '../pages/admin/Products/ProductList'
import AdminProfile from '../pages/admin/Profile/AdminProfile'

const adminRoutes = [
  { index: true, element: <Dashboard /> },

  { path: 'analytics', element: <AnalyticsPage /> },

  { path: 'categories', element: <CategoryList /> },
  { path: 'categories/new', element: <CategoryForm /> },
  { path: 'categories/:categoryId/edit', element: <CategoryForm /> },

  { path: 'products', element: <ProductList /> },
  { path: 'products/new', element: <ProductFormPage /> },
  { path: 'products/:productId', element: <ProductDetailsAdmin /> },
  { path: 'products/:productId/edit', element: <ProductFormPage /> },

  { path: 'orders', element: <OrderList /> },
  { path: 'orders/:orderId', element: <OrderDetails /> },

  { path: 'coupons', element: <CouponList /> },
  { path: 'coupons/new', element: <CouponFormPage /> },
  { path: 'coupons/:couponId/edit', element: <CouponFormPage /> },

  { path: 'faqs', element: <FaqList /> },
  { path: 'faqs/new', element: <FaqFormPage /> },
  { path: 'faqs/:faqId/edit', element: <FaqFormPage /> },

  { path: 'profile', element: <AdminProfile /> },
]

export default adminRoutes
