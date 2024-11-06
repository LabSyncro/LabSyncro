export const deviceKindService = {
  async getDeviceKindsByCategoryId(categoryId: number, offset: number, length: number): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset,
        length,
      },
    }));
  },
  async getTotalItems(categoryId: number): Promise<number> {
    return (await $fetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset: 0,
        length: 1,
      },
    })).totalPages;
  },
  async getById(deviceKindId: number): Promise<Record<string, string>> {
    return await $fetch(`/api/device_kinds/${deviceKindId}`);
  },
  async getQuantityById(deviceKindId: number): Promise<Record<string, number>> {
    return await $fetch('/api/device_kinds/quantity', { query: { kindId: deviceKindId } });
  }
};
