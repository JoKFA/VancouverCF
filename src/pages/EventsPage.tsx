import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, FileText, Clock, Users, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { supabase, Event } from '../lib/supabase'

function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      const upcoming = data?.filter(event => event.status === 'upcoming') || []
      const past = data?.filter(event => event.status === 'past') || []

      setUpcomingEvents(upcoming)
      setPastEvents(past)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="card card-hover group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      
      <div className="relative overflow-hidden">
        {event.image_url ? (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  event.status === 'upcoming' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                }`}
              >
                {event.status === 'upcoming' ? (
                  <span className="flex items-center">
                    <Sparkles size={14} className="mr-1" />
                    Upcoming
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Star size={14} className="mr-1" />
                    Past Event
                  </span>
                )}
              </motion.span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
            <Calendar size={48} className="text-white/70 relative z-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>
        )}
      </div>

      <div className="p-6 relative">
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          {event.title}
        </motion.h3>
        
        <div className="space-y-3 mb-4">
          <motion.div 
            className="flex items-center text-gray-600"
            whileHover={{ x: 3 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <span className="font-medium">{formatDate(event.date)}</span>
          </motion.div>
          <motion.div 
            className="flex items-center text-gray-600"
            whileHover={{ x: 3 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
              <MapPin size={16} className="text-orange-600" />
            </div>
            <span>{event.location}</span>
          </motion.div>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>

        {event.status === 'past' && event.recap_file_url && (
          <Link 
            to={`/events/${event.id}`}
            className="inline-flex items-center text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/link"
          >
            <FileText size={16} className="mr-2" />
            View Event Recap
            <motion.div
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Link>
        )}

        {event.status === 'upcoming' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
              <Clock size={16} className="mr-2" />
              <span className="font-semibold">Registration Open</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Users size={16} className="mr-1" />
              <span className="text-sm">Join us</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20">
      {/* Enhanced Header Section */}
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
                <Sparkles className="w-5 h-5 mr-2" />
                Career Development Events
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Events</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                Discover upcoming career opportunities and explore insights from our past events
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto section-padding">
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center mb-12"
          >
            <div className="flex items-center">
              <div className="w-3 h-16 bg-gradient-to-b from-green-500 via-emerald-500 to-purple-500 rounded-full mr-4 shadow-lg" />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Upcoming Events
                </h2>
                <p className="text-gray-600">Don't miss these exciting opportunities</p>
              </div>
            </div>
          </motion.div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full blur-xl" />
              
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar size={32} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  We're planning exciting new events. Check back soon for updates!
                </p>
              </div>
            </motion.div>
          )}
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center mb-12"
          >
            <div className="flex items-center">
              <div className="w-3 h-16 bg-gradient-to-b from-purple-500 via-blue-500 to-gray-500 rounded-full mr-4 shadow-lg" />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Past Events
                </h2>
                <p className="text-gray-600">Explore our successful events and their impact</p>
              </div>
            </div>
          </motion.div>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full blur-xl" />
              
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Past Events</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Our event history will appear here as we host more events.
                </p>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}

export default EventsPage