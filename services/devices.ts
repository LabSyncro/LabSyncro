import type { ListOfDeviceResourceDto } from '~/lib/api_schema';

export const deviceService = {
  async getByKind (kindId: string, offset: number, length: number, {
    searchText = undefined,
    searchFields = [],
    sortField = undefined,
    desc = false,
  }: {
    searchText?: string,
    searchFields?: ('device_id')[],
    sortField?: 'name' | 'id',
    desc?: boolean,
  }): Promise<ListOfDeviceResourceDto> {
    return await $fetch('/api/devices', {
      query: {
        device_kind_id: kindId,
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        desc,
        sort_field: sortField,
      },
    });
  },
};
