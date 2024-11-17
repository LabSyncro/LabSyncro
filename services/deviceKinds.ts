export const deviceKindService = {
  async getDeviceKindsByCategoryId(categoryId: number, offset: number, length: number, { searchText = undefined, searchFields = [], sortField = undefined, desc = false }: { searchText: string | undefined, searchFields: ('device_id' | 'device_kind_id' | 'device_name')[], sortField: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity' | undefined, desc: boolean }): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
      },
    }));
  },
  async getDeviceKinds(offset: number, length: number, { searchText = undefined, searchFields = [], sortField = undefined, desc = false }: { searchText: string | undefined, searchFields: ('device_id' | 'device_kind_id' | 'device_name')[], sortField: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity' | undefined, desc: boolean }): Promise<{ id: number, name: string, quantity: number }[]> {
    return (await $fetch('/api/device_kinds', {
      query: {
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
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
