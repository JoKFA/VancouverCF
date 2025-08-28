import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
 * Sets up routing, authentication context, and admin access
 * 
 * Admin routes are always available but hidden from navigation
 * Access via direct URL: /admin-login and /admin
 */
function App() {
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
            
            {/* Admin routes - always available but hidden from navigation */}
            <Route path="admin-login" element={<AdminLoginPage />} />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App