<script setup lang="ts">
import { deviceService } from '~/services/devices';
import { createColumns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const props = defineProps<{
  kindId: string;
  selectedDevices: string[];
}>();

const emits = defineEmits<{
  'device-add': [string],
  'device-delete': [string],
}>();

const { lab } = useLab();

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await deviceService.getByKind(props.kindId, offset, length, { searchText: options.searchText, searchFields: ['device_id'], sortField: options.sortField as any, desc: options.desc }, lab.value.id);
  return {
    data: res.devices,
    totalPages: res.totalPages,
  };
}

async function deleteDevice (id: string) {
  emits('device-delete', id);
}

async function borrowDevice (id: string) {
  emits('device-add', id);
}
</script>

<template>
  <DataTable
:selectable="false" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :columns="createColumns(props.selectedDevices, { deleteDevice, borrowDevice }) as AugmentedColumnDef<unknown>[]" />
</template>
