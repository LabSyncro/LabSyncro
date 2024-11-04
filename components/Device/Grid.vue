<script setup lang="ts">
import { deviceKindService } from '~/services';

const props = defineProps<{
  rows: number;
  categoryId: string;
}>();

const gridRef = ref(null);
const gridWidth = ref(null);
function updateGridWidth() {
  if (!gridRef.value) {
    gridWidth.value = null;
  }
  gridWidth.value = gridRef.value.offsetWidth;
}
onMounted(() => updateGridWidth());
onMounted(() => document.defaultView.addEventListener('resize', updateGridWidth));
onUnmounted(() => document.defaultView.removeEventListener('resize', updateGridWidth));
const ITEM_WIDTH = 180;
const cols = computed(() => {
  if (!gridWidth.value) {
    return null;
  }
  if (gridWidth.value < 50) {
    return 0;
  }
  return Math.floor((gridWidth.value - 75) / (ITEM_WIDTH + 10));
});
const gridItemNo = computed(() => {
  if (!cols.value) {
    return null;
  }
  return cols.value * props.rows;
});
const totalPages = ref(0);
const totalItems = ref(0);
const currentPage = ref(0);

watch([gridItemNo], async () => {
  totalItems.value = await deviceKindService.getTotalItems(props.categoryId);
  totalPages.value = Math.ceil(totalItems.value / gridItemNo.value);
});

async function fetchItem(offset: number) {
  await nextTick();
  const { deviceKinds: [deviceKind] } = await deviceKindService.getDeviceKindsByCategoryId(props.categoryId, offset, 1);
  return {
    thumbnailUrl: deviceKind.mainImage,
    manufacturer: deviceKind.manufacturer,
    title: deviceKind.name,
    quantity: deviceKind.quantity,
    unit: deviceKind.unit,
    id: deviceKind.id,
  };
}
</script>

<template>
  <div ref="gridRef" :class="`grid grid-cols-${cols} gap-4`" role="grid">
    <div v-for="i in [...Array(gridItemNo).keys()]" :key="i + currentPage * gridItemNo">
      <DeviceSuspenseItem
        v-if="i + currentPage * gridItemNo < totalItems" :width="`${ITEM_WIDTH}px`"
        :fetch-fn="() => fetchItem(i + currentPage * gridItemNo)" />
      </div>
  </div>
</template>
