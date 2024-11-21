<script setup lang="ts">
const props = defineProps<{
  fetchFn: () => Promise<{
    thumbnailUrl: string;
    manufacturer: string | null;
    title: string;
    quantity: number;
    unit: string;
    id: string;
  }>
}>();
const item = await props.fetchFn();
</script>

<template>
  <div v-if="item" class="cursor-pointer border-[1px] hover:border-[1px] hover:border-tertiary-dark">
    <NuxtLink :href="`/devices/${item.id}`">
      <div class="w-[100%] h-32 overflow-hidden">
        <NuxtImg :src="item.thumbnailUrl" class="object-cover" />
      </div>
      <div class="p-2 pt-5 text-ss h-28 flex flex-col">
        <p class="text-slate-dark mb-1">{{ item.manufacturer?.toUpperCase() }}</p>
        <p class="line-clamp-2 mb-3">{{ item.title }}</p>
        <p class="relative text-slate-dark bg-gray-100 pl-1.5 py-0.5 rounded-sm mt-auto">
          <Icon aria-hidden class="absolute text-sm top-1" name="i-heroicons-check" />
          <span class="ml-4">
            Sẵn có:
            <span class="font-semibold">{{ item.quantity }}</span>
            {{ item.unit }}
          </span>
        </p>
      </div>
    </NuxtLink>
  </div>
</template>
