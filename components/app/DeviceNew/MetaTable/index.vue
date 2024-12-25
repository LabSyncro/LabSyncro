<script setup lang="ts">
import { deviceKindService } from '@/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const props = defineProps<{
  kindId: string;
}>();


const showAddModal = ref(false);

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await deviceKindService.getByKind(props.kindId, offset, length, { searchText: options.searchText, searchFields: ['device_id'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.devices,
    totalPages: res.totalPages,
  };
}

</script>

<template>
  <DataTable
:selectable="false" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :add-trigger-fn="() => { showAddModal = true; }" :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
