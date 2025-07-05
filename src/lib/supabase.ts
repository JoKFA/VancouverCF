import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_actual') || supabaseAnonKey.includes('your_actual')) {
  console.error('Missing or placeholder Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set with your actual Supabase project credentials.')
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}"`)
  throw new Error('Invalid Supabase URL format')
}

/**
 * Supabase client instance for database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Database type definitions
 */
export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image_url?: string
  status: 'upcoming' | 'past'
  recap_file_url?: string
  created_at: string
}

export interface Resume {
  id: string
  name: string
  email: string
  phone: string
  file_url: string
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  avatar_url?: string
  order_index: number
  created_at: string
}