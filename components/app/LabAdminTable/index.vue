<script setup lang="ts">
import { laboratoryService } from '~/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await laboratoryService.getLabsManagedByAdmin(offset, length, { searchText: options.searchText, searchFields: ['lab_name', 'location'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.labs,
    totalPages: res.totalPages,
  };
}
</script>

<template>
  <DataTable
:selectable="true" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
