<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-vue-next';
import type { AdminDeviceList } from './schema';

interface DataTablePaginationProps {
  table: Table<AdminDeviceList>;
}

const props = defineProps<DataTablePaginationProps>();

const handlePageSizeChange = (value: string) => {
  props.table.setPageSize(Number(value));
};
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">
          Số hàng
        </p>
        <Select :model-value="`${table.getState().pagination.pageSize}`" @update:model-value="handlePageSizeChange">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Trang {{ table.getState().pagination.pageIndex + 1 }} /
        {{ table.getPageCount() + 1 }}
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)">
          <span class="sr-only">Đi đến trang đầu</span>
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()">
          <span class="sr-only">Đi đến trang trước</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          <span class="sr-only">Đi đến trang tiếp</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)">
          <span class="sr-only">Đi đến trang cuối</span>
          <ArrowRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
