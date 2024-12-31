import type {
  ReadyBorrowedDevicesResourceDto,
  BorrowedReceiptResourceDto,
  ReturnedReceiptResourceDto,
} from '~/lib/api_schema';

export const receiptService = {
  async getBorrowReceipts(
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
  ): Promise<BorrowedReceiptResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts/borrowed_device', {
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
  async getReturnReceipts(
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
        | 'device_status'
        | 'note'
      )[];
      sortField?:
      | 'device_kind_name'
      | 'borrowed_place'
      | 'returned_place'
      | 'borrowed_at'
      | 'expected_returned_at'
      | 'returned_at'
      | 'status';
      desc?: boolean;
    },
  ): Promise<ReturnedReceiptResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts/returned_device', {
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
  async getTotalBorrowedItems({
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
      await $cachedFetch('/api/receipts/borrowed_device', {
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
  async getTotalReturnedItems({
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
      await $cachedFetch('/api/receipts/returned_device', {
        query: {
          offset: 0,
          length: 1,
          search_text: searchText,
          search_fields: searchFields,
        },
      })
    ).totalPages;
  },

  async getBorrowReceiptsByAdmin(
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
  ): Promise<BorrowedReceiptResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts/admin/borrowed_device', {
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

  async getTotalBorrowedItemsByAdmin({
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
      await $cachedFetch('/api/receipts/admin/borrowed_device', {
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

  async getReadyBorrowedDevicesByAdmin(
    offset: number,
    length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false,
    }: {
      searchText?: string;
      searchFields?: ('device_kind_id' | 'device_kind_name' | 'place')[];
      sortField?: 'device_kind_name' | 'quantity' | 'place';
      desc?: boolean;
    },
  ): Promise<ReadyBorrowedDevicesResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts/admin/ready_borrowed_device', {
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

  async getTotalReadyBorrowedItemsByAdmin({
    searchText = undefined,
    searchFields = [],
  }: {
    searchText?: string;
    searchFields?: ('device_kind_id' | 'device_kind_name' | 'place')[];
  }): Promise<number> {
    const { $cachedFetch } = useNuxtApp();
    return (
      await $cachedFetch('/api/receipts/admin/ready_borrowed_device', {
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

  async getReturnReceiptsByAdmin(
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
      | 'returned_at'
      | 'status';
      desc?: boolean;
    },
  ): Promise<ReturnedReceiptResourceDto> {
    const { $cachedFetch } = useNuxtApp();
    return await $cachedFetch('/api/receipts/admin/returned_device', {
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

  async getTotalReturnedItemsByAdmin({
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
      await $cachedFetch('/api/receipts/admin/returned_device', {
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

  async submitBorrowRequest({
    receiptId,
    deviceIds,
    borrowerId,
    borrowDate,
    borrowLabId,
    expectedReturnDate,
    expectedReturnLabId,
  }: {
    receiptId: string | null;
    deviceIds: string[];
    borrowerId: string;
    borrowDate: Date;
    borrowLabId: string;
    expectedReturnDate: Date;
    expectedReturnLabId: string;
  }) {
    return await $fetch('/api/receipts', {
      method: 'POST',
      body: {
        receipt_id: receiptId || undefined,
        device_ids: deviceIds,
        borrower_id: borrowerId,
        borrow_date: borrowDate,
        borrow_lab_id: borrowLabId,
        expected_return_lab_id: expectedReturnLabId,
        expected_return_date: expectedReturnDate,
      },
    });
  },
  async submitReturnRequest({
    receiptId,
    deviceIds,
    returnerId,
    returnDate,
    returnLabId,
  }: {
    receiptId: string | null;
    deviceIds: string[];
    returnerId: string;
    returnDate: Date;
    returnLabId: string;
  }) {
    return await $fetch('/api/receipts/return', {
      method: 'POST',
      body: {
        receipt_id: receiptId || undefined,
        device_ids: deviceIds,
        returner_id: returnerId,
        return_date: returnDate,
        return_lab_id: returnLabId,
      },
    });
  },
};
