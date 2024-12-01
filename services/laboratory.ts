import type {
  ListOfLabResourceDto,
  AdminManagedLabsDto,
} from '~/lib/api_schema';

export const laboratoryService = {
  async getAllLabs ({
    searchText,
    searchFields,
  }: {
    searchText?: string;
    searchFields?: ('location' | 'lab_name')[];
  }): Promise<ListOfLabResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/laboratories', {
      query: { search_text: searchText, search_fields: searchFields },
      ttl: 300,
    });
  },

  async getLabsManagedByAdmin (
    offset: number,
    length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false,
    }: {
      searchText?: string;
      searchFields?: ('lab_name' | 'location')[];
      sortField?: 'lab_name';
      desc?: boolean;
    },
  ): Promise<AdminManagedLabsDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/laboratories/admin', {
      query: {
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
      },
      ttl: 300,
    });
  },

  async getTotalLabsManagedByAdmin ({
    searchText = undefined,
    searchFields = [],
  }: {
    searchText?: string;
    searchFields?: ('lab_name' | 'location')[];
  }): Promise<number> {
    const { $cachedFetch } = useNuxtApp();
    return (
      await $cachedFetch('/api/laboratories/admin', {
        query: {
          offset: 0,
          length: 1,
          search_text: searchText,
          search_fields: searchFields,
        },
        ttl: 60,
      })
    ).totalPages;
  },
};
