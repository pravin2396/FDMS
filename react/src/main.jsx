import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import { RestaurantProvider } from './context/RestaurantContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <RestaurantProvider>
          <App />
        </RestaurantProvider>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
