import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

/**
 * Hidden admin login page accessible only via direct URL
 */
function AdminLoginPage() {
  const { user, signIn } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin" replace />
  }

  /**
   * Handle admin login
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if admin is enabled
    const adminEnvValue = import.meta.env.VITE_ADMIN_ENABLED
    if (adminEnvValue !== 'true' && adminEnvValue !== true) {
      setError('Admin access is not available in this environment')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      if (!loginForm.email.trim() || !loginForm.password.trim()) {
        throw new Error('Please enter both email and password')
      }
      
      await signIn(loginForm.email, loginForm.password)
      // Navigation will happen automatically via the auth context
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-100/30 to-purple-100/30 rounded-full blur-xl" />

        <div className="relative">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Shield size={32} className="text-purple-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Access</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium hover:border-purple-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium hover:border-purple-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50" />
              )}
              <div className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </div>
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-purple-50/50 rounded-xl border border-purple-100"
          >
            <p className="text-sm text-purple-800 text-center">
              <strong>Team Members Only</strong>
            </p>
            <p className="text-xs text-purple-600 text-center mt-1">
              This page is restricted to authorized team members with valid credentials.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage