import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import { RestaurantProvider } from './context/RestaurantContext'
import { MenuProvider } from './context/MenuContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <DashboardProvider>
          <RestaurantProvider>
            <MenuProvider>
              <CartProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CartProvider>
            </MenuProvider>
          </RestaurantProvider>
        </DashboardProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
