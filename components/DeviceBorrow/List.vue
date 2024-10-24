<script setup lang="ts">
const listRef = ref(null);
const listWidth = computed(() => {
  if (!listRef.value) {
    return null;
  }
  return listRef.value.offsetWidth;
});
const ITEM_WIDTH = 180;
const itemNo = computed(() => {
  if (!listWidth.value) {
    return null;
  }
  if (listWidth.value < 50) {
    return 0;
  }
  return Math.floor((listWidth.value - 75) / (ITEM_WIDTH + 10));
});
const items = computed(() => {
  if (!itemNo.value) {
    return [];
  }
  return [...Array(itemNo.value).keys()].map(() => ({
    thumbnailUrl: '/images/mock-device.png',
    manufacturer: 'Texas instrument',
    title: 'Vinasemi 938BD+ II Máy Hàn Khò Tự Ngắt 810W, 220VAC, 100-480ºC',
    quantity: 3,
    unit: 'cái'
  }));
});
</script>

<template>
  <div class="mt-5">
    <div
      ref="listRef"
      class="flex justify-center items-center gap-5"
    >
      <button
        class="bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark"
      >
        <Icon
          aria-hidden
          name="i-heroicons-chevron-left"
        />
      </button>
      <div class="flex justify-around gap-2">
        <DeviceItem
          v-for="(item, index) in items"
          :key="index"
          :class="`w-[${ITEM_WIDTH}px]`"
          :thumbnail-url="item.thumbnailUrl"
          :manufacturer="item.manufacturer"
          :title="item.title"
          :quantity="item.quantity"
          :unit="item.unit"
        />
      </div>
      <button
        class="bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark"
      >
        <Icon
          aria-hidden
          name="i-heroicons-chevron-right"
        />
      </button>
    </div>
  </div>
</template>
