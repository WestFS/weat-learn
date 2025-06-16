import { createContext, useContext, ReactNode, useCallback, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser, userQueryKey } from '@/src/hooks/useAuthUser';
import * as AuthService from '@/src/services/authService';
import { AuthContextState, LoginRequest } from '@/src/types/auth';
import { User } from '@/src/types/user';



// Create the context with a default placeholder value.
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

/**
 * The AuthProvider component. It manages the authentication state and provides
 * it to its children through the AuthContext.
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  // Get the QueryClient instance to manipulate the cache.
  const queryClient = useQueryClient();

  // Fetch the user data using our custom hook. This is the "source of truth".
  const { data: user, isLoading, isError } = useAuthUser();


  useEffect(() => {
    const { unsubscribe } = AuthService.onAuthStateChange((Event, session) => {
      console.log('Auth State Change Event in AuthContext:', Event);
      // This makes TanStack Query refetch the profile, keeping UI in sync.
      if (Event === 'SIGNED_IN' || Event === 'SIGNED_OUT') {
        queryClient.invalidateQueries({ queryKey: userQueryKey });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);


  /**
  * Handles the sign-in logic. It calls the auth service and, on success,
  * manually updates the TanStack Query cache with the new user data.
  */

  const signIn = useCallback(async (data: LoginRequest) => {
    try {
      const loggedInUser = await AuthService.signIn(data);
      // Manually set the query data in the cache to the logged-in user.
      // This immediately updates the UI without needing a re-fetch.
      queryClient.setQueryData(userQueryKey, loggedInUser);
    } catch (error) {
      console.error('Failed to SignIn:', error);
      throw error;
    }
  }, [queryClient])


  /**
   * Handles the sign-out logic by calling the service and clearing the user
   * data from the TanStack Query cache.
   */
  const signOut = useCallback(async () => {
    await AuthService.signOut();
    // Set the user query data to null to reflect the signed-out state.
    queryClient.setQueryData(userQueryKey, null);
  }, [queryClient])


  /**
   * Handles the sign-up logic by calling the real auth service and, on success,
   * updates the user data in the TanStack Query cache if the user is automatically logged in.
   */
  const signUp = useCallback(async (data: LoginRequest): Promise<User | null> => {
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
  }, [queryClient]);

  // The value object that will be provided to all consuming components.
  const value: AuthContextState = {
    user,  // The user is considered logged in if the query was successful and returned data.
    isLoggedIn: !!user && !isError,  // The loading state comes directly from the useQuery hook.
    isLoading,
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
