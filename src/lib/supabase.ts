import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// More graceful handling of missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn('Missing Supabase environment variables. Some features may not work.')
  }
  // Create a dummy client that won't crash the app
  export const supabase = createClient('https://dummy.supabase.co', 'dummy-key', {
    auth: { persistSession: false }
  })
} else {
  // Check for placeholder values
  if (supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_')) {
    if (import.meta.env.DEV) {
      console.warn('Placeholder Supabase environment variables detected. Please update with your actual Supabase project credentials.')
    }
    // Create a dummy client for development
    export const supabase = createClient('https://dummy.supabase.co', 'dummy-key', {
      auth: { persistSession: false }
    })
  } else {
    // Validate URL format
    try {
      new URL(supabaseUrl)
      // Create the real client
      export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public'
        }
      })
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}"`)
      }
      // Create a dummy client
      export const supabase = createClient('https://dummy.supabase.co', 'dummy-key', {
        auth: { persistSession: false }
      })
    }
  }
}

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