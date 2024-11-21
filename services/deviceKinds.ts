export const deviceKindService = {
  async getDeviceKindsByCategoryId (categoryId: number, offset: number, length: number, { searchText = undefined, searchFields = [], sortField = undefined, desc = false }: { searchText: string | undefined, searchFields: ('device_kind_id' | 'device_name')[], sortField: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity' | undefined, desc: boolean }): Promise<{ id: number, name: string, quantity: number }[]> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
      },
      ttl: 600,
    }));
  },
  async getDeviceKinds (offset: number, length: number, { searchText = undefined, searchFields = [], sortField = undefined, desc = false }: { searchText: string | undefined, searchFields: ('device_id' | 'device_name')[], sortField: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity' | undefined, desc: boolean }): Promise<{ id: number, name: string, quantity: number }[]> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds', {
      query: {
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
      },
      ttl: 600,
    }));
  },
  async getTotalItems (categoryId: number | undefined, { searchText = undefined, searchFields = []}: { searchText: string | undefined, searchFields: ('device_id' | 'device_name')[] }): Promise<number> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset: 0,
        length: 1,
        search_text: searchText,
        search_fields: searchFields,
      },
      ttl: 600,
    })).totalPages;
  },
  async getById (deviceKindId: number): Promise<Record<string, string>> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch(`/api/device_kinds/${deviceKindId}`, { ttl: 600 });
  },
  async getQuantityByLab (deviceKindId: number, { searchText = undefined, searchFields = [] }: { searchText: string | undefined, searchFields: ('lab_name')[] }): Promise<Record<string, number>> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds/quantity_by_lab', {
      query: { kind_id: deviceKindId, search_text: searchText, search_fields: searchFields },
      ttl: 0,
    })).labs;
  }
};
