<script setup lang="ts">
import { deviceKindService, categoryService } from '~/services';

const route = useRoute();
const deviceKindId = computed(() => route.params.id);

const deviceKindMeta = await deviceKindService.getById(deviceKindId.value);

const allCategories = await categoryService.getCategories();
const deviceQuantity = await deviceKindService.getQuantityById(deviceKindId.value);
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
          <NuxtLink class="text-normal text-black" :href="`/devices?categoryId=${deviceKindMeta.categoryId}`">{{ deviceKindMeta.categoryName }}</NuxtLink>
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
        <div>
          <section class="bg-white p-10 flex flex-col md:flex-row gap-4 md:gap-16">
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
                <h2 class="md:text-lg text-2xl mb-2">{{ deviceKindMeta.name }}</h2>
                <div class="grid grid-cols-2 mb-1">
                  <p class="font-bold text-slate-dark">Phân loại</p>
                  <p>{{ deviceKindMeta.categoryName }}</p>
                </div>
                <div class="grid grid-cols-2 mb-1">
                  <p class="font-bold text-slate-dark">Thương hiệu</p>
                  <p>{{ deviceKindMeta.brand || 'Không rõ' }}</p>
                </div>
                <div class="mt-5 font-semibold">
                  <span
                    v-if="deviceKindMeta.quantity > 0"
                    class="border-[1px] border-safe-darker bg-green-50 text-green-500 p-1.5 rounded-sm">
                    Sẵn có
                  </span>
                  <span
                    v-else
                    class="border-[1px] border-danger-darker bg-red-50 text-red-500 p-1.5 rounded-sm">
                    Không có sẵn
                  </span>
                </div>
                <div class="mt-10 mb-10">
                  <h3 class="font-bold text-slate-dark">Mô tả thiết bị</h3>
                  <p class="mt-2 overflow-auto">{{ deviceKindMeta.description }}</p>
                </div>
              </div>
              <button class="bg-green-500 text-white py-1.5 px-1.5 flex justify-center items-center gap-2 w-[100%] mt-auto">
                <Icon aria-hidden name="i-heroicons-heart" class="text-xl" />
                <span>Yêu thích</span>
              </button>
            </div>
          </section>
          <section class="bg-white p-10 mt-10">
            <h2 class="text-xl">Tồn kho thiết bị</h2>
            <div class="mt-10">
              <div class="grid grid-cols-[1fr_4fr_2fr] bg-gray-100 font-bold p-2.5">
                <p>Cơ sở</p>
                <p>Phòng thí nghiệm</p>
                <p>Hàng còn</p>
              </div>
              <div v-for="[location, { branch, room, quantity }] in Object.entries(deviceQuantity)" :key="location" class="grid grid-cols-[1fr_4fr_2fr] p-2.5 border-top-[1px] border-gray-100">
                <p>{{ branch }}</p>
                <p>{{ room }} - {{ location }}</p>
                <p v-if="quantity > 0" class="relative text-green-500 pl-8">
                  <span class="absolute left-0 top-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <Icon aria-hidden name="i-heroicons-check" class="text-white text-sm font-bold" />
                  </span>
                  {{ quantity }} món
                </p>
                <p v-else class="text-slate-darker">Hết hàng</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
