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