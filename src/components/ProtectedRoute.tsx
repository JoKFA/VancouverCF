import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Protected Route Component
 * Ensures only authenticated users can access admin pages
 * 
 * Usage: Wrap any component that requires authentication
 * Example: <ProtectedRoute><AdminPage /></ProtectedRoute>
 * 
 * Behavior:
 * - If user is authenticated: renders the child component
 * - If user is not authenticated: redirects to admin login page
 * - While loading: shows loading spinner
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  
  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/admin-login" replace />
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}

export default ProtectedRoute