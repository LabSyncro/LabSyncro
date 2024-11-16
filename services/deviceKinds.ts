export const deviceKindService = {
  async getDeviceKindsByCategoryId(categoryId: number, offset: number, length: number, searchText: string | undefined = undefined, searchFields: ('device_id' | 'device_kind_id' | 'device_name')[]): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
      },
    }));
  },
  async getDeviceKinds(offset: number, length: number, searchText: string | undefined = undefined, searchFields: ('device_id'  | 'device_kind_id' | 'device_name')[]): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
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
  async getQuantityByLab(deviceKindId: number): Promise<Record<string, number>> {
    return (await $fetch('/api/device_kinds/quantity_by_lab', { query: { kindId: deviceKindId } })).labs;
  }
};
