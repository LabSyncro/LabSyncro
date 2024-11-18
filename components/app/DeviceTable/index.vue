<script setup lang="ts">
import type {
  ColumnDef,
} from '@tanstack/vue-table';

import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import DataTablePagination from './Pagination.vue';
import type { AdminDeviceList } from './schema';

interface DataTableProps {
  columns: ColumnDef<AdminDeviceList, unknown>[];
  data: AdminDeviceList[];
  pageCount: number;
  paginationState: { pageIndex: number; pageSize: number };
  sortField: string | undefined;
  sortOrder: 'desc' | 'asc' | undefined;
  rowSelection: { includeMode: boolean, rowIds: [] };
}

const props = defineProps<DataTableProps>();
const emits = defineEmits<{
  'page-size-change': [number];
  'page-index-change': [number];
  'sort-field-change': [string | undefined];
  'sort-order-change': ['desc' | 'asc' | undefined];
}>();

const table = useVueTable({
  get data() { return props.data; },
  get columns() { return props.columns; },
  manualPagination: true,
  pageCount: props.pageCount,
  manualSorting: true,
  enableRowSelection: true,
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <div class="space-y-4">
    <div>
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" @sort-order-change="(value) => emits('sort-order-change', value)"
                @sort-field-change="(value) => emits('sort-field-change', value)" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center text-lg text-slate-500">
              Không có kết quả
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination :table="table" :page-index="paginationState.pageIndex" :page-size="paginationState.pageSize"
      :page-count="pageCount" @page-size-change="(value) => emits('page-size-change', value)"
      @page-index-change="(value) => emits('page-index-change', value)" />
  </div>
</template>
