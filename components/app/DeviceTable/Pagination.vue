<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-vue-next';
import type { AdminDeviceList } from './schema';

interface DataTablePaginationProps {
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  rowsSelected: number;
  table: Table<AdminDeviceList>;
}

defineProps<DataTablePaginationProps>();
const emits = defineEmits<{
  'page-size-change': [number];
  'page-index-change': [number];
}>();


function handlePageSizeChange (value: string) {
  emits('page-index-change', 0);
  emits('page-size-change', Number(value));
};
function handlePageIndexChange (value: number) {
  emits('page-index-change', value);
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      <span class="hidden sm:block">{{ rowsSelected }} được chọn</span>
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">
          Số hàng
        </p>
        <Select :model-value="`${pageSize}`" @update:model-value="handlePageSizeChange">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Trang {{ pageIndex + 1 }} /
        {{ pageCount }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="pageIndex === 0"
          @click="handlePageIndexChange(0)">
          <span class="sr-only">Đi đến trang đầu</span>
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <Button
variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex === 0"
          @click="handlePageIndexChange(pageIndex - 1)">
          <span class="sr-only">Đi đến trang trước</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex === pageCount - 1" @click="handlePageIndexChange(pageIndex + 1)">
          <span class="sr-only">Đi đến trang tiếp</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="pageIndex === pageCount - 1"
          @click="handlePageIndexChange(pageCount - 1)">
          <span class="sr-only">Đi đến trang cuối</span>
          <ArrowRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
