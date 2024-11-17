<script setup lang="ts">
import type { SortingState } from '@tanstack/vue-table';
import { debounce } from 'lodash-es';
import { columns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';
import { deviceKindService } from '~/services';

const searchText = ref('');

const paginationState = ref({
  pageIndex: 0,
  pageSize: 10,
});
function setPagination(pageUpdater: (any) => void) {
  const newPage = pageUpdater(paginationState.value);
  console.log(newPage);
  paginationState.value = newPage;
}
const pageCount = ref(0);

const sortingState = ref<SortingState>([]);
function setSorting(updater: (SortingState) => SortingState) {
  sortingState.value = updater(sortingState.value);
}
const sortField = computed(() => {
  switch (sortingState.value[0]?.id) {
  case 'borrowableQuantity':
    return 'borrowable_quantity';
  default:
    return sortingState.value[0]?.id;
  }
});
const isDesc = computed(() => {
  return sortingState.value[0]?.desc || false;
});

const data = ref<AdminDeviceList[]>([]);
const updateDeviceKinds = debounce(async () => {
  const res = (await deviceKindService.getDeviceKinds(paginationState.value.pageIndex * paginationState.value.pageSize, paginationState.value.pageSize, { searchText: searchText.value || undefined, searchFields: ['device_id', 'device_name'], sortField: sortField.value, desc: isDesc.value }));
  data.value = res.deviceKinds;
  pageCount.value = res.totalPages;
}, 300);
onMounted(updateDeviceKinds);
watch([paginationState, searchText, sortField, isDesc], updateDeviceKinds);
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
      <section class="bg-white p-4 pb-8">
        <h2 class="font-bold text-xl"> Tất cả loại thiết bị </h2>
        <div class="flex flex-col lg:flex-row gap-2 lg:gap-0 mt-6 text-slate-dark">
          <div class="flex gap-4 lg:border-r-2 sm:border-slate-250 pr-5">
            <p class="w-[150px]"> Tổng loại thiết bị </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
          <div class="flex gap-4 lg:border-r-2 sm:border-slate-250 pr-5 lg:pl-5">
            <p class="w-[150px]"> Không có sẵn </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
          <div class="flex gap-4 lg:border-r-2 sm:border-slate-250 pr-5 lg:pl-5">
            <p class="w-[150px]"> Sẵn có </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
        </div>
      </section>
      <section class="bg-white mt-8 p-4 py-8 pb-8">
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
        <DeviceTable :columns="columns" :data="data" :page-count="pageCount" :pagination-state="paginationState"
          :set-pagination="setPagination" :sorting-state="sortingState" :set-sorting="setSorting" />
      </section>
    </main>
  </div>
</template>
