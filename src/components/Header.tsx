import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

/**
 * Enhanced navigation header with animations and glass morphism effect
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const location = useLocation()
  const { user, signIn, signOut } = useAuth()

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resume', href: '/resume' },
    { name: 'About', href: '/about' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * Check if current path matches navigation item
   */
  const isActivePath = (href: string) => {
    return location.pathname === href
  }

  /**
   * Handle admin login
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(loginForm.email, loginForm.password)
      setShowLoginModal(false)
      setLoginForm({ email: '', password: '' })
    } catch (error) {
      alert('Login failed. Please check your credentials.')
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.span 
                className="text-3xl font-black text-gradient"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                VIVA
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      isActivePath(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : scrolled 
                          ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                          : 'text-white hover:text-primary-200 hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                    {isActivePath(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-100 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Admin/Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      scrolled 
                        ? 'text-primary-600 hover:bg-primary-50'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Shield size={16} className="mr-2" />
                    Admin
                  </Link>
                  <button
                    onClick={signOut}
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      scrolled 
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                    scrolled 
                      ? 'text-primary-600 hover:bg-primary-50'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Shield size={16} className="mr-2" />
                  Admin Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`md:hidden p-3 rounded-xl transition-colors ${
                scrolled 
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2 bg-white/90 backdrop-blur-md rounded-2xl mt-4 border border-white/20">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={`block px-6 py-3 text-base font-semibold transition-all duration-300 rounded-xl mx-2 ${
                          isActivePath(item.href)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Admin Access */}
                  <div className="border-t border-gray-200 mt-4 pt-4 mx-2">
                    {user ? (
                      <div className="space-y-2">
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-base font-semibold text-primary-600 hover:bg-primary-50 rounded-xl"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Shield size={16} className="mr-2" />
                          Admin Panel
                        </Link>
                        <button
                          onClick={() => {
                            signOut()
                            setIsMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 text-base font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLoginModal(true)
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center px-4 py-3 text-base font-semibold text-primary-600 hover:bg-primary-50 rounded-xl w-full"
                      >
                        <Shield size={16} className="mr-2" />
                        Admin Login
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
                <p className="text-gray-600">Enter your credentials to access the admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>For development/testing:</strong>
                </p>
                <p className="text-xs text-gray-500">
                  You'll need to set up Supabase authentication and create admin users in your database.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header