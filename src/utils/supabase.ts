import 'react-native-url-polyfill/auto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Create storage adapter that works for both web and React Native
const createStorageAdapter = () => {
  if (Platform.OS === 'web' && isBrowser) {
    // Use localStorage for web
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
      removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
    }
  } else if (isBrowser) {
    // For React Native web, use localStorage as fallback
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
      removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
    }
  } else {
    // For SSR, return a mock storage that does nothing
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    }
  }
}

// Dynamically import AsyncStorage only on React Native
const getAsyncStorage = async () => {
  if (Platform.OS !== 'web' && !isBrowser) {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage')
      return AsyncStorage
    } catch {
      return null
    }
  }
  return null
}

// Factory function to get the Supabase client
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  let storage: any;
  let persistSession = true;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Web
    storage = {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
      removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
    };
  } else if (typeof window === 'undefined') {
    // SSR
    storage = {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
    persistSession = false;
  } else {
    // React Native
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    storage = AsyncStorage;
  }

  return createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        storage,
        autoRefreshToken: true,
        persistSession,
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'weat-learn',
        },
      },
    }
  );
}

// Helper function to check if Supabase is properly initialized
export const isSupabaseInitialized = () => {
  return !!(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Helper function to handle email confirmation
export const handleEmailConfirmation = async () => {
  try {
    // Check if we're on the web and have URL parameters
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const accessToken = url.hash.match(/access_token=([^&]*)/)?.[1];
      const refreshToken = url.hash.match(/refresh_token=([^&]*)/)?.[1];
      const error = url.hash.match(/error=([^&]*)/)?.[1];
      const errorDescription = url.hash.match(/error_description=([^&]*)/)?.[1];

      if (error) {
        console.error('Email confirmation error:', error, errorDescription);
        throw new Error(errorDescription || error);
      }

      if (accessToken && refreshToken) {
        const supabase = await getSupabaseClient()
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: decodeURIComponent(accessToken),
          refresh_token: decodeURIComponent(refreshToken),
        });

        if (sessionError) {
          throw sessionError;
        }

        // Clear the URL hash
        window.location.hash = '';
        return { success: true };
      }
    }

    // Try to get the current session
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    if (data.session) {
      return { success: true, session: data.session };
    } else {
      throw new Error('No valid session found');
    }
  } catch (error: any) {
    console.error('Email confirmation error:', error);
    throw error;
  }
};

// SSR-safe Supabase client for web
export const createSSRSafeSupabaseClient = () => {
  // Only create client on the client side
  if (typeof window === 'undefined') {
    // Return a mock client for SSR
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: null } }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    }
  }
  
  return getSupabaseClient()
}

