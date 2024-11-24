<script setup lang="ts">
import { receiptService } from '~/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await receiptService.getReceipts(offset, length, { searchText: options.searchText, searchFields: ['device_kind_id', 'device_kind_name', 'borrowed_place', 'returned_place'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.receipts,
    totalPages: res.totalPages,
  };
}

</script>

<template>
  <DataTable
:selectable="true" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
