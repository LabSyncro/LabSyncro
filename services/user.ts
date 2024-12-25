import type { UserResourceDto } from '~/lib/api_schema';

export const userService = {
  async getUserById (id: string): Promise<UserResourceDto | undefined> {
    try {
      const { $cachedFetch } = useNuxtApp();
      const res = await $cachedFetch(`/api/users/${id}`, {
        ttl: 60,
      });
      return res;
    } catch {
      return undefined;
    }
  },
};
