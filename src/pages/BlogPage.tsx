import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, Event, EventRecap } from '../lib/supabase'
import { ContentBlockRenderer } from '../components/recap/ContentBlockRenderer'
import mammoth from 'mammoth'

function BlogPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [recap, setRecap] = useState<EventRecap | null>(null)
  const [blogContent, setBlogContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useStructuredRecap, setUseStructuredRecap] = useState(false)

  useEffect(() => {
    if (eventId) {
      fetchEventAndBlog(eventId)
    }
  }, [eventId])

  const fetchEventAndBlog = async (id: string) => {
    try {
      // Fetch event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (eventError) throw eventError
      setEvent(eventData)

      // Try to fetch structured recap first
      const { data: recapData, error: recapError } = await supabase
        .from('event_recaps')
        .select('*')
        .eq('event_id', id)
        .eq('published', true)
        .single()

      if (recapData && !recapError) {
        // Use structured recap
        setRecap(recapData)
        setUseStructuredRecap(true)
      } else if (eventData.recap_file_url) {
        // Fallback to legacy file-based recap
        await processBlogFile(eventData.recap_file_url)
        setUseStructuredRecap(false)
      } else {
        // No recap available
        setError('No recap content available for this event')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event content')
    } finally {
      setLoading(false)
    }
  }

  const processBlogFile = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      
      if (fileUrl.toLowerCase().includes('.docx')) {
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setBlogContent(result.value)
      } else if (fileUrl.toLowerCase().includes('.pdf')) {
        // For PDF files, we'll show a message to download
        setBlogContent(`
          <div class="text-center p-8 bg-gray-50 rounded-lg">
            <p class="text-lg text-gray-600 mb-4">This content is available as a PDF document.</p>
            <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
               class="btn-primary inline-block">
              View PDF Document
            </a>
          </div>
        `)
      } else {
        throw new Error('Unsupported file format')
      }
    } catch (error) {
      console.error('Error processing blog file:', error)
      setBlogContent(`
        <div class="text-center p-8 bg-red-50 rounded-lg">
          <p class="text-red-600">Unable to display content. Please try downloading the file directly.</p>
          <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
             class="btn-primary inline-block mt-4">
            Download File
          </a>
        </div>
      `)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title + ' - Event Recap',
          text: recap?.summary || event?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const generatePDFSummary = () => {
    // This could be enhanced to generate actual PDFs
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
        />
      </div>
    )
  }

  if (error || !event) {
    return <Navigate to="/events" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20">
      <div className="max-w-6xl mx-auto section-padding">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/events" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 overflow-hidden"
        >
          {/* Featured Image */}
          {(recap?.featured_image_url || event.image_url) && (
            <div className="relative h-80 md:h-96 overflow-hidden rounded-2xl shadow-2xl mb-8">
              <img 
                src={recap?.featured_image_url || event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-sm font-semibold">
                    Event Recap
                  </span>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  {recap?.title || `${event.title} - Event Recap`}
                </h1>
              </div>
            </div>
          )}

          {/* Header without image */}
          {!(recap?.featured_image_url || event.image_url) && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                Event Recap
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {recap?.title || `${event.title} - Recap`}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Share2 size={16} className="mr-2" />
              Share Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePDFSummary}
              className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download size={16} className="mr-2" />
              Download Summary
            </motion.button>
          </div>
        </motion.header>

        {/* Content */}
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Summary */}
          {recap?.summary && (
            <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Summary</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{recap.summary}</p>
            </div>
          )}

          {/* Structured Content */}
          {useStructuredRecap && recap?.content_blocks ? (
            <ContentBlockRenderer blocks={recap.content_blocks} />
          ) : (
            /* Legacy Content */
            <>
              {/* Event Description */}
              <div className="mb-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              {/* Legacy Blog Content */}
              {blogContent && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Recap</h2>
                  <article className="prose prose-lg max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: blogContent }}
                      className="blog-content"
                    />
                  </article>
                </div>
              )}
            </>
          )}
        </motion.main>
      </div>
    </div>
  )
}

export default BlogPage