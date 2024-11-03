<script setup lang="ts">
import { deviceKindService } from '~/services';
const props = defineProps<{
  category: { id: number; name: string };
}>();
const listRef = ref(null);
const listWidth = ref(null);
function updateListWidth() {
  if (!listRef.value) {
    listWidth.value = null;
  }
  listWidth.value = listRef.value.offsetWidth;
}
onMounted(() => updateListWidth());
onMounted(() => document.defaultView.addEventListener('resize', updateListWidth));
onUnmounted(() => document.defaultView.removeEventListener('resize', updateListWidth));
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
const items = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);
watch([itemNo, currentPage], async () => {
  if (!itemNo.value) {
    return [];
  }
  const res = await deviceKindService.getDeviceKindsByCategoryId(props.category.id, currentPage.value * itemNo.value, itemNo.value);
  totalPages.value = res.totalPages;
  currentPage.value = res.currentPage;
  items.value = res.deviceKinds.map((deviceKind) => ({
    thumbnailUrl: deviceKind.mainImage,
    manufacturer: deviceKind.manufacturer,
    title: deviceKind.name,
    quantity: deviceKind.quantity,
    unit: deviceKind.unit,
    id: deviceKind.id,
  }));
});

function pageLeft() {
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value;
}

function pageRight() {
  currentPage.value = (currentPage.value + 1) % totalPages.value;
}
</script>

<template>
  <div class="mt-5">
    <h3 class="pl-16 lg:pl-28 mb-3 font-bold">{{ props.category.name }}</h3>
    <div ref="listRef" class="group flex justify-center items-center gap-5">
      <button
        :class="`opacity-0 group-hover:${currentPage === 0 ? 'opacity-0' : 'opacity-100'} bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark`"
        @click="pageLeft"
      >
        <Icon aria-hidden name="i-heroicons-chevron-left" />
      </button>
      <div class="flex justify-around gap-2">
        <DeviceItem v-for="item in items" :key="item.id" :class="`w-[${ITEM_WIDTH}px]`"
          :thumbnail-url="item.thumbnailUrl" :manufacturer="item.manufacturer" :title="item.title"
          :quantity="item.quantity" :unit="item.unit" />
      </div>
      <button
        :class="`opacity-0 group-hover:${currentPage === totalPages - 1 ? 'opacity-0' : 'opacity-100'}  bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark`"
        @click="pageRight"
      >
        <Icon aria-hidden name="i-heroicons-chevron-right" />
      </button>
    </div>
  </div>
</template>
