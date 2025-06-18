import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { User } from '@/src/types/user'
import { getProfile } from '@/src/services/authService';

// A unique key to identify this query in the TanStack Query cache.
export const userQueryKey = ['userProfile']

export function useAuthUser() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const queryResult = useQuery<User, Error>({
    queryKey: userQueryKey,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: isClient, // Only run query on client side
  });

  return {
    ...queryResult,
    isLoading: !isClient || queryResult.isLoading,
    data: isClient ? queryResult.data : null,
  };
}
