<script setup lang="ts">
import { columns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';
import { deviceKindService } from '~/services';

const paginationState = ref({
  pageIndex: 0,
  pageSize: 10,
});
function setPagination(pageUpdater: (any) => void) {
  const newPage = pageUpdater(paginationState.value);
  paginationState.value = newPage;
}
const rowCount = await deviceKindService.getTotalItems();
const pageCount = computed(() => Math.ceil(rowCount / paginationState.value.pageSize));
const data = ref<AdminDeviceList[]>([]);
onMounted(async () => {
  data.value = (await deviceKindService.getDeviceKinds(paginationState.value.pageIndex * paginationState.value.pageSize, paginationState.value.pageSize)).deviceKinds;
});
watch(paginationState, async () => {
  data.value = (await deviceKindService.getDeviceKinds(paginationState.value.pageIndex * paginationState.value.pageSize, paginationState.value.pageSize)).deviceKinds;
});
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
            <input type="search" placeholder="Nhập tên/mã thiết bị"
              class="border-gray-300 border rounded-sm p-2 pl-10 min-w-[300px]">
            <Icon aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
              name="i-heroicons-magnifying-glass" />
            <button class="relative bg-slate-200 border border-slate-400 text-slate-dark rounded-md w-11 h-11 lg:w-auto lg:h-auto">
              <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-qr-code" />
              <p class="hidden lg:block pl-10 pr-3">Quét QR thiết bị</p>
            </button>
          </div>
          <div>
            <button class="relative bg-tertiary-darker items-center text-white h-11 px-3 pl-10 rounded-md">
              <Icon aria-hidden class="absolute left-3 top-[12px] text-xl" name="i-heroicons-plus" />
              <span>Bổ sung thiết bị</span>
            </button>
          </div>
        </div>
        <DeviceTable :columns="columns" :data="data" :page-count="pageCount" :pagination-state="paginationState"
          :set-pagination="setPagination" />
      </section>
    </main>
  </div>
</template>
