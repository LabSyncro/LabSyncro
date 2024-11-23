<script setup lang="ts">
import { deviceKindService } from '~/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';
import { sortBy } from 'lodash-es';

const props = defineProps<{
  cart: {
    id: string;
    name: string;
    deviceIds: string[];
  }[],
}>();

const emits = defineEmits<{
  'device-kinds-delete': [string[]];
}>();

async function deleteData (kindIds: string[]) {
  emits('device-kinds-delete', kindIds);
}

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string }): Promise<{ data: unknown[], totalPages: number }> {
  let deviceKinds = props.cart.map((deviceKind) => ({
    id: deviceKind.id,
    name: deviceKind.name,
    quantity: deviceKind.deviceIds.length,
  }));
  if (options.sortField) {
    deviceKinds = sortBy(deviceKinds, (deviceKind) => (deviceKind as any)[options.sortField!]);
    if (options.desc) {
      deviceKinds.reverse();
    }
  }
  const totalPages = Math.ceil(deviceKinds.length / length);
  return {
    data: deviceKinds.slice(offset, offset + length),
    totalPages,
  };
}
</script>

<template>
  <DataTable :key="cart.flatMap(({ deviceIds }) => deviceIds).join('-')" :selectable="false" :searchable="false" :qrable="false" :fetch-fn="fetchData" :delete-fn="deleteData" :columns="columns as AugmentedColumnDef<unknown>[]" />
</template>
