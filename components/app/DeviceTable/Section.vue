<script setup lang="ts">
import { debounce } from 'lodash-es';
import { createColumns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';
import { deviceKindService } from '~/services';

const props = defineProps<{
  readOnly: boolean;
  columns?: (keyof AdminDeviceList | 'select' | 'delete')[];
}>();

const searchText = ref('');

const pageIndex = ref(0);
const pageSize = ref(10);
function handlePageIndexChange (value: number) {
  pageIndex.value = value;
}
function handlePageSizeChange (value: number) {
  pageSize.value = value;
}
const pageCount = ref(0);

const sortField = ref<string | null>(null);
const sortOrder = ref<'desc' | 'asc' | null>(null);
function handleSortFieldChange (value: string | null) {
  sortField.value = value;
}
function handleSortOrderChange (value: 'desc' | 'asc' | null) {
  sortOrder.value = value;
}

const rowSelection = ref<unknown[]>([]);
function onSelectRows (ids: unknown[]) {
  for (const id of ids) {
    const index = rowSelection.value.indexOf(id);
    if (index >= 0) {
      rowSelection.value.splice(index, 1);
    } else {
      rowSelection.value.push(id);
    }
  }
}
function onSelectAllRows (ids: unknown[]) {
  if (ids.every((id) => rowSelection.value.includes(id))) {
    ids.forEach((id) => rowSelection.value.splice(rowSelection.value.indexOf(id)));
    return;
  }
  for (const id of ids) {
    const index = rowSelection.value.indexOf(id);
    if (index === -1) {
      rowSelection.value.push(id);
    }
  }
}
function onDeleteSelectedRows () {
}
function onDeleteRow (id: unknown) {
}

const data = ref<AdminDeviceList[]>([]);
const updateDeviceKinds = debounce(async () => {
  const res = (await deviceKindService.getDeviceKinds(pageIndex.value * pageSize.value, pageSize.value, { searchText: searchText.value || undefined, searchFields: ['device_id', 'device_name'], sortField: sortField.value || undefined as any, desc: sortOrder.value === 'asc' }));
  data.value = res.deviceKinds;
  pageCount.value = res.totalPages;
}, 300);
onMounted(updateDeviceKinds);
watch([pageSize, pageIndex, searchText, sortField, sortOrder], updateDeviceKinds);

const columns = computed(() => {
  const defs = createColumns({ sortField: sortField as any, sortOrder: sortOrder as any, rowSelection: rowSelection.value, onSelectRows, onSelectAllRows, onDeleteRow, onDeleteSelectedRows });
  if (props.columns === undefined) {
    return defs;
  }
  // @ts-expect-error "implicit accessorKey field when defining TanStack columns"
  return defs.filter(({ accessorKey }) => props.columns?.includes(accessorKey));
});
</script>

<template>
  <div>
    <div class="flex justify-between items-stretch">
      <div class="relative items-center flex gap-4 m-auto md:m-0 md:mb-8 mb-8">
        <input v-model="searchText" type="search" placeholder="Nhập tên/mã thiết bị"
          class="border-gray-300 border rounded-sm p-2 pl-10 w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]"
          @input="handlePageIndexChange(0)">
        <Icon aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
          name="i-heroicons-magnifying-glass" />
        <button class="relative bg-slate-200 border border-slate-400 text-slate-dark rounded-md w-11 h-11 lg:w-auto">
          <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-qr-code" />
          <p class="hidden lg:block pl-10 pr-3">Quét QR thiết bị</p>
        </button>
        <button v-if="!props.readOnly" class="relative md:hidden bg-tertiary-darker items-center text-white px-3 rounded-md w-11 h-11">
          <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-plus" />
        </button>
      </div>
      <div v-if="!props.readOnly">
        <button
          class="relative hidden md:block bg-tertiary-darker items-center text-white px-3 rounded-md w-11 h-11 md:w-auto">
          <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-plus" />
          <span class="hidden md:block pl-8 pr-3">Bổ sung thiết bị</span>
        </button>
      </div>
    </div>
    <DeviceTable :columns="columns" :data="data" :page-count="pageCount" :page-size="pageSize" :page-index="pageIndex"
      :row-selection="rowSelection" @page-index-change="handlePageIndexChange" @page-size-change="handlePageSizeChange"
      @sort-order-change="handleSortOrderChange as any" @sort-field-change="handleSortFieldChange as any" />
  </div>
</template>
