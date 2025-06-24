import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, FileText, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { supabase, Event } from '../lib/supabase'

/**
 * Enhanced events page with animations and modern design
 */
function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    fetchEvents()
  }, [])

  /**
   * Fetch events from Supabase and categorize by status
   */
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

  /**
   * Format date string for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Enhanced event card component
   */
  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="card card-hover group"
    >
      <div className="relative overflow-hidden">
        {event.image_url ? (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                event.status === 'upcoming' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Calendar size={48} className="text-white/50" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-3 text-primary-500" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-3 text-primary-500" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>

        {event.status === 'past' && event.recap_file_url && (
          <Link 
            to={`/events/${event.id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group/link"
          >
            <FileText size={16} className="mr-2" />
            View Event Recap
            <motion.div
              className="ml-1"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Link>
        )}

        {event.status === 'upcoming' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-primary-600">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <section className="gradient-bg text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Career <span className="text-yellow-300">Events</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover upcoming career opportunities and explore insights from our past events
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto section-padding">
        {/* Upcoming Events */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center mb-12"
          >
            <div className="flex items-center">
              <div className="w-2 h-12 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-4" />
              <h2 className="text-4xl font-bold text-gray-900">
                Upcoming Events
              </h2>
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
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                We're planning exciting new events. Check back soon for updates!
              </p>
            </motion.div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center mb-12"
          >
            <div className="flex items-center">
              <div className="w-2 h-12 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-4" />
              <h2 className="text-4xl font-bold text-gray-900">
                Past Events
              </h2>
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
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Past Events</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Our event history will appear here as we host more events.
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}

export default EventsPage