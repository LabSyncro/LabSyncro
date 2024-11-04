<script setup lang="ts">
const props = defineProps<{
  fetchFn: () => Promise<{
    thumbnailUrl: string;
    manufacturer?: string;
    title: string;
    quantity: number;
    unit: string;
  }>,
  width: string;
}>();
</script>

<template>
  <Suspense>
    <DeviceItem :fetch-fn="props.fetchFn" :class="`w-[${props.width}]`" />
    <template #fallback>
      <div :class="`cursor-pointer border-[1px] hover:border-[1px] hover:border-tertiary-dark w-[${props.width}]`">
        <div class="h-32 overflow-hidden" />
        <div class="p-2 pt-5" />
      </div>
    </template>
  </Suspense>
</template>
