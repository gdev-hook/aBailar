import { Post, subscribeToPosts } from '@/services/posts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const POSTS_KEY = ['posts'];

export function usePosts() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscription to Firebase updates
    const unsubscribe = subscribeToPosts(newPosts => {
      // Update React Query cache directly
      queryClient.setQueryData(POSTS_KEY, newPosts);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery<Post[]>({
    queryKey: POSTS_KEY,
    // We set a dummy function or empty array because data comes from subscription
    // However, to avoid "loading" state indefinite hanging if we used enabled: true without data,
    // we can provide initialData or use a queryFn that resolves once.
    // For now, since we rely on subscription, we essentially treat the cache as the source of truth.
    queryFn: () => [],
    // We don't want to refetch on window focus because subscription handles it
    refetchOnWindowFocus: false,
    // Infinite stale time because subscription pushes updates
    staleTime: Infinity,
    // We let the subscription populate the data.
    // If cache is empty, it will return initialData or executed queryFn (empty array).
    initialData: [],
  });
}
