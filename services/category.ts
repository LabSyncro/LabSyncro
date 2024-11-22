export const categoryService = {
  async getCategories (): Promise<{ id: string, name: string }[]> {
    const { $cachedFetch } = useNuxtApp();
    const { categories } = await $cachedFetch('/api/categories');
    return categories;
  },
  async getCategory (id: string): Promise<{ name: string }> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch(`/api/categories/${id}`, { ttl: 900 });
  }
};
