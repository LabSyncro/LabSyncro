import type { UserResourceDto } from '~/lib/api_schema';

export const userService = {
  // TODO: replace with a real implementation
  getAvatar (): string {
    return 'https://avatars.githubusercontent.com/u/139191192?v=4';
  },
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
  }
};
