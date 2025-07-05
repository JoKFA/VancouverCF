import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, Event } from '../lib/supabase'
import mammoth from 'mammoth'

/**
 * Blog page that displays event recap content from uploaded Word/PDF files
 */
function BlogPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [blogContent, setBlogContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (eventId) {
      fetchEventAndBlog(eventId)
    }
  }, [eventId])

  /**
   * Fetch event details and process blog file content
   */
  const fetchEventAndBlog = async (id: string) => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (eventError) throw eventError
      if (!eventData.recap_file_url) {
        setError('No blog content available for this event')
        setLoading(false)
        return
      }

      setEvent(eventData)

      // Fetch and process the blog file
      await processBlogFile(eventData.recap_file_url)
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event content')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Process uploaded Word/PDF file and convert to HTML
   */
  const processBlogFile = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      
      // Check file type and process accordingly
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !event) {
    return <Navigate to="/events" replace />
  }

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <header className="mb-8">
          {event.image_url && (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </header>

        {/* Event Description */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: blogContent }}
            className="blog-content"
          />
        </article>
      </div>

      <style jsx>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.75rem; }
        .blog-content h3 { font-size: 1.5rem; }
        
        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #374151;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

export default BlogPage