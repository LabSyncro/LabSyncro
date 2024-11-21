<script setup lang="ts">
const props = defineProps<{
  fetchFn: () => Promise<{
    thumbnailUrl: string;
    manufacturer: string | null;
    title: string;
    quantity: number;
    unit: string;
    id: string;
  }>,
  width: string;
}>();
</script>

<template>
  <Suspense>
    <DeviceItem :fetch-fn="props.fetchFn" :class="`w-[${props.width}]`" />
    <template #fallback>
      <div :class="`cursor-pointer border-[1px] hover:border-[1px] hover:border-tertiary-dark w-[${props.width}] h-60`">
        <div :class="`animate-pulse w-[${props.width}px] h-32 overflow-hidden bg-gray-100`" />
        <div class="p-2 pt-5" />
      </div>
    </template>
  </Suspense>
</template>
