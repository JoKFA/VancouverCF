import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Send, Clock, Users, Star, Heart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { supabase, TeamMember } from '../lib/supabase'

/**
 * Contact page with team section and contact information
 */
function ContactPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [teamRef, teamInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [contactRef, contactInView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  /**
   * Fetch team members from database
   */
  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle contact form submission
   */
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      // In a real application, you would send this to your backend or email service
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setFormSuccess(true)
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error submitting contact form:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      content: '236-996-6136',
      link: 'tel:236-996-6136',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      content: 'careerfairinvan@gmail.com',
      link: 'mailto:careerfairinvan@gmail.com',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location',
      content: 'Greater Vancouver, BC',
      link: '#',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Office Hours',
      content: 'Mon - Fri: 9AM - 5PM',
      link: '#',
      color: 'from-orange-500 to-purple-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        
        <div className="relative section-padding text-white">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium mb-6"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Us</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                Ready to take the next step in your career? We're here to help you succeed.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-100/20 to-purple-100/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            ref={contactRef}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Touch</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about our events or want to get involved? We'd love to hear from you!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={index}
                      href={info.link}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="card p-6 text-center group relative overflow-hidden block"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${info.color} text-white mb-4 shadow-lg`}>
                          {info.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        <p className="text-gray-600">
                          {info.content}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={itemVariants} className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full blur-2xl" />
                
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h3>

                  {formSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-green-500" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Sent!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Thank you for reaching out. We'll get back to you soon!
                      </p>
                      <button
                        onClick={() => setFormSuccess(false)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                          placeholder="What's this about?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          rows={5}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                          placeholder="Tell us how we can help..."
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={formSubmitting}
                        whileHover={!formSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!formSubmitting ? { scale: 0.98 } : {}}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-center">
                          {formSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="bg-gradient-to-br from-gray-50 to-purple-50/50 section-padding relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-orange-200/15 to-purple-200/15 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            ref={teamRef}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Team</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Meet the passionate individuals dedicated to empowering your career journey
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
                />
              </div>
            ) : teamMembers.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="card p-8 text-center group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto mb-6 relative">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <Users className="w-8 h-8 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-purple-600 font-semibold mb-4">
                        {member.title}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    We're building an amazing team. Check back soon to meet our dedicated professionals!
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-200/15 to-purple-200/15 rounded-full blur-2xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Connect?</span>
            </h2>
            <div className="flex items-center justify-center mb-8">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              <p className="text-xl text-gray-600">
                We're here to support your career journey every step of the way.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="/events" 
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">View Our Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="/resume" 
                className="bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-8 rounded-xl border-2 border-purple-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl"
              >
                Submit Your Resume
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage