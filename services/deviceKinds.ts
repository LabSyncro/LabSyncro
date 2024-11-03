export const deviceKindService = {
  async getDeviceKindsByCategoryId(categoryId: number, offset: number, length: number): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset,
        length,
      },
    })).deviceKinds;
  },
};
