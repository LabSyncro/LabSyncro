<script setup lang="ts">
import { deviceKindService, categoryService } from '~/services';

const route = useRoute();
const deviceKindId = computed(() => route.params.id);

const deviceKindMeta = await deviceKindService.getById(deviceKindId.value);

const allCategories = await categoryService.getCategories();
</script>

<template>
  <div class="mx-16 my-10">
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
            <NuxtLink class="text-normal text-black" href="/devices">{{ deviceKindMeta.categoryName }}</NuxtLink>
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
        <div>
          <div class="text-sm flex flex-col shadow-lg">
            <p class="bg-black text-white min-w-[190px] px-5 py-1">Danh mục</p>
            <NuxtLink
v-for="category in allCategories" :key="category.id"
              :class="`relative text-left text-black min-w-[190px] px-5 py-1 pr-10 line-clamp-1 border-b-[1px] border-b-slate-light ${Number.parseInt(deviceKindMeta.categoryId) === category.id ? 'bg-slate-light' : 'bg-white'}`"
              :href="`/devices?categoryId=${category.id}`">
              {{ category.name }}
              <Icon
v-if="Number.parseInt(deviceKindMeta.categoryId) === category.id" aria-hidden
                name="i-heroicons-check" class="absolute top-1.5 right-2" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1">
          <section class="bg-white p-10 flex gap-16 lg:gap-32">
            <div class="w-[300px]">
              <NuxtImg :src="deviceKindMeta.mainImage" class="border-[1px] border-gray-200" />
              <div class="grid grid-cols-4 gap-2 mt-5">
                <NuxtImg
                  v-for="img in deviceKindMeta.subImages" :key="img" :src="img"
                  class="border-[1px] border-gray-200" />
              </div>
            </div>
            <div class="flex-1">
              <div>
                <h2 class="text-lg mb-2">{{ deviceKindMeta.name }}</h2>
                <div class="grid grid-cols-2 mb-1">
                  <p class="text-sm font-bold text-slate-dark">Phân loại</p>
                  <p class="text-sm">{{ deviceKindMeta.categoryName }}</p>
                </div>
                <div class="grid grid-cols-2 mb-1">
                  <p class="text-sm font-bold text-slate-dark">Thương hiệu</p>
                  <p class="text-sm">{{ deviceKindMeta.brand || 'Không rõ' }}</p>
                </div>
                <div class="mt-5 text-sm font-semibold">
                  <span
                    v-if="deviceKindMeta.quantity > 0"
                    class="border-[1px] border-safe-darker bg-green-50 text-green-500 p-1.5 rounded-sm">
                    Hàng còn
                  </span>
                  <span
                    v-else
                    class="border-[1px] border-danger-darker bg-red-50 text-red-500 p-1.5 rounded-sm">
                    Hàng hết
                  </span>
                </div>
                <div class="mt-10">
                  <h3 class="text-sm font-bold text-slate-dark">Mô tả thiết bị</h3>
                  <p class="text-sm mt-2 h-[170px] overflow-auto">{{ deviceKindMeta.description }}</p>
                </div>
              </div>
              <button class="text-sm bg-green-500 text-white py-1.5 flex justify-center gap-2 w-[100%]">
                <Icon aria-hidden name="i-heroicons-heart" class="text-xl" />
                <span>Thêm vào yêu thích</span>
              </button>
            </div>
          </section>
          <section class="bg-white p-10 mt-10">
            <h2 class="text-xl">Tồn kho thiết bị</h2>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
