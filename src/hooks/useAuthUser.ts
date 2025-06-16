import { useQuery } from '@tanstack/react-query';
import { User } from '@/src/types/user'
import { getProfile } from '@/src/services/authService';

// A unique key to identify this query in the TanStack Query cache.
export const userQueryKey = ['userProfile']


export function useAuthUser() {
  const queryResult = useQuery<User, Error>({
    queryKey: userQueryKey,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  return queryResult
}
