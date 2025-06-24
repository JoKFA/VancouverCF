import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, FileText } from 'lucide-react'
import { supabase, Event } from '../lib/supabase'

/**
 * Events page displaying upcoming and past events
 */
function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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
   * Event card component
   */
  const EventCard = ({ event }: { event: Event }) => (
    <div className="card p-6">
      {event.image_url && (
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full h-48 object-cover mb-4 rounded-lg"
        />
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {event.title}
      </h3>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={16} className="mr-2" />
        <span>{formatDate(event.date)}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin size={16} className="mr-2" />
        <span>{event.location}</span>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {event.description}
      </p>
      {event.status === 'past' && event.recap_file_url && (
        <Link 
          to={`/events/${event.id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <FileText size={16} className="mr-2" />
          View Blog
        </Link>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming career opportunities and explore insights from our past events
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No past events to display yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default EventsPage