import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * Authentication context interface
 * Defines what authentication data and functions are available throughout the app
 */
interface AuthContextType {
  user: User | null                                           // Current authenticated user (null if not logged in)
  session: Session | null                                     // Current session data
  loading: boolean                                            // Loading state during auth operations
  signIn: (email: string, password: string) => Promise<void> // Function to sign in users
  signOut: () => Promise<void>                               // Function to sign out users
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider Component
 * Wraps the entire app to provide authentication state and functions
 * Manages user sessions and authentication state changes
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session when app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for authentication state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  /**
   * Sign in function using email and password
   * Used by admin login page to authenticate team members
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * Sign out function
   * Clears user session and redirects to public pages
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Provide authentication state and functions to all child components
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
 * Custom hook to access authentication context
 * Use this in any component that needs authentication data or functions
 * Example: const { user, signIn, signOut } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}