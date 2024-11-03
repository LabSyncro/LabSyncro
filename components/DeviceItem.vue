<script setup lang="ts">
const props = defineProps<{
  thumbnailUrl: string;
  manufacturer: string;
  title: string;
  quantity: number;
  unit: string;
}>();
</script>

<template>
  <div class="cursor-pointer border-[1px] hover:border-[1px] hover:border-tertiary-dark">
    <div class="w-[100%] h-32 overflow-hidden">
      <NuxtImg :src="props.thumbnailUrl" class="object-cover" />
    </div>
    <div class="p-2 pt-5 text-ss">
      <p class="text-slate-dark mb-1">{{ props.manufacturer?.toUpperCase() }}</p>
      <p class="line-clamp-2 mb-3">{{ props.title }}</p>
      <p class="relative text-slate-dark bg-gray-100 pl-1.5 py-0.5 rounded-sm">
        <Icon aria-hidden class="absolute text-sm top-1" name="i-heroicons-check" />
        <span class="ml-4">
          Hàng còn:
          <span class="font-semibold">{{ props.quantity }}</span>
          {{ props.unit }}
        </span>
      </p>
    </div>
  </div>
</template>
