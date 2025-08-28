import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Check for placeholder values that need to be replaced
if (supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_')) {
  throw new Error('Placeholder Supabase environment variables')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error('Invalid Supabase URL format')
}

/**
 * Supabase client instance for all database operations
 * This is the main connection to our backend database and storage
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * TypeScript interfaces for database tables
 * These define the structure of our data and ensure type safety
 */

// Events table - stores career fair events (upcoming and past)
export interface Event {
  id: string                    // Unique identifier (UUID)
  title: string                 // Event name/title
  date: string                  // Event date (ISO string)
  location: string              // Event venue/location
  description: string           // Event description/details
  image_url?: string           // Optional event image URL
  status: 'upcoming' | 'past'  // Event status (determines display section)
  recap_file_url?: string      // Optional blog/recap file URL (for past events)
  created_at: string           // Timestamp when record was created
}

// Resumes table - stores job seeker resume submissions
export interface Resume {
  id: string          // Unique identifier (UUID)
  name: string        // Applicant's full name
  email: string       // Applicant's email address
  phone: string       // Applicant's phone number
  file_url: string    // URL to uploaded resume file in storage
  created_at: string  // Timestamp when resume was submitted
}

// Team members table - stores VIVA team member profiles
export interface TeamMember {
  id: string           // Unique identifier (UUID)
  name: string         // Team member's full name
  title: string        // Job title/role
  bio: string          // Biography/description
  avatar_url?: string  // Optional profile picture URL
  order_index: number  // Display order (for sorting team members)
  created_at: string   // Timestamp when record was created
}

// Event recaps table - stores structured event recap content
export interface EventRecap {
  id: string                    // Unique identifier (UUID)
  event_id: string             // Reference to events table
  title: string                // Recap title
  summary: string              // Brief recap summary
  content_blocks: ContentBlock[] // Structured content blocks
  featured_image_url?: string  // Optional hero image
  seo_meta: {
    description: string
    keywords: string[]
  }
  published: boolean           // Publication status
  author_id?: string          // Author reference
  created_at: string          // Creation timestamp
  updated_at: string          // Last update timestamp
}

// Content block types for structured recaps
export interface ContentBlock {
  id: string
  type: ContentBlockType
  order: number
  content: any // Type-specific content structure
}

export type ContentBlockType = 
  | 'text' 
  | 'image_gallery' 
  | 'statistics' 
  | 'quote' 
  | 'highlights' 
  | 'attendee_feedback'

// Specific content block interfaces
export interface TextBlock {
  type: 'text'
  content: {
    text: string // Rich text content (HTML)
    style?: 'normal' | 'callout' | 'centered'
  }
}

export interface ImageGalleryBlock {
  type: 'image_gallery'
  content: {
    images: Array<{
      url: string
      caption?: string
      alt_text: string
    }>
    layout: 'grid' | 'masonry' | 'carousel'
    show_captions: boolean
  }
}

export interface StatisticsBlock {
  type: 'statistics'
  content: {
    stats: Array<{
      label: string
      value: string | number
      icon?: string
      highlight?: boolean
    }>
    layout: 'grid' | 'cards' | 'horizontal'
    style: 'minimal' | 'colorful' | 'gradient'
  }
}

export interface QuoteBlock {
  type: 'quote'
  content: {
    quote: string
    author: string
    author_title?: string
    author_image?: string
    style: 'simple' | 'card' | 'testimonial'
  }
}

export interface HighlightsBlock {
  type: 'highlights'
  content: {
    items: Array<{
      text: string
      icon?: string
    }>
    style: 'checklist' | 'bullets' | 'numbered'
  }
}

export interface AttendeeFeedbackBlock {
  type: 'attendee_feedback'
  content: {
    feedback: Array<{
      comment: string
      author: string
      rating?: number
      role?: string
    }>
    display_style: 'cards' | 'quotes' | 'minimal'
  }
}