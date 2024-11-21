<script setup lang="ts">
import type { Row } from '@tanstack/vue-table';
import { MoreHorizontal } from 'lucide-vue-next';
import { DeviceByLabSchema, type DeviceByLab } from './schema';
import { Value } from '@sinclair/typebox/value';

interface DataTableRowActionsProps {
  row: Row<DeviceByLab>;
}
const props = defineProps<DataTableRowActionsProps>();

computed(() => {
  const data = props.row.original;

  if (Value.Check(DeviceByLabSchema, data)) {
    return data as DeviceByLab;
  } else {
    throw new Error('Invalid DeviceByLab passed to the data table');
  }
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <MoreHorizontal class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
