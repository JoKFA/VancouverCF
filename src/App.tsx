import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BlogPage from './pages/BlogPage'
import ResumePage from './pages/ResumePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Conditionally import admin components based on environment
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'))
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'))

/**
 * Component to handle admin login route based on environment
 */
const AdminLoginHandler = () => {
  const isAdminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  
  if (!isAdminEnabled) {
    return <Navigate to="/" replace />
  }
  
  return <AdminLoginPage />
}

/**
 * Component to handle admin route based on environment
 */
const AdminHandler = () => {
  const isAdminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  
  if (!isAdminEnabled) {
    return <Navigate to="/" replace />
  }
  
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  )
}

/**
 * Main application component that sets up routing and authentication context
 */
function App() {

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
            
            {/* Admin routes - will redirect to home if admin is disabled */}
            <Route path="admin-login" element={<AdminLoginHandler />} />
            <Route path="admin" element={<AdminHandler />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
    </AuthProvider>
  )
}

export default App