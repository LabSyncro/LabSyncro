<script setup lang="ts">
import type { 
  RowSelectionState,
} from '@tanstack/vue-table';
import { debounce } from 'lodash-es';
import { createColumns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';
import { deviceKindService } from '~/services';

const searchText = ref('');

const paginationState = ref({
  pageIndex: 0,
  pageSize: 10,
});
function handlePageIndexChange(value) {
  paginationState.value = {
    pageIndex: value,
    pageSize: paginationState.value.pageSize,
  };
}
function handlePageSizeChange(value) {
  paginationState.value = {
    pageSize: value,
    pageIndex: paginationState.value.pageIndex,
  };
}
const pageCount = ref(0);

const sortField = ref(undefined);
const sortOrder = ref(undefined);
function handleSortFieldChange(value: string | undefined) {
  sortField.value = value;
}
function handleSortOrderChange(value: 'desc' | 'asc' | undefined) {
  sortOrder.value = value;
}

const rowSelection = ref<RowSelectionState>();
function setRowSelection (rowSelection: RowSelectionState): void {
  rowSelection.value = rowSelection;
  console.log(rowSelection);
}

const data = ref<AdminDeviceList[]>([]);
const updateDeviceKinds = debounce(async () => {
  const res = (await deviceKindService.getDeviceKinds(paginationState.value.pageIndex * paginationState.value.pageSize, paginationState.value.pageSize, { searchText: searchText.value || undefined, searchFields: ['device_id', 'device_name'], sortField: sortField.value, desc: sortOrder.value === 'asc' }));
  data.value = res.deviceKinds;
  pageCount.value = res.totalPages;
}, 300);
onMounted(updateDeviceKinds);
watch([paginationState, searchText, sortField, sortOrder], updateDeviceKinds);
</script>

<template>
  <div class="mx-6 sm:mx-16 my-10">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <NuxtLink href="/" class="flex justify-center items-center text-lg">
            <Icon aria-hidden name="i-heroicons-home" />
          </NuxtLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <p class="font-semibold">/</p>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/devices">Danh sách loại thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <section class="bg-white mt-8 p-4 py-8 pb-8">
        <h2 class="font-bold text-xl mb-8"> Tất cả loại thiết bị </h2>
        <div class="flex justify-between items-stretch">
          <div class="relative items-center flex gap-4 m-auto md:m-0 md:mb-8 mb-8">
            <input v-model="searchText" type="search" placeholder="Nhập tên/mã thiết bị"
              class="border-gray-300 border rounded-sm p-2 pl-10 w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]">
            <Icon aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
              name="i-heroicons-magnifying-glass" />
            <button
              class="relative bg-slate-200 border border-slate-400 text-slate-dark rounded-md w-11 h-11 lg:w-auto">
              <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-qr-code" />
              <p class="hidden lg:block pl-10 pr-3">Quét QR thiết bị</p>
            </button>
            <button class="relative md:hidden bg-tertiary-darker items-center text-white px-3 rounded-md w-11 h-11">
              <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-plus" />
            </button>
          </div>
          <div>
            <button
              class="relative hidden md:block bg-tertiary-darker items-center text-white px-3 rounded-md w-11 h-11 md:w-auto">
              <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-plus" />
              <span class="hidden md:block pl-8 pr-3">Bổ sung thiết bị</span>
            </button>
          </div>
        </div>
        <DeviceTable :columns="createColumns({ sortField, sortOrder })" :data="data" 
          :page-count="pageCount" :pagination-state="paginationState" :row-selection="rowSelection" :set-row-selection="setRowSelection"
          @page-index-change="handlePageIndexChange" @page-size-change="handlePageSizeChange"
          @sort-order-change="handleSortOrderChange" @sort-field-change="handleSortFieldChange" />
      </section>
    </main>
  </div>
</template>
