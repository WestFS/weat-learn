import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/src/services/authService.mock';

// A unique key to identify this query in the TanStack Query cache.
export const userQueryKey = ['get-current-user']

/**
 * A custom hook to fetch the current authenticated user's profile.
 * It wraps the useQuery logic for reusability and cleaner component code.
 */

export function useAuthUser() {
    return useQuery({
      queryKey: userQueryKey,
      queryFn: getProfile,
      retry: false,
      staleTime: Infinity, // The user data is considered fresh forever unless invalidated.
    })
}
