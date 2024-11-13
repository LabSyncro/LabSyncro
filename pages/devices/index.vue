<script setup lang="ts">
import { categoryService } from '~/services';

const route = useRoute();
const categoryId = computed(() => route.query.categoryId ? Number.parseInt(route.query.categoryId) : null);
const categoryName = ref('Thiết bị');
watch(categoryId, async () => {
  if (categoryId.value === null) return;
  categoryName.value = (await $fetch(`/api/categories/${categoryId.value}`)).name;
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
          <p class="text-normal font-bold underline text-black">{{ categoryName }}</p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div>
          <div class="text-sm flex flex-col shadow-lg">
            <p class="bg-black text-white min-w-[190px] px-5 py-1">Danh mục</p>
            <NuxtLink
              v-for="category in allCategories" :key="category.id"
              :class="`relative text-left text-black min-w-[190px] px-5 py-1 pr-10 line-clamp-1 border-b-[1px] border-b-slate-light ${categoryId === category.id ? 'bg-slate-light' : 'bg-white'}`"
              :href="`/devices?categoryId=${category.id}`">
              {{ category.name }}
              <Icon
                v-if="categoryId === category.id" aria-hidden name="i-heroicons-check"
                class="absolute top-1.5 right-2" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1 bg-white p-10">
          <h2 class="text-2xl mb-8">
            {{ categoryName }}
          </h2>
          <DeviceGrid :category-id="categoryId" />
        </div>
      </div>
    </main>
  </div>
</template>
