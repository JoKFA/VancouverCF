import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". Please ensure it's a valid URL like https://your-project-id.supabase.co`)
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