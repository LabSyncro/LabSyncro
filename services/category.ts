export const categoryService = {
  async getCategories (): Promise<{ id: number, name: string }[]> {
    const { categories } = await $fetch('/api/categories');
    return categories;
  },
  async getCategory (id: number): Promise<{ name: string }> {
    return await $fetch(`/api/categories/${id}`);
  }
};
