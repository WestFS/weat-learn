import { useEffect, useState } from 'react'
import { getSupabaseClient, createSSRSafeSupabaseClient } from '@/src/utils/supabase'
import { User, Session, SupabaseClient } from '@supabase/supabase-js'

interface UseSupabaseReturn {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: SupabaseClient | ReturnType<typeof createSSRSafeSupabaseClient>
}

export const useSupabaseAuth = (): UseSupabaseReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setup = async () => {
      const supabase = await getSupabaseClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'INITIAL_SESSION') {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
          }
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            setSession(session)
            setUser(session?.user ?? null)
          }
        }
      )
      unsubscribe = () => subscription.unsubscribe()
    }

    setup()
    return () => { if (unsubscribe) unsubscribe() }
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

  return isClient ? getSupabaseClient() : null
} 