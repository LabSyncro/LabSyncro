<script setup lang="ts">
import type { Column } from '@tanstack/vue-table';
import { cn } from '@/lib/utils';
import type { DeviceByLab } from './schema';

interface DataTableColumnHeaderProps {
  column: Column<DeviceByLab, unknown>;
  title: string;
}

defineProps<DataTableColumnHeaderProps>();

defineOptions({
  inheritAttrs: false,
});

function toggleSortOrder (column: Column<DeviceByLab, unknown>) {
  const oldSortOrder = column.getIsSorted();
  if (oldSortOrder === 'asc') {
    column.toggleSorting(true);
  } else if (oldSortOrder === 'desc') {
    column.clearSorting();
  } else {
    column.toggleSorting(false);
  }
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="relative h-8 data-[state=open]:bg-accent text-md pr-8 text-black" @click="toggleSortOrder(column)">
          <span>{{ title }}</span>
          <Icon v-if="column.getIsSorted() === 'asc'" aria-hidden class="text-xl absolute right-1" name="i-heroicons-arrow-long-down" />
          <Icon v-else-if="column.getIsSorted() === 'desc'" aria-hidden class="text-xl absolute right-1" name="i-heroicons-arrow-long-up" />
          <Icon v-else aria-hidden class="text-xl absolute right-1" name="i-heroicons-arrows-up-down" />
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
