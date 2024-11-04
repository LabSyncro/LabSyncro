<script setup lang="ts">
const props = defineProps<{
  rows: number;
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

const totalPages = ref(0);
const totalItems = ref(0);
const currentPage = ref(0);

async function fetchItem(offset: number) {
  await nextTick();
  const { deviceKinds: [deviceKind] } = await deviceKindService.getDeviceKindsByCategoryId(props.category.id, offset, 1);
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
  <div ref="gridRef" :class="`grid grid-cols-${cols} gap-5`" role="grid">
  </div>
</template>
