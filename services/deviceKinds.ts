import type { DeviceKindResourceDto, DeviceQuantityByLabDto, ListOfDeviceKindResourceDto } from '~/lib/api_schema';

export const deviceKindService = {
  async getDeviceKindsByCategoryId (
    categoryId: string, offset: number, length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false
    }: {
      searchText?: string,
      searchFields?: ('device_id' | 'device_name')[],
      sortField?: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity',
      desc?: boolean,
    }
  ): Promise<ListOfDeviceKindResourceDto> {
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
      ttl: 60,
    }));
  },
  async getDeviceKinds (
    offset: number, length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false
    }: {
      searchText?: string,
      searchFields?: ('device_id' | 'device_name')[],
      sortField?: 'name' | 'category' | 'brand' | 'borrowable_quantity' | 'quantity',
      desc?: boolean,
    }
  ): Promise<ListOfDeviceKindResourceDto> {
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
      ttl: 60,
    }));
  },
  async getTotalItems (
    categoryId: string | undefined,
    {
      searchText = undefined,
      searchFields = []
    }: {
      searchText?: string,
      searchFields?: ('device_id' | 'device_name')[],
    }
  ): Promise<number> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds', {
      query: {
        category_id: categoryId,
        offset: 0,
        length: 1,
        search_text: searchText,
        search_fields: searchFields,
      },
      ttl: 60,
    })).totalPages;
  },
  async getById (deviceKindId: string): Promise<DeviceKindResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch(`/api/device_kinds/${deviceKindId}`, { ttl: 600 });
  },
  async getQuantityByLab (
    deviceKindId: string,
    {
      searchText = undefined,
      searchFields = []
    }: {
      searchText: string | undefined,
      searchFields: ('lab_name')[]
    }
  ): Promise<DeviceQuantityByLabDto['labs']> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/device_kinds/quantity_by_lab', {
      query: { kind_id: deviceKindId, search_text: searchText, search_fields: searchFields },
      ttl: 0,
    })).labs;
  },
  async deleteByIds (ids: string[]): Promise<void> {
    await $fetch('/api/device_kinds', {
      method: 'DELETE',
      body: { ids },
    });
  },
};
