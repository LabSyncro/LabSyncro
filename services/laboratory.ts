import type { ListOfLabResourceDto } from '~/lib/api_schema';

export const laboratoryService = {
  async getAllLabs ({
    searchText,
    searchFields,
  }: {
    searchText?: string,
    searchFields?: ('location' | 'lab_name')[],
  }): Promise<ListOfLabResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return (await $cachedFetch('/api/laboratories', {
      query: { search_text: searchText, search_fields: searchFields },
      ttl: 300,
    }));
  }
};
