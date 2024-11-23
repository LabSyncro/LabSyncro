<script setup lang="ts">
import { deviceService } from '~/services/devices';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const props = defineProps<{
  kindId: string,
}>();

async function deleteData (ids: string[]) {
}

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await deviceService.getByKind(props.kindId, offset, length, { searchText: options.searchText, searchFields: ['device_id'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.devices,
    totalPages: res.totalPages,
  };
}
</script>

<template>
  <DataTable :selectable="false" :searchable="true" :qrable="true" :fetch-fn="fetchData" :delete-fn="deleteData" :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
