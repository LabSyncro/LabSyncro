<script setup lang="ts">
import { columns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';

const data = ref<AdminDeviceList[]>([]);
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
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/devices">Danh sách thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <section class="bg-white p-4 pb-8">
        <h2 class="font-bold text-xl"> Tất cả loại thiết bị </h2>
        <div class="flex flex-col sm:flex-row mt-6 text-slate-dark">
          <div class="flex gap-4 sm:border-r-2 sm:border-slate-250 pr-5">
            <p> Tổng loại thiết bị </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
          <div class="flex gap-4 sm:border-r-2 sm:border-slate-250 pr-5 sm:pl-5">
            <p> Không có sẵn </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
          <div class="flex gap-4 sm:border-r-2 sm:border-slate-250 pr-5 sm:pl-5">
            <p> Sẵn có </p>
            <span class="text-black bg-slate-100 px-2 border-slate-250 border-2 rounded-sm">100</span>
          </div>
        </div>
      </section>
      <DeviceTable :columns="columns" :data="data" />
    </main>
  </div>
</template>
