import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, Event } from '../lib/supabase'
import mammoth from 'mammoth'

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

  const fetchEventAndBlog = async (id: string) => {
    try {
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

      await processBlogFile(eventData.recap_file_url)
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
        // Enhanced mammoth configuration to preserve Word formatting
        const result = await mammoth.convertToHtml({ arrayBuffer }, {
          // Preserve styling from Word document
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh", 
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "p[style-name='Title'] => h1.doc-title:fresh",
            "p[style-name='Subtitle'] => h2.doc-subtitle:fresh",
            "r[style-name='Strong'] => strong",
            "p[style-name='Quote'] => blockquote > p:fresh"
          ],
          // Convert images and preserve inline styles
          convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(function(imageBuffer) {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
              }
            })
          }),
          // Include default paragraph styles
          includeDefaultStyleMap: true,
          // Preserve embedded styles
          includeEmbeddedStyleMap: true
        })
        
        // Set the converted content
        setBlogContent(result.value)
        
        // Log warnings if any formatting couldn't be converted
        if (result.messages.length > 0) {
          console.warn('Word document conversion warnings:', result.messages)
          
          // Show user-friendly message for conversion issues
          const hasImportantWarnings = result.messages.some(msg => 
            msg.type === 'error' || msg.message.includes('Unrecognised')
          )
          
          if (hasImportantWarnings) {
            setBlogContent(result.value + `
              <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="text-sm text-amber-700">
                  <strong>Note:</strong> Some formatting from the original Word document may not display perfectly. 
                  The content has been converted to preserve as much styling as possible.
                </p>
              </div>
            `)
          }
        }
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
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>

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

        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {event.description}
          </p>
        </div>

        <article className="blog-content">
          <div 
            dangerouslySetInnerHTML={{ __html: blogContent }}
          />
        </article>
      </div>
    </div>
  )
}

export default BlogPage