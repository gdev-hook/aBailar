import { getPosts, PostsResponse } from '@/services/posts';
import { useInfiniteQuery } from '@tanstack/react-query';

export const POSTS_KEY = ['posts'];

export function usePosts() {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: POSTS_KEY,
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.lastVisible || undefined,
    staleTime: 1000 * 60 * 5,
  });
}
