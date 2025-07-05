import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication context provider that manages user session state
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.warn('Auth session error:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    });

    // Handle subscription errors gracefully
    subscription.unsubscribe = ((originalUnsubscribe) => () => {
      try {
        originalUnsubscribe()
      } catch (error) {
        console.warn('Auth unsubscribe error:', error)
      }
    })(subscription.unsubscribe)

    return () => {
      try {
        subscription.unsubscribe()
      } catch (error) {
        console.warn('Auth cleanup error:', error)
      }
    }
  }, [])

  /**
   * Sign in user with email and password
   */
  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error: any) {
      // Handle network or configuration errors gracefully
      if (error.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection.')
      }
      throw error
    }
  }

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      // Handle network errors gracefully
      if (error.message?.includes('fetch')) {
        console.warn('Sign out error:', error)
        // Clear local session even if server request fails
        setSession(null)
        setUser(null)
        return
      }
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}