import type { ReceiptResourceDto } from '~/lib/api_schema';

export const receiptService = {
  async getReceipts (
    offset: number,
    length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false,
    }: {
      searchText?: string;
      searchFields?: (
        | 'device_kind_id'
        | 'device_kind_name'
        | 'borrowed_place'
        | 'returned_place'
      )[];
      sortField?:
        | 'device_kind_name'
        | 'quantity'
        | 'borrowed_place'
        | 'returned_place'
        | 'borrowed_at'
        | 'expected_returned_at'
        | 'status';
      desc?: boolean;
    },
  ): Promise<ReceiptResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts', {
      query: {
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        sort_field: sortField,
        desc,
      },
      ttl: 60,
    });
  },
  async getTotalItems ({
    searchText = undefined,
    searchFields = [],
  }: {
    searchText?: string;
    searchFields?: (
      | 'device_kind_id'
      | 'device_kind_name'
      | 'borrowed_place'
      | 'returned_place'
    )[];
  }): Promise<number> {
    const { $cachedFetch } = useNuxtApp();
    return (
      await $cachedFetch('/api/receipts', {
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
