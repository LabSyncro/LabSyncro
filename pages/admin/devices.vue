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
      <section class="bg-white mt-8 p-4 pb-8">
        <DeviceTable :columns="columns" :data="data" :row-count="rowCount" :pagination-state="paginationState" :set-pagination="setPagination" />
      </section>
    </main>
  </div>
</template>
