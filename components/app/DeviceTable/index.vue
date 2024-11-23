<script setup lang="ts">
import { deviceKindService } from '~/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

async function deleteData (ids: string[]) {
  await deviceKindService.deleteByIds(ids);
}

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await deviceKindService.getDeviceKinds(offset, length, { searchText: options.searchText, searchFields: options.searchFields as any[], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.deviceKinds,
    totalPages: res.totalPages,
  };
}
</script>

<template>
  <DataTable :searchable="true" :qrable="true" :add-trigger-fn="() => {}" :fetch-fn="fetchData" :delete-fn="deleteData" :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
