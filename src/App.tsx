import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BlogPage from './pages/BlogPage'
import ResumePage from './pages/ResumePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Conditionally import admin components
const AdminPage = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  ? React.lazy(() => import('./pages/AdminPage'))
  : () => Promise.resolve({ default: () => <div>Admin not available</div> })

const AdminLoginPage = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  ? React.lazy(() => import('./pages/AdminLoginPage'))
  : () => Promise.resolve({ default: () => <div>Admin not available</div> })

const ProtectedRoute = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  ? React.lazy(() => import('./components/ProtectedRoute'))
  : () => Promise.resolve({ default: ({ children }: any) => children })

/**
 * Main application component that sets up routing and authentication context
 */
function App() {
  const adminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'

  return (
    <AuthProvider>
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<BlogPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            
            {/* Admin routes only available when enabled */}
            {adminEnabled && (
              <Route path="admin-login" element={<AdminLoginPage />} />
            )}
            {adminEnabled && (
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            )}
          </Route>
        </Routes>
      </React.Suspense>
    </AuthProvider>
  )
}

export default App