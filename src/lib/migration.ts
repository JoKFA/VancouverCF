import { supabase, Event, EventRecap, ContentBlock } from './supabase'
import mammoth from 'mammoth'

export interface MigrationResult {
  success: boolean
  eventId: string
  recapId?: string
  error?: string
}

/**
 * Migration utility to convert existing events to structured recap system
 */
export class EventMigrationService {
  
  /**
   * Migrate all existing events to the new structured system
   */
  async migrateAllEvents(): Promise<MigrationResult[]> {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    const results: MigrationResult[] = []

    for (const event of events || []) {
      try {
        const result = await this.migrateEvent(event)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          eventId: event.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  /**
   * Migrate a single event to structured recap
   */
  async migrateEvent(event: Event): Promise<MigrationResult> {
    // Skip if already has a structured recap
    const existingRecap = await this.getExistingRecap(event.id)
    if (existingRecap) {
      return {
        success: true,
        eventId: event.id,
        recapId: existingRecap.id,
        error: 'Already migrated'
      }
    }

    // Create structured recap based on existing data
    const contentBlocks = await this.createContentBlocks(event)

    const recap: Omit<EventRecap, 'id' | 'created_at' | 'updated_at'> = {
      event_id: event.id,
      title: `${event.title} - Event Recap`,
      summary: `Thank you for attending ${event.title}! Here's a recap of our event held on ${new Date(event.date).toLocaleDateString()}.`,
      content_blocks: contentBlocks,
      featured_image_url: event.image_url,
      seo_meta: {
        description: `Recap of ${event.title} held on ${new Date(event.date).toLocaleDateString()}`,
        keywords: ['career fair', 'networking', 'jobs', 'vancouver', event.title.toLowerCase()]
      },
      published: event.status === 'past',
      author_id: undefined
    }

    const { data: createdRecap, error } = await supabase
      .from('event_recaps')
      .insert([recap])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create recap: ${error.message}`)
    }

    return {
      success: true,
      eventId: event.id,
      recapId: createdRecap.id
    }
  }

  /**
   * Create content blocks from existing event data
   */
  private async createContentBlocks(event: Event): Promise<ContentBlock[]> {
    const blocks: ContentBlock[] = []
    let order = 0

    // Add main description as text block
    if (event.description) {
      blocks.push({
        id: `text-${order}`,
        type: 'text',
        order: order++,
        content: {
          text: `<p>${event.description}</p>`,
          style: 'normal'
        }
      })
    }

    // If there's a recap file, try to convert it
    if (event.recap_file_url) {
      try {
        const convertedContent = await this.convertRecapFile(event.recap_file_url)
        if (convertedContent) {
          blocks.push({
            id: `converted-${order}`,
            type: 'text',
            order: order++,
            content: {
              text: convertedContent,
              style: 'normal'
            }
          })
        }
      } catch (error) {
        console.warn(`Failed to convert recap file for event ${event.id}:`, error)
        // Add a fallback block with download link
        blocks.push({
          id: `file-link-${order}`,
          type: 'text',
          order: order++,
          content: {
            text: `<div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="mb-4">Event recap available for download:</p>
              <a href="${event.recap_file_url}" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Download Event Recap
              </a>
            </div>`,
            style: 'callout'
          }
        })
      }
    }

    // Add sample statistics for past events (can be customized later)
    if (event.status === 'past') {
      blocks.push({
        id: `stats-${order}`,
        type: 'statistics',
        order: order++,
        content: {
          stats: [
            { label: 'Attendees', value: 'TBD', icon: 'users' },
            { label: 'Companies', value: 'TBD', icon: 'trending' },
            { label: 'Connections Made', value: 'TBD', icon: 'star' },
            { label: 'Success Stories', value: 'TBD', icon: 'award' }
          ],
          layout: 'grid',
          style: 'gradient'
        }
      } as ContentBlock)
    }

    // Add placeholder highlights section
    if (event.status === 'past') {
      blocks.push({
        id: `highlights-${order}`,
        type: 'highlights',
        order: order++,
        content: {
          items: [
            { text: 'Successful networking event with high attendance' },
            { text: 'Strong employer participation and engagement' },
            { text: 'Positive feedback from both job seekers and employers' },
            { text: 'Multiple job connections and interview opportunities created' }
          ],
          style: 'checklist'
        }
      })
    }

    return blocks
  }

  /**
   * Convert existing recap file to HTML content
   */
  private async convertRecapFile(fileUrl: string): Promise<string | null> {
    if (!fileUrl) return null

    try {
      const response = await fetch(fileUrl)
      if (!response.ok) return null

      const arrayBuffer = await response.arrayBuffer()
      
      if (fileUrl.toLowerCase().includes('.docx')) {
        const result = await mammoth.convertToHtml({ arrayBuffer })
        return result.value
      } else if (fileUrl.toLowerCase().includes('.pdf')) {
        // For PDFs, return a download link since we can't easily extract text
        return `<div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="mb-4 text-gray-700">This recap was originally in PDF format.</p>
          <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Original PDF Recap
          </a>
        </div>`
      }
    } catch (error) {
      console.warn('Error converting file:', error)
      return null
    }

    return null
  }

  /**
   * Check if event already has a structured recap
   */
  private async getExistingRecap(eventId: string): Promise<EventRecap | null> {
    const { data, error } = await supabase
      .from('event_recaps')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (error) return null
    return data
  }

  /**
   * Generate sample content for testing
   */
  async createSampleRecap(eventId: string): Promise<MigrationResult> {
    // Fetch the event to get its image
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError) {
      throw new Error(`Failed to fetch event: ${eventError.message}`)
    }

    const sampleBlocks: ContentBlock[] = [
      {
        id: 'intro-text',
        type: 'text',
        order: 0,
        content: {
          text: `<p>Our recent career fair was a tremendous success, bringing together job seekers and employers in a dynamic networking environment. The event showcased the vibrant tech and business community in Vancouver while creating meaningful connections.</p>`,
          style: 'normal'
        }
      },
      {
        id: 'stats',
        type: 'statistics',
        order: 1,
        content: {
          stats: [
            { label: 'Total Attendees', value: 250, icon: 'users', highlight: true },
            { label: 'Companies Present', value: 45, icon: 'trending' },
            { label: 'Connections Made', value: 180, icon: 'star' },
            { label: 'Job Offers Extended', value: 12, icon: 'award', highlight: true }
          ],
          layout: 'grid',
          style: 'gradient'
        }
      },
      {
        id: 'highlights',
        type: 'highlights',
        order: 2,
        content: {
          items: [
            { text: 'Record attendance with 250+ job seekers and industry professionals' },
            { text: 'Strong representation from leading tech companies and startups' },
            { text: 'Interactive workshops and panel discussions throughout the day' },
            { text: '12 immediate job offers extended during the event' },
            { text: 'Positive feedback with 95% satisfaction rate from attendees' }
          ],
          style: 'checklist'
        }
      },
      {
        id: 'testimonial',
        type: 'quote',
        order: 3,
        content: {
          quote: 'This career fair exceeded my expectations. I had meaningful conversations with several companies and received two interview invitations on the spot!',
          author: 'Sarah Chen',
          author_title: 'Software Engineer',
          style: 'testimonial'
        }
      },
      {
        id: 'feedback',
        type: 'attendee_feedback',
        order: 4,
        content: {
          feedback: [
            {
              comment: 'Excellent organization and great company variety',
              author: 'Michael Torres',
              role: 'Data Analyst',
              rating: 5
            },
            {
              comment: 'Found my dream job thanks to this event!',
              author: 'Emily Wang',
              role: 'Marketing Specialist',
              rating: 5
            },
            {
              comment: 'Very well structured and professional atmosphere',
              author: 'David Kim',
              role: 'Product Manager',
              rating: 5
            }
          ],
          display_style: 'cards'
        }
      }
    ]

    const recap: Omit<EventRecap, 'id' | 'created_at' | 'updated_at'> = {
      event_id: eventId,
      title: 'Sample Career Fair Recap',
      summary: 'A highly successful networking event connecting job seekers with top Vancouver employers.',
      content_blocks: sampleBlocks,
      featured_image_url: event.image_url,
      seo_meta: {
        description: 'Recap of our successful career fair featuring 250+ attendees, 45 companies, and 12 job offers.',
        keywords: ['career fair', 'networking', 'jobs', 'vancouver', 'tech careers']
      },
      published: true,
      author_id: undefined
    }

    const { data: createdRecap, error } = await supabase
      .from('event_recaps')
      .insert([recap])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create sample recap: ${error.message}`)
    }

    return {
      success: true,
      eventId: eventId,
      recapId: createdRecap.id
    }
  }
}