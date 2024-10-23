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
  return Math.floor((listWidth.value - 30) / (ITEM_WIDTH + 20));
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
      class="flex justify-center items-center gap-5 w-[80vw]"
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
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="`w-[${ITEM_WIDTH}px] cursor-pointer border-[1px] rounded-ss`"
        >
          <div class="w-[100%] h-32 overflow-hidden">
            <NuxtImg :src="item.thumbnailUrl" class="object-cover" />
          </div>
          <div class="p-2 pt-5 text-ss">
            <p class="text-slate-dark mb-1">{{ item.manufacturer.toUpperCase() }}</p>
            <p class="line-clamp-2 mb-3">{{ item.title }}</p>
            <p class="relative text-slate-dark bg-gray-100 pl-1.5 py-0.5 rounded-sm">
              <Icon
                aria-hidden
                class="absolute text-sm top-1"
                name="i-heroicons-check"
              />
              <span class="ml-4">
                Hàng còn:
                <span class="font-semibold">{{ item.quantity }}</span>
                {{ item.unit }}
              </span>
            </p>
          </div>
        </div>
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
