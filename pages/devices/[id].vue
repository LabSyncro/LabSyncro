<script setup lang="ts">
import { sortBy } from 'lodash-es';
import { deviceKindService, categoryService } from '~/services';
import { createColumns } from '~/components/app/DeviceInventoryByLabTable/column';

const route = useRoute();
const deviceKindId = computed(() => route.params.id.toString());
const deviceKindMeta = await deviceKindService.getById(deviceKindId.value);

const allCategories = await categoryService.getCategories();

const searchText = ref('');

const data = ref<{ borrowableQuantity: number; name: string }[]>([]);

watch(searchText, async () => {
  const res = await deviceKindService.getQuantityByLab(deviceKindId.value, { searchText: searchText.value || undefined, searchFields: ['lab_name'] });

  data.value = sortBy(
    res,
    ({ borrowableQuantity }) => -borrowableQuantity,
  ).map(
    ({ borrowableQuantity, branch, room, name }) => ({ borrowableQuantity, name: `${room}, ${branch} - ${name}` })
  );
}, { immediate: true });
</script>

<template>
  <div class="mx-6 sm:mx-16 my-10">
    <div>
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
            <NuxtLink class="text-normal text-black" :href="`/devices?categoryId=${deviceKindMeta.categoryId}`">{{
              deviceKindMeta.categoryName }}</NuxtLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <p class="font-semibold">/</p>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <NuxtLink class="text-normal font-bold underline text-black">{{ deviceKindMeta.name }}</NuxtLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <main class="my-10">
      <div class="flex gap-16">
        <div class="lg:block hidden">
          <div class="text-sm flex flex-col shadow-lg">
            <p class="bg-black text-white min-w-[190px] xl:min-w-[340px] px-5 py-1">Danh mục</p>
            <NuxtLink
              v-for="category in allCategories" :key="category.id"
              :class="`relative text-left text-black min-w-[190px] px-5 py-1 pr-10 line-clamp-1 border-b-[1px] border-b-slate-light ${deviceKindMeta.categoryId === category.id ? 'bg-slate-light' : 'bg-white'}`"
              :href="`/devices?categoryId=${category.id}`">
              {{ category.name }}
              <Icon
                v-if="deviceKindMeta.categoryId === category.id" aria-hidden
                name="i-heroicons-check" class="absolute top-1.5 right-2" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1">
          <section class="bg-white p-10 flex flex-col md:flex-row gap-8 md:gap-16">
            <div class="w-[100%] md:max-w-[300px]">
              <NuxtImg :src="deviceKindMeta.mainImage" class="border-[1px] border-gray-200" />
              <div class="grid grid-cols-4 gap-2 mt-5">
                <NuxtImg
                  v-for="img in deviceKindMeta.subImages" :key="img" :src="img"
                  class="border-[1px] border-gray-200" />
              </div>
            </div>
            <div class="flex-1 flex flex-col">
              <div class="text-normal md:text-sm">
                <h2 class="text-lg mb-3">{{ deviceKindMeta.name }}</h2>
                <div class="grid grid-cols-2 mb-1">
                  <p class="font-bold text-slate-dark">Phân loại</p>
                  <p>{{ deviceKindMeta.categoryName }}</p>
                </div>
                <div class="grid grid-cols-2 mb-1">
                  <p class="font-bold text-slate-dark">Thương hiệu</p>
                  <p>{{ deviceKindMeta.brand || 'Không rõ' }}</p>
                </div>
                <div class="mt-8 font-semibold">
                  <span
                    v-if="deviceKindMeta.borrowableQuantity > 0"
                    class="border-[1px] border-safe-darker bg-green-50 text-green-500 p-1.5 rounded-sm">
                    Sẵn có
                  </span>
                  <span v-else class="border-[1px] border-danger-darker bg-red-50 text-red-500 p-1.5 rounded-sm">
                    Không có sẵn
                  </span>
                </div>
                <div class="mt-10 mb-10">
                  <h3 class="font-bold text-slate-dark">Mô tả thiết bị</h3>
                  <p class="mt-2 overflow-auto">{{ deviceKindMeta.description }}</p>
                </div>
              </div>
              <button
                class="bg-green-500 text-white py-1.5 px-1.5 flex justify-center items-center gap-2 w-[100%] mt-auto">
                <Icon aria-hidden name="i-heroicons-heart" class="text-xl" />
                <span>Yêu thích</span>
              </button>
            </div>
          </section>
          <section class="bg-white p-10 mt-10">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-8">
              <h2 class="text-xl">Tồn kho thiết bị</h2> 
              <div class="relative items-center flex gap-4 mx-auto sm:mx-0">
                <input
                  v-model="searchText" type="search" placeholder="Nhập tên phòng thí nghiệm"
                  class="border-gray-300 border rounded-sm p-2 pl-10 md:w-[350px] lg:w-[400px]"
                >
                <Icon
                  aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
                  name="i-heroicons-magnifying-glass" />
              </div>
            </div>
            <DeviceInventoryByLabTable :columns="createColumns({ searchText })" :data="data" />
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
