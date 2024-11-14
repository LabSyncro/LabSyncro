<script setup lang="ts">
import type { Row } from '@tanstack/vue-table';
import { MoreHorizontal } from 'lucide-vue-next';
import { AdminDeviceListSchema, type AdminDeviceList } from './schema';
import { Value } from '@sinclair/typebox/value';

interface DataTableRowActionsProps {
  row: Row<AdminDeviceList>;
}
const props = defineProps<DataTableRowActionsProps>();

computed(() => {
  const data = props.row.original;

  if (Value.Check(AdminDeviceListSchema, data)) {
    return data as AdminDeviceList;
  } else {
    throw new Error('Invalid AdminDeviceList passed to the data table');
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
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Make a copy</DropdownMenuItem>
      <DropdownMenuItem>Favorite</DropdownMenuItem>
      <DropdownMenuItem>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
