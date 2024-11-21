<script setup lang="ts">
import { categoryService } from '~/services';

const route = useRoute();
const categoryId = computed(() => {
  const id = route.query.categoryId;
  return id && typeof id === 'string' ? Number.parseInt(id) : null;
});
const querySearchText = computed(() => {
  const q = route.query.q;
  return q && typeof q === 'string' ? q : null;
});
const searchText = ref('');
const categoryName = ref(null);
watch(categoryId, async () => {
  if (categoryId.value === null) {
    categoryName.value = 'Thiết bị';
    return;
  }
  categoryName.value = (await categoryService.getCategory(categoryId.value)).name;
}, { immediate: true });

const allCategories = await categoryService.getCategories();

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
        <NuxtLink class="text-normal font-bold underline text-black" :href="`/devices?categoryId=${categoryId}`">{{ categoryName }}</NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div>
          <div class="text-normal flex flex-col shadow-lg">
            <p class="bg-black text-white min-w-[190px] px-5 py-1">Danh mục</p>
            <NuxtLink
              :class="`relative text-left text-black min-w-[190px] px-5 py-1 pr-10 line-clamp-1 border-b-[1px] border-b-slate-light ${categoryId === null ? 'bg-slate-light' : 'bg-white'}`"
              href="/devices">
              Tất cả
              <Icon
                v-if="categoryId === null" aria-hidden name="i-heroicons-check"
                class="absolute top-1.5 right-2" />
            </NuxtLink> 
            <NuxtLink
              v-for="category in allCategories" :key="category.id"
              :class="`relative text-left text-black min-w-[190px] px-5 py-1 pr-10 line-clamp-1 border-b-[1px] border-b-slate-light ${categoryId === category.id ? 'bg-slate-light' : 'bg-white'}`"
              :href="categoryId === category.id ? '/devices' : `/devices?categoryId=${category.id}`">
              {{ category.name }}
              <Icon
                v-if="categoryId === category.id" aria-hidden name="i-heroicons-check"
                class="absolute top-1.5 right-2" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1 bg-white p-10">
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-8">
            <h2 class="text-2xl mb-2 sm:mb-0">
              {{ categoryName }}
            </h2>
            <div v-if="!querySearchText" class="relative items-center flex gap-4 mx-auto sm:mx-0">
              <input
                v-model="searchText" type="search" placeholder="Nhập tên thiết bị"
                class="border-gray-300 border rounded-sm p-2 pl-10 md:w-[350px] lg:w-[400px]"
              >
              <Icon
                aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
                name="i-heroicons-magnifying-glass" />
            </div>
          </div>
          <DeviceGrid :category-id="categoryId" :search-text="searchText" />
        </div>
      </div>
    </main>
  </div>
</template>
