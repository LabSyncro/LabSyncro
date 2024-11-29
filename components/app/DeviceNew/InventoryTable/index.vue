<script setup lang="ts">
import { deviceService } from '~/services/devices';
import { createColumns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const props = defineProps<{
  kindId: string;
  kindName: string;
}>();

const emits = defineEmits<{
  'device-kind-link-click': [];
}>();

const showAddModal = ref(false);

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await deviceService.getByKind(props.kindId, offset, length, { searchText: options.searchText, searchFields: ['device_id'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.devices,
    totalPages: res.totalPages,
  };
}

async function onDeviceKindLinkClick () {
  emits('device-kind-link-click');
}

</script>

<template>
  <DataTable
:selectable="false" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :add-trigger-fn="() => { showAddModal = true }"
    :columns="createColumns({ onDeviceKindLinkClick }) as AugmentedColumnDef<unknown>[]" />
  <DeviceNewModal v-model:is-open="showAddModal" :device-kind-id="kindId" :device-kind-name="kindName" @submit="" />
</template>
