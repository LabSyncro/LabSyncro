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
            <NuxtLink class="text-normal text-black" href="/devices">Cảm biến</NuxtLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <p class="font-semibold">/</p>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <NuxtLink class="text-normal font-bold underline text-black"></NuxtLink>
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
                v-if="Number.parseInt(deviceKindMeta.categoryId) === category.id" aria-hidden name="i-heroicons-check"
                class="absolute top-1.5 right-2" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1 bg-white p-10">
        </div>
      </div>
    </main>
  </div>
</template>
