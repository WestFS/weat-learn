import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { getProfile } from '@/src/services/authService';
import { User } from '@/src/types/user';

// A unique key to identify this query in the TanStack Query cache.
export const userQueryKey = ['userProfile']

export function useAuthUser() {
  const { session, isLoading: authLoading } = useAuthContext();

  const queryResult = useQuery<User, Error>({
    queryKey: userQueryKey,
    queryFn: getProfile,
    enabled: !authLoading && !!session, // Only run when session is loaded and present
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  return {
    ...queryResult,
    isLoading: authLoading || queryResult.isLoading,
    data: !authLoading ? queryResult.data : null,
  };
}
