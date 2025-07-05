import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

/**
 * Enhanced navigation header with improved visibility on all pages
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  
  // Check if admin functionality is enabled
  const isAdminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resume', href: '/resume' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  // Check if we're on homepage
  const isHomePage = location.pathname === '/'

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

  // Determine header styling based on page and scroll state
  const getHeaderStyles = () => {
    if (isHomePage) {
      // Homepage: transparent when at top, solid when scrolled
      return scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-white/20' 
        : 'bg-transparent'
    } else {
      // Other pages: always solid background for visibility
      return scrolled
        ? 'bg-white/98 backdrop-blur-lg shadow-xl border-b border-purple-100'
        : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100/50'
    }
  }

  // Determine text colors based on page and scroll state
  const getTextColor = (isActive = false) => {
    if (isHomePage && !scrolled) {
      // Homepage at top: white text
      return isActive 
        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
        : 'text-white hover:text-purple-200 hover:bg-white/10'
    } else {
      // All other cases: dark text
      return isActive
        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
    }
  }

  const getLogoTextColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white'
    } else {
      return 'text-orange-600'
    }
  }

  const getSubtitleColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white/80'
    } else {
      return 'text-gray-600'
    }
  }

  const getButtonColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white hover:bg-white/10 border border-white/30'
    } else {
      return 'text-purple-600 hover:bg-purple-50 border border-purple-200'
    }
  }

  const getMobileButtonColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white hover:bg-white/10'
    } else {
      return 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderStyles()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex items-center"
              >
                <img 
                  src="/cropped-unnamed-1.png" 
                  alt="Vancouver Career Fair" 
                  className="h-12 w-12 mr-3 rounded-lg shadow-lg"
                />
                <div className="flex flex-col">
                  <span className={`text-2xl font-black transition-colors ${getLogoTextColor()}`}>
                    Vancouver
                  </span>
                  <span className={`text-xs font-medium transition-colors ${getSubtitleColor()}`}>
                    Career Fair
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation and Admin Section */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Navigation */}
              <nav className="flex space-x-6">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`relative px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group ${getTextColor(isActivePath(item.href))}`}
                    >
                      {item.name}
                      {isActivePath(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl -z-10 shadow-lg"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Admin/Auth Section */}
              {user && isAdminEnabled ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'text-white hover:bg-white/10'
                        : 'text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Shield size={16} className="mr-2" />
                    Admin
                  </Link>
                  <button
                    onClick={signOut}
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              ) : user && !isAdminEnabled ? (
                <button
                  onClick={signOut}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
                    isHomePage && !scrolled 
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Sign Out
                </button>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`md:hidden p-3 rounded-xl transition-colors ${getMobileButtonColor()}`}
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
                <div className="py-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-2xl mt-4 border border-white/20 shadow-xl">
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
                            ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Admin Access */}
                  <div className="border-t border-gray-200 mt-4 pt-4 mx-2">
                    {user && isAdminEnabled ? (
                      <div className="space-y-2">
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-base font-semibold text-purple-600 hover:bg-purple-50 rounded-xl"
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
                    ) : user && !isAdminEnabled ? (
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 text-base font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                      >
                        Sign Out
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

    </>
  )
}

export default Header