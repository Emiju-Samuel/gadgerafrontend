import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import AuthProvider from './context/AuthContext'
import CartProvider from './context/CartContext'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: '16px',
                fontFamily: 'inherit',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
