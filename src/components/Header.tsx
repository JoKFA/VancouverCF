import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  // Remove unused auth variables since admin access is now hidden

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resume', href: '/resume' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActivePath = (href: string) => {
    return location.pathname === href
  }

  const getHeaderStyles = () => {
    if (isHomePage) {
      return scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-white/20' 
        : 'bg-transparent'
    } else {
      return scrolled
        ? 'bg-white/98 backdrop-blur-lg shadow-xl border-b border-purple-100'
        : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100/50'
    }
  }

  const getTextColor = (isActive = false) => {
    if (isHomePage && !scrolled) {
      return isActive 
        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
        : 'text-white hover:text-purple-200 hover:bg-white/10'
    } else {
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

            <div className="hidden md:flex items-center space-x-6">
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

            </div>

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