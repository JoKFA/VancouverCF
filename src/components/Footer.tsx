import { Phone, Mail } from 'lucide-react'

/**
 * Footer component with contact information
 */
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">VIVA</h3>
            <p className="text-gray-300 leading-relaxed">
              Empowering individuals through community engagement and career development 
              opportunities in Greater Vancouver.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/events" className="text-gray-300 hover:text-primary-400 transition-colors">Events</a></li>
              <li><a href="/resume" className="text-gray-300 hover:text-primary-400 transition-colors">Submit Resume</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={18} className="text-primary-400 mr-3" />
                <span className="text-gray-300">236-996-6136</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-primary-400 mr-3" />
                <a 
                  href="mailto:careerfairinvan@gmail.com" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  careerfairinvan@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 VIVA Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer