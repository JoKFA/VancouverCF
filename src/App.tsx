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

// Lazy load admin components to reduce bundle size for public users
// These components are only loaded when admin functionality is enabled
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'))
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'))

/**
 * Main Application Component
 * Sets up routing, authentication context, and conditional admin access
 * 
 * Environment-based admin access:
 * - VITE_ADMIN_ENABLED=true: Full admin functionality (staging/development)
 * - VITE_ADMIN_ENABLED=false: Public-only site (production)
 */
function App() {
  // Check if admin functionality should be enabled based on environment variable
  const isAdminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'

  return (
    <AuthProvider>
      {/* Suspense wrapper for lazy-loaded admin components */}
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      }>
        <Routes>
          {/* Main layout wrapper for all pages */}
          <Route path="/" element={<Layout />}>
            {/* Public routes - always available */}
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<BlogPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            
            {/* Admin routes - only available when admin is enabled */}
            {isAdminEnabled && (
              <>
                <Route path="admin-login" element={<AdminLoginPage />} />
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
              </>
            )}
            
            {/* Redirect admin routes to home when admin is disabled (production) */}
            {!isAdminEnabled && (
              <>
                <Route path="admin-login" element={<Navigate to="/" replace />} />
                <Route path="admin" element={<Navigate to="/" replace />} />
              </>
            )}
            
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
    </AuthProvider>
  )
}

export default App