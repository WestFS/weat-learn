import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import * as AuthService from '@/src/services/authService';
import { AuthContextState, LoginRequest } from '@/src/types/auth';
import { User } from '@/src/types/user';
import { getSupabaseClient } from '@/src/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { mapSupabaseUserToAppUser } from '@/src/services/authService';

// Define userQueryKey locally
const userQueryKey = ['userProfile'];

// Create the context with a default placeholder value.
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

/**
 * The AuthProvider component. It manages the authentication state and provides
 * it to its children through the AuthContext.
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  // Get the QueryClient instance to manipulate the cache.
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user data using our custom hook. This is the "source of truth".
  // Removed: const { data: userData, isLoading: userDataLoading, isError } = useAuthUser();

  // Handle SSR - only run auth logic on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    const setup = async () => {
      const supabase = await getSupabaseClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'INITIAL_SESSION') {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ? mapSupabaseUserToAppUser(session.user) : null);
            setLoading(false);
          }
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ? mapSupabaseUserToAppUser(session.user) : null);
          }
        }
      );
      unsubscribe = () => subscription.unsubscribe();
    };

    setup();
    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /**
  * Handles the sign-in logic. It calls the auth service and, on success,
  * manually updates the TanStack Query cache with the new user data.
  */

  const signIn = useCallback(async (data: LoginRequest) => {
    if (!isClient) {
      throw new Error('Authentication is only available on the client side');
    }

    try {
      const loggedInUser = await AuthService.signIn(data);
      // Manually set the query data in the cache to the logged-in user.
      queryClient.setQueryData(userQueryKey, loggedInUser);

      // Immediately update context state
      setUser(loggedInUser);
      // If you have access to the session, setSession(session);
    } catch (error) {
      console.error('Failed to SignIn:', error);
      throw error;
    }
  }, [queryClient, isClient]);

  /**
   * Handles the sign-out logic by calling the service and clearing the user
   * data from the TanStack Query cache.
   */
  const signOut = useCallback(async () => {
    if (!isClient) {
      throw new Error('Authentication is only available on the client side');
    }

    await AuthService.signOut();
    setUser(null);      // Immediately clear user
    setSession(null);   // Immediately clear session
    queryClient.setQueryData(userQueryKey, null);
  }, [queryClient, isClient]);

  /**
   * Handles the sign-up logic by calling the real auth service and, on success,
   * updates the user data in the TanStack Query cache if the user is automatically logged in.
   */
  const signUp = useCallback(async (data: LoginRequest): Promise<User | null> => {
    if (!isClient) {
      throw new Error('Authentication is only available on the client side');
    }

    try {
      const signedUpUser = await AuthService.signUp(data);
      if (signedUpUser) {
        queryClient.setQueryData(userQueryKey, signedUpUser);
      }
      return signedUpUser;
    } catch (error) {
      console.error('Failed to SignUp:', error);
      throw error;
    }
  }, [queryClient, isClient]);

  // The value object that will be provided to all consuming components.
  const value: AuthContextState = {
    user: isClient ? user : null,  // Only show user on client side
    session, // Provide session
    isLoggedIn: isClient && !!user,  // Only logged in on client side
    isLoading: !isClient || loading,  // Show loading during SSR
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook that simplifies accessing the AuthContext.
 */
export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthContext() {
  return useContext(AuthContext);
}
