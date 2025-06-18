import { useEffect, useState } from 'react'
import { supabase, createSSRSafeSupabaseClient } from '@/src/utils/supabase'
import { User, Session, SupabaseClient } from '@supabase/supabase-js'

interface UseSupabaseReturn {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: SupabaseClient | ReturnType<typeof createSSRSafeSupabaseClient>
}

export const useSupabase = (): UseSupabaseReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    supabase: createSSRSafeSupabaseClient(),
  }
}

// Hook for client-side only operations
export const useSupabaseClient = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? supabase : null
} 