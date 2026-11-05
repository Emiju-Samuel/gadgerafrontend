import ProtectedRoute from '../components/layout/ProtectedRoute'
import CartPage from '../pages/customer/Cart/CartPage'
import CheckoutPage from '../pages/customer/Checkout/CheckoutPage'
import Home from '../pages/customer/Home'
import MyOrders from '../pages/customer/Orders/MyOrders'
import OrderTracking from '../pages/customer/Orders/OrderTracking'
import ChangePassword from '../pages/customer/Profile/ChangePassword'
import ProfilePage from '../pages/customer/Profile/ProfilePage'
import ProductDetails from '../pages/customer/Products/ProductDetails'
import ProductList from '../pages/customer/Products/ProductList'
import WriteReview from '../pages/customer/Reviews/WriteReview'
import WishlistPage from '../pages/customer/Wishlist/WishlistPage'
import { ROLES } from '../utils/constants'

const customerOnly = (element) => (
  <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>{element}</ProtectedRoute>
)

const customerRoutes = [
  { index: true, element: <Home /> },

  // Public (guest mode supported)
  { path: 'products', element: <ProductList /> },
  { path: 'products/:productId', element: <ProductDetails /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'track-order', element: <OrderTracking /> },
  { path: 'track-order/:trackingId', element: <OrderTracking /> },

  // Requires a signed-in customer
  { path: 'checkout', element: customerOnly(<CheckoutPage />) },
  { path: 'wishlist', element: customerOnly(<WishlistPage />) },
  { path: 'orders', element: customerOnly(<MyOrders />) },
  { path: 'orders/:orderId', element: customerOnly(<MyOrders />) },
  { path: 'products/:productId/review', element: customerOnly(<WriteReview />) },
  { path: 'profile', element: customerOnly(<ProfilePage />) },
  { path: 'profile/change-password', element: customerOnly(<ChangePassword />) },
]

export default customerRoutes
