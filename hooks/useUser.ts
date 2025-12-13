import { getUserPermissions, updateUserPermissions } from '@/services/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const USER_KEYS = {
  all: ['users'] as const,
  permissions: (userId: string) =>
    [...USER_KEYS.all, 'permissions', userId] as const,
};

export function useUserPermissions(userId: string | undefined) {
  return useQuery({
    queryKey: USER_KEYS.permissions(userId || ''),
    queryFn: () => getUserPermissions(userId!),
    enabled: !!userId,
  });
}

export function useUpdateUserPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permissions,
    }: {
      userId: string;
      permissions: string[];
    }) => updateUserPermissions(userId, permissions),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: USER_KEYS.permissions(userId),
      });
    },
  });
}
