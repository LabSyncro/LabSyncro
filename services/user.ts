import type { UserResourceDto, RoleWithStatsDto } from '~/lib/api_schema';

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
  async getUsers (): Promise<UserResourceDto[]> {
    try {
      const { $cachedFetch } = useNuxtApp();
      const res = await $cachedFetch('/api/users', {
        ttl: 60,
      });
      return res;
    } catch {
      return [];
    }
  },
  async getRoles (): Promise<RoleWithStatsDto[]> {
    try {
      const { $cachedFetch } = useNuxtApp();
      const res = await $cachedFetch('/api/users/roles', {
        ttl: 60,
      });
      return res;
    } catch {
      return [];
    }
  },
};
